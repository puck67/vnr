# 🔥 Hướng dẫn Setup Firebase cho Mini Games

## Vấn đề hiện tại
- Tạo phòng games bị lỗi do chưa setup Firebase
- Header đã được bỏ khỏi trang games

## Cách khắc phục

### 1. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Nhập tên project (VD: `vnr-history-games`)
4. Disable Google Analytics (không cần thiết)
5. Click "Create project"

### 2. Enable Realtime Database
1. Trong Firebase Console, chọn "Realtime Database"
2. Click "Create Database" 
3. Chọn region: `asia-southeast1`
4. Start in **test mode** (cho development)
5. Database sẽ có URL dạng: `https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app`

### 3. Lấy Firebase Configuration
1. Trong Project Settings > General
2. Scroll xuống "Your apps" section
3. Click "Web app" (</>) để thêm web app
4. Nhập app name: `vnr-games`
5. Copy Firebase config object

### 4. Cấu hình Environment Variables
Tạo file `.env.local` trong root project với nội dung:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Restart Development Server
```bash
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
npm run dev
```

### 6. Test Firebase Connection
1. Mở trang `/games`
2. Kiểm tra Console (F12) để xem debug logs
3. Status indicator sẽ hiển thị "Firebase OK" nếu thành công
4. Buttons "Tạo Phòng" và "Tham Gia" sẽ được enable

## Firebase Rules (Production)
Khi deploy production, đổi Database Rules thành:

```json
{
  "rules": {
    "gameRooms": {
      ".read": true,
      ".write": true,
      "$roomId": {
        ".validate": "newData.hasChildren(['id', 'gameType', 'players', 'status'])"
      }
    },
    "gameStates": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Troubleshooting

### Lỗi "Firebase connection failed"
- Kiểm tra `.env.local` có đúng format không
- Đảm bảo tất cả keys đều có prefix `NEXT_PUBLIC_`
- Restart development server sau khi thay đổi env

### Lỗi "Permission denied"
- Kiểm tra Firebase Database Rules
- Trong development, dùng test mode (rules open)
- Production cần rules cụ thể hơn

### Import component errors
- Các lỗi TypeScript import sẽ tự động fix sau khi restart
- Nếu vẫn lỗi, delete `.next` folder và `npm run dev` lại

## Test thành công
Khi setup đúng:
✅ Status indicator hiển thị "Firebase OK"
✅ Có thể tạo phòng games
✅ Có thể tham gia phòng bằng mã
✅ Real-time sync hoạt động

---
*Setup bởi: VNR History Development Team*
