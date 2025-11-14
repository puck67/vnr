-- Tạm thời DISABLE Row Level Security để test
-- CHỈ dùng cho development, KHÔNG dùng cho production

-- Disable RLS cho tất cả bảng
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn giữ RLS nhưng cho phép tất cả operations:

-- Drop tất cả policies cũ
DROP POLICY IF EXISTS "Allow public insert" ON users;
DROP POLICY IF EXISTS "Allow public select" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow insert progress" ON user_progress;
DROP POLICY IF EXISTS "Allow select progress" ON user_progress;
DROP POLICY IF EXISTS "Allow update progress" ON user_progress;
DROP POLICY IF EXISTS "Allow insert badges" ON user_badges;
DROP POLICY IF EXISTS "Allow select badges" ON user_badges;
DROP POLICY IF EXISTS "Allow insert game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow select game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow insert stats" ON user_stats;
DROP POLICY IF EXISTS "Allow select stats" ON user_stats;
DROP POLICY IF EXISTS "Allow update stats" ON user_stats;
DROP POLICY IF EXISTS "Allow auth insert" ON users;
DROP POLICY IF EXISTS "Allow auth insert stats" ON user_stats;

-- Tạo policies mới cho phép mọi thứ (development only)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON user_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON user_badges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON game_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON user_stats FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_badges TO authenticated;
GRANT ALL ON public.game_sessions TO authenticated;
GRANT ALL ON public.user_stats TO authenticated;

-- Grant permissions to anon users (for registration)
GRANT INSERT, SELECT ON public.users TO anon;
GRANT INSERT, SELECT ON public.user_stats TO anon;
