/**
 * Supabase Authentication System
 * Thay thế JSON file storage
 */

import { supabase, supabaseAdmin } from './supabase-admin';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  profile: {
    points: number;
    level: number;
    badges: string[];
    completedQuizzes: string[];
    viewedEvents: string[];
    achievements: { id: string; unlockedAt: string; }[];
  };
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
}

/**
 * Đăng ký user mới với Supabase
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    // Kiểm tra username đã tồn tại
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', userData.username)
      .single();

    if (existingUser) {
      return { success: false, message: 'Tên đăng nhập đã được sử dụng' };
    }

    // Đăng ký với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, message: 'Email đã được sử dụng' };
      }
      throw authError;
    }

    if (!authData.user) {
      return { success: false, message: 'Không thể tạo tài khoản' };
    }

    // Tạo profile với admin client (bypass RLS)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        username: userData.username,
        full_name: userData.username,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Tạo user stats với admin client
    await supabaseAdmin
      .from('user_stats')
      .insert({
        user_id: authData.user.id,
        total_events_completed: 0,
        total_characters_learned: 0,
        total_badges_earned: 0,
        total_game_sessions: 0,
        total_score: 0,
        study_streak_days: 0
      });

    const user: Omit<User, 'password'> = {
      id: authData.user.id,
      username: userData.username,
      email: userData.email,
      createdAt: authData.user.created_at,
      profile: {
        points: 0,
        level: 1,
        badges: [],
        completedQuizzes: [],
        viewedEvents: [],
        achievements: []
      }
    };

    return { 
      success: true, 
      user,
      message: 'Đăng ký thành công'
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      message: error.message || 'Có lỗi xảy ra khi tạo tài khoản'
    };
  }
}

/**
 * Đăng nhập user với Supabase
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng' };
      }
      throw authError;
    }

    if (!authData.user) {
      return { success: false, message: 'Đăng nhập thất bại' };
    }

    // Lấy thông tin user từ database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('User data fetch error:', userError);
      return { success: false, message: 'Không thể tải thông tin tài khoản' };
    }

    // Lấy stats và progress
    const [statsResult, progressResult, badgesResult] = await Promise.all([
      supabase.from('user_stats').select('*').eq('user_id', authData.user.id).single(),
      supabase.from('user_progress').select('*').eq('user_id', authData.user.id),
      supabase.from('user_badges').select('*').eq('user_id', authData.user.id)
    ]);

    const stats = statsResult.data || {
      total_events_completed: 0,
      total_characters_learned: 0,
      total_badges_earned: 0,
      total_game_sessions: 0,
      total_score: 0
    };

    const progress = progressResult.data || [];
    const badges = badgesResult.data || [];

    const user: Omit<User, 'password'> = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      createdAt: userData.created_at,
      profile: {
        points: stats.total_score,
        level: Math.floor(stats.total_score / 100) + 1,
        badges: badges.map(b => b.badge_id),
        completedQuizzes: [],
        viewedEvents: progress
          .filter(p => p.progress_type === 'completed')
          .map(p => p.event_id),
        achievements: badges.map(b => ({
          id: b.badge_id,
          unlockedAt: b.earned_at
        }))
      }
    };

    // Cập nhật last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    return {
      success: true,
      user,
      message: 'Đăng nhập thành công'
    };
  } catch (error: any) {
    console.error('Error logging in user:', error);
    return { 
      success: false, 
      message: error.message || 'Có lỗi xảy ra khi đăng nhập'
    };
  }
}

/**
 * Đăng xuất user
 */
export async function logoutUser(): Promise<{ success: boolean; message?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { success: true, message: 'Đăng xuất thành công' };
  } catch (error: any) {
    console.error('Error logging out:', error);
    return { 
      success: false, 
      message: error.message || 'Có lỗi xảy ra khi đăng xuất'
    };
  }
}

/**
 * Lấy user hiện tại
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!userData) return null;

    // Lấy stats và progress
    const [statsResult, progressResult, badgesResult] = await Promise.all([
      supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
      supabase.from('user_progress').select('*').eq('user_id', user.id),
      supabase.from('user_badges').select('*').eq('user_id', user.id)
    ]);

    const stats = statsResult.data || {
      total_events_completed: 0,
      total_characters_learned: 0,
      total_badges_earned: 0,
      total_game_sessions: 0,
      total_score: 0
    };

    const progress = progressResult.data || [];
    const badges = badgesResult.data || [];

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      createdAt: userData.created_at,
      profile: {
        points: stats.total_score,
        level: Math.floor(stats.total_score / 100) + 1,
        badges: badges.map(b => b.badge_id),
        completedQuizzes: [],
        viewedEvents: progress
          .filter(p => p.progress_type === 'completed')
          .map(p => p.event_id),
        achievements: badges.map(b => ({
          id: b.badge_id,
          unlockedAt: b.earned_at
        }))
      }
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Tìm user theo email  
 */
export function findUserByEmail(email: string): Promise<User | null> {
  // Legacy function for compatibility
  return getCurrentUser();
}

/**
 * Tìm user theo username
 */
export function findUserByUsername(username: string): Promise<User | null> {
  // Legacy function for compatibility
  return getCurrentUser();
}
