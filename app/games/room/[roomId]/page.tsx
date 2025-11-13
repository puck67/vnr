'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Crown, CheckCircle, Play, Copy, Trophy, Star } from 'lucide-react';
import { GameRoom, GamePlayer, GameType } from '@/types';
import { firebaseGamesService } from '@/lib/firebase-games';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function GameRoomPage({ params }: PageProps) {
  const { roomId } = use(params);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get player ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const playerIdFromUrl = urlParams.get('playerId');
    if (playerIdFromUrl) {
      setPlayerId(playerIdFromUrl);
    }

    // Setup Firebase realtime listener
    const unsubscribe = firebaseGamesService.onRoomUpdate(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        setError('');
        
        // Check if game started
        if (updatedRoom.status === 'playing' && !gameStarted) {
          setGameStarted(true);
        }
      } else {
        setError('Phòng không tồn tại hoặc đã bị xóa');
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, [roomId, gameStarted]);

  const loadRoomData = async () => {
    try {
      const response = await fetch(`/api/games/rooms?id=${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setRoom(data.room);
        
        // Check if game started
        if (data.room.status === 'playing' && !gameStarted) {
          setGameStarted(true);
        }
      } else {
        setError('Không tìm thấy phòng game');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleReady = async () => {
    if (!room || !playerId) return;
    
    const newReadyStatus = !isReady;
    
    try {
      // Update ready status locally first for immediate UI feedback
      setIsReady(newReadyStatus);
      
      // Update Firebase directly for instant real-time sync
      await firebaseGamesService.updatePlayerReady(roomId, playerId, newReadyStatus);
      
      console.log(`Ready status updated: ${newReadyStatus}`);
    } catch (error) {
      console.error('Lỗi cập nhật ready status:', error);
      // Revert on error
      setIsReady(isReady);
    }
  };

  const handleStartGame = async () => {
    if (!room || room.hostId !== playerId) return;
    
    // All players must be ready
    const allReady = room.players.every(p => p.isReady);
    if (!allReady) {
      alert('Tất cả người chơi phải sẵn sàng!');
      return;
    }

    // Start countdown
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
      alert('Đã copy mã phòng!');
    }
  };

  const leaveRoom = async () => {
    if (!playerId) return;
    
    try {
      await fetch(`/api/games/rooms/${roomId}/join`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });
      window.location.href = '/games';
    } catch (error) {
      console.error('Lỗi rời phòng:', error);
      // Still redirect even if API fails
      window.location.href = '/games';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link href="/games" className="text-blue-400 hover:text-blue-300">
            Quay lại lobby
          </Link>
        </div>
      </div>
    );
  }

  if (!room) return null;

  // If game started, render game component
  if (gameStarted && room.gameType === 'timeline-puzzle') {
    return <TimelinePuzzleGame room={room} playerId={playerId} />;
  }

  const isHost = room.hostId === playerId;
  const currentPlayer = room.players.find(p => p.id === playerId);
  const allReady = room.players.every(p => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={leaveRoom}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Rời phòng</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {getGameTypeName(room.gameType)}
              </h1>
              <p className="text-white/70">
                Phòng: <span className="font-mono font-bold text-yellow-400">{room.code}</span>
              </p>
            </div>
            
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition"
            >
              <Copy className="w-4 h-4" />
              Copy mã
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players List */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Người chơi ({room.players.length}/{room.settings.maxPlayers})
                </h2>
                
                {isHost && (
                  <button
                    onClick={handleStartGame}
                    disabled={!allReady || room.players.length < 2}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Bắt đầu
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {room.players.map((player, index) => {
                  const isCurrentPlayer = player.id === playerId;
                  const playerReady = isCurrentPlayer ? isReady : player.isReady;
                  
                  return (
                    <div key={player.id} className={`flex items-center gap-4 p-4 rounded-xl ${
                      player.isHost ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{player.name}</span>
                          {player.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
                          {isCurrentPlayer && <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white">Bạn</span>}
                        </div>
                        <div className="text-white/60 text-sm">
                          {playerReady ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {playerReady && <CheckCircle className="w-5 h-5 text-green-400" />}
                        <div className="text-white/80 font-medium">{player.score}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!isReady && currentPlayer && (
                <button
                  onClick={handleReady}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Sẵn sàng
                </button>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Thông tin game</h3>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Độ khó:</span>
                  <span className="capitalize">{room.settings.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số vòng:</span>
                  <span>{room.settings.rounds}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian/vòng:</span>
                  <span>{room.settings.timeLimit}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className={`capitalize ${
                    room.status === 'waiting' ? 'text-yellow-400' : 
                    room.status === 'playing' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {room.status === 'waiting' ? 'Chờ' : 
                     room.status === 'playing' ? 'Đang chơi' : 'Kết thúc'}
                  </span>
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Luật chơi</h3>
              <div className="text-white/70 text-sm space-y-2">
                {getGameRules(room.gameType).map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Overlay */}
      {countdown > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="text-8xl font-bold mb-4 animate-pulse">{countdown}</div>
            <div className="text-2xl">Game bắt đầu...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Timeline Puzzle Game Component
function TimelinePuzzleGame({ room, playerId }: { room: GameRoom; playerId: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // Initialize game
    initializeGame();
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeGame = async () => {
    try {
      const response = await fetch('/api/games/timeline-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          difficulty: room.settings.difficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.puzzleData.events);
      }
    } catch (error) {
      console.error('Lỗi khởi tạo game:', error);
    }
  };

  const submitAnswer = async () => {
    if (gameFinished) return;
    
    try {
      const response = await fetch('/api/games/timeline-puzzle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          playerId,
          orderedEventIds: events.map(e => e.id),
          startTime: Date.now() - ((60 - timeLeft) * 1000),
          timeLimit: 60
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setScore(data.results.score);
        setGameFinished(true);
      }
    } catch (error) {
      console.error('Lỗi nộp bài:', error);
    }
  };

  const handleDragStart = (eventId: string) => {
    setDraggedEvent(eventId);
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggedEvent) return;

    const draggedIndex = events.findIndex(e => e.id === draggedEvent);
    if (draggedIndex === -1) return;

    const newEvents = [...events];
    const draggedItem = newEvents.splice(draggedIndex, 1)[0];
    newEvents.splice(targetIndex, 0, draggedItem);
    
    setEvents(newEvents);
    setDraggedEvent(null);
  };

  if (gameFinished && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full mx-4 text-center border border-white/20">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-white mb-4">Kết quả</h1>
          
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{results.score} điểm</div>
            <div className="text-white/80">
              Độ chính xác: {Math.round(results.accuracy * 100)}%
            </div>
            <div className="text-white/60">
              Thời gian: {Math.round(results.timeUsed)}s
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/games"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Chơi lại
            </Link>
            <Link
              href="/map"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition border border-white/20"
            >
              Về bản đồ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Game Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Timeline Puzzle</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-mono text-lg">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Xếp các sự kiện theo thứ tự thời gian (từ sớm nhất đến muộn nhất)
          </h2>
          
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={event.id}
                draggable
                onDragStart={() => handleDragStart(event.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-move transition border border-white/20 hover:border-white/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{event.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{event.description}</p>
                  </div>
                  <div className="text-white/60 font-mono text-sm">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={submitAnswer}
            className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getGameTypeName(gameType: GameType): string {
  const names = {
    'timeline-puzzle': 'Timeline Puzzle',
    'character-matching': 'Character Matching',
    'historical-trivia': 'Historical Trivia',
    'map-conquest': 'Map Conquest'
  };
  return names[gameType] || gameType;
}

function getGameRules(gameType: GameType): string[] {
  const rules = {
    'timeline-puzzle': [
      'Xếp các sự kiện theo thứ tự thời gian đúng',
      'Càng nhanh và chính xác càng được nhiều điểm',
      'Kéo thả để sắp xếp sự kiện',
      'Thời gian giới hạn cho mỗi vòng'
    ],
    'character-matching': [
      'Ghép nhân vật với sự kiện liên quan',
      'Mỗi lần ghép đúng được điểm',
      'Ghép sai sẽ bị trừ điểm',
      'Hoàn thành nhanh để có điểm thưởng'
    ],
    'historical-trivia': [
      'Trả lời câu hỏi lịch sử',
      'Có 4 đáp án để chọn',
      'Trả lời nhanh được điểm cao hơn',
      'Câu khó sẽ có điểm thưởng'
    ],
    'map-conquest': [
      'Chinh phục các vùng trên bản đồ',
      'Trả lời đúng để chiếm đất',
      'Bảo vệ lãnh thổ của mình',
      'Người có nhiều đất nhất thắng'
    ]
  };
  return rules[gameType] || ['Chưa có luật chơi'];
}
