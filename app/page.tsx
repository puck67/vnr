'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventType, Region, HistoricalEvent } from '@/types';
import eventsData from '@/data/events.json';
import charactersData from '@/data/characters.json';
import { Character } from '@/types';
import TimelineSlider from '@/components/Timeline/TimelineSlider';
import MapLegend from '@/components/Map/MapLegend';
import MapControls from '@/components/Map/MapControls';
import SmartSearch from '@/components/Search/SmartSearch';
import { Trophy, Calendar } from 'lucide-react';

// Dynamic import để tránh SSR issues với Leaflet
const InteractiveMap = dynamic(() => import('@/components/Map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const events = eventsData as unknown as HistoricalEvent[];
  const characters = charactersData as unknown as Character[];

  // State cho filters
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [currentYear, setCurrentYear] = useState(1858);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lấy danh sách năm có sự kiện
  const eventYears = useMemo(() => {
    const years = events.map(e => e.date.year);
    return Array.from(new Set(years)).sort((a, b) => a - b);
  }, [events]);

  // Filter events theo năm - chỉ hiển thị sự kiện của năm đang chọn
  const filteredEvents = useMemo(() => {
    return events.filter(event => event.date.year === currentYear);
  }, [events, currentYear]);

  // Handlers
  const handleTypeToggle = (type: EventType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleRegionToggle = (region: Region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedRegions([]);
  };

  const handleEventClick = (event: HistoricalEvent) => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-[1000] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bản Đồ Lịch Sử Việt Nam
              </h1>
              <p className="text-white/90 text-sm">
                Hành trình đấu tranh chống thực dân Pháp (1858-1930)
              </p>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/timeline"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition border border-white/20"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Timeline</span>
              </Link>
              <Link
                href="/progress"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:from-purple-600 hover:to-pink-700 transition shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Tiến trình</span>
              </Link>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="max-w-2xl">
            <SmartSearch events={events} characters={characters} />
          </div>
        </div>
      </header>

      {/* Map */}
      <InteractiveMap
        events={filteredEvents}
        filters={{
          eventTypes: selectedTypes,
          regions: selectedRegions,
          yearRange: [1858, currentYear],
        }}
        currentYear={currentYear}
        isPlaying={isPlaying}
        onEventClick={handleEventClick}
      />

      {/* Map Controls */}
      <MapControls
        selectedTypes={selectedTypes}
        selectedRegions={selectedRegions}
        onTypeToggle={handleTypeToggle}
        onRegionToggle={handleRegionToggle}
        onReset={handleReset}
      />

      {/* Map Legend */}
      <MapLegend />

      {/* Timeline Slider */}
      <TimelineSlider
        minYear={1858}
        maxYear={1930}
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        eventYears={eventYears}
        onPlayingChange={setIsPlaying}
      />
    </div>
  );
}
