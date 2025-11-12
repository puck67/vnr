# Nhân vật Sự kiện Đà Nẵng 1858

## Tổng quan
Đã thêm **9 nhân vật** liên quan đến trận Đà Nẵng 1858, chia làm 2 phe:

### Phía Việt Nam (7 người)
1. **Vua Tự Đức** (char-017) - Quốc vương Đại Nam
2. **Nguyễn Tri Phương** (char-016) - Tổng chỉ huy
3. **Phạm Thế Hiển** (char-019) - Tổng đốc Quảng Nam-Quảng Ngãi
4. **Lê Đình Lý** (char-020) - Chỉ huy tuyến Thanh Khê
5. **Nguyễn Duy** (char-021) - Chỉ huy tuyến Cẩm Lệ
6. **Nguyễn Đức Huy** (char-022) - Chỉ huy tuyến Hòa Vang
7. **Nguyễn Văn Nhàn** (char-023) - Chỉ huy tuyến Hòa Khánh

### Phía Liên quân Pháp-TBN (2 người)
1. **Rigault de Genouilly** (char-018) - Đô đốc Pháp, Tổng chỉ huy
2. **Lanzarote** (char-024) - Đại tá hải quân Tây Ban Nha

## Thay đổi UI

### Trước:
- Icon emoji đơn giản (👤)
- Không phân biệt phe
- Layout đơn điệu

### Sau:
- **Icon Lucide**: 
  - `Shield` (🛡️) cho Việt Nam
  - `Swords` (⚔️) cho Pháp-TBN
  - `User` cho avatar

- **Màu sắc phân biệt**:
  - Xanh dương (blue-50/100) cho Việt Nam
  - Đỏ (red-50/100) cho Pháp-TBN

- **Layout hiện đại**:
  - Card với border 2px
  - Hover scale + shadow
  - Arrow chỉ dẫn
  - Grid responsive 2 cột

## Files đã cập nhật

1. **data/characters.json**: Thêm 8 nhân vật mới (char-017 → char-024)
2. **data/events.json**: Cập nhật `relatedCharacters` của event-001
3. **components/EventDetail/EventContent.tsx**: Cải thiện UI hoàn toàn

## Test
```bash
npm run dev
```

Truy cập: `http://localhost:3000/events/event-001`

Kiểm tra:
- [ ] 9 nhân vật hiển thị đầy đủ
- [ ] Phân chia 2 phe rõ ràng (7 VN + 2 Pháp-TBN)
- [ ] Icon đẹp, màu sắc phân biệt
- [ ] Hover effect mượt mà
- [ ] Click vào nhân vật chuyển đến trang chi tiết
