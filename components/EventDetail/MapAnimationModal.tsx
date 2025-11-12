'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { HistoricalEvent } from '@/types';
import { getEventColor } from '@/lib/utils';
import { daNang1858Config, EventAnimationConfig } from '@/components/EventAnimations/DaNang1858Animation';
import { AnimationStep } from '@/animations/events/DaNang1858Steps';

interface MapAnimationModalProps {
  event: HistoricalEvent;
  isOpen: boolean;
  onClose: () => void;
}

// AnimationStep interface đã import từ DaNang1858Steps

export default function MapAnimationModal({ event, isOpen, onClose }: MapAnimationModalProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const shipMarkerRef = useRef<L.Marker | null>(null);
  const explosionMarkerRef = useRef<L.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const shipPathRef = useRef<L.Polyline | null>(null);
  const shipTrailRef = useRef<[number, number][]>([]);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Lấy animation steps từ config của từng sự kiện
  const getAnimationConfig = (): EventAnimationConfig => {
    // Sự kiện Đà Nẵng 1858
    if (event.id === 'event-001') {
      return daNang1858Config;
    }

    // Nếu event có animationSteps trong data JSON, dùng luôn
    if (event.animationSteps && event.animationSteps.length > 0) {
      const stepsFromData: AnimationStep[] = event.animationSteps.map(step => ({
        time: step.time,
        description: step.description,
        action: 'marker' as const,
        position: step.location,
        zoom: step.zoom,
        markers: step.markers,
        paths: step.paths,
      }));

      return {
        steps: stepsFromData,
        getVoiceForStep: (stepIndex: number): string => {
          const step = event.animationSteps![stepIndex];
          return step ? `${step.title}. ${step.description}` : '';
        },
        eventName: event.name,
        eventId: event.id,
      };
    }

    // Fallback cho các sự kiện không có animation
    const fallbackSteps: AnimationStep[] = [{
      time: event.date.day ? `${event.date.day}/${event.date.month}/${event.date.year}` : `${event.date.year}`,
      description: event.shortDescription,
      action: 'marker' as const,
      position: event.location.coordinates as [number, number],
    }];

    return {
      steps: fallbackSteps,
      getVoiceForStep: (stepIndex: number): string => {
        const step = fallbackSteps[stepIndex];
        return step ? `${step.time}. ${step.description}` : '';
      },
      eventName: event.name,
      eventId: event.id,
    };
  };

  const animationConfig: EventAnimationConfig = getAnimationConfig();
  const animationSteps: AnimationStep[] = animationConfig.steps;

  // Speech synthesis với Edge TTS qua API route
  const speakText = async (text: string) => {
    // Stop any ongoing speech
    stopSpeech();

    setIsSpeaking(true);
    console.log('🎤 Bắt đầu đọc với Edge TTS:', text.substring(0, 50) + '...');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: 'hoaimy',  // Giọng nữ miền Nam
          rate: '-5%',       // Chậm 5% để dễ nghe
          pitch: '0Hz'       // Cao độ bình thường
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API lỗi: ${response.status}`);
      }

      const data = await response.json();

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);

        audio.onplay = () => {
          console.log('▶️ Đang phát audio Edge TTS');
        };

        audio.onended = () => {
          setIsSpeaking(false);
          console.log('✅ Kết thúc đọc');
        };

        audio.onerror = (e) => {
          console.error('❌ Lỗi phát audio:', e);
          setIsSpeaking(false);
        };

        speechSynthRef.current = audio as any;
        await audio.play();
      } else {
        throw new Error('API không trả về audio');
      }
    } catch (error) {
      console.error('❌ Lỗi Edge TTS:', error);
      setIsSpeaking(false);
    }
  };


  const stopSpeech = () => {
    // Stop Edge TTS audio if playing
    if (speechSynthRef.current && (speechSynthRef.current as any).pause) {
      (speechSynthRef.current as any).pause();
      (speechSynthRef.current as any).currentTime = 0;
    }

    setIsSpeaking(false);
  };


  // Đọc nội dung tổng quan khi bắt đầu animation (chỉ đọc 1 lần)
  useEffect(() => {
    if (isPlaying && mapReady && !hasPlayedIntro && animationConfig.getIntroVoice) {
      // Đọc phần tổng quan với nhịp nhấn (phù hợp cho FPT AI TTS)
      const introText = animationConfig.getIntroVoice(true);
      if (introText) {
        speakText(introText);
        setHasPlayedIntro(true);
      }
    }
  }, [isPlaying, mapReady, hasPlayedIntro]);

  // Stop speech khi pause hoặc close
  useEffect(() => {
    if (!isPlaying || !isOpen) {
      stopSpeech();
    }
  }, [isPlaying, isOpen]);

  // Debug
  useEffect(() => {
    console.log('Animation steps:', animationSteps);
    console.log('Current step:', currentStep);
    console.log('Is playing:', isPlaying);
  }, [animationSteps, currentStep, isPlaying]);

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: event.location.coordinates,
      zoom: 12,
      zoomControl: true,
    });

    // Google Maps Hybrid
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    // Wait for map to be ready
    setTimeout(() => {
      setMapReady(true);
      console.log('Map is ready');
      // Auto-start animation for event-001
      if (event.id === 'event-001') {
        setTimeout(() => {
          console.log('Auto-starting animation');
          setIsPlaying(true);
        }, 500);
      }
    }, 500);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Clear refs
      shipMarkerRef.current = null;
      explosionMarkerRef.current = null;
      shipPathRef.current = null;
      shipTrailRef.current = [];
      stopSpeech(); // Stop speech khi unmount
      setMapReady(false);
      setHasPlayedIntro(false); // Reset để có thể đọc lại khi mở lại
    };
  }, [isOpen, event]);

  // Animation logic
  useEffect(() => {
    console.log('Animation effect triggered:', { isPlaying, hasMap: !!mapRef.current, mapReady, stepsLength: animationSteps.length, currentStep });

    if (!isPlaying || !mapRef.current || !mapReady || animationSteps.length === 0) {
      console.log('Animation stopped:', { isPlaying, hasMap: !!mapRef.current, mapReady, stepsLength: animationSteps.length });
      return;
    }

    let startTime: number | null = null;
    const currentStepData = animationSteps[currentStep];

    console.log('Starting animation for step:', currentStepData);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const duration = currentStepData.duration || 3000;
      const progress = Math.min(elapsed / duration, 1);

      setProgress(progress * 100);

      // Animate based on action type
      if ((currentStepData.action === 'ship_move' || currentStepData.action === 'character_move') && currentStepData.position && currentStepData.targetPosition) {
        const isCharacter = currentStepData.action === 'character_move';
        // Create ship/character marker if doesn't exist
        if (!shipMarkerRef.current) {
          let iconUrl;

          if (isCharacter) {
            // SVG cho nhân vật Nguyễn Tri Phương
            const iconSvg = encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="charGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <!-- Body -->
                <ellipse cx="50" cy="70" rx="20" ry="15" fill="url(#charGrad)"/>
                <!-- Head -->
                <circle cx="50" cy="40" r="18" fill="#fbbf24"/>
                <!-- Hat -->
                <path d="M30 35 L50 20 L70 35 Z" fill="#dc2626"/>
                <rect x="25" y="35" width="50" height="5" fill="#dc2626"/>
                <!-- Sword -->
                <line x1="70" y1="60" x2="85" y2="75" stroke="#6b7280" stroke-width="3"/>
                <circle cx="85" cy="75" r="3" fill="#fbbf24"/>
                <!-- Flag -->
                <line x1="30" y1="60" x2="30" y2="30" stroke="#8b5cf6" stroke-width="2"/>
                <path d="M30 30 L45 35 L30 40 Z" fill="#ef4444"/>
              </svg>
            `);
            iconUrl = `data:image/svg+xml,${iconSvg}`;
          } else {
            // Icon PNG cho tàu chiến Pháp
            iconUrl = '/ship-icon.png';
          }

          const markerIcon = L.divIcon({
            html: `
              <div class="ship-animation-icon" style="
                width: 80px;
                height: 80px;
                background-image: url('${iconUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                cursor: pointer;
                animation: ${isCharacter ? 'none' : 'shipFloat 2s ease-in-out infinite'};
              "></div>
            `,
            className: isCharacter ? 'character-marker' : 'ship-marker',
            iconSize: [80, 80],
            iconAnchor: [40, 40],
          });
          shipMarkerRef.current = L.marker(currentStepData.position, { icon: markerIcon }).addTo(mapRef.current!);

          // Add click handler để hiển thị popup
          shipMarkerRef.current.on('click', () => {
            shipMarkerRef.current!.bindPopup(`
              <div style="min-width: 200px;">
                <h4 style="font-weight: bold; margin-bottom: 8px;">${currentStepData.time}</h4>
                <p style="margin: 0; font-size: 14px;">${currentStepData.description}</p>
              </div>
            `).openPopup();
          });
        }

        // Interpolate position
        const lat = currentStepData.position[0] + (currentStepData.targetPosition[0] - currentStepData.position[0]) * progress;
        const lng = currentStepData.position[1] + (currentStepData.targetPosition[1] - currentStepData.position[1]) * progress;
        shipMarkerRef.current.setLatLng([lat, lng]);

        // Update ship trail (vẽ đường đi của tàu)
        if (!isCharacter) {
          shipTrailRef.current.push([lat, lng]);

          if (!shipPathRef.current && mapRef.current) {
            // Tạo polyline mới cho đường đi
            shipPathRef.current = L.polyline([[lat, lng]], {
              color: '#3b82f6',
              weight: 3,
              opacity: 0.6,
              dashArray: '5, 5',
            }).addTo(mapRef.current);
          } else if (shipPathRef.current) {
            // Cập nhật polyline với trail hiện tại
            shipPathRef.current.setLatLngs(shipTrailRef.current);
          }
        }

        // Pan map to follow ship
        if (mapRef.current) {
          mapRef.current.panTo([lat, lng], { animate: false });
        }

        // Update rotation based on direction
        if (shipMarkerRef.current) {
          const dx = currentStepData.targetPosition[1] - currentStepData.position[1];
          const dy = currentStepData.targetPosition[0] - currentStepData.position[0];
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const iconElement = shipMarkerRef.current.getElement();
          if (iconElement) {
            const shipDiv = iconElement.querySelector('.ship-animation-icon');
            if (shipDiv) {
              (shipDiv as HTMLElement).style.transform = `rotate(${angle + 90}deg)`;
            }
          }
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Step completed
        handleStepComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStep]);

  const handleStepComplete = () => {
    const currentStepData = animationSteps[currentStep];

    if (currentStepData.action === 'explosion') {
      // Show explosion
      if (currentStepData.position) {
        const explosionIcon = L.divIcon({
          html: `
            <div class="explosion-marker" style="
              width: 60px;
              height: 60px;
              animation: explode 0.5s ease-out;
            ">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="#ef4444" opacity="0.8">
                  <animate attributeName="r" from="5" to="25" dur="0.5s" fill="freeze"/>
                  <animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="freeze"/>
                </circle>
                <circle cx="30" cy="30" r="15" fill="#f59e0b" opacity="0.6">
                  <animate attributeName="r" from="3" to="15" dur="0.5s" fill="freeze"/>
                </circle>
              </svg>
            </div>
          `,
          className: 'explosion',
          iconSize: [60, 60],
          iconAnchor: [30, 30],
        });

        if (explosionMarkerRef.current) {
          explosionMarkerRef.current.remove();
        }
        explosionMarkerRef.current = L.marker(currentStepData.position, { icon: explosionIcon }).addTo(mapRef.current!);

        // Remove after animation
        setTimeout(() => {
          if (explosionMarkerRef.current) {
            explosionMarkerRef.current.remove();
            explosionMarkerRef.current = null;
          }
        }, 1000);
      }
    } else if (currentStepData.action === 'landing' || currentStepData.action === 'marker') {
      // Show permanent marker
      if (currentStepData.position) {
        const isPhapcChiem = event.name.includes('Pháp');
        const color = isPhapcChiem ? '#dc2626' : getEventColor(event.type);

        // Icon đặc biệt cho sự kiện "Pháp chiếm"
        const xIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        const markerIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${isPhapcChiem ? xIcon : ''}
            </div>
          `,
          className: 'event-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker(currentStepData.position, { icon: markerIcon }).addTo(mapRef.current!);

        // Vẽ vòng tròn nét đứt màu đỏ cho sự kiện "Pháp chiếm"
        if (isPhapcChiem) {
          const circle = L.circle(currentStepData.position, {
            color: '#dc2626',
            fillColor: '#dc2626',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '10, 10',
            radius: 3000, // 3km bán kính
          });
          circle.addTo(mapRef.current!);
        }
      }
    } else if (currentStepData.action === 'defense_line') {
      // Vẽ tuyến phòng thủ
      if (currentStepData.position) {
        const center = currentStepData.position;
        // Vẽ vòng tròn phòng thủ
        L.circle(center, {
          radius: 3000,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.2,
          weight: 3,
          dashArray: '10, 10',
        }).addTo(mapRef.current!);

        // Marker phòng tuyến
        const defenseIcon = L.divIcon({
          html: `
            <div style="
              background-color: #10b981;
              width: 36px;
              height: 36px;
              border-radius: 4px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
            ">🛡️</div>
          `,
          className: 'defense-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        L.marker(center, { icon: defenseIcon }).addTo(mapRef.current!);
      }
    } else if (currentStepData.action === 'fortification') {
      // Hiển thị công sự phòng thủ
      if (currentStepData.position) {
        const fortIcon = L.divIcon({
          html: `
            <div class="fortification-marker" style="
              width: 50px;
              height: 50px;
              animation: pulse 1s ease-out;
            ">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <rect x="5" y="15" width="40" height="30" fill="#78716c" stroke="#57534e" stroke-width="2"/>
                <rect x="10" y="10" width="8" height="10" fill="#78716c" stroke="#57534e" stroke-width="1"/>
                <rect x="21" y="10" width="8" height="10" fill="#78716c" stroke="#57534e" stroke-width="1"/>
                <rect x="32" y="10" width="8" height="10" fill="#78716c" stroke="#57534e" stroke-width="1"/>
                <rect x="18" y="25" width="14" height="20" fill="#44403c"/>
              </svg>
            </div>
          `,
          className: 'fortification',
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        });
        L.marker(currentStepData.position, { icon: fortIcon }).addTo(mapRef.current!);
      }
    } else if (currentStepData.action === 'disease') {
      // Hiển thị khu vực bị bệnh
      if (currentStepData.position) {
        // Vòng tròn đỏ cho khu vực bệnh
        L.circle(currentStepData.position, {
          radius: 2000,
          color: '#dc2626',
          fillColor: '#dc2626',
          fillOpacity: 0.3,
          weight: 2,
          dashArray: '5, 5',
        }).addTo(mapRef.current!);

        // Multiple explosion markers cho bệnh tật
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const offset = 0.01;
            const pos: [number, number] = [
              currentStepData.position![0] + (Math.random() - 0.5) * offset,
              currentStepData.position![1] + (Math.random() - 0.5) * offset,
            ];

            const diseaseIcon = L.divIcon({
              html: `
                <div style="
                  font-size: 30px;
                  animation: fadeInOut 2s ease-in-out;
                ">💀</div>
              `,
              className: 'disease-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            });
            L.marker(pos, { icon: diseaseIcon }).addTo(mapRef.current!);
          }, i * 500);
        }
      }
    } else if (currentStepData.action === 'stalemate') {
      // Hiển thị thế bế tắc
      if (currentStepData.position) {
        const stalemateIcon = L.divIcon({
          html: `
            <div style="
              background: linear-gradient(135deg, #ef4444 50%, #10b981 50%);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 2px 12px rgba(0,0,0,0.6);
              animation: pulse 2s infinite;
            "></div>
          `,
          className: 'stalemate-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
        L.marker(currentStepData.position, { icon: stalemateIcon }).addTo(mapRef.current!);
      }
    }

    // Auto advance to next step or pause at end
    setTimeout(() => {
      if (currentStep < animationSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
      }
    }, 500);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause clicked:', { isPlaying, mapReady, currentStep, stepsLength: animationSteps.length });

    if (!mapReady) {
      console.log('Map not ready yet');
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= animationSteps.length - 1) {
        // Reset if at end
        console.log('Resetting animation');
        resetAnimation();
        setTimeout(() => setIsPlaying(true), 100);
      } else {
        setIsPlaying(true);
      }
    }
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setHasPlayedIntro(false); // Reset để có thể đọc lại intro
    stopSpeech(); // Stop speech khi reset

    // Remove all markers
    if (shipMarkerRef.current) {
      shipMarkerRef.current.remove();
      shipMarkerRef.current = null;
    }
    if (explosionMarkerRef.current) {
      explosionMarkerRef.current.remove();
      explosionMarkerRef.current = null;
    }

    // Clear ship path and trail
    if (shipPathRef.current) {
      shipPathRef.current.remove();
      shipPathRef.current = null;
    }
    shipTrailRef.current = [];

    // Clear map
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer !== shipMarkerRef.current && layer !== explosionMarkerRef.current) {
          mapRef.current!.removeLayer(layer);
        }
      });
    }
  };

  const nextStep = () => {
    if (currentStep < animationSteps.length - 1) {
      setIsPlaying(false);
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  const currentStepData = animationSteps[currentStep] || animationSteps[0];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">{event.name}</h2>
            <p className="text-sm text-gray-600">{currentStepData?.time}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Current step info overlay */}
          {currentStepData && (
            <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-4 shadow-lg max-w-md z-[1000]">
              <div className="flex items-start justify-between mb-1">
                <div className="text-sm font-semibold text-gray-700">
                  {currentStepData.time}
                </div>
                {isSpeaking && (
                  <div className="flex items-center gap-1 text-blue-600 animate-pulse">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7 1.025l1.5 4a.75.75 0 00.7.475h1.5l3.87 3.796A.75.75 0 0011 15.75v-12zm5.304-.955l-1.008 1.008A6.5 6.5 0 0116.5 10a6.5 6.5 0 01-2.204 6.197l1.008 1.008A8 8 0 0018 10a8 8 0 00-2.696-7.205z" />
                      <path d="M13.232 5.232l-1.008 1.008A2.5 2.5 0 0113.5 10a2.5 2.5 0 01-1.276 3.76l1.008 1.008A4 4 0 0015 10a4 4 0 00-1.768-4.768z" />
                    </svg>
                    <span className="text-xs">Đang đọc...</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {currentStepData.description}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Action: {currentStepData.action} | Event ID: {event.id}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Bước {currentStep + 1} / {animationSteps.length}</span>
              <span>{Math.round(((currentStep + progress / 100) / animationSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + progress / 100) / animationSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetAnimation}
              className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handlePlayPause}
              disabled={!mapReady}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!mapReady ? 'Đang tải bản đồ...' : ''}
            >
              {!mapReady ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Phát</span>
                </>
              )}
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep >= animationSteps.length - 1}
              className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Bước tiếp theo"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes explode {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          30% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.9;
          }
          60% {
            transform: scale(2) rotate(360deg);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5) rotate(540deg);
            opacity: 0;
          }
        }
        
        @keyframes shipFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .explosion-marker {
          animation: explode 1s ease-out;
          pointer-events: none;
        }
        
        .ship-marker {
          z-index: 1000 !important;
        }
      `}} />
    </div>
  );
}

