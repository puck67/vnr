'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineSliderProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  eventYears: number[]; // Các năm có sự kiện
  onPlayingChange?: (isPlaying: boolean) => void; // Callback khi play/pause
}

export default function TimelineSlider({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
  eventYears,
  onPlayingChange,
}: TimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouseX, setMouseX] = useState<number | null>(null); // Vị trí chuột trên timeline (0-100%)

  // Báo cho parent component khi isPlaying thay đổi
  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  // Auto play timeline
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentYear >= maxYear) {
        setIsPlaying(false);
        return;
      }
      onYearChange(currentYear + 1);
    }, 1000); // Mỗi giây tăng 1 năm

    return () => clearInterval(interval);
  }, [isPlaying, currentYear, maxYear, onYearChange]);

  const handleReset = () => {
    setIsPlaying(false);
    onYearChange(minYear);
  };

  const handlePlayPause = () => {
    if (currentYear >= maxYear) {
      onYearChange(minYear);
    }
    setIsPlaying(!isPlaying);
  };

  // Tính phần trăm cho slider
  const percentage = ((currentYear - minYear) / (maxYear - minYear)) * 100;

  // Hàm tính vị trí chuột trên timeline track
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setMouseX(percentage);
  };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-[1000] w-[80vw] max-w-3xl"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          <RotateCcw size={20} />
        </button>

        {/* Timeline slider */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">{minYear}</span>
            <motion.span
              key={currentYear}
              initial={{ scale: 1.2, color: '#2563eb' }}
              animate={{ scale: 1, color: '#000' }}
              className="text-lg font-bold"
            >
              {currentYear}
            </motion.span>
            <span className="text-xs font-semibold text-gray-600">{maxYear}</span>
          </div>

          {/* Slider track */}
          <div
            className="relative h-3 bg-gray-200 rounded-full group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMouseX(null)}
          >
            {/* Progress bar */}
            <motion.div
              className="absolute h-full bg-blue-600 rounded-full"
              style={{ width: `${percentage}%` }}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3 }}
            />

            {/* Event markers */}
            {eventYears.map(year => {
              const yearPercentage = ((year - minYear) / (maxYear - minYear)) * 100;
              const isPast = year <= currentYear;

              // Tính hiệu ứng "lens magnification" - chỉ phóng to, không dịch chuyển vị trí
              let scale = 1;

              if (mouseX !== null) {
                // Tính khoảng cách từ điểm đến vị trí chuột (0-100)
                const distance = Math.abs(yearPercentage - mouseX);

                // Nếu trong vùng ảnh hưởng (15% timeline)
                const influenceRadius = 15;
                if (distance < influenceRadius) {
                  // Tính độ mạnh của hiệu ứng (1 = gần nhất, 0 = xa nhất)
                  const strength = 1 - (distance / influenceRadius);

                  // Chỉ scale, không offset để tránh markers bị dịch chuyển
                  scale = 1 + strength * 0.5;
                }
              }

              // Giữ vị trí gốc, không dịch chuyển
              const finalPosition = yearPercentage;

              return (
                <motion.div
                  key={year}
                  className="absolute top-1/2 transform -translate-y-1/2 group/marker z-20"
                  animate={{
                    left: `${finalPosition}%`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 border-white cursor-pointer shadow-md ${isPast ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                    animate={{
                      scale: scale
                    }}
                    whileHover={{
                      scale: scale * 1.5
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => onYearChange(year)}
                  />
                  {/* Tooltip hiện khi hover - z-index cao để không bị che */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all duration-200 pointer-events-none z-[100] scale-0 group-hover/marker:scale-100">
                    {year}
                    {/* Arrow xuống */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                      <div className="border-4 border-transparent border-t-blue-600"></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Slider thumb */}
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={currentYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Event count */}
      <div className="mt-2 text-center text-xs text-gray-600">
        {eventYears.filter(year => year <= currentYear).length} / {eventYears.length} sự kiện
      </div>
    </motion.div>
  );
}

