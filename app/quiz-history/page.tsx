'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, Trophy, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import QuizHistory from '@/components/Quiz/QuizHistory';
import { QuizHistoryService } from '@/lib/quiz-history';

export default function QuizHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimePlayed: 0,
    uniqueEvents: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const quizStats = QuizHistoryService.getStats();
    setStats(quizStats);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/map"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6 group"
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-50 transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Quay về bản đồ</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Lịch sử làm quiz
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Xem lại tất cả các bài quiz bạn đã làm và kết quả đạt được
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Tổng quiz</p>
                  <p className="text-xl font-bold text-blue-900">{stats.totalQuizzes}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Điểm TB</p>
                  <p className="text-xl font-bold text-green-900">{stats.averageScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Điểm cao nhất</p>
                  <p className="text-xl font-bold text-yellow-900">{stats.bestScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Thời gian</p>
                  <p className="text-xl font-bold text-purple-900">{formatTime(stats.totalTimePlayed)}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Sự kiện</p>
                  <p className="text-xl font-bold text-indigo-900">{stats.uniqueEvents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sự kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[200px]"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chưa có lịch sử quiz
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa làm quiz nào. Hãy bắt đầu khám phá các sự kiện lịch sử và làm quiz để xây dựng kiến thức!
              </p>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
              >
                <Trophy className="w-5 h-5" />
                Khám phá sự kiện
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <QuizHistory />
          </div>
        )}
      </div>
    </div>
  );
}
