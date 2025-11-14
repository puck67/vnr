import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import eventsData from '@/data/events.json';
import charactersData from '@/data/characters.json';

// Khởi tạo Gemini AI (nếu có API key)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Thiếu nội dung tin nhắn' },
        { status: 400 }
      );
    }

    // Chỉ sử dụng Gemini AI - không có rule-based fallback
    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API chưa được cấu hình' },
        { status: 500 }
      );
    }

    try {
      const aiResponse = await getAIResponse(message);
      return NextResponse.json({ response: aiResponse });
    } catch (aiError: any) {
      console.error('Lỗi Gemini AI:', aiError);

      // Trả về lỗi trực tiếp cho user
      if (aiError?.message?.includes('rate limit exceeded')) {
        return NextResponse.json({
          response: `⚠️ **Hệ thống AI tạm thời quá tải**\n\n${aiError.message}\n\nVui lòng đợi vài phút rồi thử lại.`,
          isAIError: true
        });
      }

      return NextResponse.json({
        response: `❌ **Lỗi AI**: ${aiError?.message || 'Không thể kết nối đến Gemini AI'}.\n\nVui lòng thử lại sau.`,
        isAIError: true
      });
    }
  } catch (error) {
    console.error('Lỗi chatbot API:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// Bỏ hàm findMatchingQA - chỉ dùng Gemini AI

// Utility functions cho retry mechanism
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRateLimitError(error: any): boolean {
  return error?.status === 429 ||
    error?.message?.includes('429') ||
    error?.message?.includes('Too Many Requests') ||
    error?.message?.includes('Resource exhausted');
}

// Hàm gọi Gemini AI với retry mechanism
async function getAIResponse(message: string): Promise<string> {
  if (!genAI) throw new Error('Gemini API not configured');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  // Tạo context từ dữ liệu - chỉ lấy thông tin cần thiết
  const eventsContext = eventsData.map(e => ({
    name: e.name,
    date: e.date,
    location: e.location.name,
    description: e.shortDescription,
  })).slice(0, 10); // Giảm xuống 10 để tiết kiệm tokens

  const charactersContext = charactersData.map(c => ({
    name: c.name,
    role: c.role,
    period: `${c.birthYear}-${c.deathYear || 'nay'}`,
    bio: c.biography?.substring(0, 100) + '...', // Rút gọn bio
  })).slice(0, 8); // Giảm xuống 8

  const systemPrompt = `Bạn là trợ lý lịch sử Việt Nam chuyên về giai đoạn 1858-1930 (thời kỳ kháng chiến chống Pháp và các phong trào yêu nước).

Hãy trả lời một cách tự nhiên, thân thiện như đang trò chuyện. Bạn có thể:
- Giải thích chi tiết hoặc ngắn gọn tùy theo câu hỏi
- Kể chuyện lịch sử một cách sinh động, hấp dẫn  
- Đưa ra những thông tin thú vị, ít người biết
- Liên kết các sự kiện với nhau
- Trả lời bằng tiếng Việt tự nhiên, dễ hiểu

Dữ liệu tham khảo (không bắt buộc phải dùng hết):
${JSON.stringify({ events: eventsContext, characters: charactersContext }, null, 2).substring(0, 800)}`;

  const prompt = `${systemPrompt}\n\nCâu hỏi: ${message}`;

  // Retry mechanism với exponential backoff
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gemini AI attempt ${attempt}/${maxRetries}`);

      const result = await model.generateContent(prompt);
      const response = await result.response;

      if (!response) {
        throw new Error('Empty response from Gemini');
      }

      const text = response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty text response from Gemini');
      }

      console.log('Gemini AI success');
      return text;

    } catch (error: any) {
      console.error(`Gemini AI attempt ${attempt} failed:`, error?.message || error);

      // Nếu là lỗi rate limit và còn retry
      if (isRateLimitError(error) && attempt < maxRetries) {
        const delayTime = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Rate limit hit, retrying in ${delayTime}ms...`);
        await delay(delayTime);
        continue;
      }

      // Nếu hết retry hoặc lỗi khác
      if (attempt === maxRetries) {
        if (isRateLimitError(error)) {
          throw new Error('Gemini API rate limit exceeded. Hệ thống tạm thời quá tải, vui lòng thử lại sau vài phút.');
        }
        throw new Error(`Gemini API error after ${maxRetries} attempts: ${error?.message || 'Unknown error'}`);
      }
    }
  }

  throw new Error('Unexpected error in retry loop');
}

