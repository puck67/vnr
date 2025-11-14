'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Crown, Star, Target, Clock, 
  Users, TrendingUp, Award, Zap, CheckCircle,
  RotateCcw, Home, Share2
} from 'lucide-react';
import { GamePlayer, GameRoom } from '@/types/games';

interface GameResultsProps {
  players: GamePlayer[];
  gameRoom: GameRoom;
  onPlayAgain?: () => void;
  onBackToMenu?: () => void;
  gameType: string;
}

export default function GameResults({ 
  players, 
  gameRoom, 
  onPlayAgain, 
  onBackToMenu,
  gameType 
}: GameResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPlayerRank, setCurrentPlayerRank] = useState(0);

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy; 
      case 3: return Medal;
      default: return Star;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-red-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1: return 'h-32';
      case 2: return 'h-24';
      case 3: return 'h-20';
      default: return 'h-16';
    }
  };

  const getGameTypeName = (type: string) => {
    const names = {
      'trivia': 'Historical Trivia',
      'timeline': 'Timeline Puzzle',
      'character-match': 'Character Matching',
      'map-conquest': 'Map Conquest'
    };
    return names[type as keyof typeof names] || type;
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case 'trivia': return 'điểm';
      case 'timeline': return 'điểm';
      case 'character-match': return 'điểm';
      case 'map-conquest': return 'lãnh thổ';
      default: return 'điểm';
    }
  };

  const handleShare = async () => {
    const gameResult = `🏆 Kết quả ${getGameTypeName(gameType)}!\n` +
      `🥇 ${sortedPlayers[0]?.name}: ${sortedPlayers[0]?.score} ${getScoreLabel(gameType)}\n` +
      `🥈 ${sortedPlayers[1]?.name}: ${sortedPlayers[1]?.score} ${getScoreLabel(gameType)}\n` +
      `🎮 Chơi VNR History Games tại: localhost:3001/games`;

    if (navigator.share) {
      await navigator.share({
        title: 'VNR History Games Results',
        text: gameResult
      });
    } else {
      await navigator.clipboard.writeText(gameResult);
      alert('Đã copy kết quả vào clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-white/20"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            🎉 Kết Quả Game 🎉
          </motion.h1>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-200 text-lg"
          >
            {getGameTypeName(gameType)} • Phòng: {gameRoom.name}
          </motion.p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center space-x-8 mb-8">
          {sortedPlayers.slice(0, 3).map((player, index) => {
            const actualRank = index + 1;
            const RankIcon = getRankIcon(actualRank);
            const podiumOrder = [1, 0, 2]; // Để rank 1 ở giữa
            const displayIndex = podiumOrder.indexOf(index);
            
            return (
              <motion.div
                key={player.id}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + displayIndex * 0.2 }}
                className="text-center"
              >
                {/* Player Avatar */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${getRankColor(actualRank)} rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-xl`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Crown for winner */}
                  {actualRank === 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    >
                      <Crown className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                  )}
                </div>

                {/* Player Info */}
                <h3 className="text-white font-bold text-lg mb-1">{player.name}</h3>
                <p className="text-blue-200 text-sm mb-3">#{actualRank}</p>
                
                {/* Score */}
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="text-2xl font-bold text-white">{player.score || 0}</div>
                  <div className="text-blue-300 text-sm">{getScoreLabel(gameType)}</div>
                </div>

                {/* Podium */}
                <div className={`w-24 ${getPodiumHeight(actualRank)} bg-gradient-to-t ${getRankColor(actualRank)} rounded-t-xl flex items-center justify-center border-4 border-white/20`}>
                  <RankIcon className={`w-8 h-8 text-white`} />
                </div>
                
                <div className="bg-gray-700 h-4 w-24 border-4 border-gray-600"></div>
              </motion.div>
            );
          })}
        </div>

        {/* All Players List */}
        {sortedPlayers.length > 3 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-white/5 rounded-2xl p-6 mb-6"
          >
            <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Bảng Xếp Hạng Đầy Đủ</span>
            </h3>
            
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                const RankIcon = getRankIcon(rank);
                
                return (
                  <motion.div
                    key={player.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      rank <= 3 ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(rank)} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold">#{rank}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-bold">{player.name}</h4>
                        <p className="text-blue-300 text-sm">{player.score || 0} {getScoreLabel(gameType)}</p>
                      </div>
                    </div>
                    
                    <RankIcon className={`w-6 h-6 ${
                      rank === 1 ? 'text-yellow-400' :
                      rank === 2 ? 'text-gray-300' :
                      rank === 3 ? 'text-orange-400' :
                      'text-blue-400'
                    }`} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Game Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-blue-500/20 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{players.length}</div>
            <div className="text-blue-300 text-sm">Người chơi</div>
          </div>
          
          <div className="bg-purple-500/20 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{gameRoom.settings?.totalRounds || 10}</div>
            <div className="text-purple-300 text-sm">Câu hỏi</div>
          </div>
          
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center justify-center space-x-4"
        >
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center space-x-2 transition-colors duration-200"
          >
            <Share2 className="w-5 h-5" />
            <span>Chia sẻ</span>
          </button>
          
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center space-x-2 transition-colors duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Chơi lại</span>
            </button>
          )}
          
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center space-x-2 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Về menu</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
