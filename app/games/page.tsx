'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Gamepad2, Trophy, Zap } from 'lucide-react';
import { GameType } from '@/types';

const gameTypes = [
  {
    id: 'timeline-puzzle' as GameType,
    name: 'Timeline Puzzle',
    description: 'Xếp các sự kiện lịch sử theo đúng thứ tự thời gian',
    difficulty: 'Trung bình',
    duration: '3-5 phút',
    players: '2-6 người',
    color: 'from-blue-500 to-blue-700',
    icon: Clock
  },
  {
    id: 'character-matching' as GameType,
    name: 'Character Matching',
    description: 'Ghép nhân vật lịch sử với sự kiện liên quan',
    difficulty: 'Khó',
    duration: '5-7 phút',
    players: '2-8 người',
    color: 'from-purple-500 to-purple-700',
    icon: Users
  },
  {
    id: 'historical-trivia' as GameType,
    name: 'Historical Trivia',
    description: 'Đố vui kiến thức lịch sử nhanh',
    difficulty: 'Dễ',
    duration: '2-4 phút',
    players: '2-10 người',
    color: 'from-green-500 to-green-700',
    icon: Zap
  },
  {
    id: 'map-conquest' as GameType,
    name: 'Map Conquest',
    description: 'Chinh phục các vùng đất trên bản đồ Việt Nam',
    difficulty: 'Khó',
    duration: '10-15 phút',
    players: '2-4 người',
    color: 'from-red-500 to-red-700',
    icon: Trophy
  }
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/map"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại bản đồ</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mini Games
              </h1>
              <p className="text-white/70 text-lg">
                Chơi game cùng bạn bè và thách thức kiến thức lịch sử
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedGame ? (
          // Game Selection
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Chọn loại game bạn muốn chơi
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {gameTypes.map(game => {
                const IconComponent = game.icon;
                return (
                  <div
                    key={game.id}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.color} p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {game.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {game.difficulty} • {game.duration}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 mb-4">
                        {game.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{game.players}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{game.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
            
            {/* Quick Join */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Tham gia nhanh
              </h3>
              <p className="text-white/70 mb-4">
                Có mã phòng từ bạn bè? Nhập mã để tham gia ngay!
              </p>
              <button
                onClick={() => setShowJoinRoom(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Nhập mã phòng
              </button>
            </div>
          </div>
        ) : (
          // Game Options
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chọn game khác</span>
            </button>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {gameTypes.find(g => g.id === selectedGame)?.name}
                </h2>
                <p className="text-white/70">
                  {gameTypes.find(g => g.id === selectedGame)?.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-lg mb-1">Tạo phòng</div>
                  <div className="text-sm text-white/80">Làm chủ phòng và mời bạn bè</div>
                </button>
                
                <button
                  onClick={() => setShowJoinRoom(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-lg mb-1">Tham gia phòng</div>
                  <div className="text-sm text-white/80">Nhập mã phòng để chơi</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateRoom && (
        <CreateRoomModal 
          gameType={selectedGame!}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
      
      {showJoinRoom && (
        <JoinRoomModal onClose={() => setShowJoinRoom(false)} />
      )}
    </div>
  );
}

// Create Room Modal Component
function CreateRoomModal({ 
  gameType, 
  onClose 
}: { 
  gameType: GameType;
  onClose: () => void;
}) {
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/games/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType,
          hostName: playerName,
          settings: {
            maxPlayers,
            difficulty,
            timeLimit: 60,
            rounds: 5
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to game room
        window.location.href = `/games/room/${data.room.id}?playerId=${data.hostId}`;
      }
    } catch (error) {
      console.error('Lỗi tạo phòng:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Tạo phòng game</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên của bạn
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên của bạn"
              maxLength={20}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số người chơi tối đa
            </label>
            <select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2}>2 người</option>
              <option value={4}>4 người</option>
              <option value={6}>6 người</option>
              <option value={8}>8 người</option>
              <option value={10}>10 người</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || isCreating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isCreating ? 'Đang tạo...' : 'Tạo phòng'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Join Room Modal Component
function JoinRoomModal({ onClose }: { onClose: () => void }) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    
    setIsJoining(true);
    try {
      // First get room info
      const roomResponse = await fetch(`/api/games/rooms?code=${roomCode.toUpperCase()}`);
      if (!roomResponse.ok) {
        alert('Không tìm thấy phòng với mã này!');
        return;
      }
      
      const roomData = await roomResponse.json();
      const room = roomData.room;
      
      // Join the room
      const joinResponse = await fetch(`/api/games/rooms/${room.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          roomCode: roomCode.toUpperCase()
        })
      });

      if (joinResponse.ok) {
        const data = await joinResponse.json();
        // Redirect to game room
        window.location.href = `/games/room/${room.id}?playerId=${data.playerId}`;
      } else {
        const error = await joinResponse.json();
        alert(error.error || 'Không thể tham gia phòng');
      }
    } catch (error) {
      console.error('Lỗi tham gia phòng:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Tham gia phòng</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên của bạn
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên của bạn"
              maxLength={20}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã phòng
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
              placeholder="VD: ABC123"
              maxLength={6}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleJoinRoom}
            disabled={!playerName.trim() || !roomCode.trim() || isJoining}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isJoining ? 'Đang vào...' : 'Tham gia'}
          </button>
        </div>
      </div>
    </div>
  );
}
