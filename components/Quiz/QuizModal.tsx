'use client';

import { useState, useEffect } from 'react';
import { X, Check, XCircle, Trophy } from 'lucide-react';
import { QuizQuestion, QuizResult } from '@/types';
import quizData from '@/data/quiz-questions.json';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
}

export default function QuizModal({ isOpen, onClose, eventId }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Lấy câu hỏi liên quan đến event hoặc random
      let filteredQuestions = quizData as QuizQuestion[];
      
      if (eventId) {
        filteredQuestions = filteredQuestions.filter(
          q => q.relatedEventId === eventId
        );
      }

      // Lấy 10 câu hỏi ngẫu nhiên
      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 10));
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswers([]);
      setIsFinished(false);
    }
  }, [isOpen, eventId]);

  if (!isOpen || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setAnswers([...answers, isCorrect]);
    setShowExplanation(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setIsFinished(false);
  };

  const result: QuizResult = {
    totalQuestions: questions.length,
    correctAnswers: answers.filter(a => a).length,
    score: Math.round((answers.filter(a => a).length / questions.length) * 100),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Kiểm tra kiến thức</h2>
            {!isFinished && (
              <p className="text-blue-100 text-sm mt-1">
                Câu {currentQuestionIndex + 1} / {questions.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="hover:bg-blue-700 p-2 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isFinished ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === currentQuestion.correctAnswer;
                    
                    let bgColor = 'bg-gray-50 hover:bg-gray-100';
                    if (showExplanation) {
                      if (isCorrectOption) {
                        bgColor = 'bg-green-100 border-green-500';
                      } else if (isSelected && !isCorrect) {
                        bgColor = 'bg-red-100 border-red-500';
                      }
                    } else if (isSelected) {
                      bgColor = 'bg-blue-100 border-blue-500';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${bgColor} ${
                          showExplanation ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-600">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="flex-1">{option}</span>
                          {showExplanation && isCorrectOption && (
                            <Check className="text-green-600" size={20} />
                          )}
                          {showExplanation && isSelected && !isCorrect && (
                            <XCircle className="text-red-600" size={20} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}
                  </p>
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {!showExplanation ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center py-8">
              <div className="mb-6">
                <Trophy className="mx-auto text-yellow-500" size={64} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">Hoàn thành!</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-6xl font-bold text-blue-600 mb-2">
                  {result.score}%
                </p>
                <p className="text-gray-600">
                  Bạn trả lời đúng {result.correctAnswers}/{result.totalQuestions} câu
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Làm lại
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

