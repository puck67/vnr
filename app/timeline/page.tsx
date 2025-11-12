'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import eventsData from '@/data/events.json';
import { HistoricalEvent } from '@/types';
import InteractiveTimeline from '@/components/Timeline/InteractiveTimeline';

export default function TimelinePage() {
  const events = eventsData as unknown as HistoricalEvent[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại trang chủ</span>
          </Link>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dòng thời gian lịch sử Việt Nam
          </h1>
          <p className="text-gray-600 mt-2">
            1858 - 1930: Từ cuộc kháng chiến chống Pháp đến thành lập Đảng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InteractiveTimeline events={events} />
      </div>
    </div>
  );
}
