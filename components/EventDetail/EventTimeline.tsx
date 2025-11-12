'use client';

import { Search, Swords, Trophy, Star } from 'lucide-react';
import { HistoricalEvent } from '@/types';

interface EventTimelineProps {
  event: HistoricalEvent;
}

export default function EventTimeline({ event }: EventTimelineProps) {
  const timelineSteps = [
    { title: 'Nguyên nhân', content: event.fullContent.causes, icon: Search },
    { title: 'Diễn biến', content: event.fullContent.events, icon: Swords },
    { title: 'Kết quả', content: event.fullContent.results, icon: Trophy },
    { title: 'Ý nghĩa', content: event.fullContent.significance, icon: Star },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Dòng thời gian sự kiện</h2>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

        {/* Timeline items */}
        <div className="space-y-8">
          {timelineSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
            <div key={index} className="relative pl-16">
              {/* Icon */}
              <div className="absolute left-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.content}
                </p>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}

