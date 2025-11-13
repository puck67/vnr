'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, Flame, Award } from 'lucide-react';
import { GamificationService, getLevel, getNextLevelPoints } from '@/lib/gamification';

export default function ProgressBar() {
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

  if (!isClient) return null;

  const nextLevel = getNextLevelPoints(progress.points);
  const currentLevelStart = getNextLevelPoints(progress.points - 1000) || 0;
  const progressPercent = ((progress.points - currentLevelStart) / (nextLevel - currentLevelStart)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900">Cấp độ {progress.level}</h3>
            <p className="text-lg text-blue-600 font-semibold">{progress.points.toLocaleString()} điểm</p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-3 rounded-xl">
            <Flame className="w-5 h-5 text-orange-600" />
            <div className="text-center">
              <div className="font-bold text-orange-900">{progress.streak}</div>
              <div className="text-xs text-orange-600">ngày</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-xl">
            <Award className="w-5 h-5 text-yellow-600" />
            <div className="text-center">
              <div className="font-bold text-yellow-900">{progress.badges.length}</div>
              <div className="text-xs text-yellow-600">huy hiệu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Tiến độ đến cấp {progress.level + 1}</span>
          <span className="font-bold text-gray-900">{nextLevel.toLocaleString()} điểm</span>
        </div>
        
        <div className="h-6 bg-gray-100 rounded-full overflow-hidden border">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          >
            {progressPercent > 15 && (
              <Star className="w-4 h-4 text-white animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {Math.round(progressPercent)}% hoàn thành
          </span>
          <span className="text-gray-500">
            Còn {(nextLevel - progress.points).toLocaleString()} điểm
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-3xl font-bold text-blue-600 mb-1">{progress.viewedEvents.length}</div>
          <div className="text-sm text-blue-600 font-medium">Sự kiện đã xem</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="text-3xl font-bold text-green-600 mb-1">{progress.completedQuizzes.length}</div>
          <div className="text-sm text-green-600 font-medium">Quiz hoàn thành</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="text-3xl font-bold text-orange-600 mb-1">{progress.streak}</div>
          <div className="text-sm text-orange-600 font-medium">Ngày liên tiếp</div>
        </div>
      </div>
    </div>
  );
}
