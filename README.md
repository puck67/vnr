# 🗺️ Bản Đồ Lịch Sử Việt Nam 1858-1930

Ứng dụng web tương tác khám phá lịch sử đấu tranh chống thực dân Pháp qua bản đồ, timeline và chatbot AI.

## ✨ Tính năng

### 🗺️ Bản đồ tương tác

- Hiển thị 15 sự kiện lịch sử quan trọng (1858-1930)
- Bản đồ hybrid: OSM base layer + historical imagery overlay
- Marker động với popup chi tiết
- Filter theo loại sự kiện (khởi nghĩa, phong trào, chính trị)
- Filter theo vùng miền (Bắc Kỳ, Trung Kỳ, Nam Kỳ)

### ⏱️ Timeline tương tác

- Slider năm từ 1858-1930
- Play/Pause animation (1 giây/năm)
- Event markers trên timeline
- Tự động filter sự kiện theo năm

### 📖 Trang chi tiết sự kiện

- Header với gradient overlay
- Timeline 4 bước: Nguyên nhân → Diễn biến → Kết quả → Ý nghĩa
- Nội dung đầy đủ với nhân vật liên quan
- Fun facts thú vị
- Bản đồ thu nhỏ hiển thị vị trí
- Related events sidebar
- **Quiz kiểm tra kiến thức**

### 👤 Trang nhân vật

- Tiểu sử chi tiết 8 nhân vật lịch sử
- Danh sách thành tựu
- Hành trình cách mạng với animation
- Sự kiện liên quan

### 💬 Chatbot AI

- 2 chế độ: **Học nhanh** (Gen Z-friendly) và **Chuyên sâu** (chi tiết)
- Rule-based chatbot với 10 Q&A có sẵn
- Tích hợp Gemini AI (optional) cho câu hỏi phức tạp
- Gợi ý câu hỏi nhanh
- Floating chat widget

### 🎯 Quiz System

- 10 câu hỏi trắc nghiệm
- Hiển thị giải thích sau mỗi câu
- Tính điểm tự động
- Filter câu hỏi theo sự kiện

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: TailwindCSS
- **Map**: Leaflet.js + react-leaflet
- **Animation**: Framer Motion
- **AI**: Google Gemini API (optional)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình environment variables (Optional)

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:

```env
# Optional - Nếu muốn dùng AI chatbot
GEMINI_API_KEY=your_gemini_api_key_here
```

Lấy Gemini API key tại: https://makersuite.google.com/app/apikey

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc dự án

```
vietnam-history-map/
├── app/
│   ├── api/chatbot/          # API route cho chatbot
│   ├── events/[id]/          # Trang chi tiết sự kiện
│   ├── characters/[id]/      # Trang chi tiết nhân vật
│   ├── layout.tsx            # Root layout với ChatWidget
│   ├── page.tsx              # Trang chủ với bản đồ
│   └── globals.css           # Global styles
├── components/
│   ├── Map/                  # Components bản đồ
│   ├── Timeline/             # Timeline slider
│   ├── EventDetail/          # Components trang sự kiện
│   ├── Character/            # Components trang nhân vật
│   ├── Chatbot/              # Chatbot UI
│   └── Quiz/                 # Quiz system
├── data/
│   ├── events.json           # 15 sự kiện lịch sử
│   ├── characters.json       # 8 nhân vật
│   ├── chatbot-qa.json       # 10 Q&A cho chatbot
│   └── quiz-questions.json   # 10 câu hỏi quiz
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/
    ├── images/               # Placeholder cho ảnh
    └── maps/                 # Bản đồ lịch sử (nếu có)
```

## 🚀 Deployment

### Deploy lên Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm environment variables (nếu có)
4. Deploy!

```bash
npm run build
```

## 📚 Dữ liệu mẫu

Ứng dụng đi kèm với:

- ✅ 15 sự kiện lịch sử (1858-1930)
- ✅ 8 nhân vật quan trọng
- ✅ 10 Q&A cho chatbot
- ✅ 10 câu hỏi quiz

## 🔧 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Lint code
```

## 📝 License

MIT License - Tự do sử dụng cho mục đích giáo dục.

---

**Made with ❤️ for Vietnamese History Education**


















