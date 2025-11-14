/**
 * Migration Script: JSON Files -> Supabase
 * Chuyển đổi dữ liệu từ JSON files sang Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Thay bằng URL thực của bạn
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Thay bằng anon key thực

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Đường dẫn đến các file JSON hiện tại
const JSON_FILES_PATH = {
  users: path.join(__dirname, '../data/users.json'),
  progress: path.join(__dirname, '../data/user-progress.json'),
  badges: path.join(__dirname, '../data/user-badges.json'),
  gameStats: path.join(__dirname, '../data/game-stats.json')
};

/**
 * Đọc file JSON
 */
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error(`Lỗi đọc file ${filePath}:`, error);
    return {};
  }
}

/**
 * Migration Users
 */
async function migrateUsers() {
  console.log('🔄 Đang migrate Users...');
  
  const usersData = readJsonFile(JSON_FILES_PATH.users);
  const users = Object.values(usersData);
  
  if (users.length === 0) {
    console.log('📭 Không có users để migrate');
    return;
  }

  for (const user of users) {
    try {
      // Tạo user với Supabase Auth (nếu cần)
      const userData = {
        email: user.email,
        username: user.username || user.email.split('@')[0],
        full_name: user.fullName || user.displayName,
        avatar_url: user.avatar || null,
        created_at: user.createdAt || new Date().toISOString(),
        last_login: user.lastLogin || null,
        is_active: user.isActive !== false
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select();

      if (error && !error.message.includes('duplicate key')) {
        console.error('❌ Lỗi migrate user:', user.email, error);
      } else {
        console.log('✅ Migrate user thành công:', user.email);
      }
    } catch (error) {
      console.error('❌ Lỗi migrate user:', user.email, error);
    }
  }
}

/**
 * Migration User Progress
 */
async function migrateProgress() {
  console.log('🔄 Đang migrate User Progress...');
  
  const progressData = readJsonFile(JSON_FILES_PATH.progress);
  const progressEntries = Object.entries(progressData);
  
  if (progressEntries.length === 0) {
    console.log('📭 Không có progress để migrate');
    return;
  }

  for (const [userId, userProgress] of progressEntries) {
    try {
      // Lấy user_id từ email hoặc username
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', userId)
        .single();

      if (!userData) {
        console.log('⚠️ Không tìm thấy user:', userId);
        continue;
      }

      const progressRecords = [];
      
      // Migrate completed events
      if (userProgress.completedEvents) {
        for (const eventId of userProgress.completedEvents) {
          progressRecords.push({
            user_id: userData.id,
            event_id: eventId,
            progress_type: 'completed',
            completed_at: new Date().toISOString()
          });
        }
      }

      // Migrate bookmarked events
      if (userProgress.bookmarkedEvents) {
        for (const eventId of userProgress.bookmarkedEvents) {
          progressRecords.push({
            user_id: userData.id,
            event_id: eventId,
            progress_type: 'bookmarked'
          });
        }
      }

      // Migrate character progress
      if (userProgress.charactersLearned) {
        for (const charId of userProgress.charactersLearned) {
          progressRecords.push({
            user_id: userData.id,
            event_id: 'character_study',
            character_id: charId,
            progress_type: 'completed'
          });
        }
      }

      if (progressRecords.length > 0) {
        const { error } = await supabase
          .from('user_progress')
          .insert(progressRecords);

        if (error) {
          console.error('❌ Lỗi migrate progress:', userId, error);
        } else {
          console.log('✅ Migrate progress thành công:', userId);
        }
      }
    } catch (error) {
      console.error('❌ Lỗi migrate progress:', userId, error);
    }
  }
}

/**
 * Migration User Badges
 */
async function migrateBadges() {
  console.log('🔄 Đang migrate User Badges...');
  
  const badgesData = readJsonFile(JSON_FILES_PATH.badges);
  const badgeEntries = Object.entries(badgesData);
  
  if (badgeEntries.length === 0) {
    console.log('📭 Không có badges để migrate');
    return;
  }

  for (const [userId, userBadges] of badgeEntries) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', userId)
        .single();

      if (!userData) continue;

      const badgeRecords = userBadges.map(badge => ({
        user_id: userData.id,
        badge_id: badge.id,
        badge_name: badge.name,
        badge_description: badge.description,
        badge_icon: badge.icon,
        earned_at: badge.earnedAt || new Date().toISOString(),
        criteria_met: badge.criteria || {}
      }));

      if (badgeRecords.length > 0) {
        const { error } = await supabase
          .from('user_badges')
          .insert(badgeRecords);

        if (error) {
          console.error('❌ Lỗi migrate badges:', userId, error);
        } else {
          console.log('✅ Migrate badges thành công:', userId);
        }
      }
    } catch (error) {
      console.error('❌ Lỗi migrate badges:', userId, error);
    }
  }
}

/**
 * Migration Game Stats
 */
async function migrateGameStats() {
  console.log('🔄 Đang migrate Game Stats...');
  
  const gameData = readJsonFile(JSON_FILES_PATH.gameStats);
  const gameEntries = Object.entries(gameData);
  
  for (const [userId, stats] of gameEntries) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', userId)
        .single();

      if (!userData) continue;

      // Migrate game sessions
      if (stats.sessions) {
        const sessionRecords = stats.sessions.map(session => ({
          user_id: userData.id,
          game_type: session.gameType,
          session_data: session.data || {},
          score: session.score || 0,
          duration_seconds: session.duration,
          completed: session.completed || false,
          started_at: session.startedAt || new Date().toISOString(),
          completed_at: session.completedAt
        }));

        if (sessionRecords.length > 0) {
          await supabase.from('game_sessions').insert(sessionRecords);
        }
      }

      // Migrate user stats
      const statsRecord = {
        user_id: userData.id,
        total_events_completed: stats.totalEventsCompleted || 0,
        total_characters_learned: stats.totalCharactersLearned || 0,
        total_badges_earned: stats.totalBadgesEarned || 0,
        total_game_sessions: stats.totalGameSessions || 0,
        total_score: stats.totalScore || 0,
        study_streak_days: stats.studyStreakDays || 0,
        last_activity_date: stats.lastActivityDate || new Date().toISOString().split('T')[0]
      };

      await supabase.from('user_stats').insert(statsRecord);
      console.log('✅ Migrate stats thành công:', userId);
    } catch (error) {
      console.error('❌ Lỗi migrate stats:', userId, error);
    }
  }
}

/**
 * Main Migration Function
 */
async function runMigration() {
  console.log('🚀 Bắt đầu migration từ JSON sang Supabase...');
  
  try {
    await migrateUsers();
    await migrateProgress();
    await migrateBadges();
    await migrateGameStats();
    
    console.log('🎉 Migration hoàn thành thành công!');
  } catch (error) {
    console.error('💥 Lỗi trong quá trình migration:', error);
  }
}

// Chạy migration
if (require.main === module) {
  // Kiểm tra configuration
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('❌ Vui lòng cập nhật SUPABASE_URL và SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  runMigration();
}

module.exports = {
  runMigration,
  migrateUsers,
  migrateProgress,
  migrateBadges,
  migrateGameStats
};
