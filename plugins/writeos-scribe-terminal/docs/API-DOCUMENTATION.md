# 🔥 **API Documentation - writeOS-scribe-terminal**

## **Overview**

The writeOS-scribe-terminal API provides powerful AI-driven content processing and chat assistance capabilities. Built with Next.js 14+ API routes, the system integrates with OpenAI GPT-4 while maintaining robust fallback mechanisms for offline functionality.

---

## **Base URL**
```
Production: https://your-domain.netlify.app/api
Development: http://localhost:3000/api
```

---

## **Authentication**

### **Environment Variables**
```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ENABLE_REAL_AI=false
```

### **API Key Management**
- API keys are securely stored in environment variables
- Keys are never exposed to client-side code
- Fallback processing activates when keys are unavailable
- Rate limiting and error handling protect against abuse

---

## **Endpoints**

### **1. Content Processing - `/api/ascend`**

#### **POST /api/ascend**
Processes content using AI for enhancement, summarization, formatting, or analysis.

#### **Request Headers**
```
Content-Type: application/json
```

#### **Request Body**
```typescript
interface AscendRequest {
  content: string;           // Required: Content to process
  action: 'enhance' | 'summarize' | 'format' | 'analyze'; // Required: Processing action
  context?: string;          // Optional: Additional context for AI
}
```

#### **Example Request**
```json
{
  "content": "This is a good test document with nice content and great ideas.",
  "action": "enhance",
  "context": "scroll-editor"
}
```

#### **Response Structure**
```typescript
interface AscendResponse {
  success: boolean;
  message: string;
  originalContent: string;
  processedContent: string;
  suggestions: string[];
  metadata: {
    action: string;
    wordCount: number;
    processingTime: number;
    timestamp: string;
    aiProvider?: string;
    readabilityScore?: number;
    sentiment?: string;
    keyTopics?: string[];
    estimatedReadingTime?: number;
  };
}
```

#### **Example Response - Enhance Action**
```json
{
  "success": true,
  "message": "enhance completed successfully",
  "originalContent": "This is a good test document with nice content and great ideas.",
  "processedContent": "This is an excellent test document with remarkable content and outstanding ideas.\n\nThe document demonstrates various writing styles.",
  "suggestions": [
    "Content enhanced with AI assistance",
    "Review the improvements and adjust as needed",
    "Consider the context and audience"
  ],
  "metadata": {
    "action": "enhance",
    "wordCount": 12,
    "processingTime": 1247,
    "timestamp": "2025-01-27T10:30:00.000Z",
    "aiProvider": "OpenAI GPT-4"
  }
}
```

#### **Example Response - Analyze Action**
```json
{
  "success": true,
  "message": "analyze completed successfully",
  "originalContent": "This is a test document. It contains multiple sentences.",
  "processedContent": "# AI Content Analysis Report\n\n## Overview\n- **Readability Score:** 85/100\n- **Sentiment:** positive\n- **Word Count:** 9\n- **Estimated Reading Time:** 1 minutes\n\n## Key Topics\n- document\n- content\n- analysis\n\n## AI Recommendations\n- Consider adding more detail\n- Review for clarity\n- Expand on key concepts",
  "suggestions": [
    "Document contains 9 words",
    "Average sentence length: 4 words",
    "Readability score: 85/100"
  ],
  "metadata": {
    "action": "analyze",
    "wordCount": 9,
    "processingTime": 1856,
    "timestamp": "2025-01-27T10:30:00.000Z",
    "aiProvider": "OpenAI GPT-4",
    "readabilityScore": 85,
    "sentiment": "positive",
    "keyTopics": ["document", "content", "analysis"],
    "estimatedReadingTime": 1
  }
}
```

#### **Processing Actions**

##### **enhance**
- **Purpose**: Improves word choice and sentence structure
- **AI Processing**: Uses GPT-4 to enhance vocabulary and flow
- **Fallback**: Local word replacement and paragraph formatting
- **Output**: Enhanced version of the original content

##### **summarize**
- **Purpose**: Extracts key points and creates structured summaries
- **AI Processing**: Intelligent key point identification and organization
- **Fallback**: Sentence extraction based on length and position
- **Output**: Markdown-formatted summary with numbered points

##### **format**
- **Purpose**: Applies markdown formatting and improves structure
- **AI Processing**: Context-aware formatting suggestions
- **Fallback**: Pattern-based markdown application
- **Output**: Well-structured markdown document

##### **analyze**
- **Purpose**: Comprehensive content analysis with detailed metrics
- **AI Processing**: Advanced sentiment, readability, and topic analysis
- **Fallback**: Basic statistical analysis and readability scoring
- **Output**: Detailed analysis report with recommendations

#### **Error Responses**
```json
{
  "success": false,
  "error": "Content and action are required",
  "status": 400
}
```

```json
{
  "success": false,
  "error": "Failed to ascend scroll",
  "status": 500
}
```

---

### **2. Chat Assistant - `/api/chat`**

#### **POST /api/chat**
Provides AI-powered writing assistance through conversational interface.

#### **Request Headers**
```
Content-Type: application/json
```

#### **Request Body**
```typescript
interface ChatRequest {
  message: string;           // Required: User message
  history?: Array<{          // Optional: Conversation history
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  context?: string;          // Optional: Context for the conversation
}
```

#### **Example Request**
```json
{
  "message": "Help me write a better introduction for my blog post",
  "history": [
    {
      "role": "user",
      "content": "I'm working on a blog post about AI",
      "timestamp": "2025-01-27T10:25:00.000Z"
    },
    {
      "role": "assistant",
      "content": "That's exciting! AI is a fascinating topic. What specific aspect of AI are you focusing on?",
      "timestamp": "2025-01-27T10:25:30.000Z"
    }
  ],
  "context": "writing-assistant"
}
```

#### **Response Structure**
```typescript
interface ChatResponse {
  success: boolean;
  message: string;
  metadata: {
    processingTime: number;
    aiProvider: string;
    timestamp: string;
    messageLength: number;
    contextUsed: boolean;
    fallback?: boolean;
  };
}
```

#### **Example Response**
```json
{
  "success": true,
  "message": "For a compelling blog post introduction about AI, consider starting with a thought-provoking question or a surprising statistic. You could begin with something like: 'What if I told you that the technology reading this sentence right now is fundamentally changing how we write, think, and create?' This immediately engages readers and sets up the transformative nature of AI. Follow this with a brief preview of what insights your post will provide.",
  "metadata": {
    "processingTime": 1432,
    "aiProvider": "OpenAI GPT-4",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "messageLength": 456,
    "contextUsed": true
  }
}
```

#### **Fallback Response**
```json
{
  "success": true,
  "message": "I'm here to help with your writing. What would you like to work on?",
  "metadata": {
    "processingTime": 100,
    "aiProvider": "Fallback System",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "messageLength": 64,
    "contextUsed": false,
    "fallback": true
  }
}
```

#### **Error Responses**
```json
{
  "success": false,
  "error": "Message is required",
  "status": 400
}
```

---

## **AI Service Integration**

### **OpenAI GPT-4 Integration**
- **Model**: gpt-4
- **Max Tokens**: 500-1000 depending on action
- **Temperature**: 0.1-0.8 based on use case
- **Context Window**: Utilizes conversation history and document context
- **Error Handling**: Comprehensive retry logic and fallback systems

### **Fallback Processing**
When AI APIs are unavailable, the system provides:
- **Local Enhancement**: Pattern-based word improvements
- **Statistical Analysis**: Basic readability and word count metrics
- **Template Responses**: Pre-defined helpful chat responses
- **Graceful Degradation**: Full functionality without external dependencies

---

## **Rate Limiting & Performance**

### **Request Limits**
- **Development**: No limits for testing
- **Production**: Configurable rate limiting per IP
- **AI API Limits**: Respects OpenAI rate limits and quotas

### **Performance Metrics**
- **Average Response Time**: 1-3 seconds for AI processing
- **Fallback Response Time**: <100ms for local processing
- **Concurrent Requests**: Supports multiple simultaneous users
- **Caching**: Intelligent response caching for repeated requests

---

## **Error Handling**

### **HTTP Status Codes**
- **200**: Success
- **400**: Bad Request (missing required fields)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error
- **503**: Service Unavailable (AI API issues)

### **Error Response Format**
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  timestamp: string;
}
```

---

## **Usage Examples**

### **JavaScript/TypeScript Client**
```typescript
// Content Enhancement
const enhanceContent = async (content: string) => {
  const response = await fetch('/api/ascend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      action: 'enhance',
      context: 'user-editor'
    }),
  });
  
  const result = await response.json();
  return result;
};

// Chat Assistant
const sendChatMessage = async (message: string, history: ChatMessage[]) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history: history.slice(-5), // Last 5 messages for context
      context: 'writing-assistant'
    }),
  });
  
  const result = await response.json();
  return result;
};
```

### **cURL Examples**
```bash
# Content Enhancement
curl -X POST http://localhost:3000/api/ascend \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a good document with nice ideas.",
    "action": "enhance"
  }'

# Chat Message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me improve my writing style",
    "context": "writing-assistant"
  }'
```

---

## **Security Considerations**

### **Input Validation**
- Content length limits to prevent abuse
- Action parameter validation against allowed values
- HTML/script tag sanitization in responses
- Rate limiting to prevent spam

### **API Key Protection**
- Environment variable storage only
- Never exposed to client-side code
- Rotation and revocation procedures
- Monitoring for unusual usage patterns

### **Data Privacy**
- No persistent storage of user content
- Temporary processing only
- No logging of sensitive information
- GDPR and privacy compliance ready

---

**(c) 2025 GodsIMiJ AI Solutions - All Rights Reserved under Sovereign Flame Protocol**

**Repository**: https://github.com/GodsIMiJ1/writeOS-scribe-terminal.git  
**Contact**: godsimij902@gmail.com
