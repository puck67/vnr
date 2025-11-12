'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';

interface VoiceNarrationProps {
  text: string;
  title?: string;
}

export default function VoiceNarration({ text, title = 'Thuyết minh AI' }: VoiceNarrationProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dừng audio khi component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Edge TTS via API route
  const speakText = async () => {
    // Stop any ongoing speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);

    setIsLoading(true);
    setIsSpeaking(true);
    console.log('🎤 Bắt đầu đọc với Edge TTS:', text.substring(0, 50) + '...');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: 'hoaimy',  // Giọng nữ miền Nam
          rate: '-5%',       // Chậm 5% để dễ nghe
          pitch: '0Hz'       // Cao độ bình thường
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API lỗi: ${response.status}`);
      }

      const data = await response.json();

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);

        audio.onplay = () => {
          console.log('▶️ Đang phát audio Edge TTS');
          setIsLoading(false);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          console.log('✅ Kết thúc đọc');
        };

        audio.onerror = (e) => {
          console.error('❌ Lỗi phát audio:', e);
          setIsSpeaking(false);
          setIsLoading(false);
        };

        audioRef.current = audio as any;
        await audio.play();
      } else {
        throw new Error('API không trả về audio');
      }
    } catch (error) {
      console.error('❌ Lỗi Edge TTS:', error);
      alert(`Lỗi tạo giọng đọc: ${error instanceof Error ? error.message : 'Không xác định'}`);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    // Stop Edge TTS audio if playing
    if (audioRef.current && (audioRef.current as any).pause) {
      (audioRef.current as any).pause();
      (audioRef.current as any).currentTime = 0;
    }
    setIsSpeaking(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-purple-600" />
          <span>{title}</span>
        </h3>
        
        <div className="flex gap-2">
          {!isSpeaking && !isLoading && (
            <button
              onClick={speakText}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              <span>Phát</span>
            </button>
          )}

          {isLoading && (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tải...</span>
            </button>
          )}

          {isSpeaking && !isLoading && (
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
            >
              <VolumeX className="w-5 h-5" />
              <span>Dừng</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-700 bg-white p-4 rounded-lg leading-relaxed max-h-60 overflow-y-auto">
        {text.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 italic">
        Sử dụng Microsoft Edge TTS với giọng AI tiếng Việt Neural chất lượng cao - Hoàn toàn miễn phí.
      </p>
    </div>
  );
}
