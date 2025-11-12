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

