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
    if (!unlocked) return 'bg-gray-100 border-gray-300 text-gray-400';
    
    const colors: Record<string, string> = {
      green: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 text-green-700',
      blue: 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300 text-blue-700',
      purple: 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-300 text-purple-700',
      yellow: 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-400 text-yellow-800',
      pink: 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-300 text-pink-700',
      red: 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300 text-red-700',
      orange: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300 text-orange-700',
      cyan: 'bg-gradient-to-br from-cyan-50 to-sky-100 border-cyan-300 text-cyan-700',
    };
    
    return colors[color] || colors.blue;
  };

  const renderBadge = (badge: Badge, unlocked: boolean) => (
    <div
      key={badge.id}
      className={`group relative rounded-xl border-2 p-6 transition-all duration-300 ${
        getColorClasses(badge.color, unlocked)
      } ${unlocked ? 'hover:scale-105 hover:shadow-xl cursor-pointer' : 'opacity-60'}`}
    >
      {/* Lock overlay for locked badges */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 rounded-xl backdrop-blur-sm">
          <Lock className="w-8 h-8 text-gray-500" />
        </div>
      )}

      {/* Badge content */}
      <div className="text-center">
        <div className={`text-5xl mb-3 transition-transform ${unlocked ? 'group-hover:scale-110' : 'grayscale'}`}>
          {badge.icon}
        </div>
        <h4 className="font-bold text-lg mb-2">{badge.name}</h4>
        <p className="text-sm opacity-80">{badge.description}</p>
        
        {unlocked && (
          <div className="mt-4 pt-4 border-t border-current/20">
            <div className="inline-block px-3 py-1 bg-white/50 rounded-full text-xs font-semibold">
              ✓ Đã mở khóa
            </div>
          </div>
        )}
      </div>

      {/* Sparkle effect for unlocked */}
      {unlocked && (
        <div className="absolute -top-1 -right-1">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-xs">✨</span>
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
