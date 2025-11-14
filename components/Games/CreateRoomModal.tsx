'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Users, Clock, Zap } from 'lucide-react';
import { GameRoom } from '@/types/games';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (gameType: string, playerName: string, settings: any) => void;
  selectedGameType: string;
}

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom, selectedGameType }: CreateRoomModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [timeLimit, setTimeLimit] = useState(30);
  const [totalRounds, setTotalRounds] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [enablePowerUps, setEnablePowerUps] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) return;

    const settings = {
      timeLimit,
      totalRounds,
      difficulty,
      enablePowerUps,
      maxPlayers
    };

    onCreateRoom(selectedGameType, playerName, settings);
  };

  const gameTypeNames = {
    'timeline': 'Timeline Puzzle',
    'riddle-quest': 'Riddle Quest', 
    'character-match': 'Character Matching',
    'trivia': 'Historical Trivia'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Tạo Phòng Mới</h2>
                  <p className="text-blue-200 text-sm">{gameTypeNames[selectedGameType as keyof typeof gameTypeNames]}</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Player Name */}
              <div>
                <label className="block text-white font-medium mb-2">Tên của bạn</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Room Name */}
              <div>
                <label className="block text-white font-medium mb-2">Tên phòng (tùy chọn)</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder={`Phòng của ${playerName}`}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Game Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-medium flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Cài đặt game</span>
                </h3>

                {/* Max Players */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">Số người tối đa:</span>
                  </div>
                  <select
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
                  >
                    <option value={2}>2 người</option>
                    <option value={4}>4 người</option>
                    <option value={6}>6 người</option>
                    <option value={8}>8 người</option>
                  </select>
                </div>

                {/* Time Limit */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">Thời gian mỗi câu:</span>
                  </div>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
                  >
                    <option value={15}>15 giây</option>
                    <option value={30}>30 giây</option>
                    <option value={45}>45 giây</option>
                    <option value={60}>60 giây</option>
                  </select>
                </div>

                {/* Total Rounds */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Số câu hỏi:</span>
                  <select
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(Number(e.target.value))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
                  >
                    <option value={5}>5 câu</option>
                    <option value={10}>10 câu</option>
                    <option value={15}>15 câu</option>
                    <option value={20}>20 câu</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Độ khó:</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
                  >
                    <option value="easy">Dễ</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>

                {/* Power Ups */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">Kỹ năng đặc biệt:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnablePowerUps(!enablePowerUps)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                      enablePowerUps ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                        enablePowerUps ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Tạo Phòng
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
