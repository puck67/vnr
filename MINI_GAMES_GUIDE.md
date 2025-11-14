# 🎮 Hướng dẫn sử dụng Mini Games

## Tổng quan
Hệ thống Mini Games cho phép người dùng chơi các trò chơi lịch sử Việt Nam theo nhóm realtime, bao gồm 4 loại game khác nhau và hệ thống ranking/huy hiệu.

## Tính năng chính

### 🎯 4 loại Mini Games
1. **Timeline Puzzle** - Xếp sự kiện theo thứ tự thời gian
2. **Historical Trivia** - Đố vui nhanh về lịch sử
3. **Character Matching** - Ghép nhân vật với sự kiện
4. **Map Conquest** - Chinh phục các vùng miền (coming soon)

### 🏆 Hệ thống Ranking & Huy hiệu
- Bảng xếp hạng theo điểm số
- Hệ thống huy hiệu với 4 độ hiếm: Common, Rare, Epic, Legendary
- Theo dõi thống kê cá nhân: tỷ lệ thắng, điểm trung bình, level

### 🔥 Multiplayer Realtime
- Tạo phòng với mã chia sẻ
- Chơi cùng tối đa 8 người
- Đồng bộ realtime với Firebase
- Gợi ý và power-ups

## Cách sử dụng

### Tạo phòng mới
1. Truy cập `/games`
2. Chọn loại game muốn chơi
3. Điền tên và cài đặt game
4. Chia sẻ mã phòng cho bạn bè

### Tham gia phòng
1. Nhận mã phòng từ host
2. Click "Tham Gia Phòng"
3. Nhập mã và tên của bạn
4. Chờ host bắt đầu game

### Gameplay
- **Timeline Puzzle**: Kéo thả sự kiện theo đúng thứ tự năm
- **Trivia**: Chọn đáp án đúng trong thời gian giới hạn
- **Character Matching**: Ghép nhân vật với sự kiện tương ứng

## Công nghệ sử dụng

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Lucide React** - Icons

### Backend
- **Firebase Realtime Database** - Multiplayer sync
- **Firebase Hosting** - Deployment

### Data Structure
```typescript
interface GameRoom {
  id: string;
  gameType: 'timeline' | 'trivia' | 'character-match';
  players: GamePlayer[];
  status: 'waiting' | 'playing' | 'finished';
  settings: GameSettings;
}
```

## Cấu trúc Files

```
/app/games/                 - Game selection page
/app/leaderboard/           - Rankings & achievements
/components/Games/
  ├── GameLobby.tsx         - Waiting room
  ├── CreateRoomModal.tsx   - Create room dialog
  ├── JoinRoomModal.tsx     - Join room dialog
  ├── TimelinePuzzle.tsx    - Timeline game
  ├── HistoricalTrivia.tsx  - Trivia game
  ├── CharacterMatching.tsx - Matching game
  └── Leaderboard.tsx       - Rankings display
/lib/
  ├── firebase.ts           - Firebase config
  └── game-service.ts       - Game logic & API calls
/types/games.ts             - TypeScript interfaces
```

## Firebase Database Schema

```
gameRooms/
  {roomId}/
    id: string
    name: string
    gameType: string
    players: GamePlayer[]
    status: string
    settings: GameSettings

gameStates/
  {roomId}/
    currentRound: number
    timeRemaining: number
    playerAnswers: PlayerAnswer[]
    leaderboard: GamePlayer[]
```

## Deployment

1. **Setup Firebase**
   ```bash
   npm install firebase
   ```

2. **Configure environment**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   # ... other Firebase config
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   npm run start
   ```

## Tính năng nâng cao

### Hệ thống Achievements
- **Chiến thắng đầu tiên**: Thắng game đầu tiên
- **Tốc độ ánh sáng**: Trả lời đúng trong 5 giây
- **Hoàn hảo**: Đúng tất cả câu hỏi
- **Vô địch**: Thắng 25+ game liên tiếp

### Power-ups (Timeline & Trivia)
- **Hint**: Hiện gợi ý hoặc loại đáp án
- **Double Points**: Nhân đôi điểm
- **Freeze Time**: Dừng đồng hồ
- **Skip Question**: Bỏ qua câu hỏi

### Scoring System
- Điểm cơ bản + bonus thời gian
- Bonus streak (chuỗi đúng)
- Trừ điểm khi dùng hint
- Bonus hoàn thành perfect

## Roadmap

### Version 2.0
- [ ] Map Conquest game
- [ ] Private/Public room options
- [ ] Spectator mode
- [ ] Voice chat integration

### Version 3.0
- [ ] Tournament system
- [ ] Guild/Team features
- [ ] Custom question sets
- [ ] Mobile app

## Troubleshooting

### Firebase Connection Issues
1. Kiểm tra environment variables
2. Verify Firebase project settings
3. Check network permissions

### Game State Sync Issues
1. Refresh trang nếu bị lag
2. Kiểm tra kết nối internet
3. Host có thể restart game

## Support
- Documentation: `/components/Games/README.md`
- Issues: GitHub repository
- Contact: Development team

---
*Tạo bởi VNR History Team - Khám phá lịch sử qua game!*
