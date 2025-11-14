'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, set, push, onValue, off } from 'firebase/database';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testFirebase();
  }, []);

  const testFirebase = async () => {
    try {
      // Test 1: Basic connection
      console.log('Testing Firebase connection...');
      
      // Test 2: Write test data
      const testRef = ref(database, 'test/connection');
      await set(testRef, {
        timestamp: Date.now(),
        message: 'Firebase test successful'
      });
      console.log('✅ Write test passed');

      // Test 3: Create game room test
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
      console.log('✅ Game room creation test passed');
      
      // Test 4: Read data
      const testListener = (snapshot: any) => {
        const data = snapshot.val();
        console.log('✅ Read test passed:', data ? Object.keys(data).length : 0, 'rooms');
        setStatus('✅ All Firebase tests passed!');
        off(roomsRef, 'value', testListener);
      };
      
      onValue(roomsRef, testListener);
      
    } catch (err: any) {
      console.error('❌ Firebase test failed:', err);
      setError(err.message || 'Unknown error');
      setStatus('❌ Firebase test failed');
    }
  };

  const testCreateRoom = async () => {
    try {
      setStatus('Testing room creation...');
      
      const { GameService } = await import('@/lib/game-service');
      const roomId = await GameService.createRoom('Test Player', 'trivia', {
        timeLimit: 30,
        totalRounds: 5,
        difficulty: 'medium',
        enablePowerUps: true
      });
      
      console.log('🎉 Room created successfully:', roomId);
      setStatus(`🎉 Room created: ${roomId}`);
    } catch (err: any) {
      console.error('❌ Create room failed:', err);
      setError(err.message);
      setStatus('❌ Create room failed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">🔧 Firebase Debug Console</h2>
      
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-500/20 border border-green-500/50' :
          status.includes('❌') ? 'bg-red-500/20 border border-red-500/50' :
          'bg-blue-500/20 border border-blue-500/50'
        }`}>
          <p className="text-white font-medium">{status}</p>
          {error && (
            <p className="text-red-300 text-sm mt-2">Error: {error}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={testFirebase}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Test Connection
          </button>
          <button
            onClick={testCreateRoom}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Test Create Room
          </button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3 text-xs text-gray-300">
          <p className="font-bold mb-2">Firebase Config:</p>
          <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p>Database: {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.split('/')[2]}</p>
          <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10)}...</p>
        </div>
      </div>
    </div>
  );
}
