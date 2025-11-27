-- Add payment_slip_url column to orders table
ALTER TABLE public.orders ADD COLUMN payment_slip_url text;

-- Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-slips', 'payment-slips', true);

-- Allow authenticated users to upload payment slips
CREATE POLICY "Authenticated users can upload payment slips"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-slips' AND auth.uid() IS NOT NULL);

-- Allow users to view their own payment slips
CREATE POLICY "Users can view payment slips"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-slips');