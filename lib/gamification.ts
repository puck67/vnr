// Gamification system - Points, Badges, Achievements

export interface UserProgress {
  points: number;
  level: number;
  badges: string[];
  viewedEvents: string[];
  completedQuizzes: string[];
  streak: number;
  lastVisit: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'events' | 'quizzes' | 'streak' | 'special';
  color: string;
}

export const BADGES: Badge[] = [
  {
    id: 'beginner',
    name: 'Người mới bắt đầu',
    description: 'Xem 5 sự kiện lịch sử',
    icon: '🌱',
    requirement: 5,
    type: 'events',
    color: 'green'
  },
  {
    id: 'explorer',
    name: 'Nhà khám phá',
    description: 'Xem 20 sự kiện lịch sử',
    icon: '🔍',
    requirement: 20,
    type: 'events',
    color: 'blue'
  },
  {
    id: 'historian',
    name: 'Nhà sử học',
    description: 'Xem 50 sự kiện lịch sử',
    icon: '📚',
    requirement: 50,
    type: 'events',
    color: 'purple'
  },
  {
    id: 'master',
    name: 'Bậc thầy lịch sử',
    description: 'Xem tất cả 110 sự kiện',
    icon: '👑',
    requirement: 110,
    type: 'events',
    color: 'yellow'
  },
  {
    id: 'quiz_starter',
    name: 'Học sinh chăm chỉ',
    description: 'Hoàn thành 5 quiz',
    icon: '📝',
    requirement: 5,
    type: 'quizzes',
    color: 'pink'
  },
  {
    id: 'quiz_master',
    name: 'Thủ khoa',
    description: 'Hoàn thành 20 quiz',
    icon: '🎓',
    requirement: 20,
    type: 'quizzes',
    color: 'red'
  },
  {
    id: 'streak_3',
    name: 'Kiên trì 3 ngày',
    description: 'Học liên tục 3 ngày',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    color: 'orange'
  },
  {
    id: 'streak_7',
    name: 'Tuần lễ vàng',
    description: 'Học liên tục 7 ngày',
    icon: '⭐',
    requirement: 7,
    type: 'streak',
    color: 'yellow'
  },
  {
    id: 'streak_30',
    name: 'Tháng huyền thoại',
    description: 'Học liên tục 30 ngày',
    icon: '💎',
    requirement: 30,
    type: 'streak',
    color: 'cyan'
  },
  {
    id: 'can_vuong',
    name: 'Chiến binh Cần Vương',
    description: 'Xem tất cả sự kiện Cần Vương',
    icon: '⚔️',
    requirement: 1,
    type: 'special',
    color: 'red'
  },
  {
    id: 'dang_1930',
    name: 'Đảng viên 1930',
    description: 'Xem sự kiện Đảng Cộng sản ra đời',
    icon: '🚩',
    requirement: 1,
    type: 'special',
    color: 'red'
  }
];

export const POINTS = {
  VIEW_EVENT: 10,
  COMPLETE_QUIZ: 50,
  PERFECT_QUIZ: 100,
  DAILY_VISIT: 20,
  SHARE_EVENT: 30,
  UNLOCK_BADGE: 100
};

export function getLevel(points: number): number {
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  if (points < 1500) return 5;
  if (points < 2500) return 6;
  if (points < 4000) return 7;
  if (points < 6000) return 8;
  if (points < 9000) return 9;
  return 10;
}

export function getNextLevelPoints(currentPoints: number): number {
  const levels = [100, 300, 600, 1000, 1500, 2500, 4000, 6000, 9000];
  return levels.find(p => p > currentPoints) || 9000;
}

export class GamificationService {
  private static STORAGE_KEY = 'vietnam_history_progress';

  static getProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return this.getDefaultProgress();
    }

    try {
      const progress = JSON.parse(stored);
      this.checkStreak(progress);
      return progress;
    } catch {
      return this.getDefaultProgress();
    }
  }

  static saveProgress(progress: UserProgress) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static getDefaultProgress(): UserProgress {
    return {
      points: 0,
      level: 1,
      badges: [],
      viewedEvents: [],
      completedQuizzes: [],
      streak: 0,
      lastVisit: new Date().toISOString().split('T')[0]
    };
  }

  static checkStreak(progress: UserProgress) {
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = progress.lastVisit;

    if (lastVisit === today) {
      return; // Already visited today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastVisit === yesterdayStr) {
      // Consecutive day
      progress.streak += 1;
      progress.points += POINTS.DAILY_VISIT;
    } else {
      // Streak broken
      progress.streak = 1;
    }

    progress.lastVisit = today;
    this.saveProgress(progress);
  }

  static addViewedEvent(eventId: string): { newBadges: Badge[], pointsEarned: number } {
    const progress = this.getProgress();
    
    if (progress.viewedEvents.includes(eventId)) {
      return { newBadges: [], pointsEarned: 0 };
    }

    progress.viewedEvents.push(eventId);
    progress.points += POINTS.VIEW_EVENT;
    progress.level = getLevel(progress.points);

    const newBadges = this.checkBadges(progress);
    this.saveProgress(progress);

    return { newBadges, pointsEarned: POINTS.VIEW_EVENT };
  }

  static addCompletedQuiz(quizId: string, score: number, total: number): { newBadges: Badge[], pointsEarned: number } {
    const progress = this.getProgress();
    
    if (progress.completedQuizzes.includes(quizId)) {
      return { newBadges: [], pointsEarned: 0 };
    }

    progress.completedQuizzes.push(quizId);
    const isPerfect = score === total;
    const points = isPerfect ? POINTS.PERFECT_QUIZ : POINTS.COMPLETE_QUIZ;
    
    progress.points += points;
    progress.level = getLevel(progress.points);

    const newBadges = this.checkBadges(progress);
    this.saveProgress(progress);

    return { newBadges, pointsEarned: points };
  }

  static addSharedEvent(): number {
    const progress = this.getProgress();
    progress.points += POINTS.SHARE_EVENT;
    progress.level = getLevel(progress.points);
    this.saveProgress(progress);
    return POINTS.SHARE_EVENT;
  }

  static checkBadges(progress: UserProgress): Badge[] {
    const newBadges: Badge[] = [];

    for (const badge of BADGES) {
      if (progress.badges.includes(badge.id)) continue;

      let shouldUnlock = false;

      switch (badge.type) {
        case 'events':
          shouldUnlock = progress.viewedEvents.length >= badge.requirement;
          break;
        case 'quizzes':
          shouldUnlock = progress.completedQuizzes.length >= badge.requirement;
          break;
        case 'streak':
          shouldUnlock = progress.streak >= badge.requirement;
          break;
        case 'special':
          if (badge.id === 'dang_1930') {
            shouldUnlock = progress.viewedEvents.includes('event-110');
          }
          break;
      }

      if (shouldUnlock) {
        progress.badges.push(badge.id);
        progress.points += POINTS.UNLOCK_BADGE;
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  static getUnlockedBadges(): Badge[] {
    const progress = this.getProgress();
    return BADGES.filter(b => progress.badges.includes(b.id));
  }

  static getLockedBadges(): Badge[] {
    const progress = this.getProgress();
    return BADGES.filter(b => !progress.badges.includes(b.id));
  }
}
