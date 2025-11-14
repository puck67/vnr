'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export default function JoinRoomModal({ isOpen, onClose, onJoinRoom }: JoinRoomModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [searchMode, setSearchMode] = useState<'code' | 'browse'>('code');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim() || !roomCode.trim()) return;

    onJoinRoom(roomCode, playerName);
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
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Tham Gia Phòng</h2>
                  <p className="text-blue-200 text-sm">Nhập mã phòng hoặc tìm phòng công khai</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1 mb-6">
              <button
                onClick={() => setSearchMode('code')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  searchMode === 'code'
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Nhập Mã Phòng
              </button>
              <button
                onClick={() => setSearchMode('browse')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  searchMode === 'browse'
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Tìm Phòng
              </button>
            </div>

            {searchMode === 'code' ? (
              /* Join by Code Form */
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

                {/* Room Code */}
                <div>
                  <label className="block text-white font-medium mb-2">Mã phòng</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã phòng (6 ký tự)..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-blue-300 text-sm mt-2">
                    Mã phòng gồm 6 ký tự, người tạo phòng sẽ chia sẻ cho bạn
                  </p>
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
                    disabled={!playerName.trim() || !roomCode.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Tham Gia
                  </button>
                </div>
              </form>
            ) : (
              /* Browse Public Rooms */
              <div className="space-y-6">
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

                {/* Search & Filter */}
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm phòng..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                    <option value="">Tất cả</option>
                    <option value="timeline">Timeline Puzzle</option>
                    <option value="map-conquest">Map Conquest</option>
                    <option value="character-match">Character Matching</option>
                    <option value="trivia">Historical Trivia</option>
                  </select>
                </div>

                {/* Public Rooms List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 cursor-pointer transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Phòng của Nam</h4>
                      <span className="text-blue-300 text-sm">2/4 người</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Timeline Puzzle</span>
                      <span className="text-green-400">Đang chờ</span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 cursor-pointer transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Lịch sử Việt Nam</h4>
                      <span className="text-blue-300 text-sm">1/6 người</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Map Conquest</span>
                      <span className="text-green-400">Đang chờ</span>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                    <p className="text-blue-200">Không có phòng công khai nào</p>
                    <p className="text-blue-300 text-sm">Hãy tạo phòng mới hoặc tham gia bằng mã phòng</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    disabled={!playerName.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Tham Gia Phòng Đã Chọn
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
