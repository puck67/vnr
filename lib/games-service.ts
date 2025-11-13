// Server-side Games Service (không cần Firebase cho API routes)
import { GameRoom, GamePlayer, GameResult, PlayerResult, Badge, Leaderboard } from '@/types';

// In-memory storage cho development/testing
// Trong production sẽ thay bằng Firebase Admin SDK
class GamesService {
  private gameRooms = new Map<string, GameRoom>();
  private roomCodes = new Map<string, string>();
  private playerStats = new Map<string, any>();
  private gameResults = new Map<string, GameResult[]>();
  
  // Room Management
  async createRoom(gameRoom: GameRoom): Promise<string> {
    try {
      const roomId = gameRoom.id;
      this.gameRooms.set(roomId, gameRoom);
      this.roomCodes.set(gameRoom.code, roomId);
      
      console.log(`Created room ${roomId} with code ${gameRoom.code}`);
      return roomId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async joinRoom(roomId: string, player: GamePlayer): Promise<GameRoom | null> {
    try {
      const room = this.gameRooms.get(roomId);
      if (!room) return null;
      
      room.players.push(player);
      this.gameRooms.set(roomId, room);
      
      console.log(`Player ${player.name} joined room ${roomId}`);
      return room;
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
        console.log(`Deleted empty room ${roomId}`);
        return null;
      } else {
        // Reassign host if needed
        if (room.hostId === playerId) {
          room.hostId = room.players[0].id;
          room.players[0].isHost = true;
        }
        this.gameRooms.set(roomId, room);
      }
      
      console.log(`Player ${playerId} left room ${roomId}`);
      return room;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  async getRoomByCode(roomCode: string): Promise<GameRoom | null> {
    try {
      const roomId = this.roomCodes.get(roomCode.toUpperCase());
      if (!roomId) return null;
      
      return this.gameRooms.get(roomId) || null;
    } catch (error) {
      console.error('Error getting room by code:', error);
      return null;
    }
  }

  async getRoomById(roomId: string): Promise<GameRoom | null> {
    try {
      return this.gameRooms.get(roomId) || null;
    } catch (error) {
      console.error('Error getting room by id:', error);
      return null;
    }
  }

  async updateRoomStatus(roomId: string, status: 'waiting' | 'playing' | 'finished'): Promise<void> {
    try {
      const room = this.gameRooms.get(roomId);
      if (room) {
        room.status = status;
        this.gameRooms.set(roomId, room);
        console.log(`Updated room ${roomId} status to ${status}`);
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  }

  async updatePlayerReady(roomId: string, playerId: string, isReady: boolean): Promise<GameRoom | null> {
    try {
      const room = this.gameRooms.get(roomId);
      if (room) {
        const player = room.players.find(p => p.id === playerId);
        if (player) {
          player.isReady = isReady;
          this.gameRooms.set(roomId, room);
          console.log(`Player ${playerId} ready status: ${isReady}`);
          return room;
        }
      }
      return null;
    } catch (error) {
      console.error('Error updating player ready:', error);
      return null;
    }
  }

  // Game Results & Leaderboard
  async saveGameResult(gameResult: GameResult): Promise<void> {
    try {
      const results = this.gameResults.get(gameResult.gameType) || [];
      results.push(gameResult);
      this.gameResults.set(gameResult.gameType, results);
      
      // Update player stats
      gameResult.players.forEach(playerResult => {
        this.updatePlayerStats(playerResult, gameResult);
      });
      
      console.log(`Saved game result for room ${gameResult.roomId}`);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  }

  async getLeaderboard(gameType: string, period: string = 'all-time', limit: number = 10): Promise<Leaderboard> {
    try {
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
        .map(([playerId, data]) => ({
          rank: 0,
          playerId,
          playerName: data.name,
          totalScore: data.totalScore,
          gamesPlayed: data.gamesPlayed,
          winRate: data.gamesPlayed > 0 ? data.wins / data.gamesPlayed : 0,
          badges: [] as Badge[]
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, limit);
      
      // Assign ranks
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

  async getPlayerStats(playerId: string): Promise<any | null> {
    try {
      return this.playerStats.get(playerId) || null;
    } catch (error) {
      console.error('Error getting player stats:', error);
      return null;
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
    
    this.playerStats.set(playerId, stats);
  }

  // Debug methods
  getAllRooms(): GameRoom[] {
    return Array.from(this.gameRooms.values());
  }

  getRoomCount(): number {
    return this.gameRooms.size;
  }

  clearAllData(): void {
    this.gameRooms.clear();
    this.roomCodes.clear();
    this.playerStats.clear();
    this.gameResults.clear();
    console.log('Cleared all game data');
  }
}

// Export singleton instance
export const gamesService = new GamesService();
