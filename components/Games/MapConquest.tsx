'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Flag, Users, Trophy, Clock, Target, 
  Sword, Shield, Star, Crown, Zap, RotateCcw
} from 'lucide-react';
import { GamePlayer, GameState } from '@/types/games';

interface MapConquestProps {
  gameState: GameState;
  currentPlayer: GamePlayer;
  allPlayers?: GamePlayer[];
  onSubmitAnswer: (territoryId: string) => void;
  onUseHint: () => void;
  canUseHint: boolean;
  onGameFinish?: (finalScore: number) => void;
  onShowResults?: (room: any) => void;
}

// Mock territories data
const territories = [
  { id: 'hanoi', name: 'Hà Nội', x: 20, y: 15, points: 50, difficulty: 'hard' },
  { id: 'hue', name: 'Huế', x: 45, y: 40, points: 40, difficulty: 'medium' },
  { id: 'danang', name: 'Đà Nẵng', x: 50, y: 45, points: 35, difficulty: 'medium' },
  { id: 'saigon', name: 'Sài Gòn', x: 40, y: 75, points: 45, difficulty: 'hard' },
  { id: 'haiphong', name: 'Hải Phòng', x: 25, y: 20, points: 30, difficulty: 'easy' },
  { id: 'cantho', name: 'Cần Thơ', x: 35, y: 80, points: 25, difficulty: 'easy' },
  { id: 'nhatrang', name: 'Nha Trang', x: 55, y: 60, points: 30, difficulty: 'easy' },
  { id: 'dalat', name: 'Đà Lạt', x: 50, y: 65, points: 35, difficulty: 'medium' },
];

// Mock historical events for each territory
const territoryEvents = {
  'hanoi': { 
    event: 'Khởi nghĩa Yên Thế (1884-1913)', 
    description: 'Căn cứ kháng Pháp của Hoàng Hoa Thám' 
  },
  'hue': { 
    event: 'Khởi nghĩa Cần Vương (1885)', 
    description: 'Trung tâm phong trào Cần Vương chống Pháp' 
  },
  'danang': { 
    event: 'Pháp đổ bộ Đà Nẵng (1858)', 
    description: 'Điểm khởi đầu cuộc xâm lược của Pháp' 
  },
  'saigon': { 
    event: 'Khởi nghĩa Nam Kỳ (1862-1863)', 
    description: 'Phong trào kháng chiến ở miền Nam' 
  },
  'haiphong': { 
    event: 'Trận Hải Phòng (1946)', 
    description: 'Khởi đầu cuộc kháng chiến toàn quốc' 
  },
  'cantho': { 
    event: 'Khởi nghĩa Bạc Liêu (1916)', 
    description: 'Phong trào chống thuế ở miền Tây' 
  },
  'nhatrang': { 
    event: 'Phong trào Đông Du (1905)', 
    description: 'Trung tâm hoạt động của Phan Bội Châu' 
  },
  'dalat': { 
    event: 'Hội nghị Đà Lạt (1946)', 
    description: 'Đàm phán giữa Việt Minh và Pháp' 
  }
};

export default function MapConquest({ 
  gameState, 
  currentPlayer, 
  allPlayers,
  onSubmitAnswer, 
  onUseHint,
  canUseHint,
  onGameFinish,
  onShowResults
}: MapConquestProps) {
  const [conqueredTerritories, setConqueredTerritories] = useState<string[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes per round
  const [currentRound, setCurrentRound] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [playerStats, setPlayerStats] = useState({
    totalPoints: 0,
    territoriesConquered: 0,
    efficiency: 0
  });

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleFinishRound();
    }
  }, [timeRemaining, showResults]);

  const handleTerritoryClick = (territoryId: string) => {
    if (conqueredTerritories.includes(territoryId) || showResults) return;
    
    setSelectedTerritory(territoryId);
    
    // Simulate conquest attempt (in real game, this would be based on quiz/challenge)
    const territory = territories.find(t => t.id === territoryId);
    if (territory) {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setConqueredTerritories(prev => [...prev, territoryId]);
        setPlayerStats(prev => ({
          totalPoints: prev.totalPoints + territory.points,
          territoriesConquered: prev.territoriesConquered + 1,
          efficiency: Math.round(((prev.territoriesConquered + 1) / territories.length) * 100)
        }));
        onSubmitAnswer(territoryId);
      }
    }
    
    setTimeout(() => setSelectedTerritory(null), 1500);
  };

  const handleUseHint = () => {
    if (!canUseHint || hintsUsed >= 3) return;
    
    setHintsUsed(prev => prev + 1);
    onUseHint();
    
    // Reveal one easy territory
    const easyTerritories = territories.filter(t => 
      t.difficulty === 'easy' && !conqueredTerritories.includes(t.id)
    );
    
    if (easyTerritories.length > 0) {
      const revealTerritory = easyTerritories[Math.floor(Math.random() * easyTerritories.length)];
      setConqueredTerritories(prev => [...prev, revealTerritory.id]);
      setPlayerStats(prev => ({
        totalPoints: prev.totalPoints + Math.floor(revealTerritory.points * 0.5), // Half points for hint
        territoriesConquered: prev.territoriesConquered + 1,
        efficiency: Math.round(((prev.territoriesConquered + 1) / territories.length) * 100)
      }));
    }
  };

  const handleFinishRound = () => {
    setShowResults(true);
    
    // Gọi onGameFinish để notify game completed
    if (onGameFinish) {
      onGameFinish(playerStats.totalPoints);
    }
  };

  const getTerritoryColor = (territory: any) => {
    if (conqueredTerritories.includes(territory.id)) {
      return 'bg-green-500 border-green-400';
    }
    if (selectedTerritory === territory.id) {
      return 'bg-yellow-500 border-yellow-400 animate-pulse';
    }
    switch (territory.difficulty) {
      case 'easy': return 'bg-blue-400 border-blue-300 hover:bg-blue-500';
      case 'medium': return 'bg-orange-400 border-orange-300 hover:bg-orange-500';
      case 'hard': return 'bg-red-400 border-red-300 hover:bg-red-500';
      default: return 'bg-gray-400 border-gray-300';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Shield;
      case 'medium': return Sword;
      case 'hard': return Crown;
      default: return Target;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Map Conquest</h1>
                <p className="text-blue-200">Chinh phục lãnh thổ Việt Nam</p>
              </div>
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

              {/* Round */}
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-300" />
                <span className="text-white font-bold">Vòng {currentRound}</span>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{playerStats.totalPoints}</span>
              </div>

              {/* Hints */}
              <button
                onClick={handleUseHint}
                disabled={!canUseHint || hintsUsed >= 3 || showResults}
                className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 disabled:text-gray-400 rounded-lg flex items-center space-x-1 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                <span>Gợi ý ({3 - hintsUsed})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Map className="w-5 h-5" />
                <span>Bản đồ Việt Nam (1858-1930)</span>
              </h2>
              
              {/* Vietnam Map SVG */}
              <div className="relative bg-green-100/10 rounded-xl p-8 min-h-[500px]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Vietnam outline (simplified) */}
                  <path
                    d="M30 10 L35 10 L40 15 L45 12 L50 15 L55 18 L50 25 L55 30 L50 35 L45 40 L50 45 L45 50 L40 55 L45 60 L50 65 L45 70 L40 75 L35 80 L30 75 L25 70 L30 65 L25 60 L30 55 L25 50 L30 45 L25 40 L30 35 L25 30 L30 25 L25 20 L30 15 Z"
                    fill="rgba(34, 197, 94, 0.2)"
                    stroke="rgba(34, 197, 94, 0.5)"
                    strokeWidth="0.5"
                  />
                  
                  {/* Territory markers */}
                  {territories.map((territory) => {
                    const DifficultyIcon = getDifficultyIcon(territory.difficulty);
                    const isConquered = conqueredTerritories.includes(territory.id);
                    const isSelected = selectedTerritory === territory.id;
                    
                    return (
                      <g key={territory.id}>
                        <circle
                          cx={territory.x}
                          cy={territory.y}
                          r="3"
                          className={`cursor-pointer transition-all duration-200 ${getTerritoryColor(territory)}`}
                          onClick={() => handleTerritoryClick(territory.id)}
                          fill={isConquered ? '#10b981' : isSelected ? '#eab308' : territory.difficulty === 'easy' ? '#3b82f6' : territory.difficulty === 'medium' ? '#f97316' : '#ef4444'}
                          stroke={isConquered ? '#059669' : '#ffffff'}
                          strokeWidth="0.5"
                        />
                        
                        {/* Territory label */}
                        <text
                          x={territory.x}
                          y={territory.y - 4}
                          className="text-xs fill-white font-bold pointer-events-none"
                          textAnchor="middle"
                        >
                          {territory.name}
                        </text>
                        
                        {/* Conquered flag */}
                        {isConquered && (
                          <text
                            x={territory.x + 4}
                            y={territory.y - 1}
                            className="text-sm fill-green-400 font-bold pointer-events-none"
                          >
                            🚩
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Player Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Thống kê</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Điểm số:</span>
                  <span className="text-2xl font-bold text-white">{playerStats.totalPoints}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Lãnh thổ:</span>
                  <span className="text-white font-bold">{playerStats.territoriesConquered}/{territories.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Hiệu quả:</span>
                  <span className="text-white font-bold">{playerStats.efficiency}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${playerStats.efficiency}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Territory Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Flag className="w-5 h-5" />
                <span>Lãnh thổ</span>
              </h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {territories.map((territory) => {
                  const isConquered = conqueredTerritories.includes(territory.id);
                  const event = territoryEvents[territory.id as keyof typeof territoryEvents];
                  
                  return (
                    <div
                      key={territory.id}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        isConquered 
                          ? 'border-green-500 bg-green-500/20' 
                          : 'border-white/20 bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{territory.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 font-bold">{territory.points}pts</span>
                          {isConquered && <Flag className="w-4 h-4 text-green-400" />}
                        </div>
                      </div>
                      
                      {isConquered && event && (
                        <div className="text-xs">
                          <p className="text-blue-200 font-medium">{event.event}</p>
                          <p className="text-blue-300">{event.description}</p>
                        </div>
                      )}
                      
                      {!isConquered && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          territory.difficulty === 'easy' ? 'bg-blue-500/20 text-blue-300' :
                          territory.difficulty === 'medium' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {territory.difficulty === 'easy' ? 'Dễ' :
                           territory.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleFinishRound}
              disabled={showResults}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Kết thúc vòng</span>
            </button>
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
                    playerStats.efficiency >= 75 ? 'bg-green-500' : 
                    playerStats.efficiency >= 50 ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {playerStats.efficiency >= 75 ? 'Xuất sắc!' : 
                     playerStats.efficiency >= 50 ? 'Tốt!' : 'Cần cố gắng!'}
                  </h3>
                  
                  <p className="text-blue-200 mb-4">
                    Bạn đã chinh phục {playerStats.territoriesConquered}/{territories.length} lãnh thổ
                  </p>
                  
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200">Tổng điểm:</span>
                      <span className="text-2xl font-bold text-white">+{playerStats.totalPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Hiệu quả:</span>
                      <span className="text-white font-bold">{playerStats.efficiency}%</span>
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
