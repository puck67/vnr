-- Supabase Database Schema cho VNR Project

-- 1. Bảng Users (đăng nhập/đăng ký)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- 2. Bảng User Progress (tiến trình học tập)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(50) NOT NULL,
  character_id VARCHAR(50),
  progress_type VARCHAR(50) NOT NULL, -- 'completed', 'started', 'bookmarked'
  progress_data JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id, progress_type)
);

-- 3. Bảng User Badges (huy hiệu)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(100) NOT NULL,
  badge_name VARCHAR(255) NOT NULL,
  badge_description TEXT,
  badge_icon VARCHAR(255),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criteria_met JSONB DEFAULT '{}',
  UNIQUE(user_id, badge_id)
);

-- 4. Bảng Game Sessions (phiên chơi game)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL, -- 'trivia', 'timeline', 'riddle'
  session_data JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Bảng User Stats (thống kê tổng hợp)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_events_completed INTEGER DEFAULT 0,
  total_characters_learned INTEGER DEFAULT 0,
  total_badges_earned INTEGER DEFAULT 0,
  total_game_sessions INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  study_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes để tối ưu performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_event_id ON user_progress(event_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_games_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_stats_user_id ON user_stats(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users chỉ có thể truy cập data của mình)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own game sessions" ON game_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);
