/**
 * Supabase Client Configuration
 * Thay thế Firebase/JSON storage
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * User Management Service
 */
export class UserService {
  // Đăng ký user mới
  static async registerUser(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      // Tạo user profile
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: userData.username || email.split('@')[0],
          full_name: userData.fullName || '',
          avatar_url: userData.avatar || null
        });
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đăng nhập
  static async loginUser(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Cập nhật last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Đăng xuất
  static async logoutUser() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Lấy user hiện tại
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

/**
 * Progress Management Service
 */
export class ProgressService {
  // Lưu tiến trình học sự kiện
  static async saveEventProgress(eventId, progressData = {}) {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          event_id: eventId,
          progress_type: 'completed',
          progress_data: progressData,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,event_id,progress_type'
        });

      if (error) throw error;
      
      // Cập nhật user stats
      await this.updateUserStats(user.id);
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Bookmark sự kiện
  static async bookmarkEvent(eventId) {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          event_id: eventId,
          progress_type: 'bookmarked'
        }, {
          onConflict: 'user_id,event_id,progress_type'
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Lấy tiến trình của user
  static async getUserProgress(userId = null) {
    try {
      const currentUser = userId || await UserService.getCurrentUser();
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) throw new Error('User not found');

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Cập nhật user stats
  static async updateUserStats(userId) {
    try {
      // Đếm số sự kiện đã hoàn thành
      const { data: completedEvents } = await supabase
        .from('user_progress')
        .select('event_id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('progress_type', 'completed');

      // Đếm số character đã học
      const { data: charactersLearned } = await supabase
        .from('user_progress')
        .select('character_id', { count: 'exact' })
        .eq('user_id', userId)
        .not('character_id', 'is', null);

      // Đếm số badge
      const { data: badges } = await supabase
        .from('user_badges')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      // Cập nhật stats
      await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          total_events_completed: completedEvents?.length || 0,
          total_characters_learned: charactersLearned?.length || 0,
          total_badges_earned: badges?.length || 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      return { success: true };
    } catch (error) {
      console.error('Error updating user stats:', error);
      return { success: false, error: error.message };
    }
  }
}

/**
 * Badge Management Service
 */
export class BadgeService {
  // Trao huy hiệu cho user
  static async awardBadge(badgeId, badgeData) {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          badge_name: badgeData.name,
          badge_description: badgeData.description,
          badge_icon: badgeData.icon,
          criteria_met: badgeData.criteria || {}
        });

      if (error) throw error;
      
      // Cập nhật user stats
      await ProgressService.updateUserStats(user.id);
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Lấy danh sách huy hiệu của user
  static async getUserBadges(userId = null) {
    try {
      const currentUser = userId || await UserService.getCurrentUser();
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) throw new Error('User not found');

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Game Service
 */
export class GameService {
  // Lưu kết quả game
  static async saveGameSession(gameType, sessionData) {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          game_type: gameType,
          session_data: sessionData,
          score: sessionData.score || 0,
          duration_seconds: sessionData.duration,
          completed: sessionData.completed || false,
          completed_at: sessionData.completed ? new Date().toISOString() : null
        });

      if (error) throw error;
      
      // Cập nhật user stats
      await ProgressService.updateUserStats(user.id);
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Lấy lịch sử game của user
  static async getUserGameHistory(userId = null, gameType = null) {
    try {
      const currentUser = userId || await UserService.getCurrentUser();
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) throw new Error('User not found');

      let query = supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('started_at', { ascending: false });

      if (gameType) {
        query = query.eq('game_type', gameType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default supabase;
