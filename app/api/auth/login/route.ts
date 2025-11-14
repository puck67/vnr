import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ email và mật khẩu' },
        { status: 400 }
      );
    }

    // Login user
    const result = await loginUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: result.user
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đăng nhập' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Login endpoint' });
}
