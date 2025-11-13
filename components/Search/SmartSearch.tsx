'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, MapPin, User } from 'lucide-react';
import { HistoricalEvent, Character } from '@/types';

interface SmartSearchProps {
  events: HistoricalEvent[];
  characters?: Character[];
}

interface SearchResult {
  type: 'event' | 'character' | 'location';
  id: string;
  title: string;
  subtitle: string;
  year?: number;
  url: string;
}

export default function SmartSearch({ events, characters = [] }: SmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  // Build search index
  const searchIndex = useMemo(() => {
    const index: SearchResult[] = [];

    // Index events
    events.forEach(event => {
      index.push({
        type: 'event',
        id: event.id,
        title: event.name,
        subtitle: event.shortDescription,
        year: event.date.year,
        url: `/events/${event.id}`
      });

      // Also index location names
      if (event.location.name) {
        index.push({
          type: 'location',
          id: `${event.id}-location`,
          title: event.location.name,
          subtitle: event.name,
          year: event.date.year,
          url: `/events/${event.id}`
        });
      }
    });

    // Index characters
    characters.forEach(char => {
      index.push({
        type: 'character',
        id: char.id,
        title: char.name,
        subtitle: char.role,
        url: `/characters/${char.id}`
      });
    });

    return index;
  }, [events, characters]);

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults = searchIndex
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const subtitleMatch = item.subtitle.toLowerCase().includes(lowerQuery);
        return titleMatch || subtitleMatch;
      })
      .slice(0, 8); // Limit to 8 results

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, searchIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
        if (!query.trim()) {
          setIsExpanded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (!query.trim()) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecent);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }

    // Navigate
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
    setIsExpanded(false);
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsExpanded(true);
    inputRef.current?.focus();
  };

  const handleExpandSearch = () => {
    setIsExpanded(true);
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCollapseSearch = () => {
    if (!query.trim()) {
      setIsExpanded(false);
      setIsOpen(false);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'character':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'location':
        return <MapPin className="w-5 h-5 text-green-600" />;
      default:
        return <Search className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative transition-all duration-300 ${isExpanded ? 'w-full max-w-2xl' : 'w-auto'}`}>
      {/* Search Input */}
      {!isExpanded ? (
        // Compact search icon
        <button
          onClick={handleExpandSearch}
          className="p-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white hover:border-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>
      ) : (
        // Full search bar
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={handleCollapseSearch}
            placeholder="Tìm kiếm sự kiện, nhân vật, địa điểm..."
            className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-lg shadow-lg"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsExpanded(false);
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsExpanded(false);
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && isExpanded && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-100 rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto z-50 animate-slide-in-up">
          {/* Results */}
          {results.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-sm text-gray-500 font-medium">
                Kết quả tìm kiếm ({results.length})
              </p>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left ${
                    index === selectedIndex
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1 truncate">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.subtitle}
                    </p>
                    {result.year && (
                      <p className="text-xs text-gray-500 mt-1">Năm {result.year}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition">
                    →
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Không tìm thấy kết quả</p>
              <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="p-2">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Tìm kiếm gần đây
                    </p>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular searches */}
              <div className="mt-4">
                <p className="px-3 py-2 text-sm text-gray-500 font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Tìm kiếm phổ biến
                </p>
                {['Cần Vương', 'Đảng Cộng sản', 'Nguyễn Ái Quốc', 'Đà Nẵng 1858', 'Phan Bội Châu'].map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(term)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
