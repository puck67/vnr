// Test Supabase Connection
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseKey ? 'Có ✅' : 'Thiếu ❌');

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  async function testConnection() {
    try {
      console.log('📡 Đang test kết nối...');
      
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        if (error.message.includes('relation "users" does not exist')) {
          console.log('⚠️  Tables chưa được tạo. Hãy chạy SQL schema trong Supabase Dashboard!');
        } else {
          console.log('❌ Lỗi kết nối:', error.message);
        }
      } else {
        console.log('✅ Kết nối Supabase thành công!');
        console.log('📊 Response:', data);
      }
    } catch (err) {
      console.log('💥 Lỗi:', err.message);
    }
  }
  
  testConnection();
} else {
  console.log('❌ Thiếu environment variables!');
}
