import { NextRequest, NextResponse } from 'next/server';

// Map regions for conquest game
const mapRegions = [
  { id: 'hanoi', name: 'Hà Nội', x: 21.0285, y: 105.8542, difficulty: 'medium' },
  { id: 'haiphong', name: 'Hải Phòng', x: 20.8449, y: 106.6881, difficulty: 'easy' },
  { id: 'danang', name: 'Đà Nẵng', x: 16.0471, y: 108.2068, difficulty: 'hard' },
  { id: 'hue', name: 'Huế', x: 16.4637, y: 107.5909, difficulty: 'medium' },
  { id: 'saigon', name: 'Sài Gòn', x: 10.8231, y: 106.6297, difficulty: 'hard' },
  { id: 'cantho', name: 'Cần Thơ', x: 10.0452, y: 105.7469, difficulty: 'easy' },
  { id: 'nhatrang', name: 'Nha Trang', x: 12.2388, y: 109.1967, difficulty: 'medium' },
  { id: 'vungtau', name: 'Vũng Tàu', x: 10.4113, y: 107.1365, difficulty: 'easy' }
];

// Historical questions for conquest
const conquestQuestions = [
  {
    id: 'conquest-001',
    region: 'danang',
    question: 'Năm 1858, ai là tướng chỉ huy liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng?',
    options: ['Rigault de Genouilly', 'Courbet', 'Dupuis', 'Garnier'],
    correctAnswer: 0,
    points: 300
  },
  {
    id: 'conquest-002',
    region: 'saigon',
    question: 'Sài Gòn bị Pháp chiếm vào năm nào?',
    options: ['1858', '1859', '1861', '1862'],
    correctAnswer: 1,
    points: 250
  },
  {
    id: 'conquest-003',
    region: 'hanoi',
    question: 'Pháp chiếm Hà Nội lần đầu vào năm nào?',
    options: ['1873', '1874', '1882', '1883'],
    correctAnswer: 0,
    points: 200
  },
  {
    id: 'conquest-004',
    region: 'hue',
    question: 'Kinh thành Huế bị Pháp chiếm vào năm nào?',
    options: ['1883', '1884', '1885', '1886'],
    correctAnswer: 0,
    points: 300
  },
  {
    id: 'conquest-005',
    region: 'haiphong',
    question: 'Pháp thành lập đô hộ phủ Bắc Kỳ với trung tâm ở đâu?',
    options: ['Hà Nội', 'Hải Phòng', 'Nam Định', 'Thái Nguyên'],
    correctAnswer: 0,
    points: 150
  }
];

interface MapConquestData {
  regions: typeof mapRegions;
  playerTerritories: { [playerId: string]: string[] };
  currentTurn: string;
  turnOrder: string[];
  questions: typeof conquestQuestions;
  gamePhase: 'setup' | 'conquest' | 'finished';
  roundNumber: number;
}

interface ConquestAnswer {
  playerId: string;
  regionId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

// Generate map conquest game
function generateMapConquest(players: string[]): MapConquestData {
  const playerTerritories: { [playerId: string]: string[] } = {};
  
  // Each player starts with no territories
  players.forEach(playerId => {
    playerTerritories[playerId] = [];
  });

  return {
    regions: mapRegions,
    playerTerritories,
    currentTurn: players[0],
    turnOrder: [...players],
    questions: conquestQuestions,
    gamePhase: 'conquest',
    roundNumber: 1
  };
}

// Calculate conquest score
function calculateConquestScore(
  answer: ConquestAnswer,
  basePoints: number,
  timeLimit: number
): number {
  if (!answer.isCorrect) return 0;
  
  const { timeSpent } = answer;
  
  // Time bonus (faster = more points)
  const timeBonus = Math.max(0, (timeLimit - timeSpent) / timeLimit) * basePoints * 0.3;
  
  return Math.round(basePoints + timeBonus);
}

// START MAP CONQUEST
export async function POST(request: NextRequest) {
  try {
    const { roomId, players } = await request.json();
    
    if (!roomId || !players || players.length < 2) {
      return NextResponse.json(
        { error: 'Cần ít nhất 2 người chơi' },
        { status: 400 }
      );
    }

    const conquestData = generateMapConquest(players);
    
    return NextResponse.json({
      roomId,
      conquestData,
      message: 'Map conquest đã được khởi tạo'
    });

  } catch (error) {
    console.error('Lỗi tạo map conquest:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// ATTACK REGION
export async function PUT(request: NextRequest) {
  try {
    const { 
      roomId, 
      playerId, 
      regionId,
      questionId,
      selectedAnswer,
      timeSpent,
      startTime
    } = await request.json();

    if (!roomId || !playerId || !regionId || !questionId || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Find the question
    const question = conquestQuestions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const actualTimeSpent = timeSpent || (Date.now() - startTime) / 1000;

    const answer: ConquestAnswer = {
      playerId,
      regionId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent: actualTimeSpent,
      pointsEarned: 0
    };

    if (isCorrect) {
      answer.pointsEarned = calculateConquestScore(answer, question.points, 30);
    }

    // Determine if region is conquered
    const regionConquered = isCorrect;
    
    const results = {
      playerId,
      regionId,
      regionName: mapRegions.find(r => r.id === regionId)?.name || regionId,
      isCorrect,
      regionConquered,
      pointsEarned: answer.pointsEarned,
      correctAnswer: question.correctAnswer,
      selectedAnswer,
      timeSpent: actualTimeSpent,
      explanation: getConquestExplanation(questionId)
    };

    return NextResponse.json({
      results,
      message: regionConquered ? 'Chiếm đất thành công!' : 'Tấn công thất bại!'
    });

  } catch (error) {
    console.error('Lỗi tấn công vùng đất:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// GET REGION QUESTION
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');
    
    if (!regionId) {
      return NextResponse.json(
        { error: 'Region ID là bắt buộc' },
        { status: 400 }
      );
    }

    // Find questions for this region
    const regionQuestions = conquestQuestions.filter(q => q.region === regionId);
    
    if (regionQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Không có câu hỏi cho vùng này' },
        { status: 404 }
      );
    }

    // Randomly select a question
    const question = regionQuestions[Math.floor(Math.random() * regionQuestions.length)];
    
    return NextResponse.json({
      question: {
        ...question,
        timeLimit: 30 // 30 seconds per question
      }
    });

  } catch (error) {
    console.error('Lỗi lấy câu hỏi vùng đất:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// UPDATE GAME STATE
export async function PATCH(request: NextRequest) {
  try {
    const { 
      roomId, 
      playerId, 
      regionId, 
      conquered,
      nextPlayerId
    } = await request.json();

    if (!roomId || !playerId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // In a real implementation, update the game state in database/memory
    // This would include:
    // - Adding region to player's territories if conquered
    // - Switching to next player's turn
    // - Checking for game end conditions

    const gameUpdate = {
      regionConquered: conquered,
      newOwner: conquered ? playerId : null,
      nextTurn: nextPlayerId,
      roundNumber: 1, // Would increment based on game logic
      gamePhase: 'conquest' as const
    };

    return NextResponse.json({
      gameUpdate,
      message: 'Trạng thái game đã được cập nhật'
    });

  } catch (error) {
    console.error('Lỗi cập nhật game state:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// Get conquest explanation
function getConquestExplanation(questionId: string): string {
  const explanations: { [key: string]: string } = {
    'conquest-001': 'Đô đốc Rigault de Genouilly chỉ huy liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng ngày 1/9/1858.',
    'conquest-002': 'Pháp chiếm Sài Gòn năm 1859, sau khi tấn công Đà Nẵng không thành công.',
    'conquest-003': 'Pháp chiếm Hà Nội lần đầu năm 1873 dưới sự chỉ huy của Francis Garnier.',
    'conquest-004': 'Kinh thành Huế bị Pháp chiếm năm 1883 sau Hiệp ước Harmand.',
    'conquest-005': 'Pháp đặt trung tâm đô hộ phủ Bắc Kỳ tại Hà Nội sau khi chiếm được thành phố này.'
  };
  
  return explanations[questionId] || 'Chưa có giải thích cho câu hỏi này.';
}
