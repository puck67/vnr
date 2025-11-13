import { NextRequest, NextResponse } from 'next/server';
import { Leaderboard, LeaderboardEntry, GameType, GameResult, PlayerResult, Badge } from '@/types';

// In-memory storage (in production, use database)
const gameResults = new Map<string, GameResult[]>(); // gameType -> results[]
const playerStats = new Map<string, {
  playerId: string;
  playerName: string;
  avatar?: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  badges: Badge[];
  lastPlayed: string;
}>();

// Badge definitions
const availableBadges: Badge[] = [
  {
    id: 'first_win',
    name: 'Chiến thắng đầu tiên',
    description: 'Thắng game đầu tiên',
    icon: '🏆', 
    rarity: 'common',
    unlockedAt: ''
  },
  {
    id: 'speed_master',
    name: 'Tốc độ ánh sáng',
    description: 'Hoàn thành game trong thời gian kỷ lục',
    icon: '⚡',
    rarity: 'rare',
    unlockedAt: ''
  },
  {
    id: 'perfect_score',
    name: 'Điểm số hoàn hảo',
    description: 'Đạt điểm tối đa trong 1 game',
    icon: '💯',
    rarity: 'epic',
    unlockedAt: ''
  },
  {
    id: 'history_master',
    name: 'Bậc thầy lịch sử',
    description: 'Thắng 10 games liên tiếp',
    icon: '👑',
    rarity: 'legendary',
    unlockedAt: ''
  },
  {
    id: 'timeline_expert',
    name: 'Chuyên gia Timeline',
    description: 'Thắng 5 games Timeline Puzzle',
    icon: '📚',
    rarity: 'rare',
    unlockedAt: ''
  },
  {
    id: 'trivia_champion',
    name: 'Vô địch Trivia',
    description: 'Thắng 5 games Historical Trivia',
    icon: '🧠',
    rarity: 'rare', 
    unlockedAt: ''
  }
];

// Check and award badges
function checkBadges(playerId: string, playerName: string, gameResult: GameResult): Badge[] {
  const newBadges: Badge[] = [];
  const stats = playerStats.get(playerId);
  
  if (!stats) return newBadges;
  
  const playerResult = gameResult.players.find(p => p.playerId === playerId);
  if (!playerResult || playerResult.rank !== 1) return newBadges; // Only for winners
  
  const existingBadgeIds = stats.badges.map(b => b.id);
  
  // First win badge
  if (!existingBadgeIds.includes('first_win') && stats.wins === 1) {
    const badge = { ...availableBadges.find(b => b.id === 'first_win')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  // Perfect score badge (assuming max score is 1000+)
  if (!existingBadgeIds.includes('perfect_score') && playerResult.finalScore >= 1000) {
    const badge = { ...availableBadges.find(b => b.id === 'perfect_score')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  // Speed master (game completed in under 60 seconds)
  if (!existingBadgeIds.includes('speed_master') && gameResult.duration < 60) {
    const badge = { ...availableBadges.find(b => b.id === 'speed_master')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  // Game-specific badges
  const gameTypeResults = gameResults.get(gameResult.gameType) || [];
  const playerWinsInGameType = gameTypeResults.filter(result => 
    result.players.find(p => p.playerId === playerId && p.rank === 1)
  ).length;
  
  if (gameResult.gameType === 'timeline-puzzle' && !existingBadgeIds.includes('timeline_expert') && playerWinsInGameType >= 5) {
    const badge = { ...availableBadges.find(b => b.id === 'timeline_expert')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  if (gameResult.gameType === 'historical-trivia' && !existingBadgeIds.includes('trivia_champion') && playerWinsInGameType >= 5) {
    const badge = { ...availableBadges.find(b => b.id === 'trivia_champion')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  // History master (10 wins total)
  if (!existingBadgeIds.includes('history_master') && stats.wins >= 10) {
    const badge = { ...availableBadges.find(b => b.id === 'history_master')!, unlockedAt: new Date().toISOString() };
    newBadges.push(badge);
  }
  
  return newBadges;
}

// SUBMIT GAME RESULT
export async function POST(request: NextRequest) {
  try {
    const gameResult: GameResult = await request.json();
    
    if (!gameResult.roomId || !gameResult.gameType || !gameResult.players) {
      return NextResponse.json(
        { error: 'Thiếu thông tin kết quả game' },
        { status: 400 }
      );
    }

    // Store game result
    const results = gameResults.get(gameResult.gameType) || [];
    results.push(gameResult);
    gameResults.set(gameResult.gameType, results);

    // Update player stats and check badges
    const allNewBadges: { [playerId: string]: Badge[] } = {};
    
    gameResult.players.forEach(playerResult => {
      const { playerId, playerName, finalScore, rank } = playerResult;
      
      let stats = playerStats.get(playerId);
      if (!stats) {
        stats = {
          playerId,
          playerName,
          totalScore: 0,
          gamesPlayed: 0,
          wins: 0,
          badges: [],
          lastPlayed: new Date().toISOString()
        };
      }
      
      // Update stats
      stats.totalScore += finalScore;
      stats.gamesPlayed += 1;
      if (rank === 1) stats.wins += 1;
      stats.lastPlayed = new Date().toISOString();
      
      playerStats.set(playerId, stats);
      
      // Check for new badges
      const newBadges = checkBadges(playerId, playerName, gameResult);
      if (newBadges.length > 0) {
        stats.badges.push(...newBadges);
        playerStats.set(playerId, stats);
        allNewBadges[playerId] = newBadges;
      }
    });

    return NextResponse.json({
      message: 'Kết quả game đã được lưu',
      newBadges: allNewBadges
    });

  } catch (error) {
    console.error('Lỗi lưu kết quả game:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// GET LEADERBOARD
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType') as GameType;
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | 'all-time';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!gameType) {
      return NextResponse.json(
        { error: 'Game type là bắt buộc' },
        { status: 400 }
      );
    }

    // Get all player stats
    const allStats = Array.from(playerStats.values());
    
    // Filter by period if specified
    let filteredStats = allStats;
    if (period && period !== 'all-time') {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (period) {
        case 'daily':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filteredStats = allStats.filter(stats => 
        new Date(stats.lastPlayed) >= cutoffDate
      );
    }

    // Calculate game-specific scores for leaderboard
    const gameResultsForType = gameResults.get(gameType) || [];
    const leaderboardEntries: LeaderboardEntry[] = [];

    filteredStats.forEach((stats: any) => {
      const playerGameResults = gameResultsForType.filter((result: any) =>
        result.players.some((p: any) => p.playerId === stats.playerId)
      );
      
      const totalScoreInGame = playerGameResults.reduce((sum: number, result: any) => {
        const playerResult = result.players.find((p: any) => p.playerId === stats.playerId);
        return sum + (playerResult?.finalScore || 0);
      }, 0);
      
      const winsInGame = playerGameResults.filter((result: any) =>
        result.players.some((p: any) => p.playerId === stats.playerId && p.rank === 1)
      ).length;
      
      const gamesPlayedInType = playerGameResults.length;
      
      if (gamesPlayedInType > 0) {
        leaderboardEntries.push({
          rank: 0, // Will be set after sorting
          playerId: stats.playerId,
          playerName: stats.playerName,
          avatar: stats.avatar,
          totalScore: totalScoreInGame,
          gamesPlayed: gamesPlayedInType,
          winRate: winsInGame / gamesPlayedInType,
          badges: stats.badges
        });
      }
    });

    // Sort by total score and assign ranks
    leaderboardEntries.sort((a, b) => b.totalScore - a.totalScore);
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Limit results
    const limitedEntries = leaderboardEntries.slice(0, limit);

    const leaderboard: Leaderboard = {
      gameType,
      period: period || 'all-time',
      entries: limitedEntries,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ leaderboard });

  } catch (error) {
    console.error('Lỗi lấy leaderboard:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// GET PLAYER STATS
export async function PUT(request: NextRequest) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID là bắt buộc' },
        { status: 400 }
      );
    }

    const stats = playerStats.get(playerId);
    if (!stats) {
      return NextResponse.json(
        { error: 'Không tìm thấy thống kê người chơi' },
        { status: 404 }
      );
    }

    // Get detailed game stats
    const gameStats: { [gameType: string]: any } = {};
    
    Object.keys(gameResults).forEach(gameType => {
      const results = gameResults.get(gameType as GameType) || [];
      const playerResults = results.filter(result =>
        result.players.some(p => p.playerId === playerId)
      );
      
      const totalScore = playerResults.reduce((sum, result) => {
        const playerResult = result.players.find(p => p.playerId === playerId);
        return sum + (playerResult?.finalScore || 0);
      }, 0);
      
      const wins = playerResults.filter(result =>
        result.players.find(p => p.playerId === playerId && p.rank === 1)
      ).length;
      
      gameStats[gameType] = {
        gamesPlayed: playerResults.length,
        totalScore,
        wins,
        winRate: playerResults.length > 0 ? wins / playerResults.length : 0,
        averageScore: playerResults.length > 0 ? totalScore / playerResults.length : 0
      };
    });

    return NextResponse.json({
      stats,
      gameStats,
      availableBadges: availableBadges.map(badge => ({
        ...badge,
        unlocked: stats.badges.some(b => b.id === badge.id)
      }))
    });

  } catch (error) {
    console.error('Lỗi lấy thống kê player:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
