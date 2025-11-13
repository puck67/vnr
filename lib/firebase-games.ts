'use client';

// Firebase Games Service - Realtime game management
import { GameRoom, GamePlayer, GameResult, PlayerResult, Badge, Leaderboard } from '@/types';

// Firebase imports
import { database } from './firebase';
import { ref, set, get, push, onValue, off, update, remove } from 'firebase/database';

// Temporary fallback to localStorage/memory until Firebase is configured
class FirebaseGamesService {
  private gameRooms = new Map<string, GameRoom>();
  private roomCodes = new Map<string, string>();
  private playerStats = new Map<string, any>();
  private gameResults = new Map<string, GameResult[]>();
  
  // Room Management
  async createRoom(gameRoom: GameRoom): Promise<string> {
    try {
      if (database) {
        // Firebase: Save to realtime database
        const roomRef = ref(database, `gameRooms/${gameRoom.id}`);
        await set(roomRef, gameRoom);
        
        // Also save room code mapping
        const codeRef = ref(database, `roomCodes/${gameRoom.code}`);
        await set(codeRef, gameRoom.id);
        
        console.log(`Created room ${gameRoom.id} in Firebase`);
        return gameRoom.id;
      } else {
        // Fallback: localStorage
        const roomId = gameRoom.id;
        this.gameRooms.set(roomId, gameRoom);
        this.roomCodes.set(gameRoom.code, roomId);
        this.saveToLocalStorage();
        return roomId;
      }
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async joinRoom(roomId: string, player: GamePlayer): Promise<GameRoom | null> {
    try {
      if (database) {
        // Firebase: Get room and update
        const roomRef = ref(database, `gameRooms/${roomId}`);
        const snapshot = await get(roomRef);
        if (!snapshot.exists()) return null;
        
        const room = snapshot.val() as GameRoom;
        room.players.push(player);
        
        await update(roomRef, { players: room.players });
        console.log(`Player ${player.name} joined room ${roomId} in Firebase`);
        return room;
      } else {
        // Fallback: memory
        const room = this.gameRooms.get(roomId);
        if (!room) return null;
        
        room.players.push(player);
        this.gameRooms.set(roomId, room);
        this.saveToLocalStorage();
        return room;
      }
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  async leaveRoom(roomId: string, playerId: string): Promise<GameRoom | null> {
    try {
      const room = this.gameRooms.get(roomId);
      if (!room) return null;
      
      room.players = room.players.filter(p => p.id !== playerId);
      
      if (room.players.length === 0) {
        // Delete empty room
        this.gameRooms.delete(roomId);
        this.roomCodes.delete(room.code);
      } else {
        // Reassign host if needed
        if (room.hostId === playerId) {
          room.hostId = room.players[0].id;
          room.players[0].isHost = true;
        }
        this.gameRooms.set(roomId, room);
      }
      
      this.saveToLocalStorage();
      return room;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  async getRoomByCode(roomCode: string): Promise<GameRoom | null> {
    try {
      // Firebase: Query rooms by code
      // const roomsRef = ref(database, 'gameRooms');
      // const query = orderByChild('code').equalTo(roomCode);
      
      // Fallback: memory
      const roomId = this.roomCodes.get(roomCode);
      if (!roomId) return null;
      
      return this.gameRooms.get(roomId) || null;
    } catch (error) {
      console.error('Error getting room by code:', error);
      return null;
    }
  }

  async updateRoomStatus(roomId: string, status: 'waiting' | 'playing' | 'finished'): Promise<void> {
    try {
      // Firebase: await update(ref(database, `gameRooms/${roomId}`), { status });
      
      // Fallback:
      const room = this.gameRooms.get(roomId);
      if (room) {
        room.status = status;
        this.gameRooms.set(roomId, room);
        this.saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  }

  async updatePlayerReady(roomId: string, playerId: string, isReady: boolean): Promise<void> {
    try {
      if (database) {
        // Firebase: Update player ready status
        const roomRef = ref(database, `gameRooms/${roomId}`);
        const snapshot = await get(roomRef);
        
        if (snapshot.exists()) {
          const room = snapshot.val() as GameRoom;
          const playerIndex = room.players.findIndex(p => p.id === playerId);
          
          if (playerIndex !== -1) {
            room.players[playerIndex].isReady = isReady;
            await update(roomRef, { players: room.players });
            console.log(`Updated player ${playerId} ready: ${isReady} in Firebase`);
          }
        }
      } else {
        // Fallback
        const room = this.gameRooms.get(roomId);
        if (room) {
          const player = room.players.find(p => p.id === playerId);
          if (player) {
            player.isReady = isReady;
            this.gameRooms.set(roomId, room);
            this.saveToLocalStorage();
          }
        }
      }
    } catch (error) {
      console.error('Error updating player ready:', error);
    }
  }

  // Realtime listeners
  onRoomUpdate(roomId: string, callback: (room: GameRoom | null) => void): () => void {
    if (database) {
      // Firebase: Real-time listener
      const roomRef = ref(database, `gameRooms/${roomId}`);
      onValue(roomRef, (snapshot) => {
        const room = snapshot.exists() ? snapshot.val() as GameRoom : null;
        callback(room);
      });
      
      return () => off(roomRef);
    } else {
      // Fallback: polling
      const interval = setInterval(() => {
        const room = this.gameRooms.get(roomId);
        callback(room || null);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }

  onRoomsUpdate(callback: (rooms: GameRoom[]) => void): () => void {
    // Firebase realtime listener for all rooms
    // const roomsRef = ref(database, 'gameRooms');
    // onValue(roomsRef, (snapshot) => {
    //   const rooms = snapshot.exists() ? Object.values(snapshot.val()) : [];
    //   callback(rooms);
    // });
    
    // Fallback: polling
    const interval = setInterval(() => {
      const rooms = Array.from(this.gameRooms.values());
      callback(rooms);
    }, 3000);
    
    return () => clearInterval(interval);
  }

  // Game Results & Leaderboard
  async saveGameResult(gameResult: GameResult): Promise<void> {
    try {
      // Firebase: 
      // const resultRef = push(ref(database, 'gameResults'));
      // await set(resultRef, gameResult);
      
      // Fallback:
      const results = this.gameResults.get(gameResult.gameType) || [];
      results.push(gameResult);
      this.gameResults.set(gameResult.gameType, results);
      
      // Update player stats
      gameResult.players.forEach(playerResult => {
        this.updatePlayerStats(playerResult, gameResult);
      });
      
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  }

  async getLeaderboard(gameType: string, period: string = 'all-time', limit: number = 10): Promise<Leaderboard> {
    try {
      // Firebase: Complex query for leaderboard
      // Fallback: memory calculation
      const results = this.gameResults.get(gameType) || [];
      const playerScores = new Map<string, { name: string; totalScore: number; gamesPlayed: number; wins: number }>();
      
      results.forEach(result => {
        result.players.forEach(player => {
          const existing = playerScores.get(player.playerId) || {
            name: player.playerName,
            totalScore: 0,
            gamesPlayed: 0,
            wins: 0
          };
          
          existing.totalScore += player.finalScore;
          existing.gamesPlayed += 1;
          if (player.rank === 1) existing.wins += 1;
          
          playerScores.set(player.playerId, existing);
        });
      });
      
      const entries = Array.from(playerScores.entries())
        .map(([playerId, data], index) => ({
          rank: index + 1,
          playerId,
          playerName: data.name,
          totalScore: data.totalScore,
          gamesPlayed: data.gamesPlayed,
          winRate: data.wins / data.gamesPlayed,
          badges: [] as Badge[]
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, limit);
      
      // Reassign ranks
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });
      
      return {
        gameType: gameType as any,
        period: period as any,
        entries,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  private updatePlayerStats(playerResult: PlayerResult, gameResult: GameResult): void {
    const { playerId, playerName, finalScore, rank } = playerResult;
    
    let stats = this.playerStats.get(playerId) || {
      playerId,
      playerName,
      totalScore: 0,
      gamesPlayed: 0,
      wins: 0,
      badges: [],
      lastPlayed: new Date().toISOString()
    };
    
    stats.totalScore += finalScore;
    stats.gamesPlayed += 1;
    if (rank === 1) stats.wins += 1;
    stats.lastPlayed = new Date().toISOString();
    
    // Check for new badges
    const newBadges = this.checkBadges(stats, gameResult);
    stats.badges.push(...newBadges);
    
    this.playerStats.set(playerId, stats);
  }

  private checkBadges(stats: any, gameResult: GameResult): Badge[] {
    const badges: Badge[] = [];
    
    // First win badge
    if (stats.wins === 1 && !stats.badges.find((b: Badge) => b.id === 'first_win')) {
      badges.push({
        id: 'first_win',
        name: 'Chiến thắng đầu tiên',
        description: 'Thắng game đầu tiên',
        icon: '🏆',
        rarity: 'common',
        unlockedAt: new Date().toISOString()
      });
    }
    
    return badges;
  }

  private saveToLocalStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gameRooms', JSON.stringify(Array.from(this.gameRooms.entries())));
        localStorage.setItem('roomCodes', JSON.stringify(Array.from(this.roomCodes.entries())));
        localStorage.setItem('playerStats', JSON.stringify(Array.from(this.playerStats.entries())));
        localStorage.setItem('gameResults', JSON.stringify(Array.from(this.gameResults.entries())));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const gameRooms = localStorage.getItem('gameRooms');
        if (gameRooms) {
          this.gameRooms = new Map(JSON.parse(gameRooms));
        }
        
        const roomCodes = localStorage.getItem('roomCodes');
        if (roomCodes) {
          this.roomCodes = new Map(JSON.parse(roomCodes));
        }
        
        const playerStats = localStorage.getItem('playerStats');
        if (playerStats) {
          this.playerStats = new Map(JSON.parse(playerStats));
        }
        
        const gameResults = localStorage.getItem('gameResults');
        if (gameResults) {
          this.gameResults = new Map(JSON.parse(gameResults));
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  constructor() {
    this.loadFromLocalStorage();
  }
}

// Export singleton instance
export const firebaseGamesService = new FirebaseGamesService();
