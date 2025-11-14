'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Trophy, Clock, Zap, ArrowLeft, Map, Brain } from 'lucide-react';
import GameLobby from '@/components/Games/GameLobby';
import CreateRoomModal from '@/components/Games/CreateRoomModal';
import JoinRoomModal from '@/components/Games/JoinRoomModal';
import { GameService } from '@/lib/game-service';
import { GameRoom } from '@/types/games';
import GameResults from '@/components/Games/GameResults';
import { useEffect } from 'react';
import Link from 'next/link';

const gameTypes = [
  {
    id: 'trivia',
    name: 'Historical Trivia',
    description: 'Đố vui nhanh về lịch sử Việt Nam',
    icon: Zap,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    difficulty: 'Dễ - Khó',
    players: '2-10 người',
    ready: true
  },
  {
    id: 'timeline',
    name: 'Timeline Puzzle',
    description: 'Xếp các sự kiện lịch sử theo đúng thứ tự thời gian',
    icon: Clock,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    difficulty: 'Trung bình',
    players: '2-8 người',
    ready: true
  },
  {
    id: 'character-match',
    name: 'Character Matching',
    description: 'Ghép nhân vật lịch sử với sự kiện tương ứng',
    icon: Trophy,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    difficulty: 'Dễ',
    players: '2-8 người',
    ready: true
  },
  {
    id: 'riddle-quest',
    name: 'Riddle Quest',
    description: 'Giải mã câu đố và bí ẩn lịch sử Việt Nam',
    icon: Brain,
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    difficulty: 'Trung bình - Khó',
    players: '2-8 người',
    ready: true
  }
];

export default function GamesPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'lobby' | 'game' | 'results'>('menu');
  const [activeGame, setActiveGame] = useState<GameRoom | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [realtimeRoomData, setRealtimeRoomData] = useState<GameRoom | null>(null);

  // Listen to realtime room data when in game view
  useEffect(() => {
    console.log('🔍 GamesPage: Realtime listener useEffect triggered:', { 
      currentView, 
      currentRoomId: currentRoom?.id,
      shouldSetupListener: currentView === 'game' && currentRoom?.id 
    });
    
    if (currentView === 'game' && currentRoom?.id) {
      console.log('🎧 GamesPage: Setting up realtime room listener for:', currentRoom.id);
      const unsubscribe = GameService.listenToRoom(currentRoom.id, (roomData) => {
        console.log('🎧 GamesPage: Realtime room data received:', {
          roomId: roomData?.id,
          status: roomData?.status,
          playersCount: roomData?.players?.length,
          players: roomData?.players?.map(p => ({ 
            id: p.id, 
            name: p.name, 
            score: p.score, 
            isFinished: p.isFinished,
            finishedAt: p.finishedAt
          }))
        });
        console.log('🎧 GamesPage: Full room data:', roomData);
        setRealtimeRoomData(roomData);
        
        // Auto-chuyển sang results khi room status = 'finished'  
        if (roomData?.status === 'finished') {
          console.log('🏆 GamesPage: Room finished, auto-switching to results view');
          setActiveGame(roomData);
          setCurrentView('results');
        }
      });
      
      return unsubscribe;
    } else {
      console.log('❌ GamesPage: Not setting up realtime listener - conditions not met');
    }
  }, [currentView, currentRoom?.id]);

  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    setShowCreateModal(true);
  };

  const handleCreateRoom = async (gameType: string, playerName: string, settings: any) => {
    try {
      const { roomId, hostPlayerId } = await GameService.createRoom(playerName, gameType as any, settings);
      setCurrentRoom({ id: roomId } as GameRoom);
      setPlayerId(hostPlayerId);
      setCurrentView('lobby');
      setShowCreateModal(false);
    } catch (error) {
      alert('Không thể tạo phòng. Vui lòng thử lại.');
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    try {
      const player = await GameService.joinRoomByCode(roomCode, playerName);
      if (player) {
        // Cần tìm roomId từ roomCode để set currentRoom
        const roomId = await GameService.getRoomIdByCode(roomCode);
        if (roomId) {
          setCurrentRoom({ id: roomId } as GameRoom);
          setPlayerId(player.id);
          setCurrentView('lobby');
          setShowJoinModal(false);
        }
      } else {
        alert('Không thể tham gia phòng. Kiểm tra mã phòng.');
      }
    } catch (error) {
      alert('Không thể tham gia phòng. Vui lòng thử lại.');
    }
  };

  const handleGameStart = (room: GameRoom) => {
    console.log('🎮 GamesPage: handleGameStart called with room:', room.id);
    console.log('🎮 GamesPage: Setting states:', {
      activeGame: room.id,
      currentRoom: room.id,
      selectedGameType: room.gameType,
      currentView: 'game'
    });
    
    setActiveGame(room);
    setCurrentRoom(room); // Set currentRoom để trigger realtime listener
    setSelectedGameType(room.gameType); // Đảm bảo selectedGameType đúng
    setCurrentView('game');
    
    console.log('🎮 GamesPage: States set, should trigger realtime listener useEffect');
  };

  const handleGameFinish = (finalScore: number) => {
    console.log('🏁 GamesPage: handleGameFinish called with score:', finalScore);
    console.log('🏁 GamesPage: activeGame:', activeGame?.id, 'playerId:', playerId);
    
    if (activeGame && playerId) {
      console.log('🔥 GamesPage: Calling GameService.finishGameForPlayer');
      GameService.finishGameForPlayer(activeGame.id, playerId, finalScore);
    } else {
      console.log('❌ GamesPage: Missing activeGame or playerId');
    }
  };

  const handleShowResults = (room: GameRoom) => {
    console.log('🏆 GamesPage: handleShowResults called with room:', room.id, 'status:', room.status);
    console.log('🏆 GamesPage: Room players:', room.players?.map(p => ({ id: p.id, name: p.name, score: p.score, isFinished: p.isFinished })));
    setActiveGame(room);
    setCurrentView('results');
  };

  const handlePlayAgain = () => {
    setCurrentView('menu');
    setActiveGame(null);
    setCurrentRoom(null);
    setRealtimeRoomData(null);
    setPlayerId('');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setActiveGame(null);
    setCurrentRoom(null);
    setRealtimeRoomData(null);
    setPlayerId('');
  };

  console.log('🎯 GamesPage render: currentView =', currentView, 'activeGame =', activeGame?.id, 'currentRoom =', currentRoom?.id);

  if (currentView === 'lobby') {
    console.log('🏠 GamesPage: Rendering GameLobby');
    return <GameLobby 
      gameType={selectedGameType} 
      onBack={() => setCurrentView('menu')} 
      onStartGame={handleGameStart}
      onShowResults={handleShowResults}
      roomId={currentRoom?.id}
      playerId={playerId}
    />;
  }

  if (currentView === 'game') {
    console.log('🎮 GamesPage: Rendering Game Component');
    // Import game components dynamically based on activeGame.gameType
    const gameType = activeGame?.gameType || selectedGameType;
    
    let GameComponent = null;
    try {
      if (gameType === 'trivia') {
        GameComponent = require('@/components/Games/HistoricalTrivia').default;
      } else if (gameType === 'timeline') {
        GameComponent = require('@/components/Games/TimelinePuzzle').default;
      } else if (gameType === 'character-match') {
        GameComponent = require('@/components/Games/CharacterMatching').default;
      } else if (gameType === 'riddle-quest') {
        GameComponent = require('@/components/Games/RiddleQuest').default;
      }
    } catch (error) {
      console.error('Error importing game component:', error);
      GameComponent = null;
    }

    if (GameComponent && activeGame) {
      // Use realtime room data if available, fallback to activeGame
      const gameRoomData = realtimeRoomData || activeGame;
      console.log('🎮 GamesPage: Rendering game with data:', {
        hasRealtimeData: !!realtimeRoomData,
        playersCount: gameRoomData.players?.length,
        players: gameRoomData.players?.map(p => ({ id: p.id, name: p.name, isFinished: p.isFinished }))
      });
      
      return <GameComponent 
        gameState={gameRoomData}
        currentPlayer={gameRoomData.players?.find(p => p.id === playerId)}
        allPlayers={gameRoomData.players || []}
        onSubmitAnswer={() => {}}
        onUseHint={() => {}}
        canUseHint={true}
        onGameFinish={handleGameFinish}
        onShowResults={handleShowResults}
      />;
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Lỗi tải game</h2>
          <p className="text-blue-200 mb-6">
            Không thể tải game component. Vui lòng thử lại.
          </p>
          
          <button 
            onClick={() => setCurrentView('lobby')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            Quay lại Lobby
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'results' && activeGame) {
    console.log('🏆 GamesPage: Rendering GameResults');
    return <GameResults 
      players={activeGame.players || []}
      gameRoom={activeGame}
      onPlayAgain={handlePlayAgain}
      onBackToMenu={handleBackToMenu}
      gameType={selectedGameType}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mini Games</h1>
                <p className="text-blue-200">Khám phá lịch sử qua trò chơi</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href="/map"
                className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 backdrop-blur-sm border border-green-500/30 flex items-center space-x-2"
              >
                <Map className="w-4 h-4" />
                <span>Quay lại bản đồ</span>
              </Link>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                Tham Gia Phòng
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
              >
                Tạo Phòng Mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selection */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Chọn Loại Trò Chơi</h2>
          <p className="text-xl text-blue-200">Thử thách kiến thức lịch sử với bạn bè</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameTypes.map((game, index) => {
            const IconComponent = game.icon;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => game.ready && handleSelectGame(game.id)}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-300 group ${
                  game.ready 
                    ? 'hover:bg-white/20 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`w-16 h-16 ${game.color} ${game.hoverColor} rounded-xl flex items-center justify-center mb-4 transition-colors duration-200`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-200">
                  {game.name}
                </h3>
                
                <p className="text-blue-200 mb-4 leading-relaxed">
                  {game.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Độ khó:</span>
                    <span className="text-white font-medium">{game.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Người chơi:</span>
                    <span className="text-white font-medium">{game.players}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center text-blue-300 group-hover:text-white transition-colors duration-200">
                    <span className="text-sm font-medium">Nhấn để tạo phòng</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Tính Năng Nổi Bật</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Multiplayer Realtime</h4>
              <p className="text-blue-200">Chơi cùng bạn bè trong thời gian thực</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Hệ Thống Huy Hiệu</h4>
              <p className="text-blue-200">Nhận huy hiệu khi hoàn thành thành tích</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Bảng Xếp Hạng</h4>
              <p className="text-blue-200">So tài với người chơi khác</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateRoom={handleCreateRoom}
          selectedGameType={selectedGameType}
        />
      )}

      {showJoinModal && (
        <JoinRoomModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </div>
  );
}
