'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Crown, Star, Zap, Target, 
  Clock, Flame, Users, TrendingUp, Award,
  Calendar, Filter
} from 'lucide-react';
import { PlayerStats, Achievement } from '@/types/games';

interface LeaderboardProps {
  currentPlayerId?: string;
}

// Mock data for demonstration
const mockPlayers: PlayerStats[] = [
  {
    totalGames: 45,
    wins: 28,
    totalScore: 12650,
    averageScore: 281,
    rank: 1,
    experience: 8500,
    level: 12,
    achievements: [
      {
        id: 'champion',
        name: 'Vô địch',
        description: 'Thắng 25+ game liên tiếp',
        icon: 'crown',
        color: '#FFD700',
        rarity: 'legendary',
        unlockedAt: Date.now() - 86400000
      },
      {
        id: 'speed_demon',
        name: 'Tốc độ ánh sáng',
        description: 'Trả lời đúng trong 5 giây',
        icon: 'zap',
        color: '#60A5FA',
        rarity: 'epic',
        unlockedAt: Date.now() - 172800000
      }
    ]
  },
  {
    totalGames: 38,
    wins: 22,
    totalScore: 10200,
    averageScore: 268,
    rank: 2,
    experience: 7200,
    level: 10,
    achievements: [
      {
        id: 'historian',
        name: 'Sử gia',
        description: 'Đúng 100+ câu hỏi lịch sử',
        icon: 'award',
        color: '#8B5CF6',
        rarity: 'rare',
        unlockedAt: Date.now() - 259200000
      }
    ]
  },
  {
    totalGames: 32,
    wins: 18,
    totalScore: 8900,
    averageScore: 278,
    rank: 3,
    experience: 6100,
    level: 9,
    achievements: []
  }
];

const achievementCategories = [
  { id: 'all', name: 'Tất cả', icon: Award },
  { id: 'wins', name: 'Chiến thắng', icon: Trophy },
  { id: 'speed', name: 'Tốc độ', icon: Zap },
  { id: 'streaks', name: 'Chuỗi đúng', icon: Flame },
  { id: 'perfect', name: 'Hoàn hảo', icon: Star }
];

const allAchievements: Achievement[] = [
  {
    id: 'first_win',
    name: 'Chiến thắng đầu tiên',
    description: 'Thắng game đầu tiên',
    icon: 'trophy',
    color: '#10B981',
    rarity: 'common',
    unlockedAt: Date.now()
  },
  {
    id: 'speed_demon',
    name: 'Tốc độ ánh sáng',
    description: 'Trả lời đúng trong 5 giây',
    icon: 'zap',
    color: '#60A5FA',
    rarity: 'epic',
    unlockedAt: 0
  },
  {
    id: 'perfect_game',
    name: 'Hoàn hảo',
    description: 'Đúng tất cả câu hỏi trong 1 game',
    icon: 'star',
    color: '#F59E0B',
    rarity: 'rare',
    unlockedAt: 0
  },
  {
    id: 'champion',
    name: 'Vô địch',
    description: 'Thắng 25+ game liên tiếp',
    icon: 'crown',
    color: '#FFD700',
    rarity: 'legendary',
    unlockedAt: 0
  }
];

export default function Leaderboard({ currentPlayerId = 'player_1' }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [achievementFilter, setAchievementFilter] = useState('all');
  const [players, setPlayers] = useState<PlayerStats[]>(mockPlayers);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: case 3: return Medal;
      default: return Trophy;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-blue-400';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-green-500 bg-green-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      case 'epic': return 'border-purple-500 bg-purple-500/10';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      trophy: Trophy,
      crown: Crown,
      medal: Medal,
      star: Star,
      zap: Zap,
      flame: Flame,
      award: Award,
      target: Target
    };
    return icons[iconName] || Award;
  };

  const currentPlayer = players.find(p => p.rank === 1); // Mock current player

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Bảng Xếp Hạng</h1>
              <p className="text-blue-200">Thống kê và thành tích của người chơi</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
              
              <Filter className="w-5 h-5 text-blue-300" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Bảng Xếp Hạng
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'achievements'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Huy Hiệu
            </button>
          </div>
        </div>

        {activeTab === 'leaderboard' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top 3 Podium */}
            <div className="lg:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 text-center">Top 3 Người Chơi</h2>
              
              <div className="flex items-end justify-center space-x-8">
                {players.slice(0, 3).map((player, index) => {
                  const actualRank = index === 0 ? 1 : index === 1 ? 2 : 3;
                  const RankIcon = getRankIcon(actualRank);
                  const podiumHeight = index === 0 ? 'h-32' : index === 1 ? 'h-24' : 'h-20';
                  
                  return (
                    <motion.div
                      key={player.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold text-lg">
                            {actualRank}
                          </span>
                        </div>
                        <h3 className="text-white font-bold">Người chơi {actualRank}</h3>
                        <p className="text-blue-200 text-sm">Level {player.level}</p>
                        <p className="text-yellow-400 font-bold">{player.totalScore.toLocaleString()} điểm</p>
                      </div>
                      
                      <div className={`w-20 ${podiumHeight} bg-gradient-to-t ${
                        actualRank === 1 ? 'from-yellow-500 to-yellow-400' :
                        actualRank === 2 ? 'from-gray-400 to-gray-300' :
                        'from-orange-500 to-orange-400'
                      } rounded-t-lg flex items-center justify-center`}>
                        <RankIcon className={`w-8 h-8 ${getRankColor(actualRank)}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Full Leaderboard */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Xếp Hạng Toàn Server</h2>
              
              <div className="space-y-3">
                {players.map((player, index) => {
                  const RankIcon = getRankIcon(player.rank);
                  const isCurrentPlayer = index === 0; // Mock current player
                  
                  return (
                    <motion.div
                      key={player.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isCurrentPlayer 
                          ? 'border-blue-500 bg-blue-500/20' 
                          : 'border-white/20 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            player.rank <= 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-blue-500 to-purple-600'
                          }`}>
                            <RankIcon className={`w-6 h-6 ${getRankColor(player.rank)}`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold">
                                Người chơi {player.rank}
                              </span>
                              {isCurrentPlayer && (
                                <span className="text-blue-300 text-sm">(Bạn)</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-blue-200">
                              <span>Level {player.level}</span>
                              <span>• {player.wins}/{player.totalGames} thắng</span>
                              <span>• Trung bình: {player.averageScore}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {player.totalScore.toLocaleString()}
                          </div>
                          <div className="text-blue-300 text-sm">
                            {player.achievements.length} huy hiệu
                          </div>
                        </div>
                      </div>
                      
                      {/* Experience Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-blue-300 mb-1">
                          <span>Kinh nghiệm</span>
                          <span>{player.experience}/10000 XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(player.experience / 10000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Player Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Thống Kê Của Bạn</h2>
              
              {currentPlayer && (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-200">Tổng điểm</span>
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {currentPlayer.totalScore.toLocaleString()}
                    </div>
                  </div>
                  
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-200">Điểm trung bình</span>
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {currentPlayer.averageScore}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-200">Xếp hạng</span>
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      #{currentPlayer.rank}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Achievements Tab */
          <div className="space-y-6">
            {/* Achievement Categories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Bộ Sưu Tập Huy Hiệu</h2>
                <div className="flex items-center space-x-2 text-blue-200">
                  <Award className="w-5 h-5" />
                  <span>{currentPlayer?.achievements.length || 0}/{allAchievements.length} đã mở khóa</span>
                </div>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {achievementCategories.map((category) => {
                  const IconComponent = category.icon;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setAchievementFilter(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                        achievementFilter === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-blue-200 hover:bg-white/20'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAchievements.map((achievement, index) => {
                const IconComponent = getIconComponent(achievement.icon);
                const isUnlocked = achievement.unlockedAt > 0;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      isUnlocked 
                        ? `${getRarityColor(achievement.rarity)} hover:scale-105` 
                        : 'border-gray-600 bg-gray-600/10 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isUnlocked 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-600/20'
                      }`}>
                        <IconComponent 
                          className={`w-8 h-8 ${
                            isUnlocked ? 'text-white' : 'text-gray-400'
                          }`}
                          style={{ color: isUnlocked ? achievement.color : undefined }}
                        />
                      </div>
                      
                      <h3 className={`font-bold mb-2 ${
                        isUnlocked ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      
                      <p className={`text-sm mb-3 ${
                        isUnlocked ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded uppercase font-bold ${getRarityColor(achievement.rarity)} ${
                          isUnlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.rarity}
                        </span>
                        
                        {isUnlocked && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {!isUnlocked && (
                        <div className="mt-3 text-center">
                          <span className="text-gray-400 text-xs">Chưa mở khóa</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
