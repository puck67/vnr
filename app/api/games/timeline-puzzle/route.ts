import { NextRequest, NextResponse } from 'next/server';
import { TimelinePuzzleData, TimelineEvent, TimelinePuzzleAnswer } from '@/types';
import eventsData from '@/data/events.json';

// Generate timeline puzzle data
function generateTimelinePuzzle(difficulty: 'easy' | 'medium' | 'hard', round: number): TimelinePuzzleData {
  const allEvents = eventsData as any[];
  
  // Select number of events based on difficulty
  const eventCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  
  // Randomly select events
  const selectedEvents = allEvents
    .sort(() => Math.random() - 0.5)
    .slice(0, eventCount)
    .map(event => ({
      id: event.id,
      name: event.name,
      year: event.date.year,
      month: event.date.month,
      day: event.date.day,
      description: event.shortDescription || event.description
    }));

  return {
    events: selectedEvents,
    currentRound: round,
    roundStartTime: Date.now()
  };
}

// Calculate score for timeline puzzle
function calculateTimelineScore(
  answer: TimelinePuzzleAnswer,
  correctOrder: string[],
  timeLimit: number
): number {
  const { orderedEventIds, submitTime } = answer;
  
  // Calculate position accuracy
  let correctPositions = 0;
  for (let i = 0; i < orderedEventIds.length; i++) {
    if (orderedEventIds[i] === correctOrder[i]) {
      correctPositions++;
    }
  }
  
  const accuracy = correctPositions / correctOrder.length;
  
  // Time bonus (faster = more points)
  const timeUsed = (Date.now() - submitTime) / 1000;
  const timeBonus = Math.max(0, (timeLimit - timeUsed) / timeLimit);
  
  // Base score: accuracy * 1000, time bonus: up to 200 extra
  const baseScore = accuracy * 1000;
  const bonus = timeBonus * 200;
  
  return Math.round(baseScore + bonus);
}

// START TIMELINE PUZZLE
export async function POST(request: NextRequest) {
  try {
    const { roomId, difficulty = 'medium', round = 1 } = await request.json();
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID là bắt buộc' },
        { status: 400 }
      );
    }

    const puzzleData = generateTimelinePuzzle(difficulty, round);
    
    // Shuffle events for display (players need to reorder them)
    const shuffledEvents = [...puzzleData.events].sort(() => Math.random() - 0.5);
    
    return NextResponse.json({
      roomId,
      puzzleData: {
        ...puzzleData,
        events: shuffledEvents
      },
      message: 'Timeline puzzle đã được tạo'
    });

  } catch (error) {
    console.error('Lỗi tạo timeline puzzle:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// SUBMIT TIMELINE ANSWER
export async function PUT(request: NextRequest) {
  try {
    const { 
      roomId, 
      playerId, 
      orderedEventIds, 
      startTime,
      timeLimit = 60
    } = await request.json();

    if (!roomId || !playerId || !orderedEventIds) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Get correct order (sorted by date)
    const allEvents = eventsData as any[];
    const correctOrder = orderedEventIds
      .map((id: string) => {
        const event = allEvents.find(e => e.id === id);
        return event ? { id, date: new Date(event.date.year, event.date.month - 1, event.date.day) } : null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
      .map((item: any) => item.id);

    const answer: TimelinePuzzleAnswer = {
      playerId,
      orderedEventIds,
      submitTime: startTime,
      score: 0
    };

    const score = calculateTimelineScore(answer, correctOrder, timeLimit);
    answer.score = score;

    // Calculate detailed results
    const results = {
      playerId,
      score,
      correctOrder,
      playerOrder: orderedEventIds,
      accuracy: orderedEventIds.filter((id: string, index: number) => id === correctOrder[index]).length / correctOrder.length,
      timeUsed: (Date.now() - startTime) / 1000,
      isCorrect: JSON.stringify(orderedEventIds) === JSON.stringify(correctOrder)
    };

    return NextResponse.json({
      results,
      message: 'Đã nộp bài thành công'
    });

  } catch (error) {
    console.error('Lỗi nộp bài timeline puzzle:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
