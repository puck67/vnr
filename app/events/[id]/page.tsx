'use client';

import { notFound } from 'next/navigation';
import { useState, use, useEffect } from 'react';
import dynamic from 'next/dynamic';
import eventsData from '@/data/events.json';
import charactersData from '@/data/characters.json';
import { HistoricalEvent, Character } from '@/types';
import EventHeader from '@/components/EventDetail/EventHeader';
import EventTimeline from '@/components/EventDetail/EventTimeline';
import EventContent from '@/components/EventDetail/EventContent';
import RelatedEvents from '@/components/EventDetail/RelatedEvents';
import FunFacts from '@/components/EventDetail/FunFacts';
import VideoSection from '@/components/EventDetail/VideoSection';
import VoiceNarration from '@/components/EventDetail/VoiceNarration';
import QuizModal from '@/components/Quiz/QuizModal';
// import QuizHistory from '@/components/Quiz/QuizHistory';
import SocialShare from '@/components/Share/SocialShare';
import { GamificationService, getLevel } from '@/lib/gamification';
import { BookCheck, Map, Play } from 'lucide-react';

const MiniMap = dynamic(() => import('@/components/EventDetail/MiniMap'), {
  ssr: false,
});

const MapAnimationModal = dynamic(() => import('@/components/EventDetail/MapAnimationModal'), {
  ssr: false,
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);

  const events = (eventsData || []) as HistoricalEvent[];
  const characters = (charactersData || []) as Character[];

  // Track event view and add gamification points
  useEffect(() => {
    const { newBadges, pointsEarned } = GamificationService.addViewedEvent(id);
    
    if (pointsEarned > 0) {
      // Dispatch points earned event
      window.dispatchEvent(new CustomEvent('points-earned', { 
        detail: { points: pointsEarned } 
      }));

      // Check for level up
      const progress = GamificationService.getProgress();
      const oldLevel = getLevel(progress.points - pointsEarned);
      const newLevel = getLevel(progress.points);
      
      if (newLevel > oldLevel) {
        window.dispatchEvent(new CustomEvent('level-up', { 
          detail: { level: newLevel } 
        }));
      }
    }

    // Dispatch badge unlocks
    newBadges.forEach(badge => {
      window.dispatchEvent(new CustomEvent('badge-unlocked', { 
        detail: { badge } 
      }));
    });

    // Update gamification UI
    window.dispatchEvent(new Event('gamification-update'));
  }, [id]);

  // Handle retake quiz event
  useEffect(() => {
    const handleRetakeQuiz = (event: CustomEvent) => {
      if (event.detail.eventId === id) {
        setIsQuizOpen(true);
      }
    };

    window.addEventListener('retake-quiz', handleRetakeQuiz as EventListener);
    return () => {
      window.removeEventListener('retake-quiz', handleRetakeQuiz as EventListener);
    };
  }, [id]);

  const event = events.find(e => e.id === id);

  if (!event) {
    notFound();
  }

  // Lấy thông tin nhân vật liên quan
  const relatedCharacters = characters.filter(c =>
    event.relatedCharacters.includes(c.id)
  );

  // Lấy sự kiện liên quan
  const relatedEvents = events.filter(e =>
    event.relatedEvents.includes(e.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EventHeader event={event} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <EventTimeline event={event} />

            {/* Content */}
            <EventContent event={event} relatedCharacters={relatedCharacters} />

            {/* Voice Narration */}
            {event.narrationText && (
              <VoiceNarration 
                text={event.narrationText} 
                title="Thuyết minh AI"
              />
            )}

            {/* Map Animation Button */}
            {event.animationSteps && event.animationSteps.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                      <Map className="w-6 h-6 text-green-600" />
                      <span>Diễn biến trên bản đồ</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Xem {event.animationSteps.length} bước diễn biến chi tiết trên bản đồ tương tác
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsAnimationOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Xem diễn biến</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {event.animationSteps.map((step, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                    >
                      {index + 1}. {step.time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {event.videoUrl && (
              <VideoSection videoUrl={event.videoUrl} eventName={event.name} />
            )}

            {/* Fun Facts */}
            {event.funFacts.length > 0 && <FunFacts facts={event.funFacts} />}

            {/* Quiz Button */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <BookCheck className="text-purple-600" />
                <span>Kiểm tra kiến thức</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Làm quiz để kiểm tra mức độ hiểu biết của bạn về sự kiện này!
              </p>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Bắt đầu Quiz
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Share */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-bold text-lg mb-4">Chia sẻ sự kiện</h3>
              <SocialShare event={event} />
            </div>

            {/* Mini Map */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-bold text-lg mb-4">Vị trí</h3>
              <MiniMap event={event} />
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 7-10 12-10 12s-10-5-10-12a10 10 0 0 1 20 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {event.location.name}
              </p>
            </div>

            {/* Quiz History - Temporarily disabled */}
            {/* <div className="bg-white rounded-lg shadow-lg p-4">
              <QuizHistory eventId={event.id} limit={5} />
            </div> */}

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <RelatedEvents events={relatedEvents} />
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        eventId={event.id}
      />

      {/* Map Animation Modal */}
      {isAnimationOpen && (
        <MapAnimationModal
          event={event}
          isOpen={isAnimationOpen}
          onClose={() => setIsAnimationOpen(false)}
        />
      )}
    </div>
  );
}

