'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, Trophy, Users2, 
  Shuffle, RotateCcw, Zap, Link2, Crown
} from 'lucide-react';
import { GamePlayer, GameState, CharacterMatch, HistoricalCharacter, HistoricalEvent } from '@/types/games';

interface CharacterMatchingProps {
  gameState: GameState;
  currentPlayer: GamePlayer;
  allPlayers?: GamePlayer[];
  onSubmitAnswer: (matches: { characterId: string; eventId: string }[]) => void;
  onUseHint: () => void;
  canUseHint: boolean;
  onGameFinish?: (finalScore: number) => void;
  onShowResults?: (room: any) => void;
}

// Mock data từ dữ liệu có sẵn
const mockCharacters: HistoricalCharacter[] = [
  {
    id: 'char-001',
    name: 'Nguyễn Trung Trực',
    avatar: '/images/characters/nguyen-trung-truc.jpg',
    birthYear: 1838,
    deathYear: 1868,
    role: 'Anh hùng dân tộc'
  },
  {
    id: 'char-016',
    name: 'Nguyễn Tri Phương',
    avatar: '/images/characters/nguyen-tri-phuong.jpg',
    birthYear: 1800,
    deathYear: 1873,
    role: 'Danh tướng triều Nguyễn'
  },
  {
    id: 'char-003',
    name: 'Vua Hàm Nghi',
    avatar: '/images/characters/ham-nghi.jpg',
    birthYear: 1872,
    deathYear: 1943,
    role: 'Vua triều Nguyễn'
  },
  {
    id: 'char-008',
    name: 'Nguyễn Ái Quốc (Hồ Chí Minh)',
    avatar: '/images/characters/ho-chi-minh.jpg',
    birthYear: 1890,
    deathYear: 1969,
    role: 'Lãnh tụ cách mạng'
  },
  {
    id: 'char-009',
    name: 'Nguyễn Thái Học',
    avatar: '/images/characters/nguyen-thai-hoc.jpg',
    birthYear: 1902,
    deathYear: 1930,
    role: 'Lãnh tụ VNQDĐ'
  }
];

const mockEvents: HistoricalEvent[] = [
  {
    id: 'event-048',
    name: 'Đốt tàu Espérance tại Nhựt Tảo',
    year: 1868,
    type: 'military_action',
    description: 'Lần đầu tiên nghĩa quân Việt Nam đốt tàu chiến phương Tây'
  },
  {
    id: 'event-001',
    name: 'Tổ chức vây hãm liên quân tại Đà Nẵng',
    year: 1858,
    type: 'military_strategy',
    description: 'Chiến thuật "vườn không nhà trống" chống Pháp'
  },
  {
    id: 'event-008',
    name: 'Ra chiếu Cần Vương',
    year: 1885,
    type: 'political_movement',
    description: 'Kêu gọi toàn dân chống Pháp'
  },
  {
    id: 'event-014',
    name: 'Thành lập Đảng Cộng sản Việt Nam',
    year: 1930,
    type: 'political_organization',
    description: 'Hội nghị thống nhất tại Hương Cảng'
  },
  {
    id: 'event-032',
    name: 'Khởi nghĩa Yên Bái',
    year: 1930,
    type: 'military_uprising',
    description: 'Cuộc khởi nghĩa của VNQDĐ'
  }
];

const correctMatches = [
  { characterId: 'char-001', eventId: 'event-048' },
  { characterId: 'char-016', eventId: 'event-001' },
  { characterId: 'char-003', eventId: 'event-008' },
  { characterId: 'char-008', eventId: 'event-014' },
  { characterId: 'char-009', eventId: 'event-032' }
];

export default function CharacterMatching({ 
  gameState, 
  currentPlayer, 
  allPlayers,
  onSubmitAnswer, 
  onUseHint,
  canUseHint,
  onGameFinish,
  onShowResults
}: CharacterMatchingProps) {
  const [characters, setCharacters] = useState<HistoricalCharacter[]>([]);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [matches, setMatches] = useState<{ characterId: string; eventId: string }[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [showResults, setShowResults] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedMatches, setRevealedMatches] = useState<string[]>([]);

  // Khởi tạo game
  useEffect(() => {
    // Trộn ngẫu nhiên characters và events
    const shuffledCharacters = [...mockCharacters].sort(() => Math.random() - 0.5);
    const shuffledEvents = [...mockEvents].sort(() => Math.random() - 0.5);
    
    setCharacters(shuffledCharacters);
    setEvents(shuffledEvents);
    setTimeRemaining(90);
  }, []);

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

  // Chọn nhân vật
  const handleSelectCharacter = (characterId: string) => {
    if (showResults || isCharacterMatched(characterId)) return;
    
    if (selectedCharacter === characterId) {
      setSelectedCharacter(null);
    } else {
      setSelectedCharacter(characterId);
      setSelectedEvent(null); // Clear event selection
      
      // Nếu đã chọn event trước đó, tạo match
      if (selectedEvent && !isEventMatched(selectedEvent)) {
        createMatch(characterId, selectedEvent);
      }
    }
  };

  // Chọn sự kiện
  const handleSelectEvent = (eventId: string) => {
    if (showResults || isEventMatched(eventId)) return;
    
    if (selectedEvent === eventId) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(eventId);
      setSelectedCharacter(null); // Clear character selection
      
      // Nếu đã chọn character trước đó, tạo match
      if (selectedCharacter && !isCharacterMatched(selectedCharacter)) {
        createMatch(selectedCharacter, eventId);
      }
    }
  };

  // Tạo cặp ghép
  const createMatch = (characterId: string, eventId: string) => {
    setMatches(prev => [...prev, { characterId, eventId }]);
    setSelectedCharacter(null);
    setSelectedEvent(null);
  };

  // Xóa cặp ghép
  const removeMatch = (characterId: string, eventId: string) => {
    if (showResults) return;
    setMatches(prev => prev.filter(m => !(m.characterId === characterId && m.eventId === eventId)));
  };

  // Kiểm tra nhân vật đã được ghép
  const isCharacterMatched = (characterId: string) => {
    return matches.some(m => m.characterId === characterId);
  };

  // Kiểm tra sự kiện đã được ghép
  const isEventMatched = (eventId: string) => {
    return matches.some(m => m.eventId === eventId);
  };

  // Sử dụng gợi ý - hiển thị 1 cặp đúng
  const handleUseHint = () => {
    if (!canUseHint || hintsUsed >= 2) return;
    
    setHintsUsed(prev => prev + 1);
    onUseHint();
    
    // Tìm 1 cặp đúng chưa được ghép
    const availableCorrectMatches = correctMatches.filter(cm => 
      !matches.some(m => m.characterId === cm.characterId && m.eventId === cm.eventId) &&
      !revealedMatches.includes(cm.characterId)
    );
    
    if (availableCorrectMatches.length > 0) {
      const randomMatch = availableCorrectMatches[Math.floor(Math.random() * availableCorrectMatches.length)];
      
      // Xóa ghép sai nếu có
      setMatches(prev => prev.filter(m => 
        m.characterId !== randomMatch.characterId && m.eventId !== randomMatch.eventId
      ));
      
      // Thêm ghép đúng
      setMatches(prev => [...prev, randomMatch]);
      setRevealedMatches(prev => [...prev, randomMatch.characterId]);
    }
  };

  // Trộn lại vị trí
  const handleShuffle = () => {
    if (showResults) return;
    
    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    const shuffledEvents = [...events].sort(() => Math.random() - 0.5);
    
    setCharacters(shuffledCharacters);
    setEvents(shuffledEvents);
  };

  // Đặt lại tất cả
  const handleReset = () => {
    if (showResults) return;
    setMatches([]);
    setSelectedCharacter(null);
    setSelectedEvent(null);
  };

  // Nộp bài
  const handleSubmit = () => {
    setShowResults(true);
    onSubmitAnswer(matches);
    
    // Gọi onGameFinish để notify game completed
    if (onGameFinish) {
      const finalScore = calculateScore();
      onGameFinish(finalScore);
    }
  };

  // Tính điểm
  const calculateScore = () => {
    let score = 0;
    let correctCount = 0;
    
    matches.forEach(match => {
      const isCorrect = correctMatches.some(cm => 
        cm.characterId === match.characterId && cm.eventId === match.eventId
      );
      if (isCorrect) {
        correctCount++;
        score += 40; // 40 điểm cho mỗi cặp đúng
      }
    });
    
    // Bonus nếu đúng tất cả
    if (correctCount === correctMatches.length) {
      score += 100;
    }
    
    // Bonus thời gian
    score += Math.max(0, timeRemaining * 2);
    
    // Trừ điểm sử dụng gợi ý
    score -= hintsUsed * 20;
    
    return Math.max(0, score);
  };

  // Kiểm tra match có đúng không
  const isMatchCorrect = (match: { characterId: string; eventId: string }) => {
    return correctMatches.some(cm => 
      cm.characterId === match.characterId && cm.eventId === match.eventId
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Character Matching</h1>
              <p className="text-blue-200">Ghép nhân vật lịch sử với sự kiện tương ứng</p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className={`text-xl font-bold ${
                  timeRemaining <= 20 ? 'text-red-400' : 'text-white'
                }`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-2">
                <Link2 className="w-5 h-5 text-purple-300" />
                <span className="text-white font-bold">{matches.length}/5</span>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{currentPlayer.score}</span>
              </div>

              {/* Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={handleUseHint}
                  disabled={!canUseHint || hintsUsed >= 2 || showResults}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 disabled:text-gray-400 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  <span>Gợi ý ({2 - hintsUsed})</span>
                </button>
                
                <button
                  onClick={handleShuffle}
                  disabled={showResults}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-gray-500/20 text-blue-400 disabled:text-gray-400 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Trộn</span>
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={showResults}
                  className="px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 disabled:bg-gray-500/10 text-gray-300 disabled:text-gray-500 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Characters */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Users2 className="w-5 h-5" />
              <span>Nhân Vật</span>
            </h2>
            
            <div className="space-y-3">
              {characters.map((character) => {
                const isMatched = isCharacterMatched(character.id);
                const isSelected = selectedCharacter === character.id;
                const isRevealed = revealedMatches.includes(character.id);
                
                return (
                  <motion.div
                    key={character.id}
                    onClick={() => handleSelectCharacter(character.id)}
                    whileHover={!isMatched && !showResults ? { scale: 1.02 } : {}}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isMatched ? 'border-green-500 bg-green-500/20 cursor-not-allowed' :
                      isSelected ? 'border-blue-500 bg-blue-500/20' :
                      'border-white/20 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {character.name.split(' ').map(n => n.charAt(0)).join('').slice(-2)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-bold">{character.name}</h3>
                          {isRevealed && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-blue-200 text-sm">{character.role}</p>
                        <p className="text-blue-300 text-xs">
                          {character.birthYear} - {character.deathYear || 'Hiện tại'}
                        </p>
                      </div>
                      
                      {isMatched && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Matches */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Link2 className="w-5 h-5" />
              <span>Kết Nối ({matches.length}/5)</span>
            </h2>
            
            <div className="space-y-3 min-h-[400px]">
              <AnimatePresence>
                {matches.map((match, index) => {
                  const character = characters.find(c => c.id === match.characterId);
                  const event = events.find(e => e.id === match.eventId);
                  const isCorrect = showResults && isMatchCorrect(match);
                  const isWrong = showResults && !isMatchCorrect(match);
                  
                  if (!character || !event) return null;
                  
                  return (
                    <motion.div
                      key={`${match.characterId}-${match.eventId}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isCorrect ? 'border-green-500 bg-green-500/20' :
                        isWrong ? 'border-red-500 bg-red-500/20' :
                        'border-purple-500 bg-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-bold">Cặp {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {showResults && (
                            isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )
                          )}
                          {!showResults && (
                            <button
                              onClick={() => removeMatch(match.characterId, match.eventId)}
                              className="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-white text-sm font-medium">{character.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-blue-200 text-sm">{event.name} ({event.year})</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {matches.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-lg">
                  <div className="text-center">
                    <Link2 className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                    <p className="text-blue-300">Chọn nhân vật và sự kiện để ghép</p>
                  </div>
                </div>
              )}
              
              {matches.length === 5 && !showResults && (
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Nộp bài
                </button>
              )}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Sự Kiện</h2>
            
            <div className="space-y-3">
              {events.map((event) => {
                const isMatched = isEventMatched(event.id);
                const isSelected = selectedEvent === event.id;
                
                return (
                  <motion.div
                    key={event.id}
                    onClick={() => handleSelectEvent(event.id)}
                    whileHover={!isMatched && !showResults ? { scale: 1.02 } : {}}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isMatched ? 'border-green-500 bg-green-500/20 cursor-not-allowed' :
                      isSelected ? 'border-blue-500 bg-blue-500/20' :
                      'border-white/20 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {event.year}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">{event.name}</h3>
                        <p className="text-blue-200 text-sm mb-2">{event.description}</p>
                        <span className="text-blue-300 text-xs px-2 py-1 bg-blue-500/20 rounded">
                          {event.type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {isMatched && (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
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
                    matches.every(m => isMatchCorrect(m)) && matches.length === 5 ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {matches.every(m => isMatchCorrect(m)) && matches.length === 5 ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <XCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {matches.every(m => isMatchCorrect(m)) && matches.length === 5 ? 'Hoàn hảo!' : 'Hoàn thành!'}
                  </h3>
                  
                  <p className="text-blue-200 mb-4">
                    Bạn đã ghép đúng {matches.filter(m => isMatchCorrect(m)).length}/{matches.length} cặp
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
