'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Calendar, MapPin, Map, Satellite, Globe, Mountain } from 'lucide-react';
import { HistoricalEvent, MapFilters } from '@/types';
import { getEventColor, getEventIcon } from '@/lib/utils';

interface InteractiveMapProps {
  events: HistoricalEvent[];
  filters?: MapFilters;
  highlightedEventIds?: string[];
  onEventClick?: (event: HistoricalEvent) => void;
  showJourneyPath?: boolean;
  journeyPoints?: Array<{ location: [number, number]; description: string }>;
  currentYear?: number;
  isPlaying?: boolean; // Kiểm tra có đang phát animation không
}

type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

export default function InteractiveMap({
  events,
  filters,
  highlightedEventIds = [],
  onEventClick,
  showJourneyPath = false,
  journeyPoints = [],
  currentYear = 1858,
  isPlaying = false,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const journeyLineRef = useRef<L.Polyline | null>(null);
  const currentLayerRef = useRef<L.TileLayer | null>(null);
  const historicalOverlayRef = useRef<L.Polygon[]>([]);
  const historicalInfoBoxRef = useRef<L.Control | null>(null);
  const [mapType, setMapType] = useState<MapType>('roadmap');

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Tạo bản đồ với center tại Việt Nam
    const map = L.map(mapContainerRef.current, {
      center: [14.0, 109.0], // Dịch sang đông để hiển thị Hoàng Sa và Trường Sa
      zoom: 6,
      minZoom: 4,
      maxZoom: 18,
    });

    // Google Maps Road layer - hiển thị đầy đủ các đảo
    const googleRoadLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });

    googleRoadLayer.addTo(map);
    currentLayerRef.current = googleRoadLayer;

    // Tạo custom pane cho markers để control z-index
    map.createPane('eventMarkers');
    map.getPane('eventMarkers')!.style.zIndex = '650';

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Thay đổi loại bản đồ
  useEffect(() => {
    if (!mapRef.current) return;

    // Xóa layer cũ
    if (currentLayerRef.current) {
      currentLayerRef.current.remove();
    }

    let newLayer: L.TileLayer;

    switch (mapType) {
      case 'roadmap':
        // Google Maps Road
        newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
        });
        break;
      case 'satellite':
        // Google Satellite
        newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
        });
        break;
      case 'hybrid':
        // Google Hybrid (Satellite + Labels)
        newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
        });
        break;
      case 'terrain':
        // Google Terrain
        newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
        });
        break;
      default:
        newLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: '© Google Maps',
          maxZoom: 20,
        });
    }

    newLayer.addTo(mapRef.current);
    currentLayerRef.current = newLayer;
  }, [mapType]);

  // Cập nhật markers khi events hoặc filters thay đổi
  useEffect(() => {
    if (!mapRef.current) return;

    // Xóa markers cũ
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter events
    let filteredEvents = events;
    if (filters) {
      filteredEvents = events.filter(event => {
        if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.type)) {
          return false;
        }
        if (filters.regions.length > 0 && !filters.regions.includes(event.location.region)) {
          return false;
        }
        if (filters.yearRange) {
          const [minYear, maxYear] = filters.yearRange;
          if (event.date.year < minYear || event.date.year > maxYear) {
            return false;
          }
        }
        if (filters.characterId) {
          if (!event.relatedCharacters.includes(filters.characterId)) {
            return false;
          }
        }
        return true;
      });
    }

    // Tạo markers mới
    filteredEvents.forEach(event => {
      const isHighlighted = highlightedEventIds.includes(event.id);
      const isPhapcChiem = event.name.includes('Pháp');
      const color = isPhapcChiem ? '#dc2626' : getEventColor(event.type);

      // Icon đặc biệt cho sự kiện "Pháp chiếm"
      const xIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

      // Tạo custom icon
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: ${isHighlighted ? '32px' : '24px'};
          height: ${isHighlighted ? '32px' : '24px'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isHighlighted ? '18px' : '14px'};
          transition: all 0.3s ease;
          cursor: pointer;
        ">
          ${isPhapcChiem ? xIcon : getEventIcon(event.type)}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [isHighlighted ? 32 : 24, isHighlighted ? 32 : 24],
        iconAnchor: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
      });

      const marker = L.marker(event.location.coordinates, {
        icon: customIcon,
        pane: 'eventMarkers',
      });

      // Vẽ vòng tròn nét đứt màu đỏ cho sự kiện "Pháp chiếm"
      if (isPhapcChiem) {
        const circle = L.circle(event.location.coordinates, {
          color: '#dc2626',
          fillColor: '#dc2626',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '10, 10',
          radius: 3000, // 3km bán kính
        });
        circle.addTo(mapRef.current!);
        markersRef.current.push(circle as any);
      }

      // Popup
      const popupContent = `
        <div style="min-width: 200px; max-width: 300px; padding: 4px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.3;">
            ${event.name}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${formatDate(event.date)}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M20 10c0 7-10 12-10 12s-10-5-10-12a10 10 0 0 1 20 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${event.location.name}
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; line-height: 1.4;">
            ${event.shortDescription}
          </p>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('event-click', { detail: '${event.id}' }))"
            style="
              background: #3b82f6;
              color: #ffffff !important;
              border: none !important;
              padding: 14px 20px !important;
              border-radius: 12px !important;
              cursor: pointer !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              width: 100% !important;
              box-sizing: border-box !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 8px !important;
              text-decoration: none !important;
              outline: none !important;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
              text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
              letter-spacing: 0.3px !important;
              position: relative !important;
              overflow: hidden !important;
            "
            onmouseover="
              this.style.transform='translateY(-2px) scale(1.02)'; 
              this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)';
              this.style.background='#2563eb';
            "
            onmouseout="
              this.style.transform='translateY(0) scale(1)'; 
              this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)';
              this.style.background='#3b82f6';
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="21 21l-4.35-4.35"></path>
            </svg>
            <span>Xem chi tiết</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [events, filters, highlightedEventIds]);

  // Xử lý journey path
  useEffect(() => {
    if (!mapRef.current) return;

    // Xóa journey line cũ
    if (journeyLineRef.current) {
      journeyLineRef.current.remove();
      journeyLineRef.current = null;
    }

    if (showJourneyPath && journeyPoints.length > 1) {
      const coordinates = journeyPoints.map(point => point.location);

      const journeyLine = L.polyline(coordinates, {
        color: '#ef4444',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
      });

      journeyLine.addTo(mapRef.current);
      journeyLineRef.current = journeyLine;

      // Fit bounds để hiển thị toàn bộ journey
      mapRef.current.fitBounds(journeyLine.getBounds(), { padding: [50, 50] });
    }
  }, [showJourneyPath, journeyPoints]);

  // Hiển thị overlay bản đồ lịch sử theo năm
  useEffect(() => {
    if (!mapRef.current) return;

    // Xóa overlay cũ (polygons)
    historicalOverlayRef.current.forEach(polygon => polygon.remove());
    historicalOverlayRef.current = [];

    // Xóa info box cũ
    if (historicalInfoBoxRef.current) {
      historicalInfoBoxRef.current.remove();
      historicalInfoBoxRef.current = null;
    }

    // Tạo overlay thông tin năm - CHỈ HIỆN KHI KHÔNG ĐANG PHÁT ANIMATION
    const yearInfo = getHistoricalContext(currentYear);
    if (yearInfo && !isPlaying) {
      // Tạo info box hiển thị thông tin lịch sử
      const infoHtml = `
        <div style="
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 300px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        ">
          <div style="
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Năm ${currentYear}
          </div>
          <div style="
            font-size: 14px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 12px;
            border-left: 3px solid rgba(255, 255, 255, 0.5);
            padding-left: 12px;
          ">
            ${yearInfo.description}
          </div>
          <div style="
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
          ">
            ${yearInfo.territory}
          </div>
        </div>
      `;

      const InfoBoxControl = L.Control.extend({
        onAdd: function () {
          const div = L.DomUtil.create('div', 'historical-info');
          div.innerHTML = infoHtml;
          div.style.cssText = 'margin-bottom: 140px; margin-left: 10px;';
          return div;
        },
      });

      const infoBox = new InfoBoxControl({ position: 'bottomleft' });
      infoBox.addTo(mapRef.current);
      historicalInfoBoxRef.current = infoBox;

      // Vẽ ranh giới lãnh thổ (nếu có) - DISABLED: Bỏ hiển thị boundaries
      // if (yearInfo.boundaries) {
      //   yearInfo.boundaries.forEach(boundary => {
      //     const polygon = L.polygon(boundary.coordinates, {
      //       color: boundary.color,
      //       fillColor: boundary.fillColor,
      //       fillOpacity: 0.2,
      //       weight: 2,
      //       dashArray: boundary.controlled ? '' : '10, 10',
      //     }).addTo(mapRef.current!);

      //     polygon.bindTooltip(boundary.label, {
      //       permanent: false,
      //       direction: 'center',
      //       className: 'territory-tooltip',
      //     });

      //     historicalOverlayRef.current.push(polygon);
      //   });
      // }
    }
  }, [currentYear]);

  // Lắng nghe event click từ popup
  useEffect(() => {
    const handleEventClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const eventId = customEvent.detail;
      const event = events.find(ev => ev.id === eventId);
      if (event && onEventClick) {
        onEventClick(event);
      }
    };

    window.addEventListener('event-click', handleEventClick);
    return () => window.removeEventListener('event-click', handleEventClick);
  }, [events, onEventClick]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg shadow-lg"
        style={{ minHeight: '500px' }}
      />

      {/* Map Type Selector */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${mapType === 'roadmap'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Bản đồ đường (Road Map)"
        >
          <Map className="w-4 h-4" />
          Đường
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${mapType === 'satellite'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Bản đồ vệ tinh (Satellite)"
        >
          <Satellite className="w-4 h-4" />
          Vệ tinh
        </button>
        <button
          onClick={() => setMapType('hybrid')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${mapType === 'hybrid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Bản đồ lai (Hybrid)"
        >
          <Globe className="w-4 h-4" />
          Lai
        </button>
        <button
          onClick={() => setMapType('terrain')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${mapType === 'terrain'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Bản đồ địa hình (Terrain)"
        >
          <Mountain className="w-4 h-4" />
          Địa hình
        </button>
      </div>

      {/* Attribution for islands */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded px-3 py-2 text-xs shadow-lg z-[1000] flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Quần đảo Hoàng Sa và Trường Sa là của Việt Nam
      </div>
    </div>
  );
}

// Helper functions
function formatDate(date: { year: number; month?: number; day?: number }): string {
  const parts: string[] = [];
  if (date.day) parts.push(`${date.day}`);
  if (date.month) parts.push(`tháng ${date.month}`);
  parts.push(`năm ${date.year}`);
  return parts.join(' ');
}

// Thông tin lịch sử theo năm
interface HistoricalContext {
  description: string;
  territory: string;
  boundaries?: Array<{
    label: string;
    coordinates: [number, number][];
    color: string;
    fillColor: string;
    controlled: boolean; // true = Việt Nam kiểm soát, false = Pháp chiếm
  }>;
}

function getHistoricalContext(year: number): HistoricalContext | null {
  // 1858 - Pháp bắt đầu xâm lược
  if (year === 1858) {
    return {
      description: 'Ngày 1/9/1858: Liên quân Pháp–Tây Ban Nha (Đô đốc Rigault de Genouilly) nổ súng chiếm cửa Hàn, đổ bộ bán đảo Sơn Trà. Đại Nam điều Nguyễn Tri Phương ra vây hãm. Liên quân sa lầy vì bệnh tật & địa hình, không tiến sâu được. Đây là năm mở cửa cuộc chiến, chưa mất lãnh thổ.',
      territory: 'Lãnh thổ: Toàn vẹn thuộc triều Tự Đức. Pháp chỉ kiểm soát đầu cầu Đà Nẵng (cửa Hàn–Sơn Trà)',
      boundaries: [
        {
          label: 'Thành Điện Hải - Công sự trọng yếu (24 Trần Phú, bờ Tây sông Hàn)',
          coordinates: [
            [16.058, 108.218],
            [16.065, 108.218],
            [16.065, 108.225],
            [16.058, 108.225],
          ],
          color: '#dc2626',
          fillColor: '#dc2626',
          controlled: false,
        },
        {
          label: 'Đồn An Hải - Công sự bờ Đông (An Hải Tây, đối xứng với Điện Hải)',
          coordinates: [
            [16.056, 108.228],
            [16.063, 108.228],
            [16.063, 108.234],
            [16.056, 108.234],
          ],
          color: '#dc2626',
          fillColor: '#dc2626',
          controlled: false,
        },
        {
          label: 'Khu vực công sự khống chế cảng - Cửa Hàn (9/1858)',
          coordinates: [
            [16.088, 108.210],
            [16.098, 108.210],
            [16.098, 108.223],
            [16.088, 108.223],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
        {
          label: 'Tuyến vây hãm của Nguyễn Tri Phương (cuối 1858)',
          coordinates: [
            [15.95, 108.10],
            [16.18, 108.10],
            [16.18, 108.35],
            [15.95, 108.35],
          ],
          color: '#10b981',
          fillColor: '#10b981',
          controlled: true,
        },
      ],
    };
  }

  // 1859 - Pháp chiếm Gia Định
  if (year === 1859) {
    return {
      description: 'Năm bản lề: 2/2/1859 Pháp rút khỏi Đà Nẵng, 17/2/1859 chiếm thành Gia Định theo sông Lòng Tàu. Thành thất thủ sau vài giờ pháo kích, Pháp phá hủy toàn bộ để tránh tái chiếm. Nguyễn Tri Phương vẫn giữ Đà Nẵng, vây lỏng quân Pháp còn lại. Đây là lần đầu Pháp có chỗ đứng chân ở Nam Kỳ, mở đầu chiếm dần sau này.',
      territory: 'Lãnh thổ: Pháp chiếm đầu cầu Gia Định-Sài Gòn, nhưng bị vây từ Gò Công, Tân An, Biên Hòa. Chưa mất toàn Nam Kỳ.',
      boundaries: [
        {
          label: 'Vùng Pháp chiếm ở Nam Kỳ (Gia Định)',
          coordinates: [
            [10.5, 106.3],
            [11.0, 106.3],
            [11.0, 107.0],
            [10.5, 107.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1862 - Ký Hòa ước Nhâm Tuất
  if (year >= 1862 && year <= 1866) {
    return {
      description: 'Triều đình Huế ký Hòa ước Nhâm Tuất (6/1862), nhượng 3 tỉnh miền Đông Nam Kỳ (Biên Hòa, Gia Định, Định Tường) + Côn Lôn cho Pháp.',
      territory: 'Lãnh thổ mất: 3 tỉnh Biên Hòa, Gia Định, Định Tường',
      boundaries: [
        {
          label: '3 tỉnh miền Đông Nam Kỳ (Pháp chiếm)',
          coordinates: [
            [10.0, 106.0],
            [11.5, 106.0],
            [11.5, 107.5],
            [10.0, 107.5],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1867 - Pháp chiếm toàn bộ Nam Kỳ (6 tỉnh)
  if (year >= 1867 && year <= 1873) {
    return {
      description: 'Pháp chiếm toàn bộ 6 tỉnh Nam Kỳ (1867): Vĩnh Long, An Giang, Hà Tiên. Nam Kỳ trở thành thuộc địa hoàn toàn.',
      territory: 'Lãnh thổ mất: Toàn bộ Nam Kỳ (Lục tỉnh)',
      boundaries: [
        {
          label: 'Nam Kỳ - Thuộc địa Pháp (6 tỉnh)',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1873-1874 - Chiến dịch Bắc Kỳ lần 1 (Garnier)
  if (year >= 1873 && year <= 1881) {
    return {
      description: 'Garnier chiếm Hà Nội (11/1873), bị Cờ Đen tiêu diệt (12/1873). Hòa ước Giáp Tuất (1874) xác nhận Nam Kỳ thuộc Pháp, mở cửa thông thương.',
      territory: 'Lãnh thổ mất: Nam Kỳ (thuộc địa); Bắc–Trung Kỳ chịu ảnh hưởng Pháp',
      boundaries: [
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1882-1883 - Rivière chiếm Hà Nội lần 2
  if (year >= 1882 && year <= 1883) {
    return {
      description: 'Rivière chiếm Hà Nội (4/1882), tử trận ở Cầu Giấy (1883). Pháp ép ký Hiệp ước Harmand (8/1883) đặt nền bảo hộ Bắc–Trung Kỳ.',
      territory: 'Lãnh thổ: Nam Kỳ thuộc địa; Bắc–Trung Kỳ bắt đầu bị bảo hộ',
      boundaries: [
        {
          label: 'Hà Nội - Pháp chiếm đóng',
          coordinates: [
            [20.8, 105.6],
            [21.2, 105.6],
            [21.2, 106.0],
            [20.8, 106.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1884 - Hiệp ước Patenôtre - hoàn tất bảo hộ
  if (year >= 1884 && year <= 1884) {
    return {
      description: 'Hiệp ước Patenôtre (6/1884) hoàn tất chế độ bảo hộ. Trung Quốc ký Thiên Tân (1885), bỏ quyền "chủ tịch" với Việt Nam.',
      territory: 'Lãnh thổ: Nam Kỳ thuộc địa; Bắc–Trung Kỳ bảo hộ',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1885-1896 - Phong trào Cần Vương
  if (year >= 1885 && year <= 1896) {
    return {
      description: `Chiếu Cần Vương (7/1885) của vua Hàm Nghi. Khởi nghĩa Ba Đình (1886–87), Bãi Sậy (1885–92), Hương Khê (1885–95, Phan Đình Phùng). Yên Thế (Hoàng Hoa Thám) bắt đầu.`,
      territory: 'Lãnh thổ: Toàn bộ đất nước thuộc Pháp (Nam Kỳ thuộc địa, Bắc–Trung bảo hộ)',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1887 - Lập Liên bang Đông Dương
  if (year >= 1887 && year <= 1896) {
    return {
      description: 'Liên bang Đông Dương (1887): Việt Nam (3 kỳ) + Campuchia. Phong trào Cần Vương thoái trào cuối thập niên 1890.',
      territory: 'Lãnh thổ: Việt Nam thuộc Liên bang Đông Dương (Pháp)',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1897-1907 - Khai thác thuộc địa lần I & Duy tân
  if (year >= 1897 && year <= 1907) {
    return {
      description: `Toàn quyền Paul Doumer (1897): siết thuế, độc quyền, hạ tầng. Phong trào Đông Du (1905–08), Đông Kinh Nghĩa Thục (1907).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - Pháp khai thác mạnh',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1908-1913 - Phong trào chống thuế & Việt Nam Quang Phục Hội
  if (year >= 1908 && year <= 1913) {
    return {
      description: `Phong trào chống thuế Trung Kỳ (1908) bị đàn áp. Việt Nam Quang Phục Hội (1912, Phan Bội Châu). Yên Thế kết thúc (1913).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - Pháp đàn áp phong trào',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1914-1918 - Thế chiến I
  if (year >= 1914 && year <= 1918) {
    return {
      description: `Thế chiến I: Pháp vắt kiệt thuộc địa. Mưu khởi nghĩa Duy Tân (1916) thất bại. Khởi nghĩa Thái Nguyên (1917, Lương Ngọc Quyến).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - bị bóc lột trong chiến tranh',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1919-1925 - Khai thác lần II & Nguyễn Ái Quốc
  if (year >= 1919 && year <= 1925) {
    return {
      description: `Khai thác lần II (1919–29): cao su, than, gạo. Nguyễn Ái Quốc gửi Bản yêu sách (1919), tham gia ĐCS Pháp (1920), lập Hội Thanh niên (6/1925).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - khai thác mạnh, phong trào mới nổi',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1926-1929 - Phân hóa chính trị, chuẩn bị thành lập Đảng
  if (year >= 1926 && year <= 1929) {
    return {
      description: `Phan Bội Châu bị bắt (1925), đám tang Phan Châu Trinh (1926). VNQDĐ (1927). 3 tổ chức cộng sản (1929). Cao Đài (1926).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - phong trào chính trị bùng nổ',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  // 1930 - Thành lập Đảng Cộng sản & Xô viết Nghệ Tĩnh
  if (year >= 1930) {
    return {
      description: `ĐCSVN ra đời (2/1930, Hương Cảng). Yên Bái (2/1930) thất bại. Phú Riềng Đỏ (2/1930). Xô viết Nghệ–Tĩnh (9/1930). Đổi tên ĐCSĐD (10/1930).`,
      territory: 'Lãnh thổ: Liên bang Đông Dương - cao trào cách mạng 1930–31',
      boundaries: [
        {
          label: 'Bắc Kỳ - Bảo hộ Pháp',
          coordinates: [
            [20.0, 102.0],
            [23.5, 102.0],
            [23.5, 109.0],
            [20.0, 109.0],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Trung Kỳ - Bảo hộ Pháp',
          coordinates: [
            [12.0, 104.0],
            [20.0, 104.0],
            [20.0, 109.5],
            [12.0, 109.5],
          ],
          color: '#f97316',
          fillColor: '#f97316',
          controlled: false,
        },
        {
          label: 'Nam Kỳ - Thuộc địa Pháp',
          coordinates: [
            [8.5, 104.0],
            [12.0, 104.0],
            [12.0, 108.0],
            [8.5, 108.0],
          ],
          color: '#ef4444',
          fillColor: '#ef4444',
          controlled: false,
        },
      ],
    };
  }

  return null;
}

