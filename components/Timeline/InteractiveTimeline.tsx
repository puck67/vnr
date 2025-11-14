'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Filter, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { HistoricalEvent } from '@/types';

interface InteractiveTimelineProps {
  events: HistoricalEvent[];
}

type EventType = 'all' | 'political' | 'military' | 'cultural' | 'economic';

export default function InteractiveTimeline({ events }: InteractiveTimelineProps) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<EventType>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = normal, 2 = zoomed

  // Get year range
  const years = useMemo(() => {
    const allYears = events.map(e => e.date.year);
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    return { min: minYear, max: maxYear };
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(e => {
        // Match both 'political' and 'political_event' formats
        const eventType = e.type as string;
        return eventType.includes(filterType);
      });
    }
    
    if (selectedYear) {
      filtered = filtered.filter(e => e.date.year === selectedYear);
    }
    
    return filtered.sort((a, b) => a.date.year - b.date.year);
  }, [events, filterType, selectedYear]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    const grouped: Record<number, HistoricalEvent[]> = {};
    filteredEvents.forEach(event => {
      const year = event.date.year;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      political: 'bg-blue-500',
      military: 'bg-red-500',
      cultural: 'bg-purple-500',
      economic: 'bg-green-500',
      political_event: 'bg-blue-500',
      military_event: 'bg-red-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeLabel = (type: EventType) => {
    const labels: Record<EventType, string> = {
      all: 'Tất cả',
      political: 'Chính trị',
      military: 'Quân sự',
      cultural: 'Văn hóa',
      economic: 'Kinh tế'
    };
    return labels[type];
  };

  const yearRange = years.max - years.min;
  const displayYears = zoomLevel === 1 
    ? Array.from({ length: Math.ceil(yearRange / 5) + 1 }, (_, i) => years.min + i * 5)
    : Array.from({ length: yearRange + 1 }, (_, i) => years.min + i);

  return (
    <div className="space-y-8">
      {/* Controls Card */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Dòng thời gian lịch sử</h2>
            <p className="text-slate-600 font-medium">Khám phá các sự kiện quan trọng</p>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="space-y-6">
          {/* Filter Type */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <span className="font-semibold text-slate-700">Lọc theo loại sự kiện:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(['all', 'political', 'military', 'cultural', 'economic'] as EventType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-5 h-5 text-slate-600" />
                <span className="font-semibold text-slate-700">Mức độ hiển thị:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoomLevel(1)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    zoomLevel === 1 ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                  title="Tổng quan"
                >
                  Tổng quan
                </button>
                <button
                  onClick={() => setZoomLevel(2)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    zoomLevel === 2 ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                  title="Chi tiết"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">{years.min} - {years.max}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2">
            <span className="w-4 h-4 text-green-600">📊</span>
            <span className="font-medium text-green-800">{filteredEvents.length} sự kiện</span>
          </div>
          {selectedYear && (
            <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-4 py-2">
              <span className="w-4 h-4 text-purple-600">🔍</span>
              <span className="font-medium text-purple-800">Năm {selectedYear}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="relative overflow-x-auto">
          <div className="min-w-full">
            {/* Year markers */}
            <div className="flex justify-between mb-12 px-6">
              {displayYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={`group relative flex flex-col items-center transition-all duration-300 ${
                    selectedYear === year ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full mb-3 transition-all duration-300 ${
                    eventsByYear[year] 
                      ? selectedYear === year 
                        ? 'bg-blue-600 ring-4 ring-blue-200 shadow-lg' 
                        : 'bg-blue-500 group-hover:ring-4 group-hover:ring-blue-200 shadow-md hover:shadow-lg'
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`} />
                  
                  <div className={`text-center transition-all duration-300 ${
                    selectedYear === year ? 'transform -translate-y-1' : ''
                  }`}>
                    <span className={`text-sm font-bold block ${
                      selectedYear === year ? 'text-blue-600 scale-110' : 'text-slate-700 group-hover:text-blue-600'
                    }`}>
                      {year}
                    </span>
                    
                    {eventsByYear[year] && (
                      <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedYear === year 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                      }`}>
                        {eventsByYear[year].length} sự kiện
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Enhanced Timeline line */}
            <div className="relative mb-16">
              <div className="h-2 bg-slate-200 rounded-full mx-6">
                <div className="h-full bg-blue-600 rounded-full" style={{width: '100%'}}></div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-1/2 left-6 right-6 flex justify-between transform -translate-y-1/2">
                {displayYears.map(year => (
                  <div key={year} className={`w-3 h-3 rounded-full border-2 border-white ${
                    eventsByYear[year] ? 'bg-blue-600' : 'bg-slate-400'
                  }`} />
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="space-y-12">
              {Object.entries(eventsByYear).map(([year, yearEvents]) => (
                <div key={year} className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-lg shadow-xl">
                      {year}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900">Năm {year}</h3>
                      <p className="text-slate-600 font-medium">{yearEvents.length} sự kiện quan trọng</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {yearEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 text-left overflow-hidden transform hover:scale-105"
                      >
                        {/* Type indicator */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${getTypeColor(event.type)} rounded-l-2xl`} />
                        
                        {/* Icon */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                            <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg leading-tight mb-2">
                              {event.name}
                            </h4>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                          {event.shortDescription}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span className="font-medium">{event.location.name}</span>
                          </div>

                          {/* Hover arrow */}
                          <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sự kiện nào</h3>
                <p className="text-slate-600 text-lg">Thử thay đổi bộ lọc hoặc chọn năm khác</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
