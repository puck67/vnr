'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { GamificationService, Badge } from '@/lib/gamification';

export default function BadgesGrid() {
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [lockedBadges, setLockedBadges] = useState<Badge[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    updateBadges();

    const handleUpdate = () => updateBadges();
    window.addEventListener('gamification-update', handleUpdate);
    return () => window.removeEventListener('gamification-update', handleUpdate);
  }, []);

  const updateBadges = () => {
    setUnlockedBadges(GamificationService.getUnlockedBadges());
    setLockedBadges(GamificationService.getLockedBadges());
  };

  if (!isClient) return null;

  const getColorClasses = (color: string, unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-50 border-gray-200 text-gray-400';
    
    const colors: Record<string, string> = {
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    };
    
    return colors[color] || colors.blue;
  };

  const renderBadge = (badge: Badge, unlocked: boolean) => (
    <div
      key={badge.id}
      className={`group relative rounded-2xl border-2 p-6 transition-all duration-300 ${
        getColorClasses(badge.color, unlocked)
      } ${unlocked ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : 'opacity-60'}`}
    >
      {/* Lock overlay for locked badges */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
          <div className="text-center">
            <Lock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-medium">Chưa mở khóa</p>
          </div>
        </div>
      )}

      {/* Badge content */}
      <div className="text-center">
        <div className={`text-6xl mb-4 transition-transform ${unlocked ? 'group-hover:scale-110' : 'grayscale'}`}>
          {badge.icon}
        </div>
        <h4 className="font-bold text-lg mb-2">{badge.name}</h4>
        <p className="text-sm opacity-90 leading-relaxed">{badge.description}</p>
        
        {unlocked && (
          <div className="mt-4 pt-4 border-t border-current/20">
            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/70 border border-current/20 rounded-full text-xs font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Đã mở khóa
            </div>
          </div>
        )}
      </div>

      {/* Achievement indicator for unlocked */}
      {unlocked && (
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">✓</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          <span>Huy hiệu của bạn</span>
        </h2>
        <p className="text-gray-600">
          Mở khóa {unlockedBadges.length}/{unlockedBadges.length + lockedBadges.length} huy hiệu
        </p>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>Đã mở khóa ({unlockedBadges.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unlockedBadges.map(badge => renderBadge(badge, true))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-600">
            <Lock className="w-6 h-6" />
            <span>Chưa mở khóa ({lockedBadges.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lockedBadges.map(badge => renderBadge(badge, false))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {unlockedBadges.length === 0 && lockedBadges.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg">Bắt đầu khám phá lịch sử để mở khóa huy hiệu!</p>
        </div>
      )}
    </div>
  );
}
