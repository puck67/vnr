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
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <span>Dòng thời gian lịch sử</span>
        </h2>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Type */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {(['all', 'political', 'military', 'cultural', 'economic'] as EventType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setZoomLevel(1)}
              className={`p-2 rounded-lg transition ${
                zoomLevel === 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoomLevel(2)}
              className={`p-2 rounded-lg transition ${
                zoomLevel === 2 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>📅 {years.min} - {years.max}</span>
          <span>📊 {filteredEvents.length} sự kiện</span>
          {selectedYear && <span className="font-bold text-blue-600">🔍 Năm {selectedYear}</span>}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative overflow-x-auto pb-8">
        <div className="min-w-full">
          {/* Year markers */}
          <div className="flex justify-between mb-8 px-4">
            {displayYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                className={`group relative flex flex-col items-center transition-all ${
                  selectedYear === year ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mb-2 ${
                  eventsByYear[year] 
                    ? selectedYear === year 
                      ? 'bg-blue-600 ring-4 ring-blue-200' 
                      : 'bg-blue-500 group-hover:ring-4 group-hover:ring-blue-200'
                    : 'bg-gray-300'
                }`} />
                <span className={`text-sm font-medium ${
                  selectedYear === year ? 'text-blue-600 font-bold' : 'text-gray-600'
                }`}>
                  {year}
                </span>
                {eventsByYear[year] && (
                  <span className="text-xs text-blue-600 font-semibold mt-1">
                    {eventsByYear[year].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Timeline line */}
          <div className="relative h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full mx-4" />

          {/* Events */}
          <div className="mt-8 space-y-4">
            {Object.entries(eventsByYear).map(([year, yearEvents]) => (
              <div key={year} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {year}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-14">
                  {yearEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="group relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all text-left overflow-hidden"
                    >
                      {/* Type indicator */}
                      <div className={`absolute top-0 left-0 w-1 h-full ${getTypeColor(event.type)}`} />
                      
                      <div className="pl-3">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                            {event.name}
                          </h4>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {event.shortDescription}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{event.location.name}</span>
                        </div>
                      </div>

                      {/* Hover arrow */}
                      <div className="absolute bottom-2 right-2 text-blue-600 opacity-0 group-hover:opacity-100 transition">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Không tìm thấy sự kiện nào</p>
              <p className="text-sm">Thử thay đổi bộ lọc hoặc năm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
