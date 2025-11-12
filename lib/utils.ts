import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateInfo, EventType } from "@/types";

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format ngày tháng tiếng Việt
export function formatDate(date: DateInfo): string {
  const parts: string[] = [];
  
  if (date.day) parts.push(`${date.day}`);
  if (date.month) parts.push(`tháng ${date.month}`);
  parts.push(`năm ${date.year}`);
  
  return parts.join(' ');
}

// Lấy icon SVG cho loại sự kiện (trả về HTML string)
export function getEventIcon(type: EventType): string {
  const icons: Record<EventType, string> = {
    uprising: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,      // Flag icon (khởi nghĩa)
    movement: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3 1.072-2.143.224-4.054-1.155-5.334C7.185 2.887 5.954 2.5 4.5 2.5c-1.072 2.143-1.224 4.054.155 5.334 1.072.886 2.303 1.273 3.757 1.273C8.5 9.5 8.5 11.5 8.5 14.5z"></path><path d="M17 10c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3z"></path><path d="M17 21.5c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3z"></path></svg>`,      // Flame icon (phong trào)
    political_event: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>` // Shield with check icon (sự kiện chính trị)
  };
  return icons[type] || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-10 12-10 12s-10-5-10-12a10 10 0 0 1 20 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
}

// Lấy màu cho loại sự kiện
export function getEventColor(type: EventType): string {
  const colors = {
    uprising: '#ef4444',      // Đỏ
    movement: '#f59e0b',      // Cam
    political_event: '#3b82f6' // Xanh dương
  };
  return colors[type];
}

// Lấy tên tiếng Việt cho loại sự kiện
export function getEventTypeName(type: EventType): string {
  const names = {
    uprising: 'Khởi nghĩa',
    movement: 'Phong trào',
    political_event: 'Sự kiện chính trị'
  };
  return names[type];
}

// Lấy tên vùng miền
export function getRegionName(region: string): string {
  const names: Record<string, string> = {
    bac_ky: 'Bắc Kỳ',
    trung_ky: 'Trung Kỳ',
    nam_ky: 'Nam Kỳ'
  };
  return names[region] || region;
}

// Tính khoảng cách giữa 2 điểm (km)
export function calculateDistance(
  point1: [number, number],
  point2: [number, number]
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1[0])) *
      Math.cos(toRad(point2[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Tạo slug từ tên
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Delay function cho animation
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Kiểm tra năm có trong khoảng không
export function isYearInRange(year: number, range: [number, number]): boolean {
  return year >= range[0] && year <= range[1];
}

// Tạo màu ngẫu nhiên cho marker
export function getRandomColor(): string {
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', 
    '#3b82f6', '#6366f1', '#8b5cf6',
    '#ec4899', '#f43f5e'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

