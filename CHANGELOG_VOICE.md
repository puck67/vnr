# Changelog - Voice System

## [Latest Update] - Loại bỏ Web Speech API

### Thay đổi lớn

#### 🎤 Voice System
- ❌ **Loại bỏ hoàn toàn** Web Speech API fallback
- ✅ **Chỉ sử dụng** FPT AI Text-to-Speech
- ⚠️ **BẮT BUỘC** cần FPT AI API Key để dùng tính năng voice

#### 📝 Nội dung đọc
- ✅ Thêm intro voice tổng quan cho sự kiện Đà Nẵng 1858
- ✅ Hỗ trợ 2 phiên bản: thông thường và có nhịp nhấn
- ✅ AI chỉ đọc 1 lần intro khi bắt đầu animation (không đọc step by step nữa)

### Files đã cập nhật

#### 1. `components/EventDetail/MapAnimationModal.tsx`
**Thay đổi:**
- Loại bỏ hàm `speakWithWebAPI()`
- Loại bỏ `useEffect` load voices của Web Speech API
- Cải thiện error handling cho FPT AI
- Thêm console log rõ ràng hơn với emoji
- Thêm state `hasPlayedIntro` để track intro voice
- Đổi logic: đọc intro 1 lần thay vì đọc từng step

**Code mới:**
```typescript
// Chỉ FPT AI, không fallback
const speakText = async (text: string) => {
  const FPT_API_KEY = process.env.NEXT_PUBLIC_FPT_API_KEY || '';
  
  if (!FPT_API_KEY) {
    console.error('❌ Thiếu FPT AI API Key!');
    return;
  }
  
  // Call FPT AI API...
};

// Đọc intro khi bắt đầu
useEffect(() => {
  if (isPlaying && mapReady && !hasPlayedIntro && animationConfig.getIntroVoice) {
    const introText = animationConfig.getIntroVoice(true); // Dùng phiên bản có nhịp nhấn
    speakText(introText);
    setHasPlayedIntro(true);
  }
}, [isPlaying, mapReady, hasPlayedIntro]);
```

#### 2. `animations/voices/DaNang1858Voice.ts`
**Thêm mới:**
- `daNang1858IntroVoice` - Nội dung tổng quan phiên bản thông thường
- `daNang1858IntroVoiceWithPacing` - Phiên bản có nhịp nhấn (dùng `...`)
- `getIntroVoice()` - Hàm lấy intro voice
- `getFullVoiceContent()` - Hàm lấy đầy đủ intro + steps

**Nội dung intro:**
```
Năm 1858... mở đầu cuộc xâm lược Việt Nam của thực dân Pháp.

Ngày mùng 1 tháng 9 năm 1858... liên quân Pháp – Tây Ban Nha... 
nổ súng tấn công cửa Hàn, Đà Nẵng...
```

#### 3. `components/EventAnimations/DaNang1858Animation.tsx`
**Thay đổi:**
- Thêm `getIntroVoice` vào `EventAnimationConfig` interface
- Export `getIntroVoice` trong config

#### 4. `SETUP_TTS.md`
**Cập nhật toàn bộ:**
- Nhấn mạnh FPT AI là bắt buộc
- Loại bỏ mọi đề cập đến Web Speech API fallback
- Thêm hướng dẫn xử lý lỗi chi tiết
- Cải thiện các bước setup

#### 5. `animations/VOICE_GUIDE.md`
**Cập nhật:**
- Loại bỏ hướng dẫn Web Speech API
- Cập nhật Best Practices
- Cập nhật phần Test Voice

#### 6. `MIGRATION_GUIDE.md`
**Cập nhật:**
- Thông tin FPT AI TTS
- Nhấn mạnh không có fallback
- Hướng dẫn bắt buộc cần API key

### Lợi ích

✅ **Chất lượng voice tốt hơn**: Giọng tự nhiên, truyền cảm  
✅ **Code gọn hơn**: Loại bỏ fallback logic phức tạp  
✅ **Dễ maintain**: Chỉ 1 voice engine thay vì 2  
✅ **Trải nghiệm nhất quán**: Không bị đổi giọng đột ngột  

### Breaking Changes

⚠️ **QUAN TRỌNG**: Nếu không có FPT AI API Key, tính năng voice sẽ KHÔNG hoạt động.

**Migration:**
1. Đăng ký FPT AI tại: https://fpt.ai/tts
2. Lấy API key (miễn phí)
3. Thêm vào `.env.local`:
   ```
   NEXT_PUBLIC_FPT_API_KEY=your_api_key_here
   ```
4. Restart server: `npm run dev`

### Console Messages

**Thành công:**
```
🎤 Bắt đầu đọc với FPT AI: Năm 1858... mở đầu cuộc xâm lược...
▶️ Đang phát audio FPT AI
✅ Kết thúc đọc
```

**Thiếu API Key:**
```
❌ Thiếu FPT AI API Key! Vui lòng cấu hình NEXT_PUBLIC_FPT_API_KEY trong file .env.local
📖 Xem hướng dẫn: SETUP_TTS.md
```

**Lỗi API:**
```
❌ Lỗi FPT AI TTS: FPT AI API lỗi: 401
```

### Testing

**Trước khi test:**
- Đảm bảo có FPT AI API Key trong `.env.local`
- Restart server sau khi thêm API key

**Test:**
1. `npm run dev`
2. Mở http://localhost:3000
3. Chọn sự kiện "Đà Nẵng 1858"
4. Bấm Play animation
5. Nghe AI đọc nội dung tổng quan

### Troubleshooting

**Q: Không nghe thấy gì?**  
A: Kiểm tra console, có thể thiếu API key

**Q: Lỗi 401?**  
A: API key không hợp lệ, kiểm tra lại tại https://fpt.ai/tts

**Q: Lỗi 429?**  
A: Vượt quota 1M ký tự/tháng, chờ tháng sau

**Q: Muốn đổi giọng?**  
A: Sửa `'voice': 'banmai'` trong `MapAnimationModal.tsx` dòng ~88

### Future Plans

- [ ] Thêm option để chọn giọng đọc trong UI
- [ ] Thêm option để chọn tốc độ đọc
- [ ] Cache audio để giảm API calls
- [ ] Thêm intro voice cho các sự kiện khác
- [ ] Hỗ trợ pause/resume trong khi đọc

---

**Cập nhật lần cuối**: 8 Nov 2025  
**Version**: 2.0 (FPT AI Only)
