# Firebase Realtime Database Setup

## 🔥 Firebase Configuration for Mini Games

### 1. Tạo Firebase Project

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" 
3. Nhập project name (VD: `vietnam-history-games`)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Realtime Database

1. Trong Firebase Console, vào **Build > Realtime Database**
2. Click "Create Database"
3. Chọn location (asia-southeast1 cho Vietnam)
4. Start in **test mode** (có thể thay đổi rules sau)

### 3. Get Configuration

1. Vào **Project Settings** (⚙️ icon)
2. Scroll xuống "Your apps"
3. Click **Web** icon `</>`
4. Nhập app nickname: `vietnam-history-map`
5. Copy config object

### 4. Setup Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vietnam-history-games.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://vietnam-history-games-default-rtdb.asia-southeast1.firebasedatabase.app/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vietnam-history-games
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vietnam-history-games.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Install Dependencies

```bash
npm install firebase
```

### 6. Database Rules (Security)

Trong Realtime Database > Rules, đặt:

```json
{
  "rules": {
    "gameRooms": {
      ".read": true,
      ".write": true,
      "$roomId": {
        ".validate": "newData.hasChildren(['id', 'code', 'gameType', 'hostId', 'players', 'status', 'settings', 'createdAt'])"
      }
    },
    "gameResults": {
      ".read": true,
      ".write": true
    },
    "playerStats": {
      ".read": true,
      ".write": true
    },
    "leaderboards": {
      ".read": true,
      ".write": true
    }
  }
}
```

### 7. Database Structure

```
vietnam-history-games/
├── gameRooms/
│   └── room_123/
│       ├── id: "room_123"
│       ├── code: "ABC123"
│       ├── gameType: "timeline-puzzle"
│       ├── hostId: "player_456"
│       ├── players: [...]
│       ├── status: "waiting"
│       ├── settings: {...}
│       └── gameData: {...}
├── gameResults/
│   └── timeline-puzzle/
│       └── result_789: {...}
├── playerStats/
│   └── player_456: {
│       ├── totalScore: 1250
│       ├── gamesPlayed: 5
│       ├── wins: 3
│       └── badges: [...]
│   }
└── leaderboards/
    └── timeline-puzzle: [...]
```

## 🚀 Benefits của Firebase Realtime DB

### ✅ **Realtime Sync**
- Tự động sync data giữa tất cả clients
- Không cần WebSocket server riêng
- Instant updates khi có thay đổi

### ✅ **Persistence**
- Data được lưu vĩnh viễn
- Không mất data khi restart server
- Backup tự động

### ✅ **Scalability**
- Handle thousands concurrent users
- Auto-scaling theo traffic
- Global CDN

### ✅ **Easy Integration**
- Simple JavaScript SDK
- Real-time listeners
- Offline support

## 🎮 Features Enabled

### **Room Management**
- ✅ Realtime player join/leave
- ✅ Host controls sync instantly  
- ✅ Game status updates
- ✅ Player ready states

### **Game Sessions**
- ✅ Live game state sync
- ✅ Score updates realtime
- ✅ Turn-based gameplay
- ✅ Instant results

### **Leaderboards**
- ✅ Live score updates
- ✅ Badge notifications
- ✅ Player stats tracking
- ✅ Historical data

### **Social Features**
- ✅ Room codes sharing
- ✅ Multiplayer lobbies
- ✅ Player presence
- ✅ Chat (future)

## 🔧 Development vs Production

### **Development**
```env
# Test mode rules - open access
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...test-mode...
```

### **Production**
```json
// Secure rules with authentication
{
  "rules": {
    "gameRooms": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 📱 Testing

1. **Create Room**: Vào `/games` → tạo phòng
2. **Join Room**: Mở tab khác → join bằng room code  
3. **Realtime**: Thay đổi ready status → thấy update instant
4. **Game Play**: Start game → sync realtime giữa players

**Firebase Realtime Database = Perfect solution cho Mini Games!** 🎯✨
