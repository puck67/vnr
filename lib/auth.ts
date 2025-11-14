import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserProfile {
  points: number;
  level: number;
  badges: string[];
  completedQuizzes: string[];
  viewedEvents: string[];
  achievements: { id: string; unlockedAt: string; }[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profile: UserProfile;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Đảm bảo thư mục data tồn tại
export function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Tạo file users.json nếu không tồn tại
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
}

// Load users từ file
export function loadUsers(): User[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Lưu users vào file
export function saveUsers(users: User[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save users');
  }
}

// Tìm user theo email
export function findUserByEmail(email: string): User | undefined {
  const users = loadUsers();
  return users.find(user => user.email === email);
}

// Tìm user theo username
export function findUserByUsername(username: string): User | undefined {
  const users = loadUsers();
  return users.find(user => user.username === username);
}

// Tạo user mới
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message?: string; user?: Omit<User, 'password'> }> {
  try {
    // Kiểm tra email đã tồn tại
    if (findUserByEmail(userData.email)) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Kiểm tra username đã tồn tại
    if (findUserByUsername(userData.username)) {
      return { success: false, message: 'Tên đăng nhập đã được sử dụng' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Tạo user mới
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      profile: {
        points: 0,
        level: 1,
        badges: [],
        completedQuizzes: [],
        viewedEvents: [],
        achievements: []
      }
    };

    // Lưu vào database
    const users = loadUsers();
    users.push(newUser);
    saveUsers(users);

    // Trả về user không có password
    const { password, ...userWithoutPassword } = newUser;
    return { 
      success: true, 
      user: userWithoutPassword 
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Có lỗi xảy ra khi tạo tài khoản' };
  }
}

// Đăng nhập user
export async function loginUser(email: string, password: string): Promise<{
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
}> {
  try {
    // Tìm user
    const user = findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    // Trả về user không có password
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, message: 'Có lỗi xảy ra khi đăng nhập' };
  }
}

// Cập nhật profile user
export function updateUserProfile(userId: string, profileUpdate: Partial<UserProfile>): boolean {
  try {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    // Cập nhật profile
    users[userIndex].profile = {
      ...users[userIndex].profile,
      ...profileUpdate
    };

    saveUsers(users);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Thêm điểm cho user
export function addPointsToUser(userId: string, points: number): boolean {
  try {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].profile.points += points;
    
    // Tính level dựa trên điểm (mỗi 100 điểm = 1 level)
    users[userIndex].profile.level = Math.floor(users[userIndex].profile.points / 100) + 1;

    saveUsers(users);
    return true;
  } catch (error) {
    console.error('Error adding points to user:', error);
    return false;
  }
}

// Thêm badge cho user
export function addBadgeToUser(userId: string, badgeId: string): boolean {
  try {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    if (!users[userIndex].profile.badges.includes(badgeId)) {
      users[userIndex].profile.badges.push(badgeId);
      saveUsers(users);
    }

    return true;
  } catch (error) {
    console.error('Error adding badge to user:', error);
    return false;
  }
}
