                                                                                                                                                                                                                                                                                                                  'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, Trophy, Brain, 
  Users, Target, Lightbulb, Eye, Zap
} from 'lucide-react';
import { GamePlayer, GameState } from '@/types/games';

interface RiddleQuestProps {
  gameState: GameState;
  currentPlayer: GamePlayer;
  allPlayers?: GamePlayer[];
  onSubmitAnswer: (answer: string) => void;
  onUseHint: () => void;
  canUseHint: boolean;
  onGameFinish?: (finalScore: number) => void;
  onShowResults?: (room: any) => void;
}

interface RiddleQuestion {
  id: string;
  riddle: string;
  hint1: string;
  hint2: string;
  answer: string;
  alternativeAnswers?: string[];
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  points: number;
}

// Danh sách câu đố lịch sử Việt Nam
const riddleQuestions: RiddleQuestion[] = [
  {
    id: 'riddle-001',
    riddle: 'Ai là người anh hùng đốt tàu Pháp, nhưng cuối đời lại bị Pháp bắt và xử tử ở Côn Đảo?',
    hint1: 'Anh ta nổi tiếng với chiến thuật đốt tàu địch',
    hint2: 'Tên anh ta có chữ "Trực"',
    answer: 'Nguyễn Trung Trực',
    alternativeAnswers: ['Nguyen Trung Truc', 'trung trực'],
    explanation: 'Nguyễn Trung Trực đốt tàu L\'Espérance năm 1861, sau đó bị Pháp bắt và xử tử ở Côn Đảo năm 1868.',
    category: 'Anh hùng dân tộc',
    difficulty: 'medium',
    timeLimit: 45,
    points: 150
  },
  {
    id: 'riddle-002',
    riddle: 'Vị vua nào ra chiếu Cần Vương kêu gọi toàn dân chống Pháp nhưng chỉ mới 13 tuổi?',
    hint1: 'Chiếu Cần Vương được ban hành năm 1885',
    hint2: 'Tên hiệu có liên quan đến "ham muốn nghi lễ"',
    answer: 'Hàm Nghi',
    alternativeAnswers: ['Ham Nghi', 'vua Hàm Nghi', 'Vua Ham Nghi'],
    explanation: 'Vua Hàm Nghi lên ngôi năm 1884 khi mới 13 tuổi, ra chiếu Cần Vương năm 1885.',
    category: 'Triều đại',
    difficulty: 'medium',
    timeLimit: 45,
    points: 150
  },
  {
    id: 'riddle-003',
    riddle: 'Thành phố nào được mệnh danh là "Paris phương Đông" thời thuộc Pháp?',
    hint1: 'Đây là thủ đô của miền Nam Việt Nam thời Pháp thuộc',
    hint2: 'Tên cũ là Sài Gòn',
    answer: 'Sài Gòn',
    alternativeAnswers: ['Saigon', 'Thành phố Hồ Chí Minh', 'TPHCM'],
    explanation: 'Sài Gòn được Pháp xây dựng thành thành phố hiện đại và mệnh danh là "Paris phương Đông".',
    category: 'Địa lý lịch sử',
    difficulty: 'easy',
    timeLimit: 30,
    points: 100
  },
  {
    id: 'riddle-004',
    riddle: 'Ai là "Ngọc hoàng của văn chương Việt Nam", tác giả "Truyện Kiều"?',
    hint1: 'Ông sống vào cuối thế kỷ 18, đầu thế kỷ 19',
    hint2: 'Tên hiệu Tân Đà, tự Liêm',
    answer: 'Nguyễn Du',
    alternativeAnswers: ['Nguyen Du', 'Tân Đà', 'Tan Da'],
    explanation: 'Nguyễn Du (1765-1820) là đại thi hào, tác giả "Truyện Kiều" - kiệt tác văn học Việt Nam.',
    category: 'Văn hóa',
    difficulty: 'easy',
    timeLimit: 30,
    points: 100
  },
  {
    id: 'riddle-005',
    riddle: 'Cuộc khởi nghĩa nào diễn ra năm 1930, do Nguyễn Thái Học lãnh đạo ở Yên Bái?',
    hint1: 'Đây là một tổ chức cách mạng dân tộc',
    hint2: 'Tên tổ chức có chữ "Việt" và "Quốc"',
    answer: 'Việt Nam Quốc Dân Đảng',
    alternativeAnswers: ['VNQDĐ', 'Viet Nam Quoc Dan Dang', 'Quốc Dân Đảng'],
    explanation: 'Việt Nam Quốc Dân Đảng do Nguyễn Thái Học thành lập, nổi dậy ở Yên Bái năm 1930.',
    category: 'Cách mạng',
    difficulty: 'hard',
    timeLimit: 60,
    points: 200
  }
];

export default function RiddleQuest({ 
  gameState, 
  currentPlayer, 
  allPlayers = [],
  onSubmitAnswer, 
  onUseHint,
  canUseHint,
  onGameFinish,
  onShowResults
}: RiddleQuestProps) {
  const [currentRiddle, setCurrentRiddle] = useState<RiddleQuestion | null>(null);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  // Filter riddles by difficulty và totalRounds
  const getFilteredRiddles = () => {
    const roomSettings = (gameState as any)?.settings;
    const difficulty = roomSettings?.difficulty || 'easy';
    const totalRounds = roomSettings?.totalRounds || 5;
    
    const filteredByDifficulty = riddleQuestions.filter(q => q.difficulty === difficulty);
    const availableRiddles = filteredByDifficulty.length >= totalRounds 
      ? filteredByDifficulty 
      : riddleQuestions;
    
    const shuffled = [...availableRiddles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalRounds);
  };

  const [filteredRiddles] = useState(() => getFilteredRiddles());

  // Load riddle
  useEffect(() => {
    if (gameState.currentRound <= filteredRiddles.length) {
      const riddle = filteredRiddles[gameState.currentRound - 1];
      setCurrentRiddle(riddle);
      
      const roomSettings = (gameState as any)?.settings;
      const timeLimit = roomSettings?.timeLimit || riddle.timeLimit;
      setTimeRemaining(timeLimit);
      
      setIsAnswered(false);
      setPlayerAnswer('');
      setShowResults(false);
      setShowHint(false);
      setHintsUsed(0);
    } else if (gameState.currentRound > filteredRiddles.length && !hasFinished) {
      // Hết tất cả câu đố
      if (onGameFinish) {
        setHasFinished(true);
        onGameFinish(score);
      }
    }
  }, [gameState.currentRound, filteredRiddles, hasFinished, onGameFinish, score]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0 && !isAnswered && currentRiddle) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeRemaining, isAnswered, currentRiddle]);

  // Auto-finish logic
  useEffect(() => {
    if (!hasFinished && showResults && allPlayers && currentPlayer) {
      const otherPlayersFinished = allPlayers.some(p => p.id !== currentPlayer.id && p.isFinished);
      if (otherPlayersFinished && onGameFinish) {
        setHasFinished(true);
        onGameFinish(score);
      }
    }
  }, [allPlayers, hasFinished, showResults, currentPlayer, onGameFinish, score]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResults(true);
    onSubmitAnswer(''); // Empty answer = timeout
    
    if (onGameFinish && !hasFinished) {
      setHasFinished(true);
      onGameFinish(score);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentRiddle || isAnswered || !playerAnswer.trim()) return;
    
    setIsAnswered(true);
    setShowResults(true);
    
    // Check if answer is correct
    const normalizedAnswer = playerAnswer.toLowerCase().trim();
    const correctAnswers = [
      currentRiddle.answer.toLowerCase(),
      ...(currentRiddle.alternativeAnswers || []).map(a => a.toLowerCase())
    ];
    
    const isCorrect = correctAnswers.some(answer => 
      normalizedAnswer.includes(answer) || answer.includes(normalizedAnswer)
    );
    
    if (isCorrect) {
      const basePoints = currentRiddle.points;
      const timeBonus = Math.floor(timeRemaining * 2);
      const hintPenalty = hintsUsed * 25;
      const earnedPoints = Math.max(0, basePoints + timeBonus - hintPenalty);
      
      setScore(prev => prev + earnedPoints);
    }
    
    onSubmitAnswer(playerAnswer);
    
    if (onGameFinish && !hasFinished) {
      setTimeout(() => {
        setHasFinished(true);
        onGameFinish(score + (isCorrect ? currentRiddle.points : 0));
      }, 3000); // Delay để show results
    }
  };

  const handleUseHint = () => {
    if (hintsUsed < 2 && canUseHint) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
      onUseHint();
    }
  };

  const getCurrentHint = () => {
    if (!currentRiddle) return '';
    if (hintsUsed === 1) return currentRiddle.hint1;
    if (hintsUsed === 2) return currentRiddle.hint2;
    return '';
  };

  if (!currentRiddle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold">Đang tải câu đố...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Riddle Quest</h1>
                <p className="text-indigo-200">Giải mã bí ẩn lịch sử</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{gameState.currentRound}</div>
                <div className="text-indigo-200 text-sm">/ {filteredRiddles.length}</div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeRemaining}
                </div>
                <div className="text-indigo-200 text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  giây
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">Câu đố #{gameState.currentRound}</h2>
                  <p className="text-lg text-blue-100 leading-relaxed">{currentRiddle.riddle}</p>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentRiddle.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                      currentRiddle.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {currentRiddle.difficulty === 'easy' ? 'Dễ' : 
                       currentRiddle.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                      {currentRiddle.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                      {currentRiddle.points} điểm
                    </span>
                  </div>
                </div>
              </div>

              {/* Hint */}
              {showHint && getCurrentHint() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-yellow-300" />
                    <span className="text-yellow-300 font-medium">Gợi ý {hintsUsed}:</span>
                  </div>
                  <p className="text-yellow-100">{getCurrentHint()}</p>
                </motion.div>
              )}

              {/* Answer Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-3">Câu trả lời của bạn:</label>
                  <input
                    type="text"
                    value={playerAnswer}
                    onChange={(e) => setPlayerAnswer(e.target.value)}
                    disabled={isAnswered}
                    placeholder="Nhập câu trả lời..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isAnswered) {
                        handleSubmitAnswer();
                      }
                    }}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isAnswered || !playerAnswer.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isAnswered ? 'Đã trả lời' : 'Gửi đáp án'}
                  </button>
                  
                  <button
                    onClick={handleUseHint}
                    disabled={!canUseHint || hintsUsed >= 2 || isAnswered}
                    className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 disabled:text-gray-400 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Gợi ý ({2 - hintsUsed})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-fit">
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
                        ? 'bg-indigo-500/20 border border-indigo-500/50' 
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
                          <span className="text-indigo-300 text-sm ml-2">(Bạn)</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold">{player.score || score}</span>
                      <Target className="w-4 h-4 text-indigo-300" />
                    </div>
                  </div>
                ))}
            </div>
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
                    playerAnswer && currentRiddle && 
                    [currentRiddle.answer.toLowerCase(), ...(currentRiddle.alternativeAnswers || []).map(a => a.toLowerCase())]
                      .some(answer => playerAnswer.toLowerCase().includes(answer) || answer.includes(playerAnswer.toLowerCase()))
                      ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {playerAnswer && currentRiddle && 
                     [currentRiddle.answer.toLowerCase(), ...(currentRiddle.alternativeAnswers || []).map(a => a.toLowerCase())]
                       .some(answer => playerAnswer.toLowerCase().includes(answer) || answer.includes(playerAnswer.toLowerCase())) ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <XCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {playerAnswer && currentRiddle && 
                     [currentRiddle.answer.toLowerCase(), ...(currentRiddle.alternativeAnswers || []).map(a => a.toLowerCase())]
                       .some(answer => playerAnswer.toLowerCase().includes(answer) || answer.includes(playerAnswer.toLowerCase()))
                       ? 'Chính xác!' : 
                       playerAnswer ? 'Sai rồi!' : 'Hết giờ!'}
                  </h3>
                  
                  <div className="bg-indigo-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white font-medium mb-2">Đáp án đúng:</p>
                    <p className="text-indigo-200 text-lg">{currentRiddle?.answer}</p>
                  </div>
                  
                  <p className="text-blue-200 mb-4">{currentRiddle?.explanation}</p>
                  
                  <p className="text-blue-300 text-sm mb-4">Đang chờ người chơi khác...</p>
                  
                  {!hasFinished && (
                    <button
                      onClick={() => {
                        if (onGameFinish) {
                          setHasFinished(true);
                          onGameFinish(score);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
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
