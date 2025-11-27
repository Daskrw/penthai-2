-- Create enum for product types
CREATE TYPE public.product_type AS ENUM ('consumer', 'consumable');

-- Add product_type column to products table
ALTER TABLE public.products 
ADD COLUMN product_type public.product_type NOT NULL DEFAULT 'consumer';

-- Add index for better query performance
CREATE INDEX idx_products_product_type ON public.products(product_type);