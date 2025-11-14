// Test Supabase Auth
require('dotenv').config({ path: '.env.local' });

const { createUser, loginUser } = require('./lib/auth-supabase.ts');

async function testAuth() {
  console.log('🧪 Testing Supabase Authentication...\n');

  // Test 1: Register user
  console.log('1️⃣ Testing user registration...');
  const registerResult = await createUser({
    username: 'testuser123',
    email: 'testuser123@vnr.com',
    password: 'password123'
  });

  if (registerResult.success) {
    console.log('✅ Registration successful:', registerResult.user?.email);
  } else {
    console.log('❌ Registration failed:', registerResult.message);
    return;
  }

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Login user
  console.log('\n2️⃣ Testing user login...');
  const loginResult = await loginUser('testuser123@vnr.com', 'password123');

  if (loginResult.success) {
    console.log('✅ Login successful:', loginResult.user?.email);
    console.log('👤 User profile:', JSON.stringify(loginResult.user?.profile, null, 2));
  } else {
    console.log('❌ Login failed:', loginResult.message);
  }

  console.log('\n🎉 Auth test completed!');
}

testAuth();
