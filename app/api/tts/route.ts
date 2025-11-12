import { NextRequest, NextResponse } from 'next/server';

// Danh sách giọng tiếng Việt có sẵn
const VIETNAMESE_VOICES = {
  'hoaimy': 'vi-VN-HoaiMyNeural',    // Nữ, miền Nam, trẻ trung
  'namminh': 'vi-VN-NamMinhNeural',   // Nam, miền Bắc, trầm ấm
  'hanhan': 'vi-VN-HaNhanNeural',    // Nữ, miền Bắc, chuyên nghiệp
  'longkhanh': 'vi-VN-LongKhanhNeural' // Nam, miền Nam, mạnh mẽ
} as const;

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      voice = 'hoaimy',      // Giọng mặc định
      rate = '0%',           // Tốc độ: -50% đến +50% (0% = bình thường)
      pitch = '0Hz'          // Cao độ: -50Hz đến +50Hz (0Hz = bình thường)
    } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Thiếu nội dung text' },
        { status: 400 }
      );
    }

    // Lấy tên giọng đầy đủ
    const voiceName = VIETNAMESE_VOICES[voice as keyof typeof VIETNAMESE_VOICES] || VIETNAMESE_VOICES.hoaimy;

    console.log('🎤 Tạo TTS với Edge:', { voice: voiceName, rate, pitch, textLength: text.length });

    // Dynamic import Edge TTS
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
    
    // Khởi tạo Edge TTS
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    // Generate audio
    const readable = await tts.toStream(text, {
      rate,
      pitch
    });

    // Đọc stream thành buffer - toStream trả về {audioStream, metadataStream}
    const chunks: Buffer[] = [];
    for await (const chunk of readable.audioStream) {
      if (chunk instanceof Buffer) {
        chunks.push(chunk);
      }
    }
    
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    console.log('✅ Edge TTS success, audio size:', audioBuffer.length, 'bytes');

    return NextResponse.json({ 
      success: true,
      audioUrl,
      info: {
        voice: voiceName,
        rate,
        pitch,
        size: audioBuffer.length
      }
    });
  } catch (error) {
    console.error('❌ TTS API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Lỗi khi tạo giọng đọc AI. Vui lòng thử lại.'
      },
      { status: 500 }
    );
  }
}
