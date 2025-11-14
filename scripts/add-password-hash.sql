-- Thêm lại cột password_hash cho auth đơn giản
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
