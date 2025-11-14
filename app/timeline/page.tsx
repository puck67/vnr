'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import eventsData from '@/data/events.json';
import { HistoricalEvent } from '@/types';
import InteractiveTimeline from '@/components/Timeline/InteractiveTimeline';

export default function TimelinePage() {
  const events = eventsData as unknown as HistoricalEvent[];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating circles */}
          <div className="absolute top-32 right-20 w-48 h-48 rounded-full bg-blue-600 blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-40 left-32 w-64 h-64 rounded-full bg-purple-600 blur-3xl opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link 
            href="/map"
            className="inline-flex items-center gap-3 text-slate-600 hover:text-slate-900 transition mb-6 group bg-slate-100 rounded-2xl px-4 py-3 hover:bg-slate-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Quay lại bản đồ</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
              <ArrowLeft className="w-8 h-8 text-white rotate-90" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900">
                Dòng thời gian lịch sử Việt Nam
              </h1>
              <p className="text-xl text-slate-600 mt-2 font-medium">
                1858 - 1930: Từ cuộc kháng chiến chống Pháp đến thành lập Đảng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <InteractiveTimeline events={events} />
      </div>
    </div>
  );
}
