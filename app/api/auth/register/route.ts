import { NextRequest, NextResponse } from 'next/server';

// Tạm thời không dùng bcrypt, sẽ hash đơn giản
function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password: string, hash: string): boolean {
  return Buffer.from(password).toString('base64') === hash;
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      }, { status: 400 });
    }

    // Đọc users hiện có
    const fs = require('fs').promises;
    const path = require('path');
    const usersPath = path.join(process.cwd(), 'data', 'users.json');

    let users = [];
    try {
      const data = await fs.readFile(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch {
      // File không tồn tại, tạo folder và file mới
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
      users = [];
    }

    // Kiểm tra user đã tồn tại
    const existingUser = users.find((u: any) => u.email === email || u.username === username);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email hoặc tên đăng nhập đã tồn tại'
      }, { status:400 });
    }

    // Tạo user mới
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: simpleHash(password),
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
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    // Trả về user không có password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký'
    }, { status: 500 });
  }
}
