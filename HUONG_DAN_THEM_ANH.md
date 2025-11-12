# 🖼️ Hướng Dẫn Thêm Ảnh Lịch Sử

## 📁 Cấu Trúc Thư Mục Ảnh

```
public/
├── images/
│   ├── events/              # Ảnh sự kiện
│   │   ├── event-001.jpg
│   │   ├── event-002.jpg
│   │   └── ...
│   ├── characters/          # Ảnh nhân vật
│   │   ├── char-001.jpg
│   │   ├── char-002.jpg
│   │   └── ...
│   └── icons/               # Icons tùy chỉnh (optional)
└── maps/                    # Bản đồ lịch sử overlay (optional)
    └── indochina-1900.png
```

---

## 🎯 Yêu Cầu Ảnh

### Ảnh Sự Kiện
- **Kích thước**: 1200x800px (tỷ lệ 3:2)
- **Format**: JPG hoặc PNG
- **Dung lượng**: < 500KB (tối ưu cho web)
- **Tên file**: `event-001.jpg`, `event-002.jpg`, ...

### Ảnh Nhân Vật
- **Kích thước**: 800x800px (vuông)
- **Format**: JPG hoặc PNG
- **Dung lượng**: < 300KB
- **Tên file**: `char-001.jpg`, `char-002.jpg`, ...

---

## 📥 Nguồn Ảnh Lịch Sử

### 1. Nguồn Miễn Phí & Hợp Pháp

#### Wikimedia Commons
- URL: https://commons.wikimedia.org
- Tìm kiếm: "Vietnam history 1858-1930", "French Indochina"
- License: Public Domain hoặc Creative Commons
- **Ưu điểm**: Nhiều ảnh lịch sử chất lượng cao

#### Library of Congress (Mỹ)
- URL: https://www.loc.gov/pictures/
- Tìm kiếm: "Vietnam", "Indochina", "French colonial"
- **Ưu điểm**: Ảnh chất lượng cao, public domain

#### Gallica (Pháp)
- URL: https://gallica.bnf.fr
- Tìm kiếm: "Indochine", "Vietnam", "Tonkin", "Cochinchine"
- **Ưu điểm**: Nhiều tư liệu thời Pháp thuộc

#### Unsplash / Pexels
- Ảnh hiện đại về Việt Nam (dùng cho background)
- License: Free to use

### 2. Bộ Sưu Tập Đề Xuất

#### Sự Kiện Quân Sự
- Ảnh pháo đài, thành trì
- Ảnh quân đội thời kỳ
- Bản đồ chiến dịch

#### Nhân Vật
- Chân dung (nếu có)
- Tượng đài, đền thờ
- Nơi sinh, nơi hoạt động

#### Phong Cảnh
- Ảnh Việt Nam thế kỷ 19-20
- Thành phố, làng quê thời xưa

---

## 🛠️ Cách Thêm Ảnh

### Bước 1: Tải Ảnh
```bash
# Tạo thư mục nếu chưa có
mkdir -p public/images/events
mkdir -p public/images/characters
```

### Bước 2: Đổi Tên & Tối Ưu

**Đổi tên theo ID:**
- `event-001.jpg` → Pháp chiếm Đà Nẵng
- `event-002.jpg` → Pháp chiếm Gia Định
- `char-001.jpg` → Nguyễn Trung Trực
- ...

**Tối ưu kích thước:**
```bash
# Sử dụng ImageMagick (nếu có)
convert input.jpg -resize 1200x800^ -gravity center -extent 1200x800 -quality 85 event-001.jpg

# Hoặc dùng online tools:
# - TinyPNG: https://tinypng.com
# - Squoosh: https://squoosh.app
```

### Bước 3: Copy vào Thư Mục
```bash
# Copy ảnh vào public/images/events/
cp downloaded-image.jpg public/images/events/event-001.jpg

# Copy ảnh nhân vật
cp character-photo.jpg public/images/characters/char-001.jpg
```

### Bước 4: Kiểm Tra
- Mở http://localhost:3000
- Click vào sự kiện
- Ảnh sẽ tự động hiển thị

---

## 🎨 Placeholder Nếu Chưa Có Ảnh

Hiện tại ứng dụng đã có **fallback** tự động:
- Nếu không có ảnh → Hiển thị gradient background
- Không ảnh hưởng đến chức năng

**Không cần làm gì thêm!**

---

## 📋 Danh Sách Ảnh Cần Tìm

### Sự Kiện (15 ảnh)
- [ ] `event-001.jpg` - Pháp chiếm Đà Nẵng (1858)
- [ ] `event-002.jpg` - Pháp chiếm Gia Định (1859)
- [ ] `event-003.jpg` - Nguyễn Trung Trực đốt tàu (1861)
- [ ] `event-004.jpg` - Hiệp ước Nhâm Tuất (1862)
- [ ] `event-005.jpg` - Pháp chiếm Hà Nội (1873)
- [ ] `event-006.jpg` - Hiệp ước Giáp Tuất (1874)
- [ ] `event-007.jpg` - Pháp chiếm Bắc Kỳ (1884)
- [ ] `event-008.jpg` - Phong trào Cần Vương (1885)
- [ ] `event-009.jpg` - Khởi nghĩa Yên Thế (1884)
- [ ] `event-010.jpg` - Phong trào Đông Du (1905)
- [ ] `event-011.jpg` - Đông Kinh Nghĩa Thục (1907)
- [ ] `event-012.jpg` - Phong trào Duy Tân (1916)
- [ ] `event-013.jpg` - Việt Nam Quang Phục Hội (1912)
- [ ] `event-014.jpg` - Thành lập Đảng Cộng sản (1930)
- [ ] `event-015.jpg` - Xô viết Nghệ Tĩnh (1930)

### Nhân Vật (8 ảnh)
- [ ] `char-001.jpg` - Nguyễn Trung Trực
- [ ] `char-002.jpg` - Hoàng Hoa Thám
- [ ] `char-003.jpg` - Phan Đình Phùng
- [ ] `char-004.jpg` - Phan Bội Châu
- [ ] `char-005.jpg` - Phan Châu Trinh
- [ ] `char-006.jpg` - Lương Văn Can
- [ ] `char-007.jpg` - Hồ Chí Minh
- [ ] `char-008.jpg` - Nguyễn Ái Quốc

---

## 🔍 Gợi Ý Tìm Kiếm

### Từ Khóa Tiếng Anh
- "French Indochina 1858-1930"
- "Vietnam colonial period"
- "Nguyen Trung Truc"
- "Can Vuong movement"
- "Dong Du movement"
- "Vietnamese resistance France"

### Từ Khóa Tiếng Pháp
- "Indochine française"
- "Cochinchine"
- "Tonkin"
- "Annam"
- "Résistance vietnamienne"

### Từ Khóa Tiếng Việt
- "Lịch sử Việt Nam 1858-1930"
- "Kháng chiến chống Pháp"
- "Phong trào Cần Vương"
- "Nguyễn Trung Trực"

---

## ⚖️ Lưu Ý Bản Quyền

### Ảnh An Toàn Sử Dụng
✅ Public Domain (> 70 năm)
✅ Creative Commons (CC0, CC-BY)
✅ Government works (US, France)
✅ Wikimedia Commons (kiểm tra license)

### Ảnh Cần Tránh
❌ Google Images (không rõ nguồn)
❌ Ảnh có watermark
❌ Ảnh từ sách giáo khoa (có bản quyền)
❌ Ảnh từ website thương mại

### Ghi Nguồn
Nếu sử dụng ảnh CC-BY, thêm vào `data/events.json`:
```json
{
  "sources": [
    "Ảnh: Wikimedia Commons (Public Domain)",
    "Nguồn: Library of Congress"
  ]
}
```

---

## 🚀 Tối Ưu Hiệu Suất

### Next.js Image Optimization
Nếu muốn tối ưu tự động, dùng `next/image`:

```tsx
import Image from 'next/image';

<Image
  src="/images/events/event-001.jpg"
  alt="Pháp chiếm Đà Nẵng"
  width={1200}
  height={800}
  quality={85}
/>
```

### WebP Conversion
```bash
# Convert JPG to WebP (nhẹ hơn 30%)
cwebp -q 85 event-001.jpg -o event-001.webp
```

---

## 📞 Hỗ Trợ

Nếu cần giúp tìm ảnh hoặc tối ưu:
1. Kiểm tra Wikimedia Commons trước
2. Sử dụng công cụ tìm kiếm nâng cao
3. Liên hệ thư viện lịch sử địa phương

---

**Chúc bạn tìm được những bức ảnh lịch sử đẹp! 📸**

