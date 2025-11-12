# Hướng dẫn quản lý Animation và Voice cho sự kiện

## Cấu trúc thư mục

```
animations/
├── events/           # Animation steps (di chuyển, vị trí trên bản đồ)
│   ├── DaNang1858Steps.ts
│   └── index.ts
├── voices/           # Nội dung AI voice đọc
│   ├── DaNang1858Voice.ts
│   └── index.ts
├── README.md         # Hướng dẫn thêm sự kiện mới
└── VOICE_GUIDE.md    # Hướng dẫn sử dụng voice content

components/
└── EventAnimations/  # Component kết hợp animation + voice
    ├── DaNang1858Animation.tsx
    └── index.ts
```

## Cách thêm sự kiện mới

### Bước 1: Tạo file Animation Steps

Tạo file `animations/events/TenSuKienSteps.ts`:

```typescript
import { AnimationStep } from './DaNang1858Steps';

export const POSITIONS = {
  // Định nghĩa các vị trí quan trọng
  startPos: [lat, lng] as [number, number],
  // ... các vị trí khác
};

export const tenSuKienAnimationSteps: AnimationStep[] = [
  {
    time: 'Thời gian',
    description: 'Mô tả ngắn gọn',
    action: 'ship_move',  // hoặc explosion, landing, marker, etc.
    position: POSITIONS.startPos,
    targetPosition: POSITIONS.endPos,
    duration: 2000,  // milliseconds
  },
  // ... các bước khác
];
```

### Bước 2: Tạo file Voice Content

Tạo file `animations/voices/TenSuKienVoice.ts`:

```typescript
import { VoiceStep } from './DaNang1858Voice';

export const tenSuKienVoiceSteps: VoiceStep[] = [
  {
    time: 'Thời gian đầy đủ để AI đọc tốt',
    description: 'Mô tả chi tiết, dễ nghe, tự nhiên cho AI đọc',
  },
  // ... các bước khác
];

export const getVoiceContent = (stepIndex: number): string => {
  if (stepIndex < 0 || stepIndex >= tenSuKienVoiceSteps.length) {
    return '';
  }
  const step = tenSuKienVoiceSteps[stepIndex];
  return `${step.time}. ${step.description}`;
};
```

**Lưu ý khi viết Voice Content:**
- Thời gian: Viết đầy đủ, rõ ràng (VD: "Ngày 1 tháng 9 năm 1858" thay vì "1/9/1858")
- Mô tả: Dùng câu văn tự nhiên, dễ nghe
- Tránh viết tắt, ký hiệu đặc biệt
- Độ dài phù hợp với thời gian animation (khoảng 2-4 giây mỗi câu)

### Bước 3: Tạo Component Animation

Tạo file `components/EventAnimations/TenSuKienAnimation.tsx`:

```typescript
'use client';

import { AnimationStep } from '@/animations/events/TenSuKienSteps';
import { tenSuKienAnimationSteps } from '@/animations/events/TenSuKienSteps';
import { getVoiceContent } from '@/animations/voices/TenSuKienVoice';

export interface EventAnimationConfig {
  steps: AnimationStep[];
  getVoiceForStep: (stepIndex: number) => string;
  eventName: string;
  eventId: string;
}

export const tenSuKienConfig: EventAnimationConfig = {
  steps: tenSuKienAnimationSteps,
  getVoiceForStep: getVoiceContent,
  eventName: 'Tên sự kiện',
  eventId: 'event-xxx',
};
```

### Bước 4: Export trong index.ts

Thêm vào `components/EventAnimations/index.ts`:
```typescript
export { tenSuKienConfig } from './TenSuKienAnimation';
```

Thêm vào `animations/events/index.ts`:
```typescript
export { tenSuKienAnimationSteps } from './TenSuKienSteps';
```

Thêm vào `animations/voices/index.ts`:
```typescript
export { tenSuKienVoiceSteps } from './TenSuKienVoice';
```

### Bước 5: Sử dụng trong MapAnimationModal

Trong `MapAnimationModal.tsx`, thêm import và sử dụng:

```typescript
import { tenSuKienConfig } from '@/components/EventAnimations/TenSuKienAnimation';

const getAnimationConfig = (): EventAnimationConfig => {
  if (event.id === 'event-001') {
    return daNang1858Config;
  }
  
  if (event.id === 'event-xxx') {  // ID sự kiện mới
    return tenSuKienConfig;
  }
  
  // Fallback...
};
```

## Các loại Action có sẵn

- `ship_move` - Di chuyển tàu/phương tiện
- `character_move` - Di chuyển nhân vật
- `explosion` - Pháo nổ, bom đạn
- `landing` - Đổ bộ, chiếm đóng
- `marker` - Đánh dấu vị trí
- `defense_line` - Tuyến phòng thủ
- `fortification` - Công sự, pháo đài
- `disease` - Bệnh dịch
- `stalemate` - Bế tắc, thế đối trì

## Lợi ích của cấu trúc này

✅ **Tách biệt rõ ràng:**
- Animation steps (logic di chuyển) ≠ Voice content (nội dung đọc)
- Dễ chỉnh sửa từng phần riêng biệt

✅ **Dễ bảo trì:**
- Mỗi sự kiện là 1 component độc lập
- Không cần sửa file lớn MapAnimationModal

✅ **Dễ mở rộng:**
- Thêm sự kiện mới chỉ cần 3 file
- Không ảnh hưởng code cũ

✅ **Kiểm soát tốt:**
- Voice content tách riêng → dễ điều chỉnh nội dung AI đọc
- Animation steps → dễ tùy chỉnh hiệu ứng

## FPT AI TTS

Hệ thống đang sử dụng **FPT AI Text-to-Speech** với fallback sang Web Speech API.

**Cấu hình:**
- File: `.env.local`
- Key: `NEXT_PUBLIC_FPT_API_KEY`
- Xem hướng dẫn: `SETUP_TTS.md`

**Giọng đọc:** 
- Mặc định: `banmai` (nữ miền Bắc, tự nhiên, truyền cảm)
- Có thể đổi trong `MapAnimationModal.tsx` dòng 84

**Miễn phí:** 1 triệu ký tự/tháng
