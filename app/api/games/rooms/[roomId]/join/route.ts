import { NextRequest, NextResponse } from 'next/server';
import { GameRoom, GamePlayer } from '@/types';
import { gamesService } from '@/lib/games-service';

// JOIN ROOM
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { playerName, roomCode } = await request.json();

    if (!playerName) {
      return NextResponse.json(
        { error: 'Tên người chơi là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm room theo roomId hoặc roomCode
    let room = await gamesService.getRoomById(roomId);
    
    if (!room && roomCode) {
      // Tìm theo room code
      room = await gamesService.getRoomByCode(roomCode.toUpperCase());
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Không tìm thấy phòng game' },
        { status: 404 }
      );
    }

    if (room.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Phòng game đã bắt đầu hoặc kết thúc' },
        { status: 400 }
      );
    }

    if (room.players.length >= room.settings.maxPlayers) {
      return NextResponse.json(
        { error: 'Phòng game đã đầy' },
        { status: 400 }
      );
    }

    // Check if player name already exists
    const existingPlayer = room.players.find((p: GamePlayer) => p.name === playerName);
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Tên người chơi đã tồn tại trong phòng' },
        { status: 400 }
      );
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newPlayer: GamePlayer = {
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false,
      isHost: false,
      joinedAt: new Date().toISOString()
    };

    const updatedRoom = await gamesService.joinRoom(room.id, newPlayer);

    return NextResponse.json({
      room: updatedRoom,
      playerId,
      message: `${playerName} đã tham gia phòng thành công`
    });

  } catch (error) {
    console.error('Lỗi tham gia phòng:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// LEAVE ROOM
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { playerId } = await request.json();

    const room = await gamesService.leaveRoom(roomId, playerId);
    if (!room) {
      return NextResponse.json({
        message: 'Đã rời phòng thành công'
      });
    }

    return NextResponse.json({
      room,
      message: 'Đã rời phòng thành công'
    });

  } catch (error) {
    console.error('Lỗi rời phòng:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
