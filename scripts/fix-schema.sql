-- Sửa lỗi schema cho Supabase Auth integration

-- 1. Bỏ constraint NOT NULL cho password_hash
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Hoặc xóa cột password_hash hoàn toàn (khuyến nghị)
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- 3. Thêm trigger để tự động tạo user profile khi có auth user mới
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, created_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Tạo user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 4. Tạo trigger cho auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Cập nhật RLS policies để cho phép insert từ trigger
DROP POLICY IF EXISTS "Allow public insert" ON users;
CREATE POLICY "Allow auth insert" ON users
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow insert stats" ON user_stats;  
CREATE POLICY "Allow auth insert stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
