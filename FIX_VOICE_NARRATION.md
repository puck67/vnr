# Sửa lỗi Voice Narration

## Lỗi gặp phải
```
TTS API Error: Error: FPT AI API error
POST /api/tts 500 in 395ms
```

## Nguyên nhân
- FPT AI API key chưa được cấu hình trong `.env.local`
- Hoặc API key không hợp lệ
- Hoặc hết quota miễn phí

## Giải pháp đã áp dụng

### 1. **Fallback tự động** ✅
Voice Narration giờ có 2 chế độ:

**Ưu tiên**: FPT AI (giọng AI chất lượng cao)
- Giọng tự nhiên, truyền cảm
- Phát âm chuẩn tiếng Việt

**Fallback**: Web Speech API (giọng trình duyệt)
- Tự động kích hoạt khi:
  - API key chưa cấu hình
  - FPT AI gặp lỗi
  - Hết quota
- Không cần setup gì
- Hoạt động offline

### 2. **Error handling cải thiện** ✅

**API Route** (`/api/tts`):
- Check API key trước khi gọi
- Log chi tiết lỗi
- Trả về `useFallback: true` thay vì throw error
- Status 200 để client xử lý fallback

**VoiceNarration Component**:
- Hàm `speakWithWebSpeech()` làm fallback
- Tự động chuyển khi FPT AI lỗi
- Cleanup cả 2 loại audio

## Sử dụng ngay (không cần FPT AI key)

### Bước 1: Test fallback
```bash
npm run dev
```

Truy cập: `http://localhost:3000/events/event-002`

Click "Phát" → Giọng đọc của trình duyệt sẽ hoạt động ngay!

### Bước 2: (Tùy chọn) Setup FPT AI để có giọng tốt hơn

#### a. Lấy API Key
1. Đăng ký tài khoản: https://fpt.ai/
2. Vào **Console** → **Text to Speech**
3. Copy **API Key**

#### b. Thêm vào `.env.local`
```env
# FPT AI Text-to-Speech (optional)
FPT_AI_API_KEY=your_actual_fpt_ai_api_key_here

# Gemini API Key (đã có)
GEMINI_API_KEY=AIzaSyDIneuxMx8dzlyJ--t4W_qirOr3kZA4cMg
```

#### c. Restart server
```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

## So sánh 2 chế độ

| Tiêu chí | FPT AI | Web Speech API |
|----------|--------|----------------|
| **Chất lượng** | ⭐⭐⭐⭐⭐ Rất cao | ⭐⭐⭐ Trung bình |
| **Tự nhiên** | Giống người thật | Hơi robot |
| **Setup** | Cần API key | Không cần |
| **Chi phí** | 1M ký tự/tháng free | Miễn phí |
| **Offline** | ❌ Không | ✅ Có |
| **Tốc độ** | Cần tải audio (2-3s) | Ngay lập tức |

## Troubleshooting

### Không có giọng đọc nào hoạt động
**Kiểm tra**:
- Trình duyệt hỗ trợ Web Speech API? (Chrome, Edge: Có / Safari: Có nhưng hạn chế)
- Volume máy tính đã bật?
- Console có lỗi gì?

### FPT AI vẫn lỗi sau khi thêm key
**Kiểm tra**:
1. API key có đúng không?
2. Restart server sau khi thêm key
3. Check console log để xem lỗi chi tiết:
   ```
   FPT AI API Error: { status: 401, ... }
   ```

### Muốn tắt fallback, chỉ dùng FPT AI
Sửa trong `VoiceNarration.tsx`:
```typescript
if (data.useFallback) {
  // Thay vì fallback, hiện lỗi
  alert('FPT AI chưa được cấu hình. Vui lòng thêm API key.');
  setIsLoading(false);
  return;
}
```

## Kết luận

✅ **Voice Narration giờ hoạt động mà KHÔNG CẦN setup gì!**

- Dùng ngay với giọng trình duyệt (Web Speech API)
- Muốn giọng tốt hơn → Thêm FPT AI key

✅ **Không lo lỗi nữa** - tự động fallback khi có vấn đề

## Files đã sửa

1. **app/api/tts/route.ts**
   - Check API key trước
   - Error handling tốt hơn
   - Trả về `useFallback` flag

2. **components/EventDetail/VoiceNarration.tsx**
   - Thêm `speakWithWebSpeech()` function
   - Auto fallback khi FPT AI lỗi
   - Cleanup cả 2 loại audio
   - Cập nhật UI text
