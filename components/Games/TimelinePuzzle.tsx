'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, Trophy, 
  ArrowUp, ArrowDown, RotateCcw, Zap 
} from 'lucide-react';
import { TimelineEvent, GamePlayer, GameState } from '@/types/games';

interface TimelinePuzzleProps {
  gameState: GameState;
  currentPlayer: GamePlayer;
  allPlayers?: GamePlayer[];
  onSubmitAnswer: (eventIds: string[]) => void;
  onUseHint: () => void;
  canUseHint: boolean;
  onGameFinish?: (finalScore: number) => void;
  onShowResults?: (room: any) => void;
}

// Mock data - sẽ được thay thế bằng dữ liệu thật từ Firebase
const mockEvents: TimelineEvent[] = [
  {
    id: 'event-001',
    name: 'Liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng',
    year: 1858,
    description: 'Cuộc tấn công đánh dấu sự bắt đầu của cuộc xâm lược Pháp',
    imageUrl: '/images/events/danang-1858.jpg'
  },
  {
    id: 'event-002', 
    name: 'Thành Gia Định thất thủ',
    year: 1859,
    description: 'Pháp chiếm thành Gia Định sau khi rút khỏi Đà Nẵng',
    imageUrl: '/images/events/gia-dinh-1859.jpg'
  },
  {
    id: 'event-003',
    name: 'Nguyễn Trung Trực khởi nghĩa',
    year: 1861,
    description: 'Nghĩa quân Rạch Giá - Hà Tiên bắt đầu kháng chiến',
    imageUrl: '/images/events/nguyen-trung-truc.jpg'
  },
  {
    id: 'event-004',
    name: 'Ký Hiệp ước Saigon',
    year: 1862,
    description: 'Triều đình Huế ký hiệp ước cắt 3 tỉnh Nam Kỳ cho Pháp',
    imageUrl: '/images/events/hiep-uoc-saigon.jpg'
  },
  {
    id: 'event-005',
    name: 'Khởi nghĩa Yên Thế',
    year: 1884,
    description: 'Hoàng Hoa Thám lãnh đạo phong trào chống Pháp ở Yên Thế',
    imageUrl: '/images/events/yen-the.jpg'
  },
  {
    id: 'event-006',
    name: 'Phong trào Cần Vương',
    year: 1885,
    description: 'Vua Hàm Nghi ra chiếu kêu gọi toàn dân chống Pháp',
    imageUrl: '/images/events/can-vuong.jpg'
  },
  {
    id: 'event-007',
    name: 'Khởi nghĩa Đông Du',
    year: 1905,
    description: 'Phan Bội Châu tổ chức đưa thanh niên sang Nhật học tập',
    imageUrl: '/images/events/dong-du.jpg'
  },
  {
    id: 'event-008',
    name: 'Thành lập Việt Nam Quốc dân đảng',
    year: 1927,
    description: 'Nguyễn Thái Học thành lập tổ chức cách mạng',
    imageUrl: '/images/events/vnqdd.jpg'
  },
  {
    id: 'event-009',
    name: 'Khởi nghĩa Yên Bái',
    year: 1930,
    description: 'VNQĐD tổ chức khởi nghĩa chống thực dân Pháp',
    imageUrl: '/images/events/yen-bai.jpg'
  },
  {
    id: 'event-010',
    name: 'Thành lập Đảng Cộng sản Việt Nam',
    year: 1930,
    description: 'Nguyễn Ái Quốc chủ trì hội nghị thống nhất các tổ chức cộng sản',
    imageUrl: '/images/events/dang-thanh-lap.jpg'
  },
  {
    id: 'event-011',
    name: 'Xô viết Nghệ Tĩnh',
    year: 1930,
    description: 'Phong trào nông dân cách mạng tại Nghệ An - Hà Tĩnh',
    imageUrl: '/images/events/xo-viet-nghe-tinh.jpg'
  },
  {
    id: 'event-012',
    name: 'Mặt trận Việt Minh thành lập',
    year: 1941,
    description: 'Hồ Chí Minh thành lập mặt trận dân tộc thống nhất',
    imageUrl: '/images/events/viet-minh.jpg'
  }
];

export default function TimelinePuzzle({ 
  gameState, 
  currentPlayer, 
  allPlayers,
  onSubmitAnswer, 
  onUseHint,
  canUseHint,
  onGameFinish,
  onShowResults
}: TimelinePuzzleProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [playerAnswer, setPlayerAnswer] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Khởi tạo game
  useEffect(() => {
    // Lấy số câu hỏi từ settings
    const roomSettings = (gameState as any)?.settings;
    const totalEvents = roomSettings?.totalRounds || 5;
    
    console.log('🎯 TimelinePuzzle: Initializing game:', {
      totalEvents,
      availableEvents: mockEvents.length,
      settings: roomSettings
    });
    
    // Trộn ngẫu nhiên và lấy số lượng events theo settings
    const shuffledEvents = [...mockEvents]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(totalEvents, mockEvents.length));
    
    setEvents(shuffledEvents);
    
    // Lưu thứ tự đúng (sắp xếp theo năm)
    const correct = shuffledEvents
      .sort((a, b) => a.year - b.year)
      .map(e => e.id);
    setCorrectOrder(correct);
    
    // Sử dụng timeLimit từ settings
    const timeLimit = roomSettings?.timeLimit || 60;
    setTimeRemaining(timeLimit);
  }, [(gameState as any)?.settings]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

  // Chọn sự kiện
  const handleSelectEvent = (eventId: string) => {
    if (showResults) return;
    
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
    } else {
      setSelectedEvents(prev => [...prev, eventId]);
    }
  };

  // Di chuyển sự kiện trong timeline
  const moveEvent = (eventId: string, direction: 'up' | 'down') => {
    if (showResults) return;
    
    const currentIndex = selectedEvents.indexOf(eventId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedEvents.length) return;
    
    const newOrder = [...selectedEvents];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setSelectedEvents(newOrder);
  };

  // Sử dụng gợi ý
  const handleUseHint = () => {
    if (!canUseHint || hintsUsed >= 2) return;
    
    setHintsUsed(prev => prev + 1);
    onUseHint();
    
    // Hiển thị 1 sự kiện ở vị trí đúng
    if (selectedEvents.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedEvents.length);
      const eventId = selectedEvents[randomIndex];
      const correctIndex = correctOrder.indexOf(eventId);
      
      const newOrder = [...selectedEvents];
      newOrder.splice(randomIndex, 1);
      newOrder.splice(correctIndex, 0, eventId);
      setSelectedEvents(newOrder);
    }
  };

  // Đặt lại timeline
  const handleReset = () => {
    if (showResults) return;
    setSelectedEvents([]);
  };

  // Nộp câu trả lời
  const handleSubmit = () => {
    console.log('📤 TimelinePuzzle: Submitting answer:', {
      selectedEvents,
      correctOrder,
      eventsLength: events.length
    });
    
    setPlayerAnswer(selectedEvents);
    setShowResults(true);
    onSubmitAnswer(selectedEvents);
    
    // Gọi onGameFinish để notify game completed
    if (onGameFinish) {
      // Tính điểm với selectedEvents thay vì playerAnswer (vì playerAnswer chưa được update)
      const finalScore = calculateScoreWithAnswer(selectedEvents);
      console.log('🎯 TimelinePuzzle: Final score calculated:', finalScore);
      onGameFinish(finalScore);
    }
  };

  // Kiểm tra câu trả lời
  const checkAnswer = () => {
    const correct = playerAnswer.length === correctOrder.length && 
      playerAnswer.every((id, index) => id === correctOrder[index]);
    return correct;
  };

  // Tính điểm với answer cụ thể
  const calculateScoreWithAnswer = (answer: string[]) => {
    let score = 0;
    answer.forEach((id, index) => {
      if (id === correctOrder[index]) {
        score += 20; // 20 điểm cho mỗi vị trí đúng
      }
    });
    
    // Bonus thời gian nếu đúng hoàn toàn
    const isCompletelyCorrect = answer.length === correctOrder.length && 
      answer.every((id, index) => id === correctOrder[index]);
    
    if (isCompletelyCorrect) {
      score += Math.max(0, timeRemaining * 2);
    }
    
    // Trừ điểm sử dụng gợi ý
    score -= hintsUsed * 10;
    
    console.log('🧮 TimelinePuzzle: Score calculation:', {
      answer,
      correctOrder,
      baseScore: answer.length * 20,
      timeBonus: isCompletelyCorrect ? timeRemaining * 2 : 0,
      hintPenalty: hintsUsed * 10,
      finalScore: Math.max(0, score)
    });
    
    return Math.max(0, score);
  };

  // Tính điểm (wrapper cho calculateScoreWithAnswer)
  const calculateScore = () => {
    return calculateScoreWithAnswer(playerAnswer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Timeline Puzzle</h1>
              <p className="text-blue-200">Xếp các sự kiện theo đúng thứ tự thời gian</p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className={`text-xl font-bold ${
                  timeRemaining <= 10 ? 'text-red-400' : 'text-white'
                }`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{currentPlayer.score}</span>
              </div>

              {/* Hints */}
              <button
                onClick={handleUseHint}
                disabled={!canUseHint || hintsUsed >= 2 || showResults}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 disabled:text-gray-400 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                <span>Gợi ý ({2 - hintsUsed})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Events Pool */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Các Sự Kiện</h2>
            
            <div className="space-y-3">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  onClick={() => handleSelectEvent(event.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedEvents.includes(event.id)
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">
                        {event.year}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{event.name}</h3>
                      <p className="text-blue-200 text-sm">{event.description}</p>
                    </div>
                    
                    {selectedEvents.includes(event.id) && (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Timeline ({selectedEvents.length}/5)</h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  disabled={showResults}
                  className="px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 disabled:bg-gray-500/10 text-gray-300 disabled:text-gray-500 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                
                {selectedEvents.length === events.length && !showResults && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Nộp bài
                  </button>
                )}
              </div>
            </div>

            {/* Timeline Items */}
            <div className="space-y-3 min-h-[400px]">
              <AnimatePresence>
                {selectedEvents.map((eventId, index) => {
                  const event = events.find(e => e.id === eventId);
                  if (!event) return null;
                  
                  const isCorrect = showResults && playerAnswer[index] === correctOrder[index];
                  const isWrong = showResults && playerAnswer[index] !== correctOrder[index];
                  
                  return (
                    <motion.div
                      key={eventId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                        isCorrect ? 'border-green-500 bg-green-500/20' :
                        isWrong ? 'border-red-500 bg-red-500/20' :
                        'border-blue-500 bg-blue-500/20'
                      }`}
                    >
                      {/* Position indicator */}
                      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 ml-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-bold">{event.name}</span>
                            {showResults && (
                              isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )
                            )}
                          </div>
                          <p className="text-blue-200 text-sm">{event.year}</p>
                        </div>
                        
                        {!showResults && (
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => moveEvent(eventId, 'up')}
                              disabled={index === 0}
                              className="w-8 h-8 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded text-white disabled:text-gray-400 flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveEvent(eventId, 'down')}
                              disabled={index === selectedEvents.length - 1}
                              className="w-8 h-8 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded text-white disabled:text-gray-400 flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {selectedEvents.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-lg">
                  <p className="text-blue-300">Chọn các sự kiện để xếp timeline</p>
                </div>
              )}
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
                    checkAnswer() ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {checkAnswer() ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <XCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {checkAnswer() ? 'Chính xác!' : 'Chưa đúng!'}
                  </h3>
                  
                  <p className="text-blue-200 mb-6">
                    Bạn đã {checkAnswer() ? 'xếp đúng' : 'xếp sai'} timeline các sự kiện lịch sử
                  </p>
                  
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Điểm nhận được:</span>
                      <span className="text-2xl font-bold text-white">+{calculateScore()}</span>
                    </div>
                  </div>
                  
                  <p className="text-blue-300 text-sm">
                    Đang chờ người chơi khác hoàn thành...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
