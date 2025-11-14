'use client';

// Debug Firebase connection
export const debugFirebaseConnection = () => {
  console.log('=== Firebase Debug Info ===');
  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...');
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('Database URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error('❌ FIREBASE_API_KEY is missing');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
    console.error('❌ FIREBASE_DATABASE_URL is missing');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('❌ FIREBASE_PROJECT_ID is missing');
  }
  
  console.log('=== End Firebase Debug ===');
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    const { database } = await import('./firebase');
    const { ref, set } = await import('firebase/database');
    
    console.log('Testing Firebase connection...');
    
    // Test write to database
    const testRef = ref(database, 'test/connection');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'Firebase connection test'
    });
    
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};
