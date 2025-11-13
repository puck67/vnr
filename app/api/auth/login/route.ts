import { NextRequest, NextResponse } from 'next/server';

function verifyPassword(password: string, hash: string): boolean {
  return Buffer.from(password).toString('base64') === hash;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      }, { status: 400 });
    }

    // Đọc users
    const fs = require('fs').promises;
    const path = require('path');
    const usersPath = path.join(process.cwd(), 'data', 'users.json');

    let users = [];
    try {
      const data = await fs.readFile(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Email không tồn tại'
      }, { status: 400 });
    }

    // Tìm user
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Email không tồn tại'
      }, { status: 400 });
    }

    // Kiểm tra password
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({
        success: false,
        message: 'Mật khẩu không đúng'
      }, { status: 400 });
    }

    // Trả về user không có password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Có lỗi xảy ra khi đăng nhập'
    }, { status: 500 });
  }
}
