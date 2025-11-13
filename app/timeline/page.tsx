'use client';

import { ArrowLeft, Clock, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import eventsData from '@/data/events.json';
import { HistoricalEvent } from '@/types';
import InteractiveTimeline from '@/components/Timeline/InteractiveTimeline';

export default function TimelinePage() {
  const events = eventsData as unknown as HistoricalEvent[];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link 
            href="/map"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại bản đồ</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Dòng thời gian lịch sử Việt Nam
              </h1>
              <div className="flex items-center gap-6 mt-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>1858 - 1930: Từ cuộc kháng chiến chống Pháp đến thành lập Đảng</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>{events.length} sự kiện lịch sử</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InteractiveTimeline events={events} />
      </div>
    </div>
  );
}
