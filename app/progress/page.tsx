'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '@/components/Gamification/ProgressBar';
import BadgesGrid from '@/components/Gamification/BadgesGrid';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tiến trình học tập của bạn
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi thành tích và huy hiệu bạn đã đạt được
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Badges Grid */}
        <BadgesGrid />
      </div>
    </div>
  );
}
