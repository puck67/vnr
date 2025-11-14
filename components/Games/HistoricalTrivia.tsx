'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, Trophy, Zap, 
  Users, Target, Flame, Brain
} from 'lucide-react';
import { GamePlayer, GameState, TriviaQuestion } from '@/types/games';
import { GameService } from '@/lib/game-service';

interface HistoricalTriviaProps {
  gameState: GameState;
  currentPlayer: GamePlayer;
  allPlayers?: GamePlayer[];
  onSubmitAnswer: (answer: number) => void;
  onUseHint: () => void;
  canUseHint: boolean;
  onGameFinish?: (finalScore: number) => void;
  onShowResults?: (room: any) => void;
}

// Mock questions từ dữ liệu có sẵn
const mockQuestions: TriviaQuestion[] = [
  {
    id: 'quiz-001',
    question: 'Pháp bắt đầu xâm lược Việt Nam vào năm nào?',
    options: ['1856', '1858', '1860', '1862'],
    correctAnswer: 1,
    explanation: 'Ngày 1/9/1858, quân Pháp tấn công Đà Nẵng, mở đầu cuộc xâm lược Việt Nam.',
    relatedEventId: 'event-001',
    category: 'Kháng chiến chống Pháp',
    difficulty: 'easy',
    timeLimit: 30,
    points: 100
  },
  {
    id: 'quiz-002',
    question: 'Ai là người đốt tàu chiến Pháp L\'Espérance?',
    options: ['Hoàng Hoa Thám', 'Nguyễn Trung Trực', 'Phan Đình Phùng', 'Trương Định'],
    correctAnswer: 1,
    explanation: 'Nguyễn Trung Trực đốt tàu L\'Espérance năm 1861, gây tổn thất lớn cho Pháp.',
    relatedEventId: 'event-003',
    category: 'Anh hùng dân tộc',
    difficulty: 'medium',
    timeLimit: 30,
    points: 150
  },
  {
    id: 'quiz-003',
    question: 'Phong trào Cần Vương được phát động bởi ai?',
    options: ['Vua Tự Đức', 'Vua Hàm Nghi', 'Vua Duy Tân', 'Vua Thành Thái'],
    correctAnswer: 1,
    explanation: 'Vua Hàm Nghi ra chiếu Cần Vương năm 1885, kêu gọi toàn dân chống Pháp.',
    relatedEventId: 'event-008',
    category: 'Phong trào yêu nước',
    difficulty: 'medium',
    timeLimit: 30,
    points: 150
  },
  {
    id: 'quiz-004',
    question: 'Đảng Cộng sản Việt Nam được thành lập ở đâu?',
    options: ['Hà Nội', 'Sài Gòn', 'Hương Cảng', 'Quảng Châu'],
    correctAnswer: 2,
    explanation: 'Đảng Cộng sản Việt Nam được thành lập tại Hương Cảng (Hong Kong) ngày 3/2/1930.',
    relatedEventId: 'event-014',
    category: 'Cách mạng hiện đại',
    difficulty: 'hard',
    timeLimit: 30,
    points: 200
  }
];

export default function HistoricalTrivia({ 
  gameState, 
  currentPlayer, 
  allPlayers = [],
  onSubmitAnswer, 
  onUseHint,
  canUseHint,
  onGameFinish,
  onShowResults
}: HistoricalTriviaProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [hasFinished, setHasFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Stabilize settings to prevent re-renders
  const gameSettings = useMemo(() => (gameState as any)?.settings, [(gameState as any)?.settings?.difficulty, (gameState as any)?.settings?.totalRounds]);
  const roomId = useMemo(() => (gameState as any)?.id, [(gameState as any)?.id]);

  // Filter questions by difficulty và totalRounds từ settings  
  const getFilteredQuestions = () => {
    // Lấy settings từ gameState hoặc default values
    const roomSettings = gameSettings;
    const difficulty = roomSettings?.difficulty || 'easy';
    const totalRounds = roomSettings?.totalRounds || 5;
    
    console.log('🎯 HistoricalTrivia: Using room settings:', { difficulty, totalRounds, roomSettings });
    
    // Filter questions theo difficulty
    const filteredByDifficulty = mockQuestions.filter(q => q.difficulty === difficulty);
    
    // Nếu không đủ câu hỏi theo difficulty, lấy random từ tất cả
    const availableQuestions = filteredByDifficulty.length >= totalRounds 
      ? filteredByDifficulty 
      : mockQuestions;
    
    // Use room ID as seed for consistent shuffling across all players
    const seedRoomId = roomId || 'default';
    const seed = seedRoomId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    
    // Seeded shuffle để tất cả players có cùng thứ tự câu hỏi
    const shuffled = [...availableQuestions].sort((a, b) => {
      const hashA = (a.id + seed).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const hashB = (b.id + seed).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      return hashA - hashB;
    });
    
    return shuffled.slice(0, totalRounds);
  };

  // Calculate questions once
  const filteredQuestions = useMemo(() => {
    if (!gameSettings) return [];
    return getFilteredQuestions();
  }, [gameSettings, roomId]);

  // Auto-finish chỉ khi game thực sự kết thúc (tất cả câu hỏi đã hoàn thành)
  useEffect(() => {
    if (filteredQuestions.length === 0) return; // Wait for questions to be loaded
    
    console.log('🔍 HistoricalTrivia: Auto-finish check triggered by dependency change');
    console.log('🔍 HistoricalTrivia: Auto-finish check:', {
      hasFinished,
      showResults, 
      allPlayersCount: allPlayers?.length,
      currentPlayerId: currentPlayer?.id,
      currentRound: gameState.currentRound,
      totalQuestions: filteredQuestions.length,
      allPlayersData: allPlayers?.map(p => ({ 
        id: p.id, 
        name: p.name, 
        isFinished: p.isFinished,
        finishedAt: p.finishedAt,
        score: p.score
      }))
    });
    
    // CHỈ auto-finish khi:
    // 1. Đã hoàn thành tất cả câu hỏi (currentRound > totalQuestions) 
    // 2. HOẶC có player khác đã finished và game đã kết thúc
    if (!hasFinished && allPlayers && currentPlayer) {
      const gameCompleted = gameState.currentRound > filteredQuestions.length;
      const otherPlayersFinished = allPlayers.some(p => p.id !== currentPlayer.id && p.isFinished);
      
      console.log('🔍 HistoricalTrivia: Auto-finish conditions:', {
        gameCompleted,
        otherPlayersFinished,
        shouldAutoFinish: gameCompleted && otherPlayersFinished
      });
      
      // Chỉ auto-finish khi game thực sự đã hoàn thành
      if (gameCompleted && otherPlayersFinished && onGameFinish) {
        console.log('🔄 HistoricalTrivia: Game completed and other player finished, auto-finishing');
        const finalScore = score; // Sử dụng accumulated score
        setHasFinished(true);
        onGameFinish(finalScore);
      }
    }
  }, [allPlayers, hasFinished, gameState.currentRound, filteredQuestions.length, currentPlayer, score, onGameFinish]);

  // Track previous round để chỉ reset khi round thực sự thay đổi
  const [previousRound, setPreviousRound] = useState(gameState.currentRound);

  // Load câu hỏi và reset states khi round change
  useEffect(() => {
    if (filteredQuestions.length === 0) {
      console.log('🔄 HistoricalTrivia: Waiting for questions to be filtered');
      return;
    }

    console.log('🎯 HistoricalTrivia: Loading question for round:', {
      currentRound: gameState.currentRound,
      previousRound,
      totalQuestions: filteredQuestions.length,
      gameStateTotalRounds: (gameState as any)?.settings?.totalRounds,
      settingsFromGameState: (gameState as any)?.settings
    });

    const question = filteredQuestions[gameState.currentRound - 1];
    if (question) {
      // Sử dụng timeLimit từ settings hoặc default từ câu hỏi
      const roomSettings = (gameState as any)?.settings;
      const timeLimit = roomSettings?.timeLimit || question.timeLimit;
      setTimeRemaining(timeLimit);
      
      // CHỈ reset states khi round thực sự thay đổi
      if (gameState.currentRound !== previousRound) {
        console.log('🔄 HistoricalTrivia: Round changed, resetting states');
        setIsAnswered(false);
        setSelectedAnswer(null);
        setShowResults(false);
        setEliminatedOptions([]);
        setHintsUsed(0);
        setPreviousRound(gameState.currentRound);
      }
      
      console.log('🎯 HistoricalTrivia: Loaded question:', {
        round: gameState.currentRound,
        questionId: question.id,
        difficulty: question.difficulty,
        timeLimit: timeLimit
      });
    } else if (gameState.currentRound > filteredQuestions.length && !hasFinished) {
      // Hết tất cả câu hỏi, auto-finish game
      console.log('🏁 HistoricalTrivia: All questions completed, auto-finishing');
      setHasFinished(true);
      onGameFinish?.(score);
    }
  }, [gameState.currentRound, filteredQuestions, previousRound]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeRemaining > 0 && !isAnswered && currentQuestion) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeRemaining, isAnswered, currentQuestion]);

  // Hết giờ
  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResults(true);
    setStreak(0);
    onSubmitAnswer(-1); // -1 = không trả lời
    
    // Submit timeout answer to server
    if (roomId && currentPlayer?.id) {
      console.log('⏱️ HistoricalTrivia: Submitting timeout answer to server:', { roomId, playerId: currentPlayer.id });
      GameService.submitAnswer(roomId, currentPlayer.id, -1);
    } else {
      console.log('❌ HistoricalTrivia: Cannot submit timeout answer - missing roomId or playerId:', { roomId, playerId: currentPlayer?.id });
    }
    
    // CHỈ finish nếu đây là câu cuối cùng
    if (gameState.currentRound >= filteredQuestions.length) {
      setTimeout(() => {
        if (onGameFinish && !hasFinished) {
          console.log('🏁 HistoricalTrivia: Last question timeout, finishing game');
          setHasFinished(true);
          onGameFinish(score);
        }
      }, 2000);
    }
  };

  // Chọn đáp án
  const handleSelectAnswer = (answerIndex: number) => {
    console.log('🎯 HistoricalTrivia: handleSelectAnswer called:', {
      answerIndex,
      isAnswered,
      currentQuestion: !!currentQuestion,
      correctAnswer: currentQuestion?.correctAnswer,
      eliminatedOptions,
      isEliminated: eliminatedOptions.includes(answerIndex)
    });
    
    if (isAnswered || !currentQuestion) {
      console.log('❌ HistoricalTrivia: handleSelectAnswer blocked:', { isAnswered, hasCurrentQuestion: !!currentQuestion });
      return;
    }
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResults(true);
    
    // Tính điểm và cập nhật score
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const basePoints = isCorrect ? currentQuestion.points : 0;
    const timeBonus = isCorrect ? Math.max(0, timeRemaining * 2) : 0;
    const streakBonus = isCorrect && streak >= 2 ? streak * 50 : 0;
    const hintPenalty = hintsUsed * 25;
    const earnedPoints = Math.max(0, basePoints + timeBonus + streakBonus - hintPenalty);
    
    console.log('🎮 HistoricalTrivia: Answer submitted:', {
      isCorrect, earnedPoints, currentRound: gameState.currentRound, totalQuestions: filteredQuestions.length
    });
    
    setScore((prev: number) => prev + earnedPoints);
    
    // Cập nhật streak
    if (answerIndex === currentQuestion.correctAnswer) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    onSubmitAnswer(answerIndex);
    
    // Submit answer to server for round tracking  
    console.log('🔍 HistoricalTrivia: Debug gameState for roomId:', {
      gameState: gameState,
      roomIdFromGameState: (gameState as any)?.roomId,
      idFromGameState: (gameState as any)?.id,
      currentPlayer: currentPlayer,
      allPlayers: allPlayers
    });
    
    if (roomId && currentPlayer?.id) {
      console.log('📤 HistoricalTrivia: Submitting answer to server:', { roomId, playerId: currentPlayer.id, answerIndex });
      GameService.submitAnswer(roomId, currentPlayer.id, answerIndex);
    } else {
      console.log('❌ HistoricalTrivia: Cannot submit answer - missing roomId or playerId:', { 
        roomId, 
        playerId: currentPlayer?.id,
        hasGameState: !!gameState,
        hasCurrentPlayer: !!currentPlayer,
        gameStateKeys: Object.keys(gameState || {}),
        currentPlayerKeys: Object.keys(currentPlayer || {})
      });
    }
    
    // Check if this is the last question, then finish
    if (gameState.currentRound >= filteredQuestions.length) {
      setTimeout(() => {
        if (onGameFinish && !hasFinished) {
          console.log('🏁 HistoricalTrivia: Last question completed, finishing game');
          setHasFinished(true);
          onGameFinish(score + earnedPoints);
        }
      }, 2000); // Delay 2s để show results
    }
  };

  // Sử dụng gợi ý - loại bỏ 2 đáp án sai
  const handleUseHint = () => {
    if (!canUseHint || hintsUsed >= 2 || !currentQuestion) return;
    
    setHintsUsed(prev => prev + 1);
    onUseHint();
    
    // Tìm 2 đáp án sai để loại bỏ
    const wrongAnswers = (currentQuestion.options || [])
      .map((_, index) => index)
      .filter(index => index !== currentQuestion.correctAnswer);
    
    const toEliminate = wrongAnswers.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Tính điểm
  const calculatePoints = () => {
    if (!currentQuestion || selectedAnswer !== currentQuestion.correctAnswer) {
      return 0;
    }
    
    let points = currentQuestion.points;
    
    // Bonus thời gian (càng nhanh càng được nhiều điểm)
    const timeBonus = Math.floor(timeRemaining / currentQuestion.timeLimit * 50);
    points += timeBonus;
    
    // Bonus streak (chuỗi đúng)
    if (streak >= 3) {
      points += streak * 10;
    }
    
    // Trừ điểm nếu dùng gợi ý
    if (eliminatedOptions.length > 0) {
      points -= 25;
    }
    
    return points;
  };

  // Lấy màu theo difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Historical Trivia</h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-200">Câu {gameState.currentRound}/{gameState.totalRounds}</span>
                <span className={`px-2 py-1 rounded ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="text-purple-300">{currentQuestion.category}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className={`text-2xl font-bold ${
                  timeRemaining <= 5 ? 'text-red-400' : 'text-white'
                }`}>
                  {timeRemaining}s
                </span>
              </div>

              {/* Streak */}
              {streak > 0 && (
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-bold">{streak}</span>
                </div>
              )}

              {/* Score */}
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{currentPlayer.score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Câu Hỏi</h2>
            </div>
            
            <p className="text-xl text-white leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(currentQuestion.options || []).map((option, index) => {
              const isEliminated = eliminatedOptions.includes(index);
              const isSelected = selectedAnswer === index;
              const isCorrect = showResults && index === currentQuestion.correctAnswer;
              const isWrong = showResults && isSelected && index !== currentQuestion.correctAnswer;
              
              // Debug selected answer logic
              if (isSelected) {
                console.log('🔴 HistoricalTrivia: Selected button state:', {
                  index,
                  isSelected,
                  selectedAnswer,
                  showResults,
                  isCorrect,
                  isWrong,
                  correctAnswer: currentQuestion.correctAnswer,
                  isAnswered
                });
              }
              
              // Debug log for button states (reduced frequency)
              if (index === currentQuestion.correctAnswer && Math.random() < 0.1) {
                console.log('🔍 HistoricalTrivia: Correct answer button state:', {
                  index,
                  isEliminated,
                  isAnswered,
                  disabled: isAnswered || isEliminated,
                  eliminatedOptions
                });
              }
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered || isEliminated}
                  whileHover={!isAnswered && !isEliminated ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered && !isEliminated ? { scale: 0.98 } : {}}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 relative ${
                    isEliminated ? 'border-gray-600 bg-gray-600/20 opacity-50 cursor-not-allowed' :
                    isCorrect ? 'border-green-500 bg-green-500/20' :
                    isWrong ? 'border-red-500 bg-red-500/20' :
                    isSelected ? 'border-blue-500 bg-blue-500/20' :
                    'border-white/20 bg-white/10 hover:bg-white/20 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isEliminated ? 'bg-gray-600 text-gray-400' :
                        isCorrect ? 'bg-green-500 text-white' :
                        isWrong ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-blue-500 text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      
                      <span className={`text-lg ${
                        isEliminated ? 'text-gray-400' : 'text-white'
                      }`}>
                        {option}
                      </span>
                    </div>
                    
                    {showResults && isCorrect && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {showResults && isWrong && (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    {isEliminated && (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Hint Button */}
          {!isAnswered && (
            <div className="flex justify-center">
              <button
                onClick={handleUseHint}
                disabled={!canUseHint || hintsUsed >= 2 || eliminatedOptions.length > 0}
                className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 disabled:text-gray-400 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                <span>Loại bỏ 2 đáp án ({2 - hintsUsed} lượt)</span>
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Bảng Xếp Hạng</span>
          </h3>
          
          <div className="space-y-3">
            {(allPlayers || [])
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.id === currentPlayer.id 
                      ? 'bg-blue-500/20 border border-blue-500/50' 
                      : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <span className="text-white font-medium">{player.name}</span>
                      {player.id === currentPlayer?.id && (
                        <span className="text-blue-300 text-sm ml-2">(Bạn)</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-bold">{player.score || 0}</span>
                    <Target className="w-4 h-4 text-blue-300" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-lg w-full"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-500' : 
                    selectedAnswer === -1 ? 'bg-gray-500' : 'bg-red-500'
                  }`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <XCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Chính xác!' :
                     selectedAnswer === -1 ? 'Hết giờ!' : 'Sai rồi!'}
                  </h3>
                  
                  <p className="text-blue-200 mb-4">
                    {currentQuestion.explanation}
                  </p>
                  
                  {selectedAnswer === currentQuestion.correctAnswer && (
                    <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-green-200">Điểm cơ bản:</span>
                        <span className="text-white">{currentQuestion.points}</span>
                      </div>
                      {timeRemaining > 0 && (
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-green-200">Bonus thời gian:</span>
                          <span className="text-white">+{Math.floor(timeRemaining / currentQuestion.timeLimit * 50)}</span>
                        </div>
                      )}
                      {streak >= 3 && (
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-green-200">Bonus streak:</span>
                          <span className="text-white">+{streak * 10}</span>
                        </div>
                      )}
                      {eliminatedOptions.length > 0 && (
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-red-200">Dùng gợi ý:</span>
                          <span className="text-white">-25</span>
                        </div>
                      )}
                      <div className="border-t border-green-400/30 pt-2 flex justify-between items-center">
                        <span className="text-green-200 font-bold">Tổng điểm:</span>
                        <span className="text-2xl font-bold text-white">+{calculatePoints()}</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-blue-300 text-sm mb-4">
                    Đang chờ người chơi khác...
                  </p>
                  
                  {!hasFinished && (
                    <button
                      onClick={() => {
                        if (onGameFinish) {
                          console.log('🔘 HistoricalTrivia: Manual finish button clicked');
                          const finalScore = calculatePoints();
                          setHasFinished(true);
                          onGameFinish(finalScore);
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Hoàn thành
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
