'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { HistoricalEvent } from '@/types';
import { formatDate, getEventTypeName, getEventColor, getRegionName } from '@/lib/utils';

interface EventHeaderProps {
  event: HistoricalEvent;
}

export default function EventHeader({ event }: EventHeaderProps) {
  const color = getEventColor(event.type);

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/events/${event.id}.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Quay lại bản đồ</span>
        </Link>

        {/* Event type badge */}
        <div className="mb-4">
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: color }}
          >
            {getEventTypeName(event.type)}
          </span>
        </div>

        {/* Event name */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {event.name}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span className="text-lg">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span className="text-lg">
              {event.location.name} ({getRegionName(event.location.region)})
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="mt-6 text-xl text-white/90 max-w-3xl">
          {event.shortDescription}
        </p>
      </div>
    </div>
  );
}

