-- Secure Order Placement Function
-- Calculates total on server side to prevent price tampering
CREATE OR REPLACE FUNCTION public.create_order(
  order_items_json JSONB,
  customer_details JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id UUID;
  total_amt DECIMAL := 0;
  item JSONB;
  prod_price DECIMAL;
  prod_name TEXT;
  prod_id UUID;
  item_qty INTEGER;
  item_size TEXT;
  item_color TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user ID (if authenticated)
  current_user_id := auth.uid();

  -- 1. Calculate Total Amount
  FOR item IN SELECT * FROM jsonb_array_elements(order_items_json)
  LOOP
    prod_id := (item->>'productId')::UUID;
    item_qty := (item->>'quantity')::INTEGER;
    
    -- Validate quantity
    IF item_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', prod_id;
    END IF;

    -- Get price from DB
    SELECT price INTO prod_price FROM public.products WHERE id = prod_id;
    
    IF prod_price IS NULL THEN
      RAISE EXCEPTION 'Product not found: %', prod_id;
    END IF;
    
    total_amt := total_amt + (prod_price * item_qty);
  END LOOP;

  -- 2. Insert Order
  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_phone,
    customer_address,
    notes,
    total_amount,
    status,
    payment_method,
    payment_reference
  ) VALUES (
    current_user_id,
    customer_details->>'name',
    customer_details->>'phone',
    customer_details->>'address',
    customer_details->>'notes',
    total_amt,
    'pending',
    customer_details->>'paymentMethod',
    customer_details->>'paymentReference'
  ) RETURNING id INTO new_order_id;

  -- 3. Insert Order Items
  FOR item IN SELECT * FROM jsonb_array_elements(order_items_json)
  LOOP
    prod_id := (item->>'productId')::UUID;
    item_qty := (item->>'quantity')::INTEGER;
    item_size := item->>'size';
    item_color := item->>'color';
    
    SELECT price, name INTO prod_price, prod_name FROM public.products WHERE id = prod_id;
    
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_price,
      quantity,
      size,
      color
    ) VALUES (
      new_order_id,
      prod_id,
      prod_name,
      prod_price,
      item_qty,
      item_size,
      item_color
    );
  END LOOP;

  -- Return the new order
  RETURN jsonb_build_object('id', new_order_id, 'total_amount', total_amt);
END;
$$;

-- Ensure RLS on critical tables (Idempotent checks)

-- PRODUCTS: Public Read, Admin Write
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Products" ON public.products;
CREATE POLICY "Admin Manage Products" ON public.products FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ORDERS: Owner Read, Admin Read/Write
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin view all orders" ON public.orders;
CREATE POLICY "Admin view all orders" ON public.orders FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
CREATE POLICY "Admin manage orders" ON public.orders FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Note: Insert is handled via SECURITY DEFINER function now, but if direct insert is needed:
DROP POLICY IF EXISTS "Users create orders" ON public.orders;
CREATE POLICY "Users create orders" ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL); 
-- But wait, if we allow direct insert, we re-open the price vulnerability.
-- Ideally, we disable direct INSERT for orders except for admins, forcing users to use the RPC.
-- However, that might break existing code if I don't update it immediately.
-- I WILL update the code. So let's restrict INSERT to admins only (or disable for public/user roles).

-- Lock down Order INSERT
DROP POLICY IF EXISTS "Users create orders" ON public.orders; 
-- No policy for INSERT means default deny (except admin policy below).
-- Actually, let's explicit deny or just not add it.
-- But wait, Admins might need to create orders manually?
CREATE POLICY "Admin create orders" ON public.orders FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ORDER ITEMS: Similar to Orders
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View own order items" ON public.order_items;
CREATE POLICY "View own order items" ON public.order_items FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admin view all order items" ON public.order_items;
CREATE POLICY "Admin view all order items" ON public.order_items FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- USER ROLES: Read own, Admin Manage
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read own role" ON public.user_roles;
CREATE POLICY "Read own role" ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin manage roles" ON public.user_roles;
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

