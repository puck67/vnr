'use client';

import { useEffect, useState } from 'react';
import { X, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/lib/gamification';

interface Notification {
  type: 'badge' | 'points' | 'level';
  badge?: Badge;
  points?: number;
  level?: number;
  id: string;
}

export default function AchievementNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleBadgeUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<{ badge: Badge }>;
      const notification: Notification = {
        type: 'badge',
        badge: customEvent.detail.badge,
        id: `badge-${Date.now()}`
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto remove after 5s
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    const handlePointsEarned = (e: Event) => {
      const customEvent = e as CustomEvent<{ points: number }>;
      const notification: Notification = {
        type: 'points',
        points: customEvent.detail.points,
        id: `points-${Date.now()}`
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    const handleLevelUp = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: number }>;
      const notification: Notification = {
        type: 'level',
        level: customEvent.detail.level,
        id: `level-${Date.now()}`
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    window.addEventListener('badge-unlocked', handleBadgeUnlock);
    window.addEventListener('points-earned', handlePointsEarned);
    window.addEventListener('level-up', handleLevelUp);

    return () => {
      window.removeEventListener('badge-unlocked', handleBadgeUnlock);
      window.removeEventListener('points-earned', handlePointsEarned);
      window.removeEventListener('level-up', handleLevelUp);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="pointer-events-auto bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-6 min-w-[320px] max-w-md animate-slide-in-right"
        >
          {notification.type === 'badge' && notification.badge && (
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0 animate-bounce">
                {notification.badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-bold text-lg text-purple-900">Huy hiệu mới!</h4>
                </div>
                <p className="font-bold text-purple-700 mb-1">{notification.badge.name}</p>
                <p className="text-sm text-gray-600">{notification.badge.description}</p>
                <div className="mt-3 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  +100 điểm
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {notification.type === 'points' && notification.points && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">+{notification.points} điểm!</p>
                <p className="text-sm text-gray-600">Làm tốt lắm!</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {notification.type === 'level' && notification.level && (
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">🎉</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-purple-900 mb-1">Lên cấp!</h4>
                <p className="text-gray-700">Bạn đã đạt <span className="font-bold text-purple-700">Cấp {notification.level}</span></p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
