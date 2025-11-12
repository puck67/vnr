# Hướng dẫn tích hợp FPT AI Text-to-Speech

## Đã hoàn thành

### 1. **Video VTV cho sự kiện 1859** ✅
- Đã thêm videoUrl: `https://vtv.vn/video/khat-vong-non-song-quan-phap-chiem-thanh-gia-dinh-502327.htm`
- Video hiển thị trong trang `/events/event-002`

### 2. **Tích hợp FPT AI Voice** ✅
- Tạo API route `/api/tts` gọi FPT AI TTS API
- Cập nhật `VoiceNarration.tsx` dùng FPT AI thay vì Web Speech API
- Giọng đọc: **banmai** (giọng nữ miền Bắc tự nhiên)

### 3. **Animation bản đồ chi tiết** ✅
- 5 bước diễn biến cho sự kiện 1859:
  1. **2/2/1859**: Rút quân khỏi Đà Nẵng
  2. **2-16/2**: Hạm đội vượt 700km biển
  3. **17/2 rạng sáng**: Tiến theo sông Lòng Tàu
  4. **17/2 sáng**: Pháo kích và chiếm thành
  5. **Sau 17/2**: Phá hủy và lập căn cứ

## Setup FPT AI API Key

### Bước 1: Đăng ký FPT AI
1. Truy cập: https://fpt.ai/
2. Đăng ký tài khoản
3. Vào **Console** → **Text to Speech**
4. Lấy **API Key**

### Bước 2: Thêm API Key vào dự án

Tạo hoặc cập nhật file `.env.local`:

```env
# FPT AI API Key
FPT_AI_API_KEY=your_fpt_ai_api_key_here

# Gemini API Key (đã có)
GEMINI_API_KEY=AIzaSyDIneuxMx8dzlyJ--t4W_qirOr3kZA4cMg
```

### Bước 3: Test Voice Narration

```bash
npm run dev
```

Truy cập: `http://localhost:3000/events/event-002`

Kiểm tra:
- [ ] Section "Thuyết minh AI" hiển thị
- [ ] Click "Phát" → Loading "Đang tạo..."
- [ ] Sau vài giây → Audio phát giọng AI tiếng Việt
- [ ] Click "Tạm dừng" / "Tiếp tục" hoạt động
- [ ] Click "Dừng" → Kết thúc hoàn toàn

## Tính năng FPT AI TTS

### Giọng đọc
- **banmai**: Giọng nữ miền Bắc, tự nhiên, truyền cảm
- Tốc độ: Bình thường (speed=0)
- Chất lượng cao, phát âm chuẩn

### So sánh với Web Speech API

| Feature | Web Speech API | FPT AI |
|---------|---------------|---------|
| Giọng Việt | Phụ thuộc browser | Luôn có ✅ |
| Chất lượng | Trung bình | Cao ✅ |
| Tự nhiên | Robot hóa | Tự nhiên ✅ |
| Offline | Có | Không |
| Chi phí | Miễn phí | API call |

## Files đã thay đổi

1. **data/events.json**
   - Thêm `videoUrl` cho event-002
   - Thêm `animationSteps` (5 bước)

2. **types/index.ts**
   - Thêm `AnimationStep` interface
   - Thêm `animationSteps` vào `HistoricalEvent`

3. **app/api/tts/route.ts** (MỚI)
   - API route gọi FPT AI TTS
   - Headers: api-key, speed, voice

4. **components/EventDetail/VoiceNarration.tsx**
   - Thay Web Speech API → FPT AI
   - Dùng HTML5 Audio
   - Thêm loading state với spinner

## Animation Steps Structure

```typescript
{
  time: "17/2/1859",
  title: "Tiêu đề bước",
  description: "Mô tả chi tiết...",
  location: [lat, lng],
  zoom: 13,
  markers: [
    {
      position: [lat, lng],
      label: "Nhãn marker",
      type: "attack" | "defend" | "base" | "route"
    }
  ],
  paths: [
    {
      coordinates: [[lat1, lng1], [lat2, lng2]],
      color: "#ef4444",
      label: "Tuyến đường"
    }
  ]
}
```

## Next Steps

1. **Tạo component AnimationModal** để hiển thị animation
2. **Render markers và paths** trên Leaflet map
3. **Auto play animation** với timeline
4. **Tích hợp voice narration** cho từng bước

## Lưu ý

- FPT AI TTS có giới hạn request/tháng (Free tier: 1 triệu ký tự/tháng)
- Nên cache audio URL để tránh gọi API nhiều lần
- Text dài sẽ mất vài giây để tạo audio

## Support

- FPT AI Docs: https://docs.fpt.ai/
- Pricing: https://fpt.ai/vi/gia
