import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-simple';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({ username, email, password });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      user: result.user
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Register endpoint' });
}
