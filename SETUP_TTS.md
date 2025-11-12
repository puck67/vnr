# Hướng dẫn cài đặt FPT AI Text-to-Speech

> **⚠️ BẮT BUỘC**: Hệ thống chỉ sử dụng FPT AI TTS, không có fallback. Bạn cần có API key để sử dụng tính năng giọng đọc.

## Bước 1: Đăng ký và lấy API Key từ FPT.AI

1. **Truy cập**: https://fpt.ai/tts
2. **Đăng ký/Đăng nhập** tài khoản (miễn phí)
3. Vào mục **API** (thanh menu trên cùng)
4. Click **"Get API Key"** hoặc tìm API Key hiện có
5. **Copy** API Key

## Bước 2: Cấu hình trong dự án

### 2.1. Tạo file `.env.local`

Tại thư mục gốc dự án (cùng cấp với `package.json`):

```bash
# Tạo file .env.local
touch .env.local
```

### 2.2. Thêm API Key

Mở file `.env.local` và thêm:

```env
NEXT_PUBLIC_FPT_API_KEY=your_api_key_here
```

**Thay thế** `your_api_key_here` bằng API key bạn vừa copy.

### 2.3. Ví dụ

```env
NEXT_PUBLIC_FPT_API_KEY=AbCdEfGh1234567890XyZ
```

## Bước 3: Restart Server

```bash
# Dừng server hiện tại (Ctrl + C)
# Sau đó chạy lại:
npm run dev
```

## Bước 4: Kiểm tra

1. Mở dev server: `http://localhost:3000`
2. Chọn sự kiện **Đà Nẵng 1858**
3. Bấm nút **Play** animation
4. Kiểm tra console:
   - ✅ `🎤 Bắt đầu đọc với FPT AI...` → Thành công
   - ❌ `Thiếu FPT AI API Key!` → Cần cấu hình lại

## Các giọng đọc có sẵn

Đổi giọng trong file `components/EventDetail/MapAnimationModal.tsx` (dòng ~88):

```typescript
'voice': 'banmai', // Đổi giọng ở đây
```

### Giọng phổ biến:
- **`banmai`** - Nữ miền Bắc (truyền cảm nhất) ⭐ **Khuyên dùng**
- **`leminh`** - Nam miền Bắc (uy lực, trang trọng)
- **`thuminh`** - Nữ miền Bắc (nhẹ nhàng)
- `myan` - Nữ miền Trung
- `giahuy` - Nam miền Trung  
- `linhsan` - Nữ miền Nam
- `minhquang` - Nam miền Nam
- `lannhi` - Nữ miền Nam

### Tùy chỉnh tốc độ đọc

Trong cùng file, thay đổi `speed`:

```typescript
'speed': '0',  // 0 = bình thường
               // -1 = chậm hơn
               // 1 = nhanh hơn
```

## Thông tin gói miễn phí

- **Miễn phí**: 1 triệu ký tự/tháng
- **Giọng**: Tự nhiên, truyền cảm, chất lượng cao
- **Không cần thẻ tín dụng**: Đăng ký hoàn toàn miễn phí

## Xử lý lỗi

### Lỗi: "Thiếu FPT AI API Key!"

**Nguyên nhân**: Chưa cấu hình API key hoặc cấu hình sai.

**Giải pháp**:
1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra key có đúng tên `NEXT_PUBLIC_FPT_API_KEY`
3. Restart server sau khi thêm/sửa `.env.local`

### Lỗi: "FPT AI API lỗi: 401"

**Nguyên nhân**: API key không hợp lệ.

**Giải pháp**:
1. Kiểm tra lại API key tại https://fpt.ai/tts
2. Đảm bảo copy đúng key (không thừa/thiếu ký tự)
3. Kiểm tra tài khoản FPT AI còn quota không

### Lỗi: "FPT AI API lỗi: 429"

**Nguyên nhân**: Vượt quá giới hạn miễn phí (1M ký tự/tháng).

**Giải pháp**:
1. Chờ đến tháng sau để quota reset
2. Hoặc nâng cấp gói trả phí

## Test trực tiếp

Bạn có thể test giọng đọc trực tiếp tại:
👉 https://fpt.ai/tts

Nhập văn bản → Chọn giọng → Nghe thử!

## Hỗ trợ

- **Tài liệu FPT AI**: https://docs.fpt.ai/
- **File hướng dẫn dự án**: `animations/VOICE_GUIDE.md`
