# 🚀 Hướng Dẫn Deploy Lên Vercel

## 📋 Chuẩn Bị

### 1. Tài Khoản Cần Có
- ✅ GitHub account
- ✅ Vercel account (miễn phí tại https://vercel.com)
- ⚠️ Gemini API key (optional - nếu muốn AI chatbot)

### 2. Kiểm Tra Trước Khi Deploy

```bash
# Test build local
npm run build

# Nếu build thành công → OK để deploy
# Nếu có lỗi → Fix trước khi deploy
```

---

## 🔧 Bước 1: Push Code Lên GitHub

### Tạo Repository Mới

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Vietnam History Map 1858-1930"

# Tạo repo trên GitHub: https://github.com/new
# Đặt tên: vietnam-history-map

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/vietnam-history-map.git

# Push
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 2: Deploy Lên Vercel

### Option 1: Deploy Qua Web UI (Dễ Nhất)

1. **Đăng nhập Vercel**: https://vercel.com/login
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Chọn "Import Git Repository"
   - Chọn repository `vietnam-history-map`
3. **Configure Project**:
   - Framework Preset: **Next.js** (tự động detect)
   - Root Directory: `./` (mặc định)
   - Build Command: `npm run build` (mặc định)
   - Output Directory: `.next` (mặc định)
4. **Environment Variables** (Optional):
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
5. **Deploy**:
   - Click "Deploy"
   - Đợi 2-3 phút
   - ✅ Done!

### Option 2: Deploy Qua CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Làm theo hướng dẫn:
# - Link to existing project? No
# - Project name: vietnam-history-map
# - Directory: ./
# - Override settings? No

# Deploy production
vercel --prod
```

---

## 🔐 Bước 3: Cấu Hình Environment Variables

### Thêm Gemini API Key (Optional)

**Qua Web UI:**
1. Vào project dashboard: https://vercel.com/YOUR_USERNAME/vietnam-history-map
2. Settings → Environment Variables
3. Add:
   - Name: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
   - Environment: Production, Preview, Development
4. Save
5. Redeploy: Deployments → Latest → "Redeploy"

**Qua CLI:**
```bash
vercel env add GEMINI_API_KEY
# Nhập value khi được hỏi
# Chọn: Production, Preview, Development

# Redeploy
vercel --prod
```

---

## 🎯 Bước 4: Custom Domain (Optional)

### Thêm Domain Riêng

1. **Mua domain** (từ Namecheap, GoDaddy, etc.)
2. **Vào Vercel Dashboard**:
   - Settings → Domains
   - Add Domain: `your-domain.com`
3. **Cấu hình DNS**:
   - Thêm A record: `76.76.21.21`
   - Hoặc CNAME: `cname.vercel-dns.com`
4. **Đợi DNS propagate** (5-30 phút)
5. ✅ Done!

**Domain miễn phí:**
- Vercel tự động cung cấp: `vietnam-history-map.vercel.app`

---

## 📊 Bước 5: Kiểm Tra Deployment

### Checklist Sau Deploy

- [ ] Trang chủ load được: `https://your-app.vercel.app`
- [ ] Bản đồ hiển thị đúng
- [ ] Click vào marker → popup hiển thị
- [ ] Timeline slider hoạt động
- [ ] Trang chi tiết sự kiện: `/events/event-001`
- [ ] Trang nhân vật: `/characters/char-001`
- [ ] Chatbot mở được (icon góc dưới phải)
- [ ] Quiz hoạt động
- [ ] Responsive trên mobile

### Test Performance

```bash
# Lighthouse score (nên > 90)
# Mở Chrome DevTools → Lighthouse → Run

# Hoặc dùng:
npx lighthouse https://your-app.vercel.app
```

---

## 🔄 Bước 6: Auto-Deploy (CI/CD)

Vercel tự động deploy khi:
- ✅ Push code lên `main` branch → Deploy production
- ✅ Push lên branch khác → Deploy preview
- ✅ Pull Request → Deploy preview với URL riêng

**Workflow:**
```bash
# Làm việc trên branch mới
git checkout -b feature/add-more-events

# Code...
git add .
git commit -m "Add 5 more events"
git push origin feature/add-more-events

# Vercel tự động tạo preview deployment
# Check preview URL trong GitHub PR

# Merge vào main → Auto deploy production
```

---

## 🐛 Troubleshooting

### Build Failed

**Lỗi TypeScript:**
```bash
# Fix local trước
npm run build

# Nếu OK local nhưng fail trên Vercel:
# - Check Node version (Vercel dùng Node 18+)
# - Check dependencies trong package.json
```

**Lỗi Environment Variables:**
```bash
# Đảm bảo GEMINI_API_KEY được add đúng
# Hoặc comment code liên quan nếu không dùng AI
```

### Deployment Slow

```bash
# Vercel có thể chậm nếu:
# - Dependencies lớn (node_modules)
# - Build time lâu

# Giải pháp:
# - Dùng .vercelignore để ignore files không cần
# - Optimize dependencies
```

### 404 Errors

```bash
# Nếu /events/[id] bị 404:
# - Check generateStaticParams() có đúng không
# - Check file structure: app/events/[id]/page.tsx
```

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Miễn Phí)

1. Vào project dashboard
2. Analytics tab
3. Xem:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Google Analytics (Optional)

Thêm vào `app/layout.tsx`:
```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎉 Hoàn Thành!

Ứng dụng của bạn đã live tại:
- **Production**: `https://vietnam-history-map.vercel.app`
- **Custom Domain**: `https://your-domain.com` (nếu có)

### Chia Sẻ

```
🗺️ Bản Đồ Lịch Sử Việt Nam 1858-1930
Khám phá lịch sử đấu tranh chống thực dân Pháp qua bản đồ tương tác!

🔗 https://vietnam-history-map.vercel.app

✨ Tính năng:
- Bản đồ tương tác với 15 sự kiện lịch sử
- Timeline slider 1858-1930
- Chatbot AI hỗ trợ học tập
- Quiz kiểm tra kiến thức
- Hành trình cách mạng của 8 nhân vật

#LịchSửViệtNam #GiáoDục #InteractiveMap
```

---

## 📞 Support

Nếu gặp vấn đề khi deploy:
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Đọc lại hướng dẫn
4. Open issue trên GitHub

---

**Chúc bạn deploy thành công! 🚀**

