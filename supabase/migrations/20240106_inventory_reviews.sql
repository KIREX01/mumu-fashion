-- Add inventory tracking and review images support

-- Add stock_quantity to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 10;

-- Add images to reviews
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Create a storage bucket for review images if not already handled
-- (Assuming public bucket 'product-reviews' exists or handles permissions)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-reviews', 'product-reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for review images
CREATE POLICY "Public Access for Review Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-reviews' );

CREATE POLICY "Authenticated Users can upload Review Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-reviews' );
