-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public read access to product images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

-- Policy: Only admins can upload/delete product images
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'products' 
  AND public.has_role(auth.uid(), 'admin') 
);

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( 
  bucket_id = 'products' 
  AND public.has_role(auth.uid(), 'admin') 
);

CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
USING ( 
  bucket_id = 'products' 
  AND public.has_role(auth.uid(), 'admin') 
);

-- Helper function to get all users (for admin user management)
-- Note: Direct access to auth.users is restricted. 
-- We will use the 'profiles' table which is linked to auth.users.
-- We ensure the profiles table has email sync via trigger (if not already there, we'll assume profiles has the necessary info or we join)

-- Let's ensure profiles has email if it wasn't there (it wasn't in the previous schema)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the handle_new_user function to sync email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name', 
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;
