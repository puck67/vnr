export interface GameRoom {
  id: string;
  roomCode?: string;
  name: string;
  gameType: 'timeline' | 'riddle-quest' | 'character-match' | 'trivia';
  hostId: string;
  hostName: string;
  players: GamePlayer[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  settings: GameSettings;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  currentRound?: number;
  totalRounds?: number;
  gameData?: any;
}

export interface GamePlayer {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  joinedAt: number;
  achievements: Achievement[];
  isFinished?: boolean;
  finishedAt?: number;
}

export interface GameSettings {
  timeLimit: number; // giây cho mỗi câu/round
  totalRounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  enablePowerUps: boolean;
  maxPlayers?: number; // số người tối đa
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
}

export interface GameQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: number | string;
  timeLimit: number;
  points: number;
  explanation?: string;
  relatedEventId?: string;
  relatedCharacterId?: string;
}

export interface TimelinePuzzle extends GameQuestion {
  events: TimelineEvent[];
  correctOrder: string[];
}

export interface TimelineEvent {
  id: string;
  name: string;
  year: number;
  description: string;
  imageUrl?: string;
}

export interface MapConquest {
  id: string;
  regionName: string;
  provinces: Province[];
  question: GameQuestion;
  conquered: boolean;
  conqueredBy?: string;
}

export interface Province {
  id: string;
  name: string;
  coordinates: [number, number];
  difficulty: number;
  points: number;
}

export interface CharacterMatch extends GameQuestion {
  characters: HistoricalCharacter[];
  events: HistoricalEvent[];
  correctPairs: CharacterEventPair[];
}

export interface CharacterEventPair {
  characterId: string;
  eventId: string;
}

export interface HistoricalCharacter {
  id: string;
  name: string;
  avatar: string;
  birthYear: number;
  deathYear?: number;
  role: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  year: number;
  type: string;
  description: string;
}

export interface TriviaQuestion extends GameQuestion {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentQuestion?: GameQuestion;
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  playerAnswers: PlayerAnswer[];
  leaderboard: GamePlayer[];
}

export interface PlayerAnswer {
  playerId: string;
  answer: string | number | string[];
  submittedAt: number;
  isCorrect: boolean;
  points: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'skip-question' | 'double-points' | 'freeze-time' | 'hint' | 'eliminate-options';
  duration?: number;
  cost: number;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  totalScore: number;
  averageScore: number;
  achievements: Achievement[];
  rank: number;
  experience: number;
  level: number;
}
