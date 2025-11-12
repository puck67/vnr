'use client';

import Link from 'next/link';
import { HistoricalEvent } from '@/types';
import { formatDate, getEventColor } from '@/lib/utils';

interface RelatedEventsProps {
  events: HistoricalEvent[];
}

export default function RelatedEvents({ events }: RelatedEventsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-bold text-lg mb-4">Sự kiện liên quan</h3>
      
      <div className="space-y-3">
        {events.map(event => {
          const color = getEventColor(event.type);
          
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
                  <p className="text-xs text-gray-600">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

