# Hướng dẫn Migration - Cấu trúc mới cho Animation & Voice

## Tổng quan thay đổi

Đã tái cấu trúc hệ thống animation và voice để:
- ✅ Mỗi sự kiện là 1 component riêng
- ✅ Nội dung AI voice tách thành file riêng dễ chỉnh sửa
- ✅ Animation steps tách riêng dễ quản lý
- ✅ Code gọn gàng, dễ bảo trì và mở rộng

## Cấu trúc cũ vs mới

### Trước đây (Hard-coded)
```
MapAnimationModal.tsx (1000+ dòng)
├── parseAnimationSteps() - 220 dòng hard-coded
│   ├── Vị trí
│   ├── Animation steps
│   └── Voice content (lẫn lộn)
└── speakText() - đọc từ description
```

### Bây giờ (Modular)
```
animations/
├── events/
│   ├── DaNang1858Steps.ts      ← Animation steps
│   └── index.ts
├── voices/
│   ├── DaNang1858Voice.ts      ← Nội dung AI đọc
│   └── index.ts
└── README.md                    ← Hướng dẫn

components/EventAnimations/
├── DaNang1858Animation.tsx      ← Component sự kiện
└── index.ts

MapAnimationModal.tsx (800 dòng)
└── getAnimationConfig()         ← Chọn config theo eventId
```

## Các file đã tạo mới

### 1. Animation Steps
**File:** `animations/events/DaNang1858Steps.ts`
- Chứa: Các bước di chuyển, vị trí, action trên bản đồ
- Kiểu: `AnimationStep[]`
- Ví dụ: ship_move từ A → B trong 2000ms

### 2. Voice Content
**File:** `animations/voices/DaNang1858Voice.ts`
- Chứa: Nội dung text để AI đọc
- Kiểu: `VoiceStep[]`
- **Quan trọng:** Thời gian viết đầy đủ, dễ nghe hơn animation steps

**So sánh:**
```typescript
// Animation Step (ngắn gọn)
time: 'Đêm 31/8 rạng 1/9/1858'

// Voice Content (tự nhiên, dễ nghe)
time: 'Đêm 31 tháng 8 rạng sáng 1 tháng 9 năm 1858'
```

### 3. Component
**File:** `components/EventAnimations/DaNang1858Animation.tsx`
- Export: `daNang1858Config`
- Kết hợp: animation steps + voice content
- Cung cấp: `getVoiceForStep()` để lấy nội dung đọc

### 4. Index files
- `animations/events/index.ts`
- `animations/voices/index.ts`
- `components/EventAnimations/index.ts`

### 5. Documentation
- `animations/README.md` - Hướng dẫn thêm sự kiện mới
- `MIGRATION_GUIDE.md` - File này

## Thay đổi trong MapAnimationModal.tsx

### Import mới
```typescript
import { daNang1858Config, EventAnimationConfig } from '@/components/EventAnimations/DaNang1858Animation';
import { AnimationStep } from '@/animations/events/DaNang1858Steps';
```

### Hàm mới
```typescript
const getAnimationConfig = (): EventAnimationConfig => {
  if (event.id === 'event-001') {
    return daNang1858Config;  // Sử dụng config từ file riêng
  }
  // Fallback cho sự kiện khác...
};

const animationConfig = getAnimationConfig();
const animationSteps = animationConfig.steps;
```

### Đọc voice
```typescript
// CŨ: Hard-coded
const textToSpeak = `${currentStepData.time}. ${currentStepData.description}`;

// MỚI: Từ config
const textToSpeak = animationConfig.getVoiceForStep(currentStep);
```

## Cách chỉnh sửa nội dung

### Sửa nội dung AI đọc
Chỉ cần sửa file: `animations/voices/DaNang1858Voice.ts`

```typescript
{
  time: 'Thời gian đầy đủ',
  description: 'Nội dung mới mà bạn muốn AI đọc',
}
```

### Sửa animation trên bản đồ
Chỉ cần sửa file: `animations/events/DaNang1858Steps.ts`

```typescript
{
  time: 'Thời gian',
  description: 'Mô tả ngắn',
  action: 'ship_move',
  position: [lat, lng],
  targetPosition: [lat2, lng2],
  duration: 3000,  // Thay đổi thời gian di chuyển
}
```

## Thêm sự kiện mới

Xem chi tiết trong `animations/README.md`

**Tóm tắt 5 bước:**
1. Tạo `animations/events/TenSuKienSteps.ts`
2. Tạo `animations/voices/TenSuKienVoice.ts`
3. Tạo `components/EventAnimations/TenSuKienAnimation.tsx`
4. Export trong các file index.ts
5. Thêm vào `MapAnimationModal.tsx` → `getAnimationConfig()`

## FPT AI TTS

**Có đang dùng:** ✅ Đúng, **CHỈ** dùng FPT AI TTS

**Thay đổi quan trọng:**
- ❌ **Đã loại bỏ** Web Speech API fallback
- ⚠️ **BẮT BUỘC** phải có FPT AI API Key để sử dụng tính năng voice
- Nếu không có API key → Không có giọng đọc

**Cấu hình:**
- API Key: `.env.local` → `NEXT_PUBLIC_FPT_API_KEY`
- Giọng mặc định: `banmai` (nữ miền Bắc, truyền cảm)
- Miễn phí: 1 triệu ký tự/tháng
- Không cần thẻ tín dụng

**File cấu hình:** `MapAnimationModal.tsx` dòng ~88
```typescript
'voice': 'banmai', // Có thể đổi: leminh, thuminh, myan, etc.
'speed': '0',      // 0 = bình thường, -1 = chậm, 1 = nhanh
```

**Hướng dẫn setup:** `SETUP_TTS.md`

## Test thử

1. Chạy dev server: `npm run dev`
2. Mở sự kiện Đà Nẵng 1858
3. Bấm Play animation
4. AI sẽ đọc nội dung từ `animations/voices/DaNang1858Voice.ts`

## Lợi ích

✅ **Dễ chỉnh sửa:** Sửa nội dung AI đọc không cần đụng code animation  
✅ **Dễ bảo trì:** Mỗi sự kiện 1 component, không lộn xộn  
✅ **Dễ mở rộng:** Thêm sự kiện mới chỉ cần copy template  
✅ **Type-safe:** Full TypeScript, IntelliSense hỗ trợ  
✅ **Reusable:** Có thể tái sử dụng các action, positions  

## Breaking Changes

**Không có!** Code cũ vẫn hoạt động bình thường.

Sự kiện Đà Nẵng 1858 đã được migrate sang cấu trúc mới, các sự kiện khác vẫn dùng fallback.
