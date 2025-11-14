// Quiz History Management System

export interface QuizAnswer {
  questionId: string;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  timeSpent: number;
}

export interface QuizHistory {
  id: string;
  eventId: string;
  eventName: string;
  playedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  timeSpent: number; // total seconds
  answers: QuizAnswer[];
  canRetake: boolean;
}

export class QuizHistoryService {
  private static STORAGE_KEY = 'quiz_history';

  // Lưu kết quả quiz
  static saveQuizHistory(history: QuizHistory): void {
    try {
      const existingHistory = this.getQuizHistory();
      
      // Tìm và cập nhật hoặc thêm mới
      const existingIndex = existingHistory.findIndex(h => h.eventId === history.eventId);
      
      if (existingIndex >= 0) {
        // Cập nhật lịch sử có sẵn
        existingHistory[existingIndex] = {
          ...history,
          playedAt: new Date().toISOString()
        };
      } else {
        // Thêm lịch sử mới
        existingHistory.unshift(history);
      }

      // Giới hạn 50 lịch sử gần nhất
      const limitedHistory = existingHistory.slice(0, 50);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
      }
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  }

  // Lấy tất cả lịch sử quiz
  static getQuizHistory(): QuizHistory[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading quiz history:', error);
      return [];
    }
  }

  // Lấy lịch sử quiz của một sự kiện cụ thể
  static getQuizHistoryByEvent(eventId: string): QuizHistory | null {
    try {
      const history = this.getQuizHistory();
      return history.find(h => h.eventId === eventId) || null;
    } catch (error) {
      console.error('Error getting quiz history by event:', error);
      return null;
    }
  }

  // Kiểm tra xem đã làm quiz của event chưa
  static hasCompletedQuiz(eventId: string): boolean {
    const history = this.getQuizHistoryByEvent(eventId);
    return history !== null;
  }

  // Lấy điểm của một quiz
  static getQuizScore(eventId: string): number {
    const history = this.getQuizHistoryByEvent(eventId);
    return history?.score || 0;
  }

  // Có thể làm lại quiz không
  static canRetakeQuiz(eventId: string): boolean {
    const history = this.getQuizHistoryByEvent(eventId);
    return history?.canRetake !== false; // Mặc định cho phép làm lại
  }

  // Xóa lịch sử quiz của một event
  static deleteQuizHistory(eventId: string): void {
    try {
      const history = this.getQuizHistory();
      const filteredHistory = history.filter(h => h.eventId !== eventId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
      }
    } catch (error) {
      console.error('Error deleting quiz history:', error);
    }
  }

  // Xóa toàn bộ lịch sử
  static clearAllHistory(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error clearing quiz history:', error);
    }
  }

  // Lấy thống kê tổng quan
  static getOverallStats(): {
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
  } {
    try {
      const history = this.getQuizHistory();
      
      if (history.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrectAnswers: 0,
          totalQuestions: 0
        };
      }

      const totalQuizzes = history.length;
      const totalScore = history.reduce((sum, h) => sum + h.score, 0);
      const averageScore = totalScore / totalQuizzes;
      const bestScore = Math.max(...history.map(h => h.score));
      const totalCorrectAnswers = history.reduce((sum, h) => sum + h.correctAnswers, 0);
      const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);

      return {
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        bestScore,
        totalCorrectAnswers,
        totalQuestions
      };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0
      };
    }
  }

  // Tạo ID duy nhất cho quiz history
  static generateQuizId(eventId: string): string {
    return `quiz_${eventId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
