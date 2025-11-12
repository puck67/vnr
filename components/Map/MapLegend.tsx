'use client';

import { getEventColor, getEventTypeName } from '@/lib/utils';
import { EventType } from '@/types';

export default function MapLegend() {
  const eventTypes: EventType[] = ['uprising', 'movement', 'political_event'];

  return (
    <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 z-[1000]">
      <h3 className="font-bold text-sm mb-3">Chú thích</h3>
      <div className="space-y-2">
        {eventTypes.map(type => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: getEventColor(type) }}
            />
            <span className="text-xs">{getEventTypeName(type)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

