import { NextRequest, NextResponse } from 'next/server';
import { GameRoom, GamePlayer, GameSettings, GameType } from '@/types';
import { gamesService } from '@/lib/games-service';

// Generate unique 6-digit room code
function generateRoomCode(): string {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// CREATE ROOM
export async function POST(request: NextRequest) {
  try {
    const { gameType, hostName, settings } = await request.json();
    
    if (!gameType || !hostName) {
      return NextResponse.json(
        { error: 'Game type và host name là bắt buộc' },
        { status: 400 }
      );
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const roomCode = generateRoomCode();
    const hostId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const defaultSettings: GameSettings = {
      maxPlayers: 6,
      timeLimit: 30,
      difficulty: 'medium',
      rounds: 5,
      ...settings
    };

    const host: GamePlayer = {
      id: hostId,
      name: hostName,
      score: 0,
      isReady: true,
      isHost: true,
      joinedAt: new Date().toISOString()
    };

    const room: GameRoom = {
      id: roomId,
      code: roomCode,
      gameType: gameType as GameType,
      hostId,
      players: [host],
      status: 'waiting',
      settings: defaultSettings,
      gameData: null,
      createdAt: new Date().toISOString()
    };

    await gamesService.createRoom(room);

    return NextResponse.json({
      room,
      hostId,
      message: 'Phòng game đã được tạo thành công'
    });

  } catch (error) {
    console.error('Lỗi tạo phòng game:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi tạo phòng' },
      { status: 500 }
    );
  }
}

// GET ALL ROOMS hoặc GET ROOM BY CODE/ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get('code');
    const roomId = searchParams.get('id');
    
    if (roomCode) {
      // Get specific room by code
      const room = await gamesService.getRoomByCode(roomCode.toUpperCase());
      if (!room) {
        return NextResponse.json(
          { error: 'Không tìm thấy phòng với mã này' },
          { status: 404 }
        );
      }

      return NextResponse.json({ room });
    }

    if (roomId) {
      // Get specific room by ID
      const room = await gamesService.getRoomById(roomId);
      if (!room) {
        return NextResponse.json(
          { error: 'Không tìm thấy phòng với ID này' },
          { status: 404 }
        );
      }

      return NextResponse.json({ room });
    }

    // Get all active rooms - for now return empty array
    // In Firebase implementation, this would query all rooms
    return NextResponse.json({ rooms: [] });

  } catch (error) {
    console.error('Lỗi lấy thông tin phòng:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
