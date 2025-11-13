import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI (nếu có API key)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Simple rate limiting và caching
const requestCache = new Map<string, { response: string; timestamp: number }>();
const requestTracker = new Map<string, number[]>();
const RATE_LIMIT = 1000; // Disable rate limiting để test AI
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Clear all cached responses để bắt buộc dùng AI
    requestCache.clear();
    
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Thiếu nội dung tin nhắn' },
        { status: 400 }
      );
    }

    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Clear old cache và disable cache tạm thời để test AI
    const cacheKey = message.toLowerCase().trim();
    
    // TODO: Enable cache sau khi test xong AI
    // const cached = requestCache.get(cacheKey);
    // if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    //   return NextResponse.json({ response: cached.response });
    // }

    // Rate limiting check
    const now = Date.now();
    const userRequests = requestTracker.get(clientIP) || [];
    const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute
    
    if (recentRequests.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Update rate limiter
    recentRequests.push(now);
    requestTracker.set(clientIP, recentRequests);

    // Bắt buộc sử dụng Gemini AI
    if (genAI) {
      try {
        const aiResponse = await getAIResponse(message);
        // Cache successful AI response
        requestCache.set(cacheKey, { 
          response: aiResponse, 
          timestamp: now 
        });
        return NextResponse.json({ response: aiResponse });
      } catch (aiError: any) {
        console.error('Lỗi Gemini AI:', aiError);
        
        // Không có fixed responses - chỉ log error và throw
        console.log(`Gemini API Error (${aiError?.status}):`, aiError?.message || aiError);
        throw aiError; // Re-throw để fallback model handling
        
        // Không có fallback, return error
      }
    }

    // Không có API key 
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}


// Hàm gọi Gemini AI với fallback model
async function getAIResponse(message: string): Promise<string> {
  if (!genAI) throw new Error('Gemini API not configured');

  // Thử model mới trước, fallback sang model cũ nếu lỗi
  const models = [
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest', 
    'gemini-1.5-pro-latest', 
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];
  let lastError: any;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      // 100% Pure AI - không dùng data có sẵn
      const systemPrompt = `Bạn là chuyên gia lịch sử Việt Nam về giai đoạn 1858-1945.

PHONG CÁCH: Trả lời ngắn gọn, súc tích, không quá 200 từ.

QUAN TRỌNG: Trả lời bằng tiếng Việt.`;

      const prompt = `${systemPrompt}\n\nCÂU HỎI: ${message}\n\nTRẢ LỜI:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
      
    } catch (error: any) {
      lastError = error;
      console.log(`Model ${modelName} failed:`, error.message);
      continue; // Try next model
    }
  }

  // Nếu tất cả models đều fail
  throw lastError || new Error('All models failed');
}

