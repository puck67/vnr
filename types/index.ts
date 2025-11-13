// Loại sự kiện lịch sử
export type EventType = 'uprising' | 'movement' | 'political_event';

// Vùng miền
export type Region = 'bac_ky' | 'trung_ky' | 'nam_ky';

// Tọa độ địa lý
export type Coordinates = [number, number]; // [latitude, longitude]

// Thông tin ngày tháng
export interface DateInfo {
  year: number;
  month?: number;
  day?: number;
}

// Vị trí địa lý
export interface Location {
  name: string;
  coordinates: Coordinates;
  region: Region;
}

// Nội dung chi tiết sự kiện
export interface EventContent {
  causes: string;        // Nguyên nhân
  events: string;        // Diễn biến
  results: string;       // Kết quả
  significance: string;  // Ý nghĩa
}

// Điểm trong hành trình của nhân vật
export interface JourneyPoint {
  eventId: string;
  year: number;
  location: Coordinates;
  description: string;
}

// Sự kiện lịch sử
export interface HistoricalEvent {
  id: string;
  name: string;
  type: EventType;
  date: DateInfo;
  location: Location;
  shortDescription: string;
  fullContent: EventContent;
  images: string[];
  relatedCharacters: string[];  // IDs của nhân vật
  relatedEvents: string[];      // IDs của sự kiện liên quan
  funFacts: string[];
  sources: string[];
  videoUrl?: string;            // Link video tài liệu (VTV, YouTube...)
  narrationText?: string;       // Nội dung thuyết minh AI voice
  animationSteps?: AnimationStep[]; // Các bước diễn biến chi tiết
}

// Animation step cho bản đồ
export interface AnimationStep {
  time: string;               // Thời gian (VD: "Rạng sáng 1/9/1858")
  title: string;              // Tiêu đề bước
  description: string;        // Mô tả chi tiết
  location: [number, number]; // Tọa độ trọng tâm
  zoom?: number;              // Mức zoom (mặc định 13)
  markers?: Array<{           // Các marker hiển thị
    position: [number, number];
    label: string;
    type: 'attack' | 'defend' | 'base' | 'route';
  }>;
  paths?: Array<{             // Đường di chuyển
    coordinates: [number, number][];
    color: string;
    label: string;
  }>;
}

// Nhân vật lịch sử
export interface Character {
  id: string;
  name: string;
  avatar: string;
  birthYear: number;
  deathYear?: number;
  biography: string;
  role: string;
  achievements: string[];
  relatedEvents: string[];
  journey: JourneyPoint[];
}

// Tin nhắn chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Chế độ chatbot
export type ChatMode = 'quick' | 'detailed';

// Câu hỏi quiz
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;  // Index của đáp án đúng
  explanation: string;
  relatedEventId?: string;
}

// Kết quả quiz
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;  // Phần trăm
}

// Câu trả lời của user trong quiz
export interface QuizAnswer {
  questionId: string;
  questionText: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizHistory {
  id: string;
  eventId: string;
  eventName: string;
  answers: QuizAnswer[];
  result: QuizResult;
  completedAt: string; // ISO date
  timeTaken: number; // total seconds
}

// Mini Games types
export type GameType = 'timeline-puzzle' | 'map-conquest' | 'character-matching' | 'historical-trivia';

export interface GameRoom {
  id: string;
  code: string; // 6-digit room code
  gameType: GameType;
  hostId: string;
  players: GamePlayer[];
  status: 'waiting' | 'playing' | 'finished';
  settings: GameSettings;
  gameData: any; // Specific to each game type
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface GamePlayer {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  joinedAt: string;
}

export interface GameSettings {
  maxPlayers: number;
  timeLimit: number; // seconds per question/round
  difficulty: 'easy' | 'medium' | 'hard';
  rounds: number;
}

// Timeline Puzzle Game
export interface TimelinePuzzleData {
  events: TimelineEvent[];
  currentRound: number;
  roundStartTime: number;
}

export interface TimelineEvent {
  id: string;
  name: string;
  year: number;
  month: number;
  day: number;
  description: string;
}

export interface TimelinePuzzleAnswer {
  playerId: string;
  orderedEventIds: string[];
  submitTime: number;
  score: number;
}

// Character Matching Game  
export interface CharacterMatchingData {
  pairs: CharacterEventPair[];
  currentRound: number;
  roundStartTime: number;
}

export interface CharacterEventPair {
  characterId: string;
  characterName: string;
  eventId: string;
  eventName: string;
  isCorrect: boolean;
}

export interface CharacterMatchingAnswer {
  playerId: string;
  matches: { characterId: string; eventId: string }[];
  submitTime: number;
  score: number;
}

// Historical Trivia Game
export interface HistoricalTriviaData {
  questions: TriviaQuestion[];
  currentQuestionIndex: number;
  questionStartTime: number;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface TriviaAnswer {
  playerId: string;
  questionId: string;
  selectedAnswer: number;
  submitTime: number;
  timeSpent: number;
  isCorrect: boolean;
  points: number;
}

// Game Results & Leaderboard
export interface GameResult {
  roomId: string;
  gameType: GameType;
  players: PlayerResult[];
  duration: number;
  completedAt: string;
}

export interface PlayerResult {
  playerId: string;
  playerName: string;
  finalScore: number;
  rank: number;
  badges: Badge[];
  pointsEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

// Leaderboard
export interface Leaderboard {
  gameType: GameType;
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  avatar?: string;
  totalScore: number;
  gamesPlayed: number;
  winRate: number;
  badges: Badge[];
}

// Dữ liệu Q&A cho chatbot
export interface ChatbotQA {
  id: string;
  keywords: string[];
  question: string;
  quickAnswer: string;
  detailedAnswer: string;
  relatedEventIds?: string[];
  relatedCharacterIds?: string[];
}

// Filter options cho bản đồ
export interface MapFilters {
  eventTypes: EventType[];
  regions: Region[];
  yearRange: [number, number];
  characterId?: string;
}

// Props cho marker
export interface MarkerData {
  event: HistoricalEvent;
  isHighlighted?: boolean;
  onClick?: () => void;
}

