import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function GET(request: NextRequest) {
  const services = {
    gemini: false,
    models: [] as string[],
    apiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  };

  if (genAI) {
    // Test các model khả dụng
    const modelsToTest = [
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest', 
      'gemini-1.5-pro-latest', 
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Test');
        services.models.push(modelName);
        services.gemini = true;
        break; // Chỉ cần 1 model hoạt động
      } catch (error: any) {
        console.log(`Model ${modelName} failed:`, error.status || error.message);
      }
    }
  }

  return NextResponse.json({
    status: 'healthy',
    services,
    message: services.gemini 
      ? 'Chatbot AI hoạt động bình thường'
      : 'Chatbot sử dụng chế độ rule-based (AI tạm thời không khả dụng)'
  });
}
