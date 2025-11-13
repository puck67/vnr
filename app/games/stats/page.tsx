'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp, Award, Star, Crown } from 'lucide-react';
import { Badge } from '@/types';

interface PlayerStats {
  playerId: string;
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  badges: Badge[];
  lastPlayed: string;
}

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  wins: number;
  winRate: number;
  averageScore: number;
}

const gameTypes = [
  { id: 'timeline-puzzle', name: 'Timeline Puzzle', color: 'from-blue-500 to-blue-700' },
  { id: 'character-matching', name: 'Character Matching', color: 'from-purple-500 to-purple-700' },
  { id: 'historical-trivia', name: 'Historical Trivia', color: 'from-green-500 to-green-700' },
  { id: 'map-conquest', name: 'Map Conquest', color: 'from-red-500 to-red-700' }
];

export default function PersonalStatsPage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [gameStats, setGameStats] = useState<{ [key: string]: GameStats }>({});
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerId] = useState('current-player'); // In real app, get from auth

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games/leaderboard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setGameStats(data.gameStats);
        setAvailableBadges(data.availableBadges);
      }
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '👑';
      case 'epic': return '💯';
      case 'rare': return '⚡';
      default: return '🏆';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải thống kê...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <div className="text-white text-xl mb-2">Chưa có thống kê</div>
          <div className="text-white/60 mb-6">Hãy chơi game đầu tiên để xem thống kê!</div>
          <Link
            href="/games"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Bắt đầu chơi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/games/leaderboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Leaderboard</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Thống kê cá nhân
              </h1>
              <p className="text-white/70 text-lg">
                {stats.playerName} - {stats.gamesPlayed} games đã chơi
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80 text-sm">Tổng điểm</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalScore.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80 text-sm">Số games</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.gamesPlayed}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-green-400" />
                  <span className="text-white/80 text-sm">Thắng</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.wins}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-white/80 text-sm">Tỷ lệ thắng</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Game Type Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Thống kê theo loại game</h2>
              
              <div className="space-y-4">
                {gameTypes.map(game => {
                  const gameTypeStats = gameStats[game.id];
                  
                  if (!gameTypeStats || gameTypeStats.gamesPlayed === 0) {
                    return (
                      <div key={game.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{game.name}</h3>
                            <p className="text-white/60 text-sm">Chưa chơi</p>
                          </div>
                          <Link
                            href="/games"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                          >
                            Chơi ngay
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={game.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">{game.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {gameTypeStats.totalScore.toLocaleString()}
                          </div>
                          <div className="text-xs text-white/60">điểm</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Games</div>
                          <div className="text-white font-semibold">{gameTypeStats.gamesPlayed}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Thắng</div>
                          <div className="text-white font-semibold">{gameTypeStats.wins}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Tỷ lệ thắng</div>
                          <div className="text-white font-semibold">{Math.round(gameTypeStats.winRate * 100)}%</div>
                        </div>
                        <div>
                          <div className="text-white/60">Điểm TB</div>
                          <div className="text-white font-semibold">{Math.round(gameTypeStats.averageScore)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-6">
            {/* Badges Collection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Huy hiệu ({stats.badges.length})
              </h2>
              
              {stats.badges.length > 0 ? (
                <div className="space-y-3">
                  {stats.badges.map((badge, index) => (
                    <div
                      key={badge.id}
                      className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} p-4 rounded-xl`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getBadgeIcon(badge.rarity)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{badge.name}</h3>
                          <p className="text-white/80 text-sm">{badge.description}</p>
                          <p className="text-white/60 text-xs">
                            {new Date(badge.unlockedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="w-12 h-12 text-white/20 mx-auto mb-2" />
                  <div className="text-white/60 text-sm">Chưa có huy hiệu nào</div>
                </div>
              )}
            </div>

            {/* Available Badges */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Huy hiệu có thể đạt được</h3>
              
              <div className="space-y-2">
                {availableBadges.filter(badge => !badge.unlocked).map((badge, index) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-lg opacity-50">
                      {getBadgeIcon(badge.rarity)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white/80 text-sm">{badge.name}</h4>
                      <p className="text-white/50 text-xs">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                href="/games"
                className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold transition text-center"
              >
                Chơi game mới
              </Link>
              
              <Link
                href="/games/leaderboard"
                className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition text-center border border-white/20"
              >
                Xem bảng xếp hạng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
