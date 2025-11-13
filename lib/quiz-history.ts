// Quiz History Management System

import { QuizHistory, QuizAnswer, QuizResult } from '@/types';

export class QuizHistoryService {
  private static STORAGE_KEY = 'vietnam_history_quiz_history';

  // Lấy tất cả lịch sử quiz
  static getQuizHistory(): QuizHistory[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    try {
      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        completedAt: new Date(item.completedAt)
      }));
    } catch {
      return [];
    }
  }

  // Lấy lịch sử quiz theo event ID
  static getQuizHistoryByEvent(eventId: string): QuizHistory[] {
    return this.getQuizHistory().filter(quiz => quiz.eventId === eventId);
  }

  // Lưu kết quả quiz mới
  static saveQuizResult(
    eventId: string,
    eventName: string,
    answers: QuizAnswer[],
    result: QuizResult,
    timeTaken: number
  ): string {
    const history = this.getQuizHistory();
    
    const newQuiz: QuizHistory = {
      id: `quiz_${eventId}_${Date.now()}`,
      eventId,
      eventName,
      completedAt: new Date().toISOString(),
      answers,
      result,
      timeTaken
    };

    history.unshift(newQuiz); // Thêm vào đầu danh sách
    
    // Giới hạn tối đa 100 lịch sử
    if (history.length > 100) {
      history.splice(100);
    }

    this.saveToStorage(history);
    return newQuiz.id;
  }

  // Lấy chi tiết một lần làm quiz
  static getQuizById(quizId: string): QuizHistory | null {
    const history = this.getQuizHistory();
    return history.find(quiz => quiz.id === quizId) || null;
  }

  // Xóa một lịch sử quiz
  static deleteQuiz(quizId: string): boolean {
    const history = this.getQuizHistory();
    const index = history.findIndex(quiz => quiz.id === quizId);
    
    if (index === -1) return false;
    
    history.splice(index, 1);
    this.saveToStorage(history);
    return true;
  }

  // Xóa tất cả lịch sử quiz
  static clearAllHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Lấy thống kê tổng quan
  static getStats() {
    const history = this.getQuizHistory();
    
    if (history.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimePlayed: 0,
        uniqueEvents: 0
      };
    }

    const scores = history.map(quiz => quiz.result.score);
    const uniqueEvents = new Set(history.map(quiz => quiz.eventId)).size;
    const totalTime = history.reduce((sum, quiz) => sum + quiz.timeTaken, 0);

    return {
      totalQuizzes: history.length,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      bestScore: Math.max(...scores),
      totalTimePlayed: totalTime,
      uniqueEvents
    };
  }

  // Lưu vào localStorage
  private static saveToStorage(history: QuizHistory[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }
  }

  // Tìm kiếm lịch sử theo từ khóa
  static searchHistory(query: string): QuizHistory[] {
    const history = this.getQuizHistory();
    const lowerQuery = query.toLowerCase();

    return history.filter(quiz => 
      quiz.eventName.toLowerCase().includes(lowerQuery) ||
      quiz.answers.some(answer => 
        answer.questionText.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Lấy lịch sử theo khoảng thời gian
  static getHistoryByDateRange(startDate: Date, endDate: Date): QuizHistory[] {
    const history = this.getQuizHistory();
    
    return history.filter(quiz => {
      const quizDate = new Date(quiz.completedAt);
      return quizDate >= startDate && quizDate <= endDate;
    });
  }
}
