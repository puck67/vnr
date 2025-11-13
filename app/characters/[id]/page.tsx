'use client';

import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, User, Award, BookOpen, Calendar, MapPin, Shield, Swords } from 'lucide-react';
import charactersData from '@/data/characters.json';
import eventsData from '@/data/events.json';
import { Character, HistoricalEvent } from '@/types';
import CharacterJourney from '@/components/Character/CharacterJourney';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const characters = charactersData as unknown as Character[];
  const events = eventsData as unknown as HistoricalEvent[];
  
  const character = characters.find(c => c.id === id);
  
  if (!character) {
    notFound();
  }

  // Lấy các sự kiện liên quan
  const relatedEvents = events.filter(e =>
    character.relatedEvents.includes(e.id)
  );

  // Kiểm tra nhân vật nước ngoài
  const isForeign = character.name.includes('Rigault') || character.name.includes('Lanzarote');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${isForeign ? 'from-red-900 to-red-800' : 'from-blue-900 to-blue-800'} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 ${isForeign ? 'bg-red-700' : 'bg-blue-700'}`}>
              <User className="w-20 h-20 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {isForeign ? (
                  <Swords className="w-8 h-8 text-red-300" />
                ) : (
                  <Shield className="w-8 h-8 text-blue-300" />
                )}
                <h1 className="text-4xl md:text-5xl font-bold">
                  {character.name}
                </h1>
              </div>
              <p className="text-xl text-white/90 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {character.role}
              </p>
              <p className="text-white/80 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {character.birthYear} - {character.deathYear || 'nay'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className={`w-6 h-6 ${isForeign ? 'text-red-600' : 'text-blue-600'}`} />
                <span>Tiểu sử</span>
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {character.biography}
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className={`w-6 h-6 ${isForeign ? 'text-red-600' : 'text-blue-600'}`} />
                <span>Thông tin nhanh</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-l-4 ${isForeign ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <p className="text-sm text-gray-600 mb-1">Năm sinh</p>
                  <p className="text-xl font-bold text-gray-900">{character.birthYear}</p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isForeign ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <p className="text-sm text-gray-600 mb-1">Năm mất</p>
                  <p className="text-xl font-bold text-gray-900">{character.deathYear || 'Còn sống'}</p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isForeign ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <p className="text-sm text-gray-600 mb-1">Hưởng thọ</p>
                  <p className="text-xl font-bold text-gray-900">
                    {character.deathYear ? character.deathYear - character.birthYear : new Date().getFullYear() - character.birthYear} tuổi
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isForeign ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <p className="text-sm text-gray-600 mb-1">Số sự kiện liên quan</p>
                  <p className="text-xl font-bold text-gray-900">{relatedEvents.length}</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className={`w-6 h-6 ${isForeign ? 'text-red-600' : 'text-blue-600'}`} />
                <span>Thành tựu</span>
              </h2>
              <ul className="space-y-3">
                {character.achievements.map((achievement, index) => (
                  <li key={index} className={`flex gap-3 p-3 rounded-lg ${isForeign ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <span className={`font-bold flex-shrink-0 ${isForeign ? 'text-red-600' : 'text-blue-600'}`}>
                      ✓
                    </span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Journey Map */}
            {character.journey.length > 0 && (
              <CharacterJourney character={character} events={events} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Events */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <MapPin className={`w-5 h-5 ${isForeign ? 'text-red-600' : 'text-blue-600'}`} />
                <span>Sự kiện liên quan</span>
                <span className="text-sm font-normal text-gray-500">({relatedEvents.length})</span>
              </h3>
              <div className="space-y-3">
                {relatedEvents.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={`group block p-4 rounded-lg border-2 transition-all hover:scale-[1.02] hover:shadow-md ${isForeign ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition">{event.name}</h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date.day}/{event.date.month}/{event.date.year}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location.name}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


