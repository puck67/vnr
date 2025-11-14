// Simple Firebase test script
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAKbO7kWxO6_Wd5IR9vBOeEQsXEKXBSpks",
  authDomain: "hcmmmmmm-1d626.firebaseapp.com",
  databaseURL: "https://hcmmmmmm-1d626-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hcmmmmmm-1d626",
  storageBucket: "hcmmmmmm-1d626.firebasestorage.app",
  messagingSenderId: "215321433779",
  appId: "1:215321433779:web:5407188378eb645fc742c6",
  measurementId: "G-WM4Q8JND4H"
};

async function testFirebase() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    console.log('✅ Firebase initialized');

    // Test basic write
    const testRef = ref(database, 'test/simple');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'Simple test successful'
    });
    console.log('✅ Write test passed');

    // Test game room creation
    const roomsRef = ref(database, 'gameRooms');
    const newRoomRef = push(roomsRef);
    
    const testRoom = {
      id: newRoomRef.key,
      name: 'Test Room',
      gameType: 'trivia',
      hostId: 'test-host',
      hostName: 'Test Host',
      players: [{
        id: 'test-host',
        name: 'Test Host',
        score: 0,
        isHost: true,
        isReady: true,
        joinedAt: Date.now(),
        achievements: []
      }],
      maxPlayers: 4,
      status: 'waiting',
      settings: {
        timeLimit: 30,
        totalRounds: 5,
        difficulty: 'medium',
        enablePowerUps: true
      },
      createdAt: Date.now()
    };

    await set(newRoomRef, testRoom);
    console.log('✅ Game room created:', newRoomRef.key);
    console.log('🎉 All Firebase tests passed! Room ID:', newRoomRef.key);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testFirebase();
