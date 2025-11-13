import { NextRequest, NextResponse } from 'next/server';
import { HistoricalTriviaData, TriviaQuestion, TriviaAnswer } from '@/types';

// Trivia questions database
const triviaQuestions = [
  {
    id: 'trivia-001',
    question: 'Liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng vào năm nào?',
    options: ['1856', '1858', '1860', '1862'],
    correctAnswer: 1,
    category: 'Xâm lược',
    difficulty: 'easy',
    timeLimit: 15
  },
  {
    id: 'trivia-002', 
    question: 'Ai là người lãnh đạo phong trào Đông Du?',
    options: ['Phan Châu Trinh', 'Phan Bội Châu', 'Nguyễn Ái Quốc', 'Hoàng Hoa Thám'],
    correctAnswer: 1,
    category: 'Nhân vật',
    difficulty: 'medium',
    timeLimit: 20
  },
  {
    id: 'trivia-003',
    question: 'Phong trào Cần Vương được phát động bởi vua nào?',
    options: ['Tự Đức', 'Hàm Nghi', 'Đồng Khánh', 'Thành Thái'],
    correctAnswer: 1,
    category: 'Phong trào',
    difficulty: 'medium',
    timeLimit: 20
  },
  {
    id: 'trivia-004',
    question: 'Nguyễn Trung Trực đốt tàu chiến Pháp nào?',
    options: ['La Galissonnière', 'L\'Espérance', 'Duguay-Trouin', 'Primauguet'],
    correctAnswer: 1,
    category: 'Sự kiện',
    difficulty: 'hard',
    timeLimit: 25
  },
  {
    id: 'trivia-005',
    question: 'Khởi nghĩa Yên Thế do ai lãnh đạo?',
    options: ['Phan Đình Phùng', 'Hoàng Hoa Thám', 'Nguyễn Thiện Thuật', 'Trương Định'],
    correctAnswer: 1,
    category: 'Nhân vật',
    difficulty: 'easy',
    timeLimit: 15
  },
  {
    id: 'trivia-006',
    question: 'Đông Kinh Nghĩa Thục được thành lập vào năm nào?',
    options: ['1905', '1907', '1908', '1910'],
    correctAnswer: 1,
    category: 'Giáo dục',
    difficulty: 'medium',
    timeLimit: 20
  },
  {
    id: 'trivia-007',
    question: 'Hiệp ước Patenôtre được ký kết vào năm nào?',
    options: ['1882', '1883', '1884', '1885'],
    correctAnswer: 2,
    category: 'Hiệp ước',
    difficulty: 'hard',
    timeLimit: 25
  },
  {
    id: 'trivia-008',
    question: 'Ai được mệnh danh là "De Thám"?',
    options: ['Phan Đình Phùng', 'Hoàng Hoa Thám', 'Nguyễn Thiện Thuật', 'Trương Định'],
    correctAnswer: 1,
    category: 'Nhân vật',
    difficulty: 'easy',
    timeLimit: 15
  },
  {
    id: 'trivia-009',
    question: 'Phong trào Duy Tân có mục tiêu chính là gì?',
    options: ['Đuổi Pháp', 'Cải cách xã hội', 'Duy tân đất nước', 'Giải phóng dân tộc'],
    correctAnswer: 2,
    category: 'Phong trào',
    difficulty: 'medium',
    timeLimit: 20
  },
  {
    id: 'trivia-010',
    question: 'Thành lập Đảng Cộng sản Việt Nam vào năm nào?',
    options: ['1929', '1930', '1931', '1932'],
    correctAnswer: 1,
    category: 'Chính trị',
    difficulty: 'easy',
    timeLimit: 15
  }
];

// Generate trivia game
function generateHistoricalTrivia(difficulty: 'easy' | 'medium' | 'hard', rounds: number): HistoricalTriviaData {
  // Filter questions by difficulty
  const filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
  
  // If not enough questions of specific difficulty, mix with other difficulties
  let selectedQuestions = filteredQuestions.slice();
  if (selectedQuestions.length < rounds) {
    const otherQuestions = triviaQuestions.filter(q => q.difficulty !== difficulty);
    selectedQuestions = [...selectedQuestions, ...otherQuestions];
  }
  
  // Randomly select questions
  const gameQuestions = selectedQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, rounds)
    .map(q => ({ ...q } as TriviaQuestion));

  return {
    questions: gameQuestions,
    currentQuestionIndex: 0,
    questionStartTime: Date.now()
  };
}

// Calculate trivia score
function calculateTriviaScore(
  answer: TriviaAnswer,
  question: any,
  timeLimit: number = 30
): number {
  if (!answer.isCorrect) return 0;
  
  const { timeSpent } = answer;
  const { difficulty } = question;
  
  // Base points by difficulty
  const basePoints = {
    'easy': 100,
    'medium': 200,
    'hard': 300
  };
  
  const base = basePoints[difficulty as keyof typeof basePoints] || 100;
  
  // Time bonus (faster = more points)
  const timeBonus = Math.max(0, (timeLimit - timeSpent) / timeLimit) * base * 0.5;
  
  return Math.round(base + timeBonus);
}

// START TRIVIA GAME
export async function POST(request: NextRequest) {
  try {
    const { roomId, difficulty = 'medium', rounds = 5 } = await request.json();
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID là bắt buộc' },
        { status: 400 }
      );
    }

    const triviaData = generateHistoricalTrivia(difficulty, rounds);
    
    return NextResponse.json({
      roomId,
      triviaData,
      message: 'Historical trivia đã được tạo'
    });

  } catch (error) {
    console.error('Lỗi tạo trivia game:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// SUBMIT TRIVIA ANSWER
export async function PUT(request: NextRequest) {
  try {
    const { 
      roomId, 
      playerId, 
      questionId,
      selectedAnswer,
      timeSpent,
      startTime
    } = await request.json();

    if (!roomId || !playerId || !questionId || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Find the question
    const question = triviaQuestions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const actualTimeSpent = timeSpent || (Date.now() - startTime) / 1000;

    const answer: TriviaAnswer = {
      playerId,
      questionId,
      selectedAnswer,
      submitTime: Date.now(),
      timeSpent: actualTimeSpent,
      isCorrect,
      points: 0
    };

    if (isCorrect) {
      answer.points = calculateTriviaScore(answer, question, question.timeLimit || 30);
    }

    const results = {
      playerId,
      questionId,
      isCorrect,
      correctAnswer: question.correctAnswer,
      selectedAnswer,
      points: answer.points,
      timeSpent: actualTimeSpent,
      explanation: getQuestionExplanation(questionId)
    };

    return NextResponse.json({
      results,
      message: 'Đã trả lời câu hỏi'
    });

  } catch (error) {
    console.error('Lỗi nộp bài trivia:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// NEXT QUESTION
export async function PATCH(request: NextRequest) {
  try {
    const { roomId, currentQuestionIndex } = await request.json();
    
    if (!roomId || currentQuestionIndex === undefined) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const nextIndex = currentQuestionIndex + 1;
    
    return NextResponse.json({
      nextQuestionIndex: nextIndex,
      questionStartTime: Date.now(),
      message: 'Chuyển sang câu hỏi tiếp theo'
    });

  } catch (error) {
    console.error('Lỗi chuyển câu hỏi:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// Get question explanation
function getQuestionExplanation(questionId: string): string {
  const explanations: { [key: string]: string } = {
    'trivia-001': 'Ngày 1/9/1858, liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng, mở đầu cuộc xâm lược Việt Nam.',
    'trivia-002': 'Phan Bội Châu là người sáng lập và lãnh đạo phong trào Đông Du, đưa thanh niên sang Nhật Bản học tập.',
    'trivia-003': 'Vua Hàm Nghi ra chiếu Cần Vương tháng 7/1885, kêu gọi toàn dân đứng lên chống Pháp.',
    'trivia-004': 'Năm 1861, Nguyễn Trung Trực đốt cháy tàu chiến Pháp L\'Espérance tại sông Nhật Tảo.',
    'trivia-005': 'Hoàng Hoa Thám lãnh đạo khởi nghĩa Yên Thế từ 1884-1913, còn gọi là "Đề Đốc Hoàng Hoa Thám".',
    'trivia-006': 'Đông Kinh Nghĩa Thục được thành lập năm 1907 do Phan Châu Trinh và các nhà yêu nước khởi xướng.',
    'trivia-007': 'Hiệp ước Patenôtre ký năm 1884, Pháp công nhận chủ quyền của Trung Quốc tại Việt Nam.',
    'trivia-008': 'Hoàng Hoa Thám được mệnh danh là "De Thám", lãnh đạo khởi nghĩa Yên Thế chống Pháp.',
    'trivia-009': 'Phong trào Duy Tân nhằm duy tân đất nước, cải cách xã hội theo mô hình phương Tây.',
    'trivia-010': 'Đảng Cộng sản Việt Nam được thành lập ngày 3/2/1930 tại Hồng Kông do Nguyễn Ái Quốc sáng lập.'
  };
  
  return explanations[questionId] || 'Chưa có giải thích cho câu hỏi này.';
}
