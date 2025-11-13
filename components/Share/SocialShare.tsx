'use client';

import { useState, useEffect, useRef } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, Check, Download } from 'lucide-react';
import { HistoricalEvent } from '@/types';
import { GamificationService } from '@/lib/gamification';

interface SocialShareProps {
  event: HistoricalEvent;
}

export default function SocialShare({ event }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = `${event.name} - Lịch sử Việt Nam`;
  const description = event.shortDescription;

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    addSharePoints();
  };

  const shareToTwitter = () => {
    const text = `${title}\n\n${description}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    addSharePoints();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addSharePoints();
      
      // Show toast
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('points-earned', { 
          detail: { points: 30 } 
        }));
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addSharePoints = () => {
    GamificationService.addSharedEvent();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('gamification-update'));
    }
  };

  const downloadImage = async () => {
    // TODO: Implement image generation and download
    console.log('Download feature coming soon!');
  };

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold">Chia sẻ</span>
      </button>

      {/* Share Options */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
          />

          {/* Share Menu */}
          <div className="absolute top-full mt-2 left-0 z-[1000] bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-4 w-[280px] animate-slide-in-up">
            <h4 className="font-bold text-lg mb-4 text-gray-900">Chia sẻ sự kiện</h4>
            
            <div className="space-y-2">
              {/* Facebook */}
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group border-2 border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white" fill="white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-900">Facebook</p>
                  <p className="text-sm text-gray-600">Chia sẻ lên Facebook</p>
                </div>
              </button>

              {/* Twitter */}
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-100 hover:from-sky-100 hover:to-cyan-200 transition-all group border-2 border-sky-200"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6 text-white" fill="white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-900">Twitter / X</p>
                  <p className="text-sm text-gray-600">Chia sẻ lên Twitter</p>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 transition-all group border-2 border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {copied ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <LinkIcon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-900">
                    {copied ? 'Đã sao chép!' : 'Sao chép link'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {copied ? 'Link đã được sao chép' : 'Sao chép URL vào clipboard'}
                  </p>
                </div>
              </button>

              {/* Download Image - Coming soon */}
              <button
                onClick={downloadImage}
                disabled
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-100 opacity-50 cursor-not-allowed border-2 border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-900">Tải hình ảnh</p>
                  <p className="text-sm text-gray-600">Sắp ra mắt...</p>
                </div>
              </button>
            </div>

            {/* Earn points notice */}
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
              <p className="text-sm text-center text-yellow-800">
                <span className="font-bold">+30 điểm</span> khi chia sẻ!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
