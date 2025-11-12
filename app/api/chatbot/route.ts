import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import qaData from '@/data/chatbot-qa.json';
import eventsData from '@/data/events.json';
import charactersData from '@/data/characters.json';
import { ChatbotQA } from '@/types';

const qas = qaData as ChatbotQA[];

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

    // Thử tìm câu trả lời từ rule-based trước
    const matchedQA = findMatchingQA(message.toLowerCase());

    if (matchedQA) {
      // Luôn dùng câu trả lời chi tiết
      return NextResponse.json({ response: matchedQA.detailedAnswer });
    }

    // Nếu có Gemini API key, sử dụng AI
    if (genAI) {
      try {
        const aiResponse = await getAIResponse(message);
        return NextResponse.json({ response: aiResponse });
      } catch (aiError) {
        console.error('Lỗi Gemini AI:', aiError);
        // Fallback to default response
      }
    }

    // Nếu không tìm thấy, trả về câu trả lời mặc định chi tiết
    const defaultResponse = 'Xin lỗi, tôi chưa có thông tin chi tiết về câu hỏi này. Tôi có thể giúp bạn tìm hiểu về:\n\n- Các cuộc xâm lược của Pháp (1858-1884)\n- Phong trào Cần Vương (1885-1896)\n- Phong trào Đông Du và Duy Tân (1905-1908)\n- Thành lập Đảng Cộng sản Việt Nam (1930)\n- Các nhân vật lịch sử như Phan Bội Châu, Phan Châu Trinh, Hoàng Hoa Thám\n\nBạn muốn tìm hiểu về chủ đề nào?';

    return NextResponse.json({ response: defaultResponse });
  } catch (error) {
    console.error('Lỗi chatbot API:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// Hàm tìm QA phù hợp
function findMatchingQA(message: string): ChatbotQA | null {
  let bestMatch: ChatbotQA | null = null;
  let maxMatches = 0;

  for (const qa of qas) {
    let matches = 0;

    for (const keyword of qa.keywords) {
      if (message.includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = qa;
    }
  }

  // Chỉ trả về nếu có ít nhất 1 keyword match
  return maxMatches > 0 ? bestMatch : null;
}

// Hàm gọi Gemini AI
async function getAIResponse(message: string): Promise<string> {
  if (!genAI) throw new Error('Gemini API not configured');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  // Tạo context từ dữ liệu - chỉ lấy thông tin cần thiết
  const eventsContext = eventsData.map(e => ({
    name: e.name,
    date: e.date,
    location: e.location.name,
    description: e.shortDescription,
  })).slice(0, 15);
  
  const charactersContext = charactersData.map(c => ({
    name: c.name,
    role: c.role,
    period: `${c.birthYear}-${c.deathYear || 'nay'}`,
    bio: c.biography,
  })).slice(0, 10);

  const systemPrompt = `Bạn là chuyên gia lịch sử Việt Nam về giai đoạn 1858-1945 (thời kỳ kháng chiến chống Pháp).

PHONG CÁCH:
- Trả lời chi tiết, dễ hiểu
- Cấu trúc rõ ràng: Nguyên nhân → Diễn biến → Kết quả → Ý nghĩa
- Dẫn chứng cụ thể về thời gian, địa điểm, nhân vật
- Giải thích theo cách sinh động, hấp dẫn

DỮ LIỆU SỰ KIỆN:
${JSON.stringify(eventsContext, null, 2)}

DỮ LIỆU NHÂN VẬT:
${JSON.stringify(charactersContext, null, 2)}

QUAN TRỌNG:
- Ưu tiên trả lời dựa trên dữ liệu đã cho
- Có thể bổ sung kiến thức lịch sử chung nhưng phải chính xác
- Luôn trả lời bằng tiếng Việt
- Nếu không chắc chắn, nói rõ "Thông tin này cần được xác minh thêm"`;

  const prompt = `${systemPrompt}\n\n===\nCÂU HỎI: ${message}\n\nTRẢ LỜI:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

