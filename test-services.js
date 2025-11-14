// Test Supabase Services
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Test UserService
class UserService {
  static async registerUser(email, password, userData = {}) {
    try {
      console.log('🔄 Testing user registration...');
      
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
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: userData.username || email.split('@')[0],
          full_name: userData.fullName || '',
          avatar_url: userData.avatar || null
        });
        
        if (profileError) throw profileError;
      }
      
      console.log('✅ User registration successful!');
      return { success: true, user: data.user };
    } catch (error) {
      console.log('❌ User registration failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Test ProgressService  
class ProgressService {
  static async saveEventProgress(userId, eventId, progressData = {}) {
    try {
      console.log('🔄 Testing save event progress...');
      
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          event_id: eventId,
          progress_type: 'completed',
          progress_data: progressData,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('✅ Progress saved successfully!');
      return { success: true, data };
    } catch (error) {
      console.log('❌ Progress save failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Test BadgeService
class BadgeService {
  static async awardBadge(userId, badgeId, badgeData) {
    try {
      console.log('🔄 Testing badge award...');
      
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          badge_name: badgeData.name,
          badge_description: badgeData.description,
          badge_icon: badgeData.icon,
          criteria_met: badgeData.criteria || {}
        });

      if (error) throw error;
      
      console.log('✅ Badge awarded successfully!');
      return { success: true, data };
    } catch (error) {
      console.log('❌ Badge award failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Run Tests
async function runTests() {
  console.log('🚀 Starting Supabase Services Test...\n');
  
  // Test 1: User Registration
  const testUser = await UserService.registerUser(
    'test@vnr.com',
    'password123',
    {
      username: 'testuser',
      fullName: 'Test User VNR',
      avatar: null
    }
  );
  
  if (!testUser.success) {
    console.log('💥 Tests stopped - User registration failed');
    return;
  }
  
  const userId = testUser.user.id;
  console.log('👤 User ID:', userId, '\n');
  
  // Test 2: Save Progress  
  await ProgressService.saveEventProgress(userId, 'event-107', {
    score: 85,
    duration: 300,
    completed: true
  });
  
  // Test 3: Award Badge
  await BadgeService.awardBadge(userId, 'first-event', {
    name: 'Sự Kiện Đầu Tiên',
    description: 'Hoàn thành sự kiện đầu tiên',
    icon: 'trophy',
    criteria: { eventsCompleted: 1 }
  });
  
  console.log('\n🎉 All tests completed!');
}

runTests();
