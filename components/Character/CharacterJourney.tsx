'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Character, HistoricalEvent } from '@/types';
import { Play, Pause } from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/Map/InteractiveMap'), {
  ssr: false,
});

interface CharacterJourneyProps {
  character: Character;
  events: HistoricalEvent[];
}

export default function CharacterJourney({ character, events }: CharacterJourneyProps) {
  const [showJourney, setShowJourney] = useState(false);

  // Lấy events từ journey
  const journeyEvents = character.journey
    .map(jp => events.find(e => e.id === jp.eventId))
    .filter(Boolean) as HistoricalEvent[];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Hành trình cách mạng</h2>
        <button
          onClick={() => setShowJourney(!showJourney)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showJourney ? (
            <>
              <Pause size={16} />
              <span>Ẩn hành trình</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Xem hành trình</span>
            </>
          )}
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4 mb-6">
        {character.journey.map((point, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              {index < character.journey.length - 1 && (
                <div className="w-0.5 h-full bg-blue-300 my-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-bold text-blue-600">{point.year}</p>
              <p className="text-gray-700">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      {showJourney && (
        <div className="h-96 rounded-lg overflow-hidden">
          <InteractiveMap
            events={journeyEvents}
            highlightedEventIds={journeyEvents.map(e => e.id)}
            showJourneyPath={true}
            journeyPoints={character.journey}
          />
        </div>
      )}
    </div>
  );
}

