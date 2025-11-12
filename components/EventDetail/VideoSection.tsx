'use client';

import { useState } from 'react';
import { ExternalLink, Video, X } from 'lucide-react';

interface VideoSectionProps {
  videoUrl: string;
  eventName: string;
}

// Hàm chuyển đổi YouTube URL sang dạng embed
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Xử lý dạng youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    // Xử lý dạng youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch) {
      return `https://www.youtube.com/embed/${longMatch[1]}`;
    }
    
    return null;
  } catch {
    return null;
  }
}

export default function VideoSection({ videoUrl, eventName }: VideoSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Kiểm tra loại video
  const isVTVVideo = videoUrl.includes('vtv.vn');
  const isYouTubeVideo = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  
  // Lấy URL embed cho YouTube
  const embedUrl = isYouTubeVideo ? getYouTubeEmbedUrl(videoUrl) : videoUrl;
  
  // Xác định loại nền tảng
  const platform = isYouTubeVideo ? 'YouTube' : isVTVVideo ? 'VTV' : 'Video';
  
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200 overflow-hidden">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Video className="text-blue-600" />
          <span>Video tài liệu</span>
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {isVTVVideo && 'Video từ VTV - Khát vọng non sông'}
          {isYouTubeVideo && 'Video tài liệu từ YouTube'}
          {!isVTVVideo && !isYouTubeVideo && 'Video tài liệu về sự kiện'}
        </p>
        
        {/* Video preview card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative w-full aspect-video mb-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors group-hover:scale-110 transform duration-300">
              <Video className="w-10 h-10 text-white ml-1" />
            </div>
            <div className="text-center px-4">
              <p className="text-white font-semibold text-lg mb-1">{eventName}</p>
              <p className="text-gray-300 text-sm">Video tài liệu lịch sử</p>
              <p className="text-red-400 text-xs mt-2">Click để xem video</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* External link button - chỉ hiện cho VTV */}
        {isVTVVideo && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2 group"
          >
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Mở trên VTV.vn</span>
          </a>
        )}
        
        {/* Play button cho YouTube */}
        {isYouTubeVideo && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 group"
          >
            <Video className="w-5 h-5" />
            <span>Xem video ngay</span>
          </button>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && embedUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-h-screen flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition flex items-center gap-2 z-10 shadow-lg"
            >
              <X className="w-6 h-6" />
              <span className="font-semibold">Đóng</span>
            </button>
            
            <div className="flex-1 flex items-center justify-center pt-16">
              <div className="relative w-full h-full max-w-[1400px] max-h-[800px]">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-lg shadow-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
