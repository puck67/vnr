import { database } from './firebase';
import { ref, push, set, onValue, off, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { GameRoom, GamePlayer, GameState, PlayerAnswer, GameQuestion, Achievement } from '@/types/games';

export class GameService {
  // Tạo phòng game mới
  static async createRoom(
    hostName: string, 
    gameType: GameRoom['gameType'], 
    settings: GameRoom['settings']
  ): Promise<{ roomId: string; hostPlayerId: string }> {
    console.log('🏗️ GameService: Creating room with settings:', { gameType, settings });
    
    const roomsRef = ref(database, 'gameRooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key!;
    const roomCode = this.generateRoomCode();
    
    const hostPlayer: GamePlayer = {
      id: this.generatePlayerId(),
      name: hostName,
      score: 0,
      isHost: true,
      isReady: true,
      joinedAt: Date.now(),
      achievements: []
    };

    const room: GameRoom = {
      id: roomId,
      roomCode: roomCode,
      name: `Phòng của ${hostName}`,
      gameType,
      hostId: hostPlayer.id,
      hostName,
      players: [hostPlayer],
      maxPlayers: settings?.maxPlayers || 8,
      status: 'waiting',
      settings,
      createdAt: Date.now()
    };

    await set(newRoomRef, room);
    
    // Tạo mapping từ roomCode -> roomId
    const codeRef = ref(database, `roomCodes/${roomCode}`);
    await set(codeRef, roomId);
    
    return { roomId, hostPlayerId: hostPlayer.id };
  }

  // Lấy roomId từ roomCode
  static async getRoomIdByCode(roomCode: string): Promise<string | null> {
    try {
      const codeRef = ref(database, `roomCodes/${roomCode}`);
      const codeSnapshot = await new Promise<any>((resolve) => {
        onValue(codeRef, resolve, { onlyOnce: true });
      });
      
      return codeSnapshot.val() || null;
    } catch (error) {
      console.error('Error getting room ID by code:', error);
      return null;
    }
  }

  // Tham gia phòng bằng mã
  static async joinRoomByCode(roomCode: string, playerName: string): Promise<GamePlayer | null> {
    try {
      const roomId = await this.getRoomIdByCode(roomCode);
      if (!roomId) {
        return null; // Mã phòng không tồn tại
      }
      
      return this.joinRoom(roomId, playerName);
    } catch (error) {
      console.error('Error joining room by code:', error);
      return null;
    }
  }

  // Tham gia phòng
  static async joinRoom(roomId: string, playerName: string): Promise<GamePlayer | null> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    return new Promise((resolve) => {
      onValue(roomRef, async (snapshot) => {
        const room = snapshot.val() as GameRoom;
        if (!room || room.status !== 'waiting' || (room.players?.length || 0) >= room.maxPlayers) {
          resolve(null);
          return;
        }

        const newPlayer: GamePlayer = {
          id: this.generatePlayerId(),
          name: playerName,
          score: 0,
          isHost: false,
          isReady: false,
          joinedAt: Date.now(),
          achievements: []
        };

        const updatedPlayers = [...(room.players || []), newPlayer];
        await update(roomRef, { players: updatedPlayers });
        resolve(newPlayer);
      }, { onlyOnce: true });
    });
  }

  // Rời phòng
  static async leaveRoom(roomId: string, playerId: string): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    onValue(roomRef, async (snapshot) => {
      const room = snapshot.val() as GameRoom;
      if (!room) return;

      const updatedPlayers = room.players.filter(p => p.id !== playerId);
      
      if (updatedPlayers.length === 0) {
        // Xóa phòng nếu không còn ai
        await remove(roomRef);
      } else {
        // Chuyển host nếu host rời đi
        if (room.hostId === playerId && updatedPlayers.length > 0) {
          updatedPlayers[0].isHost = true;
          await update(roomRef, {
            players: updatedPlayers,
            hostId: updatedPlayers[0].id,
            hostName: updatedPlayers[0].name
          });
        } else {
          await update(roomRef, { players: updatedPlayers });
        }
      }
    }, { onlyOnce: true });
  }

  // Đánh dấu sẵn sàng
  static async setPlayerReady(roomId: string, playerId: string, isReady: boolean): Promise<void> {
    console.log('🔵 GameService: setPlayerReady called:', { roomId, playerId, isReady });
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    onValue(roomRef, async (snapshot) => {
      const room = snapshot.val() as GameRoom;
      console.log('🔵 GameService: Room data retrieved:', { 
        hasRoom: !!room, 
        playersCount: room?.players?.length,
        playerFound: room?.players?.some(p => p.id === playerId)
      });
      
      if (!room) {
        console.log('❌ GameService: Room not found');
        return;
      }

      const updatedPlayers = room.players.map(p => 
        p.id === playerId ? { ...p, isReady } : p
      );

      console.log('📤 GameService: Updating players ready status');
      await update(roomRef, { players: updatedPlayers });
      console.log('✅ GameService: Players ready status updated');
    }, { onlyOnce: true });
  }

  // Bắt đầu game
  static async startGame(roomId: string): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    const gameStateRef = ref(database, `gameStates/${roomId}`);
    
    // Get room settings first
    const roomSnapshot = await new Promise<any>((resolve) => {
      onValue(roomRef, resolve, { onlyOnce: true });
    });
    
    const room = roomSnapshot.val() as GameRoom;
    const totalRounds = room?.settings?.totalRounds || 10;
    const timeLimit = room?.settings?.timeLimit || 30;
    
    console.log('🎮 GameService: Starting game with settings:', {
      totalRounds,
      timeLimit,
      difficulty: room?.settings?.difficulty
    });
    
    const initialGameState: GameState = {
      currentRound: 1,
      totalRounds: totalRounds,
      timeRemaining: timeLimit,
      playerAnswers: [],
      leaderboard: []
    };
    
    // Store settings and room info in gameState for consistency across all players
    (initialGameState as any).settings = room?.settings;
    (initialGameState as any).roomId = roomId;

    await Promise.all([
      update(roomRef, { 
        status: 'playing', 
        startedAt: Date.now(),
        currentRound: 1,
        totalRounds: totalRounds
      }),
      set(gameStateRef, initialGameState)
    ]);
  }

  // Hoàn thành game cho player
  static async finishGameForPlayer(roomId: string, playerId: string, finalScore: number): Promise<void> {
    console.log('🔥 GameService: finishGameForPlayer called', { roomId, playerId, finalScore });
    
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    // Get current room data
    const roomSnapshot = await new Promise<any>((resolve) => {
      onValue(roomRef, resolve, { onlyOnce: true });
    });
    
    const room = roomSnapshot.val() as GameRoom;
    if (!room) {
      console.log('❌ GameService: Room not found:', roomId);
      return;
    }

    console.log('📊 GameService: Current room players:', room.players?.map(p => ({ 
      id: p.id, name: p.name, score: p.score, isFinished: p.isFinished 
    })));

    // Update player's final score and finished status
    const updatedPlayers = room.players.map(player => {
      if (player.id === playerId) {
        console.log('🎯 GameService: Updating player', player.name, 'with score:', finalScore);
        return { 
          ...player, 
          score: finalScore, 
          isFinished: true,
          finishedAt: Date.now()
        };
      }
      return player;
    });

    // Check if all players are finished
    const allFinished = updatedPlayers.every(p => p.isFinished);
    console.log('🏁 GameService: All players finished?', allFinished);
    console.log('🏁 GameService: Updated players:', updatedPlayers.map(p => ({ 
      id: p.id, name: p.name, score: p.score, isFinished: p.isFinished 
    })));
    
    const updates: any = { players: updatedPlayers };
    
    if (allFinished) {
      console.log('🎉 GameService: Setting room status to finished');
      updates.status = 'finished';
      updates.finishedAt = Date.now();
    }

    console.log('🔄 GameService: Updating Firebase with:', updates);
    await update(roomRef, updates);
    console.log('✅ GameService: Firebase update completed');
  }

  // Gửi câu trả lời
  static async submitAnswer(
    roomId: string, 
    playerId: string, 
    answer: string | number | string[]
  ): Promise<void> {
    console.log('📝 GameService: submitAnswer called:', { roomId, playerId, answer });
    
    const answerRef = ref(database, `gameStates/${roomId}/playerAnswers`);
    const newAnswerRef = push(answerRef);
    
    const playerAnswer: PlayerAnswer = {
      playerId,
      answer,
      submittedAt: Date.now(),
      isCorrect: false, // Sẽ được tính toán ở server
      points: 0
    };

    try {
      await set(newAnswerRef, playerAnswer);
      console.log('✅ GameService: Answer saved to Firebase:', playerAnswer);
      
      // Check if all players have answered for this round
      console.log('🔍 GameService: Calling checkRoundCompletion...');
      await this.checkRoundCompletion(roomId);
    } catch (error) {
      console.error('❌ GameService: Error submitting answer:', error);
    }
  }
  
  // Prevent duplicate round advancement
  private static advancementInProgress = new Set<string>();

  // Kiểm tra xem tất cả players đã trả lời chưa
  static async checkRoundCompletion(roomId: string): Promise<void> {
    // Prevent duplicate calls for same room
    if (this.advancementInProgress.has(roomId)) {
      console.log('⏸️ GameService: Round advancement already in progress for room:', roomId);
      return;
    }
    const roomRef = ref(database, `gameRooms/${roomId}`);
    const gameStateRef = ref(database, `gameStates/${roomId}`);
    
    const [roomSnapshot, gameStateSnapshot] = await Promise.all([
      new Promise<any>((resolve) => onValue(roomRef, resolve, { onlyOnce: true })),
      new Promise<any>((resolve) => onValue(gameStateRef, resolve, { onlyOnce: true }))
    ]);
    
    const room = roomSnapshot.val() as GameRoom;
    const gameState = gameStateSnapshot.val();
    
    if (!room || !gameState) {
      console.log('❌ GameService: Room or gameState not found', { room: !!room, gameState: !!gameState });
      return;
    }
    
    // Track answers for current round only
    const currentRound = room.currentRound || 1;
    const allAnswers = Object.values(gameState.playerAnswers || {}).filter(
      (answer: any) => answer.submittedAt && answer.playerId
    );
    
    // Get unique players who answered (không cần theo round vì ta clear answers mỗi round)
    const uniquePlayerAnswers = new Set(allAnswers.map((answer: any) => answer.playerId)).size;
    const expectedPlayers = room.players.length;
    
    console.log('🔍 GameService: Checking round completion:', {
      roomId,
      currentRound: currentRound,
      totalPlayers: expectedPlayers,
      answersReceived: allAnswers.length,
      uniquePlayerAnswers: uniquePlayerAnswers,
      expectedPlayers: expectedPlayers,
      playerIds: room.players.map(p => p.id),
      answerPlayerIds: allAnswers.map((a: any) => a.playerId),
      allAnswersData: allAnswers
    });
    
    // Nếu tất cả players đã trả lời
    if (uniquePlayerAnswers >= expectedPlayers) {
      console.log('✅ GameService: All players answered, scheduling advance to next round in 3 seconds');
      console.log('🎯 GameService: Will advance from round', currentRound, 'to round', currentRound + 1);
      
      // Set flag để prevent duplicate calls
      this.advancementInProgress.add(roomId);
      
      // Delay 3 giây để players xem kết quả trước khi chuyển câu
      setTimeout(async () => {
        console.log('🚀 GameService: Executing advance to next round after delay');
        
        // Clear previous answers và advance round
        try {
          await update(gameStateRef, { playerAnswers: {} });
          console.log('✅ GameService: Cleared playerAnswers');
          
          await this.advanceToNextRound(roomId);
          console.log('✅ GameService: advanceToNextRound completed');
        } catch (error) {
          console.error('❌ GameService: Error in setTimeout:', error);
        } finally {
          // Clear flag sau khi hoàn thành
          this.advancementInProgress.delete(roomId);
          console.log('🏁 GameService: Advancement flag cleared for room:', roomId);
        }
      }, 3000);
    } else {
      console.log('⏳ GameService: Waiting for more players to answer:', {
        received: uniquePlayerAnswers,
        needed: expectedPlayers,
        missing: expectedPlayers - uniquePlayerAnswers
      });
    }
  }

  // Cập nhật điểm số
  static async updatePlayerScore(roomId: string, playerId: string, points: number): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    onValue(roomRef, async (snapshot) => {
      const room = snapshot.val() as GameRoom;
      if (!room) return;

      const updatedPlayers = room.players.map(p => 
        p.id === playerId ? { ...p, score: p.score + points } : p
      );

      await update(roomRef, { players: updatedPlayers });
    }, { onlyOnce: true });
  }

  // Chuyển sang round tiếp theo
  static async advanceToNextRound(roomId: string): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    const gameStateRef = ref(database, `gameStates/${roomId}`);
    
    // Get current room and game state
    const roomSnapshot = await new Promise<any>((resolve) => {
      onValue(roomRef, resolve, { onlyOnce: true });
    });
    
    const room = roomSnapshot.val() as GameRoom;
    if (!room) {
      console.log('❌ GameService: Room not found for advanceToNextRound:', roomId);
      return;
    }
    
    const currentRound = room.currentRound || 1;
    const nextRound = currentRound + 1;
    const totalRounds = room.totalRounds || room.settings?.totalRounds || 10;
    
    console.log('🎯 GameService: Advancing to next round:', {
      roomId,
      currentRound,
      nextRound,
      totalRounds,
      roomStatus: room.status
    });
    
    if (nextRound <= totalRounds) {
      // Chuyển sang round tiếp theo
      const timeLimit = room.settings?.timeLimit || 30;
      
      try {
        await Promise.all([
          update(roomRef, { 
            currentRound: nextRound 
          }),
          update(gameStateRef, {
            currentRound: nextRound,
            timeRemaining: timeLimit,
            playerAnswers: {} // Clear as object, not array
          })
        ]);
        
        console.log('✅ GameService: Successfully advanced to round:', nextRound);
      } catch (error) {
        console.error('❌ GameService: Error advancing to next round:', error);
      }
    } else {
      // Hết tất cả rounds, finish game
      console.log('🏁 GameService: All rounds completed, finishing game');
      await this.finishGame(roomId);
    }
  }

  // Kết thúc game
  static async finishGame(roomId: string): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    await update(roomRef, { 
      status: 'finished',
      finishedAt: Date.now()
    });

    // Tính toán huy hiệu và cập nhật thống kê
    await this.calculateAchievements(roomId);
  }

  // Tính toán huy hiệu
  static async calculateAchievements(roomId: string): Promise<void> {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    onValue(roomRef, async (snapshot) => {
      const room = snapshot.val() as GameRoom;
      if (!room) return;

      const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
      const winner = sortedPlayers[0];
      
      // Trao huy hiệu cho người thắng
      if (winner) {
        const winnerAchievement: Achievement = {
          id: `win-${Date.now()}`,
          name: 'Chiến Thắng',
          description: `Đã thắng game ${room.gameType}`,
          icon: 'trophy',
          color: '#FFD700',
          rarity: 'epic',
          unlockedAt: Date.now()
        };

        const updatedPlayers = room.players.map(p => 
          p.id === winner.id 
            ? { ...p, achievements: [...p.achievements, winnerAchievement] }
            : p
        );

        await update(roomRef, { players: updatedPlayers });
      }
    }, { onlyOnce: true });
  }

  // Lắng nghe thay đổi phòng
  static listenToRoom(roomId: string, callback: (room: GameRoom | null) => void): () => void {
    const roomRef = ref(database, `gameRooms/${roomId}`);
    
    onValue(roomRef, (snapshot) => {
      const room = snapshot.val() as GameRoom | null;
      callback(room);
    });

    return () => off(roomRef);
  }

  // Lắng nghe trạng thái game
  static listenToGameState(roomId: string, callback: (gameState: GameState | null) => void): () => void {
    const gameStateRef = ref(database, `gameStates/${roomId}`);
    
    onValue(gameStateRef, (snapshot) => {
      const gameState = snapshot.val() as GameState | null;
      callback(gameState);
    });

    return () => off(gameStateRef);
  }

  // Tìm phòng công khai
  static async findPublicRooms(gameType?: GameRoom['gameType']): Promise<GameRoom[]> {
    const roomsRef = ref(database, 'gameRooms');
    const waitingRoomsQuery = query(roomsRef, orderByChild('status'), equalTo('waiting'));
    
    return new Promise((resolve) => {
      onValue(waitingRoomsQuery, (snapshot) => {
        const rooms: GameRoom[] = [];
        
        snapshot.forEach((childSnapshot) => {
          const room = childSnapshot.val() as GameRoom;
          if (!gameType || room.gameType === gameType) {
            rooms.push(room);
          }
        });

        resolve(rooms);
      }, { onlyOnce: true });
    });
  }

  // Tạo ID người chơi
  static generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Tạo mã phòng ngắn (6 ký tự)
  static generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
