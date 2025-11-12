'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HistoricalEvent } from '@/types';
import { getEventColor } from '@/lib/utils';
import MapAnimationModal from './MapAnimationModal';

interface MiniMapProps {
  event: HistoricalEvent;
}

export default function MiniMap({ event }: MiniMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: event.location.coordinates,
      zoom: 10,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
    });

    // Google Maps Hybrid layer - hiển thị đầy đủ các đảo
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
    }).addTo(map);

    // Add marker
    const isPhapcChiem = event.name.includes('Pháp');
    const color = isPhapcChiem ? '#dc2626' : getEventColor(event.type);
    
    // Icon đặc biệt cho sự kiện "Pháp"
    const xIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      ">${isPhapcChiem ? xIcon : ''}</div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker(event.location.coordinates, { icon: customIcon }).addTo(map);
    
    // Vẽ vòng tròn nét đứt màu đỏ cho sự kiện "Pháp"
    if (isPhapcChiem) {
      L.circle(event.location.coordinates, {
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '10, 10',
        radius: 3000, // 3km bán kính
      }).addTo(map);
    }

    // Click to open modal
    map.on('click', () => {
      setIsModalOpen(true);
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      setIsModalOpen(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [event]);

  return (
    <>
      <div 
        ref={mapContainerRef} 
        className="w-full h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        title="Click để xem animation chi tiết"
      />
      {isModalOpen && (
        <MapAnimationModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

