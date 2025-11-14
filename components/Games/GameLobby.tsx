'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, Settings, Crown, Copy, Check, 
  Play, UserPlus, Clock, Trophy, Zap, Share2 
} from 'lucide-react';
import { GameService } from '@/lib/game-service';
import { GameRoom, GamePlayer } from '@/types/games';

interface GameLobbyProps {
  gameType: string;
  onBack: () => void;
  onStartGame?: (room: GameRoom) => void;
  onShowResults?: (room: GameRoom) => void;
  roomId?: string;
  playerId?: string;
}

export default function GameLobby({ gameType, onBack, onStartGame, onShowResults, roomId, playerId }: GameLobbyProps) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = GameService.listenToRoom(roomId, (roomData) => {
      console.log('🎧 GameLobby: Room data received:', {
        roomId: roomData?.id,
        status: roomData?.status,
        playersCount: roomData?.players?.length,
        players: roomData?.players?.map(p => ({ 
          id: p.id, name: p.name, score: p.score, isFinished: p.isFinished 
        }))
      });
      
      setRoom(roomData);
      if (roomData && roomData.players && playerId) {
        const player = roomData.players.find(p => p.id === playerId);
        setCurrentPlayer(player || null);
      }
      
      // Chuyển sang game khi status = 'playing'
      if (roomData && roomData.status === 'playing' && onStartGame) {
        console.log('🎮 GameLobby: Starting game, calling onStartGame');
        onStartGame(roomData);
      }
      
      // Chuyển sang results khi status = 'finished' VÀ tất cả players đã finished
      if (roomData && roomData.status === 'finished' && onShowResults) {
        const allPlayersFinished = roomData.players?.every(p => p.isFinished) || false;
        console.log('🏆 GameLobby: Game finished, checking player status:', {
          roomStatus: roomData.status,
          allPlayersFinished,
          playersData: roomData.players?.map(p => ({ id: p.id, name: p.name, isFinished: p.isFinished }))
        });
        
        if (allPlayersFinished) {
          console.log('🏆 GameLobby: All players finished, calling onShowResults');
          onShowResults(roomData);
        } else {
          console.log('⏳ GameLobby: Game finished but waiting for all players to complete');
        }
      } else if (roomData && roomData.status === 'finished') {
        console.log('❌ GameLobby: Game finished but onShowResults not provided');
      }
    });

    return unsubscribe;
  }, [roomId, playerId]);

  const handleCopyRoomCode = async () => {
    if (!room) return;
    
    const codeToShare = room.roomCode || room.id.slice(-6).toUpperCase();
    await navigator.clipboard.writeText(codeToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = async () => {
    console.log('🔴 GameLobby: handleToggleReady called:', {
      hasRoom: !!room,
      hasCurrentPlayer: !!currentPlayer,
      roomId: room?.id,
      playerId: currentPlayer?.id,
      currentIsReady: currentPlayer?.isReady
    });
    
    if (!room || !currentPlayer) {
      console.log('❌ GameLobby: Cannot toggle ready - missing room or currentPlayer:', {
        room: !!room,
        currentPlayer: !!currentPlayer
      });
      return;
    }
    
    console.log('📤 GameLobby: Calling GameService.setPlayerReady');
    try {
      await GameService.setPlayerReady(room.id, currentPlayer.id, !currentPlayer.isReady);
      console.log('✅ GameLobby: setPlayerReady completed');
    } catch (error) {
      console.error('❌ GameLobby: Error in setPlayerReady:', error);
    }
  };

  const handleStartGame = async () => {
    if (!room || !currentPlayer?.isHost) return;
    
    const allReady = (room.players || []).every(p => p.isReady);
    if (!allReady) return;
    
    await GameService.startGame(room.id);
  };

  const canStartGame = room?.players?.every(p => p.isReady) && (room.players || []).length >= 2;

  const gameTypeNames = {
    'timeline': 'Timeline Puzzle',
    'map-conquest': 'Map Conquest', 
    'character-match': 'Character Matching',
    'trivia': 'Historical Trivia'
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Đang tải phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-white">{room.name}</h1>
                <p className="text-blue-200">{gameTypeNames[gameType as keyof typeof gameTypeNames]}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Room Code */}
              <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center space-x-2">
                <span className="text-blue-200 text-sm">Mã phòng:</span>
                <span className="text-white font-mono text-lg">{room.roomCode || room.id.slice(-6).toUpperCase()}</span>
                <button
                  onClick={handleCopyRoomCode}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors duration-200"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* Share Button */}
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white flex items-center space-x-2 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Players List */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Người chơi ({(room.players || []).length}/{room.maxPlayers})</span>
                </h2>
                
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white flex items-center space-x-2 transition-colors duration-200">
                  <UserPlus className="w-4 h-4" />
                  <span>Mời bạn bè</span>
                </button>
              </div>

              <div className="space-y-3">
                {(room.players || []).map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{player.name}</span>
                          {player.isHost && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                          {player.id === currentPlayer?.id && (
                            <span className="text-blue-300 text-sm">(Bạn)</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-200">Điểm: {player.score || 0}</span>
                          {(player.achievements || []).length > 0 && (
                            <span className="text-purple-300">
                              {(player.achievements || []).length} huy hiệu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        player.isReady 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {player.isReady ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: room.maxPlayers - (room.players || []).length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-white/5 rounded-lg p-4 border-2 border-dashed border-white/20 flex items-center justify-center"
                  >
                    <span className="text-blue-300">Đang chờ người chơi...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Settings & Controls */}
          <div className="space-y-6">
            {/* Game Settings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Cài đặt game</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Thời gian mỗi câu:</span>
                  <span className="text-white flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{room.settings.timeLimit}s</span>
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200">Tổng số câu:</span>
                  <span className="text-white">{room.settings.totalRounds}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200">Độ khó:</span>
                  <span className="text-white capitalize">{room.settings.difficulty}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-200">Kỹ năng đặc biệt:</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-white">
                      {room.settings.enablePowerUps ? 'Bật' : 'Tắt'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Điều khiển</h3>

              <div className="space-y-3">
                {/* Ready Button */}
                <button
                  onClick={handleToggleReady}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentPlayer?.isReady
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {currentPlayer?.isReady ? 'Hủy sẵn sàng' : 'Sẵn sàng'}
                </button>

                {/* Start Game Button (Host only) */}
                {currentPlayer?.isHost && (
                  <button
                    onClick={handleStartGame}
                    disabled={!canStartGame}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Bắt đầu game</span>
                  </button>
                )}

                {!currentPlayer?.isHost && (
                  <div className="text-center text-blue-300 text-sm">
                    Đang chờ host bắt đầu game...
                  </div>
                )}

                {/* Game Status */}
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Trạng thái:</span>
                    <span className={`font-medium ${
                      room.status === 'waiting' ? 'text-orange-400' :
                      room.status === 'playing' ? 'text-green-400' :
                      'text-blue-400'
                    }`}>
                      {room.status === 'waiting' ? 'Đang chờ' :
                       room.status === 'playing' ? 'Đang chơi' :
                       'Đã kết thúc'}
                    </span>
                  </div>
                  
                  {!canStartGame && currentPlayer?.isHost && (
                    <p className="text-blue-300 text-xs mt-2">
                      Cần ít nhất 2 người và tất cả đều sẵn sàng
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Huy hiệu có thể nhận</span>
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-blue-200">Chiến thắng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-200">Trả lời nhanh nhất</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-blue-200">Chuỗi đúng 5+</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-200">Hoàn thành game</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
