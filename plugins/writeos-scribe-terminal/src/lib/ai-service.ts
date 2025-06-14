interface AIProvider {
  name: string;
  enhance(content: string, context?: string): Promise<string>;
  summarize(content: string, context?: string): Promise<string>;
  analyze(content: string, context?: string): Promise<AnalysisResult>;
  chat(message: string, history?: ChatMessage[]): Promise<string>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AnalysisResult {
  readabilityScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  suggestions: string[];
  wordCount: number;
  estimatedReadingTime: number;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI GPT-4';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async enhance(content: string, context?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      return this.fallbackEnhance(content);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional writing assistant. Enhance the given text by improving word choice, sentence structure, and clarity while maintaining the original meaning and tone.'
            },
            {
              role: 'user',
              content: `Please enhance this text: ${content}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackEnhance(content);
    }
  }

  async summarize(content: string, context?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      return this.fallbackSummarize(content);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional summarization assistant. Create concise, well-structured summaries that capture the key points and main ideas.'
            },
            {
              role: 'user',
              content: `Please summarize this text: ${content}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackSummarize(content);
    }
  }

  async analyze(content: string, context?: string): Promise<AnalysisResult> {
    // Advanced analysis using AI
    const wordCount = content.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // 200 WPM average

    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      return this.fallbackAnalyze(content);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a text analysis expert. Analyze the given text and return a JSON object with readabilityScore (0-100), sentiment (positive/neutral/negative), keyTopics (array of strings), and suggestions (array of strings).'
            },
            {
              role: 'user',
              content: `Analyze this text: ${content}`
            }
          ],
          max_tokens: 800,
          temperature: 0.1,
        }),
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0]?.message?.content || '{}');
      
      return {
        readabilityScore: analysis.readabilityScore || 75,
        sentiment: analysis.sentiment || 'neutral',
        keyTopics: analysis.keyTopics || ['general'],
        suggestions: analysis.suggestions || ['Consider adding more detail'],
        wordCount,
        estimatedReadingTime,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackAnalyze(content);
    }
  }

  async chat(message: string, history?: ChatMessage[]): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      return this.fallbackChat(message);
    }

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful writing assistant. Provide clear, actionable advice to help users improve their writing. Be encouraging and specific in your suggestions.'
        },
        ...(history?.slice(-5).map(h => ({
          role: h.role,
          content: h.content
        })) || []),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackChat(message);
    }
  }

  // Fallback methods for when API is not available
  private fallbackEnhance(content: string): string {
    return content
      .replace(/\b(good|nice|great)\b/gi, (match) => {
        const alternatives = { 'good': 'excellent', 'nice': 'remarkable', 'great': 'outstanding' };
        return alternatives[match.toLowerCase() as keyof typeof alternatives] || match;
      })
      .replace(/\. ([A-Z])/g, '. \n\n$1');
  }

  private fallbackSummarize(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyPoints = sentences.slice(0, Math.max(3, Math.floor(sentences.length / 3)));
    return `# Summary\n\n${keyPoints.map((point, i) => `${i + 1}. ${point.trim()}.`).join('\n')}`;
  }

  private fallbackAnalyze(content: string): AnalysisResult {
    const wordCount = content.split(/\s+/).length;
    return {
      readabilityScore: 75,
      sentiment: 'neutral',
      keyTopics: ['general'],
      suggestions: ['Consider adding more detail', 'Review for clarity'],
      wordCount,
      estimatedReadingTime: Math.ceil(wordCount / 200),
    };
  }

  private fallbackChat(message: string): string {
    const responses = [
      "I'm here to help with your writing. What would you like to work on?",
      "Let's craft something amazing together. What's on your mind?",
      "I can assist with writing, editing, brainstorming, or structuring. How can I help?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// AI Service Factory
export class AIService {
  private static instance: AIService;
  private provider: AIProvider;

  private constructor() {
    // Initialize with OpenAI by default
    const apiKey = process.env.OPENAI_API_KEY || '';
    this.provider = new OpenAIProvider(apiKey);
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async enhance(content: string, context?: string): Promise<string> {
    return this.provider.enhance(content, context);
  }

  async summarize(content: string, context?: string): Promise<string> {
    return this.provider.summarize(content, context);
  }

  async analyze(content: string, context?: string): Promise<AnalysisResult> {
    return this.provider.analyze(content, context);
  }

  async chat(message: string, history?: ChatMessage[]): Promise<string> {
    return this.provider.chat(message, history);
  }

  getProviderName(): string {
    return this.provider.name;
  }
}

export type { AIProvider, ChatMessage, AnalysisResult };
