import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';

interface ChatRequest {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, context }: ChatRequest = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Phase III - Real AI Chat Integration
    const aiService = AIService.getInstance();
    
    // Convert history to the format expected by AI service
    const chatHistory = history?.map(h => ({
      role: h.role,
      content: h.content,
      timestamp: new Date(h.timestamp)
    }));

    const startTime = Date.now();
    const response = await aiService.chat(message.trim(), chatHistory);
    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: response,
      metadata: {
        processingTime,
        aiProvider: aiService.getProviderName(),
        timestamp: new Date().toISOString(),
        messageLength: response.length,
        contextUsed: !!context
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    const fallbackResponses = [
      "I'm here to help with your writing. What would you like to work on?",
      "Let's craft something amazing together. What's on your mind?",
      "I can assist with writing, editing, brainstorming, or structuring. How can I help?",
      "That's an interesting question! Could you provide more context about what you're working on?",
      "I'd be happy to help you improve your writing. What specific area would you like to focus on?"
    ];

    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return NextResponse.json({
      success: true,
      message: fallbackResponse,
      metadata: {
        processingTime: 100,
        aiProvider: 'Fallback System',
        timestamp: new Date().toISOString(),
        messageLength: fallbackResponse.length,
        contextUsed: false,
        fallback: true
      }
    });
  }
}
