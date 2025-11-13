import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profile: {
    points: number;
    level: number;
    badges: string[];
    completedQuizzes: string[];
    viewedEvents: string[];
    achievements: {
      id: string;
      unlockedAt: string;
    }[];
  };
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Đảm bảo file users.json tồn tại
async function ensureUsersFile(): Promise<void> {
  try {
    await fs.access(USERS_FILE);
  } catch {
    // File không tồn tại, tạo mới
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// Đọc danh sách users
export async function getUsers(): Promise<User[]> {
  await ensureUsersFile();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Lưu danh sách users
async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Tạo user mới
export async function createUser(username: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
  try {
    const users = await getUsers();
    
    // Kiểm tra user đã tồn tại
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return { success: false, message: 'Email hoặc tên đăng nhập đã tồn tại' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo user mới
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
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

    users.push(newUser);
    await saveUsers(users);

    // Trả về user không có password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, message: 'Đăng ký thành công', user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi đăng ký' };
  }
}

// Đăng nhập
export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<User, 'password'> }> {
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    // Trả về user không có password
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, message: 'Đăng nhập thành công', user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi đăng nhập' };
  }
}

// Cập nhật profile user
export async function updateUserProfile(userId: string, profileUpdates: Partial<User['profile']>): Promise<{ success: boolean; message: string }> {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy user' };
    }

    users[userIndex].profile = { ...users[userIndex].profile, ...profileUpdates };
    await saveUsers(users);
    
    return { success: true, message: 'Cập nhật profile thành công' };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi cập nhật profile' };
  }
}

// Thêm điểm cho user
export async function addPointsToUser(userId: string, points: number): Promise<{ success: boolean; message: string }> {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy user' };
    }

    users[userIndex].profile.points += points;
    
    // Tính level mới
    const newLevel = Math.floor(users[userIndex].profile.points / 100) + 1;
    users[userIndex].profile.level = newLevel;
    
    await saveUsers(users);
    
    return { success: true, message: 'Thêm điểm thành công' };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi thêm điểm' };
  }
}

// Thêm huy hiệu cho user
export async function addBadgeToUser(userId: string, badgeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy user' };
    }

    if (!users[userIndex].profile.badges.includes(badgeId)) {
      users[userIndex].profile.badges.push(badgeId);
      users[userIndex].profile.achievements.push({
        id: badgeId,
        unlockedAt: new Date().toISOString()
      });
      await saveUsers(users);
    }
    
    return { success: true, message: 'Thêm huy hiệu thành công' };
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi thêm huy hiệu' };
  }
}

// Lấy thông tin user theo ID
export async function getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
  try {
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    return null;
  }
}
