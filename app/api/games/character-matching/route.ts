import { NextRequest, NextResponse } from 'next/server';
import { CharacterMatchingData, CharacterEventPair, CharacterMatchingAnswer } from '@/types';
import eventsData from '@/data/events.json';
import charactersData from '@/data/characters.json';

// Generate character matching pairs
function generateCharacterMatching(difficulty: 'easy' | 'medium' | 'hard', round: number): CharacterMatchingData {
  const allEvents = eventsData as any[];
  const allCharacters = charactersData as any[];
  
  // Number of pairs based on difficulty
  const pairCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
  
  const pairs: CharacterEventPair[] = [];
  const usedCharacters = new Set<string>();
  const usedEvents = new Set<string>();

  // Create correct pairs
  for (let i = 0; i < pairCount; i++) {
    const character = allCharacters.find(c => 
      !usedCharacters.has(c.id) && 
      c.relatedEvents && 
      c.relatedEvents.length > 0
    );
    
    if (!character) continue;
    
    const relatedEventId = character.relatedEvents[Math.floor(Math.random() * character.relatedEvents.length)];
    const event = allEvents.find(e => e.id === relatedEventId && !usedEvents.has(e.id));
    
    if (event) {
      pairs.push({
        characterId: character.id,
        characterName: character.name,
        eventId: event.id,
        eventName: event.name,
        isCorrect: true
      });
      
      usedCharacters.add(character.id);
      usedEvents.add(event.id);
    }
  }

  // Add some wrong pairs to confuse players
  const wrongPairCount = Math.min(2, pairCount);
  for (let i = 0; i < wrongPairCount; i++) {
    const character = allCharacters.find(c => !usedCharacters.has(c.id));
    const event = allEvents.find(e => !usedEvents.has(e.id));
    
    if (character && event) {
      pairs.push({
        characterId: character.id,
        characterName: character.name,
        eventId: event.id,
        eventName: event.name,
        isCorrect: false
      });
      
      usedCharacters.add(character.id);
      usedEvents.add(event.id);
    }
  }

  return {
    pairs: pairs.sort(() => Math.random() - 0.5), // Shuffle
    currentRound: round,
    roundStartTime: Date.now()
  };
}

// Calculate score for character matching
function calculateMatchingScore(
  answer: CharacterMatchingAnswer,
  correctPairs: CharacterEventPair[],
  timeLimit: number
): number {
  const { matches, submitTime } = answer;
  
  let correctMatches = 0;
  let wrongMatches = 0;
  
  matches.forEach(match => {
    const correctPair = correctPairs.find(pair => 
      pair.characterId === match.characterId && 
      pair.eventId === match.eventId &&
      pair.isCorrect
    );
    
    if (correctPair) {
      correctMatches++;
    } else {
      wrongMatches++;
    }
  });
  
  const accuracy = matches.length > 0 ? correctMatches / matches.length : 0;
  const totalCorrect = correctPairs.filter(p => p.isCorrect).length;
  const completeness = correctMatches / totalCorrect;
  
  // Time bonus
  const timeUsed = (Date.now() - submitTime) / 1000;
  const timeBonus = Math.max(0, (timeLimit - timeUsed) / timeLimit);
  
  // Base score: (accuracy + completeness) * 500, penalty for wrong matches, time bonus up to 200
  const baseScore = ((accuracy + completeness) / 2) * 500;
  const penalty = wrongMatches * 50; // -50 per wrong match
  const bonus = timeBonus * 200;
  
  return Math.max(0, Math.round(baseScore - penalty + bonus));
}

// START CHARACTER MATCHING
export async function POST(request: NextRequest) {
  try {
    const { roomId, difficulty = 'medium', round = 1 } = await request.json();
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID là bắt buộc' },
        { status: 400 }
      );
    }

    const matchingData = generateCharacterMatching(difficulty, round);
    
    // Separate characters and events for UI
    const characters = Array.from(new Set(matchingData.pairs.map(p => ({ id: p.characterId, name: p.characterName }))))
      .sort(() => Math.random() - 0.5);
    const events = Array.from(new Set(matchingData.pairs.map(p => ({ id: p.eventId, name: p.eventName }))))
      .sort(() => Math.random() - 0.5);
    
    return NextResponse.json({
      roomId,
      matchingData: {
        ...matchingData,
        characters,
        events
      },
      message: 'Character matching đã được tạo'
    });

  } catch (error) {
    console.error('Lỗi tạo character matching:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// SUBMIT CHARACTER MATCHING ANSWER
export async function PUT(request: NextRequest) {
  try {
    const { 
      roomId, 
      playerId, 
      matches,
      startTime,
      timeLimit = 60
    } = await request.json();

    if (!roomId || !playerId || !matches) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Get correct pairs (would normally be stored in room data)
    const allEvents = eventsData as any[];
    const allCharacters = charactersData as any[];
    
    const correctPairs: CharacterEventPair[] = [];
    matches.forEach((match: any) => {
      const character = allCharacters.find(c => c.id === match.characterId);
      const event = allEvents.find(e => e.id === match.eventId);
      
      if (character && event && character.relatedEvents?.includes(event.id)) {
        correctPairs.push({
          characterId: character.id,
          characterName: character.name,
          eventId: event.id,
          eventName: event.name,
          isCorrect: true
        });
      }
    });

    const answer: CharacterMatchingAnswer = {
      playerId,
      matches,
      submitTime: startTime,
      score: 0
    };

    // For scoring, we need all correct pairs (not just user's matches)
    const allCorrectPairs: CharacterEventPair[] = [];
    allCharacters.forEach((char: any) => {
      if (char.relatedEvents) {
        char.relatedEvents.forEach((eventId: string) => {
          const event = allEvents.find(e => e.id === eventId);
          if (event) {
            allCorrectPairs.push({
              characterId: char.id,
              characterName: char.name,
              eventId: event.id,
              eventName: event.name,
              isCorrect: true
            });
          }
        });
      }
    });

    const score = calculateMatchingScore(answer, allCorrectPairs, timeLimit);
    answer.score = score;

    // Calculate detailed results
    let correctMatches = 0;
    let wrongMatches = 0;
    
    matches.forEach((match: any) => {
      const character = allCharacters.find(c => c.id === match.characterId);
      if (character && character.relatedEvents?.includes(match.eventId)) {
        correctMatches++;
      } else {
        wrongMatches++;
      }
    });

    const results = {
      playerId,
      score,
      correctMatches,
      wrongMatches,
      totalMatches: matches.length,
      accuracy: matches.length > 0 ? correctMatches / matches.length : 0,
      timeUsed: (Date.now() - startTime) / 1000,
      details: matches.map((match: any) => {
        const character = allCharacters.find(c => c.id === match.characterId);
        const event = allEvents.find(e => e.id === match.eventId);
        const isCorrect = character && character.relatedEvents?.includes(match.eventId);
        
        return {
          characterName: character?.name || 'Unknown',
          eventName: event?.name || 'Unknown',
          isCorrect: !!isCorrect
        };
      })
    };

    return NextResponse.json({
      results,
      message: 'Đã nộp bài thành công'
    });

  } catch (error) {
    console.error('Lỗi nộp bài character matching:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
