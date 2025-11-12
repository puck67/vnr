# 📖 Hướng Dẫn Sử Dụng - Bản Đồ Lịch Sử Việt Nam 1858-1930

## 🚀 Bắt Đầu Nhanh

### 1. Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở trình duyệt tại: http://localhost:3000

### 2. Cấu hình (Optional)

Nếu muốn sử dụng AI Chatbot:

```bash
# Copy file .env.example
cp .env.example .env.local

# Thêm Gemini API key vào .env.local
GEMINI_API_KEY=your_api_key_here
```

Lấy API key miễn phí tại: https://makersuite.google.com/app/apikey

---

## 🗺️ Hướng Dẫn Sử Dụng Các Tính Năng

### 1. Bản Đồ Tương Tác

**Điều hướng:**
- **Zoom**: Scroll chuột hoặc nút +/- trên bản đồ
- **Di chuyển**: Click và kéo bản đồ
- **Reset**: Nút "Reset View" để về vị trí ban đầu

**Markers:**
- 🚩 **Màu đỏ**: Khởi nghĩa vũ trang
- 🔥 **Màu cam**: Phong trào cách mạng
- ⚔️ **Màu xanh**: Sự kiện chính trị

**Tương tác:**
- Click vào marker để xem thông tin tóm tắt
- Click "Xem chi tiết" trong popup để đến trang chi tiết sự kiện

### 2. Bộ Lọc (Filters)

**Filter theo loại sự kiện:**
- ☑️ Khởi nghĩa
- ☑️ Phong trào
- ☑️ Sự kiện chính trị

**Filter theo vùng miền:**
- ☑️ Bắc Kỳ
- ☑️ Trung Kỳ
- ☑️ Nam Kỳ

**Reset**: Nút "Reset Filters" để bỏ tất cả bộ lọc

### 3. Timeline Slider

**Cách sử dụng:**
- Kéo thanh slider để chọn năm (1858-1930)
- Bản đồ tự động hiển thị các sự kiện đến năm đã chọn
- Nút ▶️ **Play**: Tự động chạy timeline (1 giây/năm)
- Nút ⏸️ **Pause**: Dừng animation

**Event markers trên timeline:**
- Các chấm tròn trên thanh slider = năm có sự kiện
- Click vào chấm để nhảy đến năm đó

### 4. Trang Chi Tiết Sự Kiện

**Nội dung:**
- **Header**: Tên sự kiện, ngày tháng, địa điểm
- **Timeline 4 bước**:
  - 🎯 Nguyên nhân
  - 📜 Diễn biến
  - ✅ Kết quả
  - ⭐ Ý nghĩa
- **Nhân vật liên quan**: Click để xem trang nhân vật
- **Fun Facts**: Những điều thú vị
- **Bản đồ thu nhỏ**: Vị trí sự kiện
- **Sự kiện liên quan**: Sidebar bên phải

**Quiz:**
- Nút "Bắt đầu Quiz" ở cuối trang
- 5 câu hỏi trắc nghiệm liên quan đến sự kiện
- Xem giải thích sau mỗi câu
- Điểm số tự động tính

### 5. Trang Nhân Vật

**Nội dung:**
- **Tiểu sử**: Cuộc đời và sự nghiệp
- **Thành tựu**: Danh sách các đóng góp quan trọng
- **Hành trình cách mạng**:
  - Timeline các điểm quan trọng
  - Nút "Xem hành trình" để hiển thị bản đồ
  - Animation di chuyển giữa các điểm
- **Sự kiện liên quan**: Sidebar

### 6. Chatbot AI

**Mở chatbot:**
- Click vào icon 💬 ở góc dưới bên phải

**2 chế độ:**
- ⚡ **Học nhanh**: Câu trả lời ngắn gọn, dễ hiểu (2-3 câu)
- 📚 **Chuyên sâu**: Câu trả lời chi tiết, có cấu trúc

**Cách sử dụng:**
1. Chọn chế độ (Học nhanh / Chuyên sâu)
2. Nhập câu hỏi hoặc chọn gợi ý
3. Nhấn Enter hoặc nút gửi
4. Đọc câu trả lời

**Gợi ý câu hỏi:**
- "Pháp xâm lược Việt Nam khi nào?"
- "Phong trào Cần Vương là gì?"
- "Ai là Phan Bội Châu?"
- "Đảng Cộng sản thành lập năm nào?"

**Lưu ý:**
- Nếu không có Gemini API key: Chatbot dùng rule-based (10 Q&A có sẵn)
- Nếu có API key: Chatbot dùng AI thông minh hơn

### 7. Quiz System

**Cách chơi:**
1. Vào trang chi tiết sự kiện
2. Scroll xuống cuối, click "Bắt đầu Quiz"
3. Đọc câu hỏi và chọn đáp án (A, B, C, D)
4. Click "Kiểm tra" để xem đúng/sai
5. Đọc giải thích
6. Click "Câu tiếp theo" để tiếp tục
7. Xem kết quả cuối cùng (điểm %)

**Tính năng:**
- 5 câu hỏi/quiz
- Giải thích chi tiết sau mỗi câu
- Điểm số tự động
- Có thể làm lại

---

## 📊 Dữ Liệu Có Sẵn

### Sự kiện (15 sự kiện)
1. Pháp chiếm Đà Nẵng (1858)
2. Pháp chiếm Gia Định (1859)
3. Nguyễn Trung Trực đốt tàu (1861)
4. Hiệp ước Nhâm Tuất (1862)
5. Pháp chiếm Hà Nội (1873)
6. Hiệp ước Giáp Tuất (1874)
7. Pháp chiếm Bắc Kỳ (1884)
8. Phong trào Cần Vương (1885)
9. Khởi nghĩa Yên Thế (1884-1913)
10. Phong trào Đông Du (1905)
11. Đông Kinh Nghĩa Thục (1907)
12. Phong trào Duy Tân (1916)
13. Việt Nam Quang Phục Hội (1912)
14. Thành lập Đảng Cộng sản (1930)
15. Xô viết Nghệ Tĩnh (1930)

### Nhân vật (8 nhân vật)
1. Nguyễn Trung Trực
2. Hoàng Hoa Thám
3. Phan Đình Phùng
4. Phan Bội Châu
5. Phan Châu Trinh
6. Lương Văn Can
7. Hồ Chí Minh
8. Nguyễn Ái Quốc

### Quiz (10 câu hỏi)
- Câu hỏi về năm tháng, nhân vật, sự kiện
- Có giải thích chi tiết

---

## 🎯 Tips & Tricks

### Học hiệu quả:
1. **Bắt đầu với Timeline**: Kéo từ 1858 → 1930 để hiểu dòng chảy lịch sử
2. **Đọc chi tiết**: Click vào từng sự kiện để hiểu sâu
3. **Làm Quiz**: Kiểm tra kiến thức sau mỗi sự kiện
4. **Xem Hành trình**: Hiểu vai trò của từng nhân vật
5. **Hỏi Chatbot**: Khi có thắc mắc

### Shortcuts:
- **Esc**: Đóng modal/popup
- **Enter**: Gửi tin nhắn chatbot
- **Click logo**: Về trang chủ

---

## 🐛 Troubleshooting

### Bản đồ không hiển thị:
- Kiểm tra kết nối internet
- Refresh trang (F5)
- Clear cache trình duyệt

### Chatbot không trả lời:
- Kiểm tra GEMINI_API_KEY trong .env.local
- Nếu không có API key, chatbot chỉ trả lời 10 câu hỏi cơ bản

### Build lỗi:
```bash
# Xóa cache và rebuild
rm -rf .next
npm run build
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log (F12)
2. Đọc lại hướng dẫn
3. Mở issue trên GitHub

---

**Chúc bạn học tốt! 🎓**

