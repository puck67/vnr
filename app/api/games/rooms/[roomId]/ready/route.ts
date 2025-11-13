import { NextRequest, NextResponse } from 'next/server';
import { gamesService } from '@/lib/games-service';

// UPDATE PLAYER READY STATUS
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { playerId, isReady } = await request.json();

    if (!playerId || isReady === undefined) {
      return NextResponse.json(
        { error: 'Player ID và ready status là bắt buộc' },
        { status: 400 }
      );
    }

    const updatedRoom = await gamesService.updatePlayerReady(roomId, playerId, isReady);
    
    if (!updatedRoom) {
      return NextResponse.json(
        { error: 'Không tìm thấy phòng hoặc người chơi' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      room: updatedRoom,
      message: `Trạng thái ready đã được cập nhật: ${isReady ? 'Sẵn sàng' : 'Chưa sẵn sàng'}`
    });

  } catch (error) {
    console.error('Lỗi cập nhật ready status:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
