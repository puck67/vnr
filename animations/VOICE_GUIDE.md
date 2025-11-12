# Hướng dẫn sử dụng Voice Content

## Tổng quan

Mỗi sự kiện có 2 loại nội dung voice:

1. **Intro Voice** - Giới thiệu tổng quan sự kiện
2. **Step Voice** - Đọc theo từng bước animation

## Cấu trúc Voice Content

### File: `animations/voices/DaNang1858Voice.ts`

```typescript
// 1. Intro Voice - Tổng quan sự kiện
export const daNang1858IntroVoice = `...`;

// 2. Intro Voice với nhịp nhấn (chậm, rõ ràng)
export const daNang1858IntroVoiceWithPacing = `...`;

// 3. Voice theo từng bước
export const daNang1858VoiceSteps: VoiceStep[] = [...];
```

## Phiên bản Intro Voice

### 1. Phiên bản thông thường
```typescript
export const daNang1858IntroVoice = `
Năm 1858, mở đầu cuộc xâm lược Việt Nam của thực dân Pháp.
Ngày mùng 1 tháng 9 năm 1858, liên quân Pháp – Tây Ban Nha...
`;
```

**Đặc điểm:**
- Câu văn tự nhiên, liền mạch
- Dễ đọc, nghe trơn tru
- Phù hợp cho voice bình thường

### 2. Phiên bản có nhịp nhấn
```typescript
export const daNang1858IntroVoiceWithPacing = `
Năm 1858... mở đầu cuộc xâm lược Việt Nam của thực dân Pháp.
Ngày mùng 1 tháng 9 năm 1858... liên quân Pháp – Tây Ban Nha...
`;
```

**Đặc điểm:**
- Dấu `...` tạo điểm dừng tự nhiên
- Đọc chậm hơn, rõ ràng hơn
- Truyền cảm, nhấn mạnh nội dung
- Phù hợp cho **FPT AI TTS** (giọng truyền cảm)

## Cách sử dụng

### Trong MapAnimationModal

```typescript
import { daNang1858Config } from '@/components/EventAnimations/DaNang1858Animation';

// Lấy intro voice
if (animationConfig.getIntroVoice) {
  // Phiên bản thông thường
  const intro = animationConfig.getIntroVoice(false);
  
  // Hoặc phiên bản có nhịp nhấn
  const introWithPacing = animationConfig.getIntroVoice(true);
  
  // Đọc bằng AI
  await speakText(introWithPacing);
}

// Sau đó đọc từng bước
const stepVoice = animationConfig.getVoiceForStep(currentStep);
await speakText(stepVoice);
```

## Khi nào dùng phiên bản nào?

> **Lưu ý**: Hệ thống chỉ sử dụng FPT AI TTS, không có Web Speech API fallback.

### Phiên bản thông thường
✅ Nội dung ngắn  
✅ Đọc nhanh, không cần truyền cảm  
✅ Testing cơ bản  

### Phiên bản có nhịp nhấn ⭐ **Khuyên dùng**
✅ **FPT AI TTS** với giọng truyền cảm  
✅ Nội dung dài, quan trọng  
✅ Demo, thuyết trình  
✅ Trải nghiệm người dùng tốt nhất  

## Cách viết nội dung có nhịp nhấn

### Quy tắc:
1. Dùng `...` thay cho dấu phẩy quan trọng
2. Tách câu dài thành các cụm ngắn
3. Đặt `...` trước/sau thông tin quan trọng
4. Không đặt quá nhiều (1-3 chấm/câu)

### Ví dụ:

**Trước (thông thường):**
```
Tư lệnh phía Pháp là Đô đốc Rigault de Genouilly, đem theo hơn hai nghìn quân, bảy tàu chiến, cùng hỏa lực hiện đại.
```

**Sau (có nhịp nhấn):**
```
Tư lệnh phía Pháp... là Đô đốc Rigault de Genouilly... đem theo hơn hai nghìn quân... bảy tàu chiến... cùng hỏa lực hiện đại.
```

## FPT AI TTS Settings

Khi sử dụng phiên bản có nhịp nhấn với FPT AI:

```typescript
// MapAnimationModal.tsx
const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
  method: 'POST',
  headers: {
    'api-key': FPT_API_KEY,
    'speed': '0',      // 0 = tốc độ bình thường, -1 = chậm, 1 = nhanh
    'voice': 'banmai', // Giọng nữ truyền cảm
  },
  body: textWithPacing, // Dùng phiên bản có nhịp nhấn
});
```

**Giọng khuyên dùng:**
- `banmai` - Nữ miền Bắc (truyền cảm nhất)
- `leminh` - Nam miền Bắc (uy lực)
- `thuminh` - Nữ miền Bắc (nhẹ nhàng)

## API Functions

```typescript
// Lấy intro (tổng quan)
getIntroVoice(withPacing?: boolean): string

// Lấy voice theo bước
getVoiceForStep(stepIndex: number): string

// Lấy tất cả voice steps
getAllVoiceContent(): string[]

// Lấy đầy đủ (intro + steps)
getFullVoiceContent(withPacing?: boolean): string[]
```

## Ví dụ sử dụng đầy đủ

```typescript
// 1. Đọc intro khi mở modal
useEffect(() => {
  if (isOpen && animationConfig.getIntroVoice) {
    const intro = animationConfig.getIntroVoice(true); // Dùng phiên bản nhịp nhấn
    speakText(intro);
  }
}, [isOpen]);

// 2. Đọc từng bước khi animation chạy
useEffect(() => {
  if (isPlaying && currentStep < animationSteps.length) {
    const stepVoice = animationConfig.getVoiceForStep(currentStep);
    speakText(stepVoice);
  }
}, [currentStep, isPlaying]);
```

## Best Practices

✅ **Intro voice**: Dùng phiên bản có nhịp nhấn  
✅ **Step voice**: Có thể dùng thông thường (ngắn gọn)  
✅ **FPT AI**: Luôn dùng phiên bản có nhịp nhấn cho trải nghiệm tốt nhất  
✅ **Nội dung dài**: Chia thành nhiều đoạn với `...`  

❌ Không đặt quá nhiều `...` (gây gián đoạn)  
❌ Không tách quá nhỏ (gây khó nghe)  
❌ Không dùng ký hiệu đặc biệt khác  
❌ Không quên cấu hình FPT AI API Key  

## Test Voice

### Cách 1: Test trực tiếp trên FPT AI (Khuyên dùng)

1. Truy cập: https://fpt.ai/tts
2. Copy nội dung từ file voice vào ô text
3. Chọn giọng (ví dụ: `banmai`)
4. Bấm "Tạo giọng nói" và nghe thử

### Cách 2: Test trong dự án

1. Cấu hình FPT AI API Key (xem `SETUP_TTS.md`)
2. Chạy `npm run dev`
3. Mở sự kiện và bấm Play
4. Kiểm tra console log để debug
