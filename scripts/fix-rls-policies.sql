-- Fix Row Level Security Policies cho Supabase

-- 1. Drop existing policies nếu có
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can view own game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;

-- 2. Tạo policies mới cho phép insert và select public

-- Users table policies
CREATE POLICY "Allow public insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User Progress policies  
CREATE POLICY "Allow insert progress" ON user_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select progress" ON user_progress
  FOR SELECT USING (true);

CREATE POLICY "Allow update progress" ON user_progress
  FOR UPDATE USING (true);

-- User Badges policies
CREATE POLICY "Allow insert badges" ON user_badges
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select badges" ON user_badges
  FOR SELECT USING (true);

-- Game Sessions policies
CREATE POLICY "Allow insert game sessions" ON game_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select game sessions" ON game_sessions
  FOR SELECT USING (true);

-- User Stats policies
CREATE POLICY "Allow insert stats" ON user_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select stats" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow update stats" ON user_stats
  FOR UPDATE USING (true);

-- 3. Hoặc tạm thời disable RLS để test (KHÔNG khuyến nghị cho production)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_badges DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
