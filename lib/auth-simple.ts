/**
 * Simple Authentication - Lưu trực tiếp vào public.users
 * Không dùng Supabase Auth, chỉ dùng database
 */

import { supabaseAdmin } from './supabase-admin';
import bcrypt from 'bcryptjs';

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
 * Đăng ký user mới - Lưu trực tiếp vào public.users
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    // Kiểm tra email đã tồn tại
    const { data: existingEmail } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single();

    if (existingEmail) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Kiểm tra username đã tồn tại
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('username')
      .eq('username', userData.username)
      .single();

    if (existingUser) {
      return { success: false, message: 'Tên đăng nhập đã được sử dụng' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Tạo UUID cho user
    const userId = crypto.randomUUID();

    // Tạo user trong public.users
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        username: userData.username,
        password_hash: hashedPassword,
        full_name: userData.username,
        created_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      throw userError;
    }

    // Tạo user stats
    await supabaseAdmin
      .from('user_stats')
      .insert({
        user_id: userId,
        total_events_completed: 0,
        total_characters_learned: 0,
        total_badges_earned: 0,
        total_game_sessions: 0,
        total_score: 0,
        study_streak_days: 0
      });

    const user: Omit<User, 'password'> = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.created_at,
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
 * Đăng nhập user - Kiểm tra trong public.users
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Tìm user trong public.users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (userError || !userData) {
      return { success: false, message: 'Email không tồn tại' };
    }

    // Kiểm tra password
    if (!userData.password_hash) {
      return { success: false, message: 'Tài khoản không hợp lệ' };
    }

    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    // Lấy stats và progress
    const [statsResult, progressResult, badgesResult] = await Promise.all([
      supabaseAdmin.from('user_stats').select('*').eq('user_id', userData.id).single(),
      supabaseAdmin.from('user_progress').select('*').eq('user_id', userData.id),
      supabaseAdmin.from('user_badges').select('*').eq('user_id', userData.id)
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
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userData.id);

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
 * Lấy user theo ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userData) return null;

    // Lấy stats và progress
    const [statsResult, progressResult, badgesResult] = await Promise.all([
      supabaseAdmin.from('user_stats').select('*').eq('user_id', userId).single(),
      supabaseAdmin.from('user_progress').select('*').eq('user_id', userId),
      supabaseAdmin.from('user_badges').select('*').eq('user_id', userId)
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
    console.error('Error getting user by ID:', error);
    return null;
  }
}
