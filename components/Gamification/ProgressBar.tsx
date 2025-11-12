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
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Trophy className="w-7 h-7 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Cấp độ {progress.level}</h3>
            <p className="text-sm text-purple-100">{progress.points.toLocaleString()} điểm</p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Streak */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="font-bold">{progress.streak} ngày</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">{progress.badges.length} huy hiệu</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-purple-100">Đến cấp {progress.level + 1}</span>
          <span className="font-semibold">{nextLevel.toLocaleString()} điểm</span>
        </div>
        
        <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          >
            {progressPercent > 10 && (
              <Star className="w-3 h-3 text-yellow-900 animate-pulse" />
            )}
          </div>
        </div>

        <p className="text-xs text-purple-100 text-right">
          Còn {(nextLevel - progress.points).toLocaleString()} điểm nữa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-300">{progress.viewedEvents.length}</div>
          <div className="text-xs text-purple-100 mt-1">Sự kiện</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{progress.completedQuizzes.length}</div>
          <div className="text-xs text-purple-100 mt-1">Quiz</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-300">{progress.streak}</div>
          <div className="text-xs text-purple-100 mt-1">Ngày liên tiếp</div>
        </div>
      </div>
    </div>
  );
}
