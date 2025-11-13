'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { GamificationService } from '@/lib/gamification';
import { Trophy, Calendar, User, LogOut, Settings, Award, BarChart3, Gamepad2 } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  profile: {
    points: number;
    level: number;
    badges: string[];
    completedQuizzes: string[];
    viewedEvents: string[];
    achievements: { id: string; unlockedAt: string; }[];
  };
}

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

export default function MapPage() {
  const router = useRouter();
  const events = eventsData as unknown as HistoricalEvent[];
  const characters = charactersData as unknown as Character[];

  // State cho filters
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [currentYear, setCurrentYear] = useState(1858);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // User state
  const [user, setUser] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Load user data and sync with gamification
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && !userData.profile) {
          userData.profile = {
            points: 0,
            level: 1,
            badges: [],
            completedQuizzes: [],
            viewedEvents: [],
            achievements: []
          };
        }
        
        // Sync with gamification service
        const gamificationProgress = GamificationService.getProgress();
        userData.profile.points = gamificationProgress.points;
        userData.profile.level = gamificationProgress.level;
        userData.profile.badges = gamificationProgress.badges;
        userData.profile.completedQuizzes = gamificationProgress.completedQuizzes;
        userData.profile.viewedEvents = gamificationProgress.viewedEvents;
        
        // Save updated user data
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Listen for gamification updates
  useEffect(() => {
    const handleGamificationUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          const gamificationProgress = GamificationService.getProgress();
          
          userData.profile.points = gamificationProgress.points;
          userData.profile.level = gamificationProgress.level;
          userData.profile.badges = gamificationProgress.badges;
          userData.profile.completedQuizzes = gamificationProgress.completedQuizzes;
          userData.profile.viewedEvents = gamificationProgress.viewedEvents;
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }
    };

    window.addEventListener('gamification-update', handleGamificationUpdate);
    return () => {
      window.removeEventListener('gamification-update', handleGamificationUpdate);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/welcome');
  };

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
            <div className="flex gap-3 flex-shrink-0 items-center">
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
              <Link
                href="/quiz-history"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition border border-white/20"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Quiz</span>
              </Link>
              <Link
                href="/games"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:from-orange-600 hover:to-red-700 transition shadow-lg"
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="font-medium">Games</span>
              </Link>
              
              {/* User Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition shadow-lg"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.username}</span>
                    <div className="ml-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                      {user.profile?.points || 0}
                    </div>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{user.username}</h3>
                            <p className="text-blue-100 text-sm">Level {user.profile?.level || 1}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-yellow-50 rounded-xl">
                            <Award className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-yellow-600">{user.profile?.points || 0}</div>
                            <div className="text-xs text-gray-600">Điểm</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-xl">
                            <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-purple-600">{user.profile?.badges?.length || 0}</div>
                            <div className="text-xs text-gray-600">Huy hiệu</div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              // TODO: Open profile settings
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                            <span>Cài đặt</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/welcome"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Đăng nhập</span>
                </Link>
              )}
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
