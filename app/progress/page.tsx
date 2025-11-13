'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Award, Target } from 'lucide-react';
import Link from 'next/link';
import { GamificationService } from '@/lib/gamification';
import ProgressBar from '@/components/Gamification/ProgressBar';
import BadgesGrid from '@/components/Gamification/BadgesGrid';

export default function ProgressPage() {
  const [progress, setProgress] = useState(() => GamificationService.getProgress());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateProgress = () => {
      setProgress(GamificationService.getProgress());
    };

    window.addEventListener('gamification-update', updateProgress);
    return () => window.removeEventListener('gamification-update', updateProgress);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }
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
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Tiến trình học tập của bạn
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Theo dõi thành tích và huy hiệu bạn đã đạt được
              </p>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Cấp độ hiện tại</p>
                  <p className="text-xl font-bold text-blue-900">Cấp {progress.level}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Huy hiệu</p>
                  <p className="text-xl font-bold text-green-900">{progress.badges.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Tổng điểm</p>
                  <p className="text-xl font-bold text-purple-900">{progress.points.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Badges Grid */}
        <BadgesGrid />
      </div>
    </div>
  );
}
