'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Filter, ZoomIn, ZoomOut, MapPin, 
  Sword, Crown, Book, Coins, Users, 
  Clock, Target, Search, ChevronRight,
  Award, Flag, Shield, ChevronLeft, 
  ArrowLeft, ArrowRight, MousePointer
} from 'lucide-react';
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
  const [timelineScrollPosition, setTimelineScrollPosition] = useState<number>(0);

  // Get year range
  const years = useMemo(() => {
    const allYears = events.map(e => e.date.year);
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    return { min: minYear, max: maxYear };
  }, [events]);

  const yearRange = years.max - years.min;
  const displayYears = zoomLevel === 1 
    ? Array.from({ length: Math.ceil(yearRange / 5) + 1 }, (_, i) => years.min + i * 5)
    : Array.from({ length: yearRange + 1 }, (_, i) => years.min + i);

  // Keyboard navigation for zoomed timeline
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomLevel === 2 && displayYears.length > 10) {
        const container = document.querySelector('.timeline-scroll-container');
        if (container && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          e.preventDefault();
          const scrollAmount = e.key === 'ArrowLeft' ? -200 : 200;
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel, displayYears.length]);

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
      political: 'border-l-blue-500 bg-blue-50',
      military: 'border-l-red-500 bg-red-50',
      cultural: 'border-l-purple-500 bg-purple-50',
      economic: 'border-l-emerald-500 bg-emerald-50',
      political_event: 'border-l-blue-500 bg-blue-50',
      military_event: 'border-l-red-500 bg-red-50',
    };
    return colors[type] || 'border-l-slate-500 bg-slate-50';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      political: <Crown className="w-4 h-4 text-blue-600" />,
      military: <Sword className="w-4 h-4 text-red-600" />,
      cultural: <Book className="w-4 h-4 text-purple-600" />,
      economic: <Coins className="w-4 h-4 text-emerald-600" />,
      political_event: <Crown className="w-4 h-4 text-blue-600" />,
      military_event: <Sword className="w-4 h-4 text-red-600" />,
    };
    return icons[type] || <Flag className="w-4 h-4 text-slate-600" />;
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

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Khám phá lịch sử</h2>
            <p className="text-slate-300">Hành trình qua các sự kiện quan trọng</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filter Type */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Bộ lọc:</span>
            </div>
            <div className="flex gap-2">
              {(['all', 'political', 'military', 'cultural', 'economic'] as EventType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterType === type
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium mr-2">Hiển thị:</span>
            <button
              onClick={() => setZoomLevel(1)}
              className={`p-3 rounded-xl transition-all ${
                zoomLevel === 1 ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title="Tổng quan"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoomLevel(2)}
              className={`p-3 rounded-xl transition-all ${
                zoomLevel === 2 ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title="Chi tiết"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <div>
              <div className="text-white font-bold">{years.min} - {years.max}</div>
              <div className="text-slate-400 text-sm">Khoảng thời gian</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Target className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-white font-bold">{filteredEvents.length}</div>
              <div className="text-slate-400 text-sm">Sự kiện</div>
            </div>
          </div>
          {selectedYear && (
            <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
              <Search className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-white font-bold">Năm {selectedYear}</div>
                <div className="text-slate-400 text-sm">Đang lọc</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="p-8">
        <div className="relative">
          
          {/* Year markers - Scrollable */}
          <div className={`relative mb-8 ${
            zoomLevel === 2 && displayYears.length > 10 
              ? 'timeline-scroll-container overflow-x-auto pb-4' 
              : ''
          }`}>
            <div className={`flex ${
              zoomLevel === 2 && displayYears.length > 10 
                ? 'gap-8 min-w-max px-4' 
                : 'justify-between'
            } relative`}>
              {/* Timeline line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full animate-line-draw" />
              
              {displayYears.map((year, index) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={`group relative flex flex-col items-center z-10 transition-all duration-300 ${
                    selectedYear === year ? 'scale-110' : 'hover:scale-105'
                  } ${zoomLevel === 2 ? 'flex-shrink-0' : ''}`}
                >
                <div className={`w-6 h-6 rounded-full border-4 bg-white shadow-lg mb-3 transition-all ${
                  eventsByYear[year] 
                    ? selectedYear === year 
                      ? 'border-indigo-600 bg-indigo-600 animate-year-pulse' 
                      : 'border-indigo-500 group-hover:border-indigo-600 animate-float-gentle'
                    : 'border-slate-300'
                }`}>
                  {eventsByYear[year] && selectedYear === year && (
                    <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className={`bg-white rounded-lg px-3 py-2 shadow-md border transition-all ${
                  selectedYear === year 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-200 group-hover:border-slate-300'
                }`}>
                  <span className={`text-sm font-bold ${
                    selectedYear === year ? 'text-indigo-700' : 'text-slate-700'
                  }`}>
                    {year}
                  </span>
                  {eventsByYear[year] && (
                    <div className={`text-xs font-semibold mt-1 ${
                      selectedYear === year ? 'text-indigo-600' : 'text-slate-500'
                    }`}>
                      {eventsByYear[year].length} sự kiện
                    </div>
                  )}
                </div>
                </button>
              ))}
            </div>
            
            {/* Navigation buttons for zoomed view */}
            {zoomLevel === 2 && displayYears.length > 10 && (
              <div className="absolute -top-12 right-0 flex gap-2">
                <button
                  onClick={() => {
                    const container = document.querySelector('.overflow-x-auto');
                    if (container) {
                      container.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Cuộn trái"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    const container = document.querySelector('.overflow-x-auto');
                    if (container) {
                      container.scrollBy({ left: 200, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Cuộn phải"
                >
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>


          {/* Events */}
          <div className="mt-12 space-y-8">
            {Object.entries(eventsByYear).map(([year, yearEvents]) => (
              <div key={year} className="relative">
                {/* Year Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{year}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Năm {year}</h3>
                      <p className="text-slate-600">{yearEvents.length} sự kiện quan trọng</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                
                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {yearEvents.map((event, index) => (
                    <button
                      key={event.id}
                      onClick={() => router.push(`/events/${event.id}`)}
                      className={`group relative p-6 rounded-2xl border-l-4 ${getTypeColor(event.type)} hover:shadow-xl transition-all duration-300 text-left transform hover:-translate-y-1 animate-timeline-appear`}
                      style={{
                        animationDelay: `${index * 150}ms`
                      }}
                    >
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(event.type)}
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {event.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      
                      {/* Event Content */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2 text-lg leading-tight">
                          {event.name}
                        </h4>
                        
                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {event.shortDescription}
                        </p>
                        
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">{event.location.name}</span>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-indigo-50 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity animate-glow" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy sự kiện</h3>
              <p className="text-slate-600 mb-6">Thử thay đổi tiêu chí lọc hoặc năm để xem thêm sự kiện</p>
              <button
                onClick={() => { setFilterType('all'); setSelectedYear(null); }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
