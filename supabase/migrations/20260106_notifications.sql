-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('new_user', 'order_placed', 'payment_failed')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Create admin preferences table
CREATE TABLE public.admin_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    notify_new_user BOOLEAN DEFAULT true,
    notify_order_placed BOOLEAN DEFAULT true,
    notify_payment_failed BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
ON public.admin_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON public.admin_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
ON public.admin_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to create notification for all admins
CREATE OR REPLACE FUNCTION public.notify_admins(
    notif_type TEXT,
    notif_title TEXT,
    notif_message TEXT,
    notif_link TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_record RECORD;
    pref_record RECORD;
    should_notify BOOLEAN;
BEGIN
    -- Loop through all users who have the 'admin' role
    FOR admin_record IN 
        SELECT user_id FROM public.user_roles WHERE role = 'admin'
    LOOP
        -- Check preferences (if record doesn't exist, assume true due to defaults, but we check explicitly)
        -- We construct the column name dynamically or just check specific logic
        should_notify := true;
        
        SELECT * INTO pref_record FROM public.admin_preferences WHERE user_id = admin_record.user_id;
        
        IF FOUND THEN
            IF notif_type = 'new_user' AND pref_record.notify_new_user = false THEN should_notify := false; END IF;
            IF notif_type = 'order_placed' AND pref_record.notify_order_placed = false THEN should_notify := false; END IF;
            IF notif_type = 'payment_failed' AND pref_record.notify_payment_failed = false THEN should_notify := false; END IF;
        END IF;

        IF should_notify THEN
            INSERT INTO public.notifications (user_id, type, title, message, link)
            VALUES (admin_record.user_id, notif_type, notif_title, notif_message, notif_link);
        END IF;
    END LOOP;
END;
$$;

-- Trigger: New User Registration
CREATE OR REPLACE FUNCTION public.trigger_notify_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Wait a moment to ensure roles might be assigned, though usually 'user' is default
    PERFORM public.notify_admins(
        'new_user',
        'New User Registered',
        'A new customer has joined: ' || COALESCE(NEW.full_name, 'Unknown'),
        '/admin' -- Link to user manager
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_notify_new_user();

-- Trigger: Order Placed
CREATE OR REPLACE FUNCTION public.trigger_notify_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM public.notify_admins(
        'order_placed',
        'New Order Received',
        'Order #' || LEFT(NEW.id::text, 8) || ' placed by ' || NEW.customer_name || ' (' || NEW.total_amount || ' BIF)',
        '/admin' -- Link to order manager
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_notify_new_order();

-- Trigger: Payment Failed (Simulated via status change to cancelled, though ideally we'd have a specific failure state)
-- For now, we will assume if status changes to 'cancelled' it might be worth notifying
CREATE OR REPLACE FUNCTION public.trigger_notify_order_cancelled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        PERFORM public.notify_admins(
            'payment_failed',
            'Order Cancelled/Failed',
            'Order #' || LEFT(NEW.id::text, 8) || ' was cancelled.',
            '/admin'
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_cancelled
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_notify_order_cancelled();
