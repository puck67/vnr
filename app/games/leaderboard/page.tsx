'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Crown, Medal, Star, Clock, Target, TrendingUp } from 'lucide-react';
import { Leaderboard, LeaderboardEntry, GameType } from '@/types';

const gameTypes = [
  { id: 'timeline-puzzle', name: 'Timeline Puzzle', color: 'from-blue-500 to-blue-700' },
  { id: 'character-matching', name: 'Character Matching', color: 'from-purple-500 to-purple-700' },
  { id: 'historical-trivia', name: 'Historical Trivia', color: 'from-green-500 to-green-700' },
  { id: 'map-conquest', name: 'Map Conquest', color: 'from-red-500 to-red-700' }
];

const periods = [
  { id: 'daily', name: 'Hôm nay' },
  { id: 'weekly', name: 'Tuần này' },
  { id: 'monthly', name: 'Tháng này' },
  { id: 'all-time', name: 'Mọi thời đại' }
];

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>('timeline-puzzle');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedGame, selectedPeriod]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/games/leaderboard?gameType=${selectedGame}&period=${selectedPeriod}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Lỗi tải leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white/60 font-bold">{rank}</span>;
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

  const selectedGameInfo = gameTypes.find(g => g.id === selectedGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/games"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Games</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Bảng xếp hạng
              </h1>
              <p className="text-white/70 text-lg">
                Xem thành tích của các cao thủ lịch sử
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Game Type Filter */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Loại game</h3>
              <div className="space-y-2">
                {gameTypes.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id as GameType)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedGame === game.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {game.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Filter */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Thời gian</h3>
              <div className="space-y-2">
                {periods.map(period => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedPeriod === period.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            {leaderboard && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Thống kê</h3>
                <div className="space-y-3 text-white/70">
                  <div className="flex justify-between">
                    <span>Tổng người chơi:</span>
                    <span className="text-white font-semibold">{leaderboard.entries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Điểm cao nhất:</span>
                    <span className="text-yellow-400 font-semibold">
                      {leaderboard.entries[0]?.totalScore || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cập nhật:</span>
                    <span className="text-white/60 text-sm">
                      {new Date(leaderboard.lastUpdated).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              {/* Header */}
              <div className={`p-6 bg-gradient-to-r ${selectedGameInfo?.color} rounded-t-2xl`}>
                <h2 className="text-2xl font-bold text-white">
                  {selectedGameInfo?.name} - {periods.find(p => p.id === selectedPeriod)?.name}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-white/60">Đang tải...</div>
                  </div>
                ) : !leaderboard || leaderboard.entries.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <div className="text-white/60 mb-2">Chưa có dữ liệu</div>
                    <div className="text-white/40 text-sm">Hãy chơi game để xuất hiện trên bảng xếp hạng!</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.entries.map((entry, index) => (
                      <div
                        key={entry.playerId}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 ${
                          entry.rank <= 3 ? 'bg-white/10 border border-white/20' : 'bg-white/5'
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                          entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          entry.rank === 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                          'bg-white/20'
                        }`}>
                          {entry.playerName.charAt(0).toUpperCase()}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white truncate">
                              {entry.playerName}
                            </span>
                            {entry.rank <= 3 && (
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                entry.rank === 2 ? 'bg-gray-400 text-gray-900' :
                                'bg-amber-400 text-amber-900'
                              }`}>
                                TOP {entry.rank}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>{entry.gamesPlayed} games</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{Math.round(entry.winRate * 100)}% thắng</span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        {entry.badges.length > 0 && (
                          <div className="flex gap-1">
                            {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                              <div
                                key={badge.id}
                                title={badge.name}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm"
                              >
                                {getBadgeIcon(badge.rarity)}
                              </div>
                            ))}
                            {entry.badges.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
                                +{entry.badges.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {entry.totalScore.toLocaleString()}
                          </div>
                          <div className="text-xs text-white/60">điểm</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/games"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6" />
                </div>
                <div className="font-bold text-lg mb-1">Chơi ngay</div>
                <div className="text-sm text-white/80">Tham gia game để lên top!</div>
              </Link>

              <Link
                href="/games/stats"
                className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-center border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="font-bold text-lg mb-1">Thống kê cá nhân</div>
                <div className="text-sm text-white/80">Xem chi tiết thành tích</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
