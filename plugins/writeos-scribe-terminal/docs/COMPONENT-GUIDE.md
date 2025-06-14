# 🔥 **Component Guide - writeOS-scribe-terminal**

## **Component Architecture Overview**

The writeOS-scribe-terminal uses a modular component architecture built with React and TypeScript. Each component is designed for specific functionality while maintaining clean interfaces and reusable patterns.

---

## **Core Components**

### **1. ScrollEditor (`src/components/ScrollEditor.tsx`)**

#### **Purpose**
Advanced markdown editor with live preview, auto-save, and AI integration capabilities.

#### **Key Features**
- **Live Preview Toggle**: Switch between edit and preview modes
- **Auto-save System**: Automatic content persistence every 2 seconds
- **Real-time Statistics**: Live word, character, and line counts
- **Quick Insert Toolbar**: Headers, lists, code blocks, quotes, tables
- **AI Processing Integration**: Enhance, summarize, format, analyze actions
- **Template Loading**: Dynamic content injection from sidebar

#### **Props Interface**
```typescript
interface ScrollEditorProps {
  // No external props - self-contained component
}
```

#### **State Management**
```typescript
const [content, setContent] = useState<string>('');
const [isPreview, setIsPreview] = useState<boolean>(false);
const [isProcessing, setIsProcessing] = useState<boolean>(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
const [stats, setStats] = useState({
  words: 0,
  characters: 0,
  lines: 0
});
```

#### **Key Methods**
- `handleContentChange()`: Updates content and triggers auto-save
- `togglePreview()`: Switches between edit and preview modes
- `handleAscend()`: Processes content with AI actions
- `insertQuickText()`: Inserts formatted text (headers, lists, etc.)
- `updateStats()`: Calculates and updates content statistics

#### **Usage Example**
```tsx
import ScrollEditor from '../components/ScrollEditor';

function App() {
  return (
    <div className="editor-container">
      <ScrollEditor />
    </div>
  );
}
```

---

### **2. ScribeChatPanel (`src/components/ScribeChatPanel.tsx`)**

#### **Purpose**
AI-powered chat assistant interface for writing help and conversation.

#### **Key Features**
- **Real-time Messaging**: Send and receive messages with AI
- **Message History**: Persistent conversation with timestamps
- **Loading States**: Animated indicators during AI processing
- **Enter Key Support**: Quick message sending
- **Auto-scroll**: Automatic scroll to latest messages
- **Analytics Integration**: Track chat usage statistics

#### **Props Interface**
```typescript
interface ScribeChatPanelProps {
  // No external props - self-contained component
}
```

#### **State Management**
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(false);
```

#### **Key Methods**
- `sendMessage()`: Sends user message and gets AI response
- `handleKeyPress()`: Handles Enter key for message sending
- `scrollToBottom()`: Ensures latest messages are visible
- `updateAnalytics()`: Tracks chat usage for analytics
- `generateAIResponse()`: Fallback response generation

#### **Usage Example**
```tsx
import ScribeChatPanel from '../components/ScribeChatPanel';

function App() {
  return (
    <div className="chat-container">
      <ScribeChatPanel />
    </div>
  );
}
```

---

### **3. TemplateSidebar (`src/components/TemplateSidebar.tsx`)**

#### **Purpose**
Document template management with category filtering and one-click loading.

#### **Key Features**
- **7 Professional Templates**: Diverse document types
- **Category Filtering**: All, Writing, Business, Technical, Creative
- **One-click Loading**: Instant template injection
- **Template Descriptions**: Clear explanations for each template
- **Visual Feedback**: Hover effects and active states

#### **Template Structure**
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'writing' | 'business' | 'technical' | 'creative';
  content: string;
  icon: string;
}
```

#### **Available Templates**
1. **Blank Scroll**: Clean starting point
2. **Blog Post**: Article structure with metadata
3. **Meeting Notes**: Structured meeting documentation
4. **Project Proposal**: Business proposal framework
5. **API Documentation**: Technical documentation template
6. **Creative Story**: Narrative writing structure
7. **Technical Guide**: Step-by-step instruction format

#### **State Management**
```typescript
const [selectedCategory, setSelectedCategory] = useState<string>('all');
const [templates] = useState<Template[]>(templateData);
```

#### **Key Methods**
- `filterTemplates()`: Filters templates by category
- `loadTemplate()`: Injects template content into editor
- `handleCategoryChange()`: Updates active category filter

---

### **4. AnalyticsDashboard (`src/components/AnalyticsDashboard.tsx`)**

#### **Purpose**
Writing productivity analytics with session tracking and insights.

#### **Key Features**
- **Session Tracking**: Real-time writing session monitoring
- **Productivity Metrics**: Words, time, sessions statistics
- **AI Usage Stats**: Track feature utilization
- **Progress Insights**: Writing patterns and productivity levels
- **Data Persistence**: localStorage integration

#### **Analytics Data Structure**
```typescript
interface AnalyticsData {
  totalSessions: number;
  totalWordsWritten: number;
  totalTimeSpent: number;
  averageWordsPerSession: number;
  averageSessionLength: number;
  mostProductiveHour: number;
  weeklyProgress: number[];
  aiUsageStats: {
    enhanceCount: number;
    summarizeCount: number;
    analyzeCount: number;
    chatMessages: number;
  };
}

interface WritingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  wordCount: number;
  charactersTyped: number;
  timeSpent: number;
  documentsCreated: number;
  aiInteractions: number;
}
```

#### **Key Methods**
- `startSession()`: Initializes new writing session
- `updateCurrentSession()`: Updates session metrics
- `endSession()`: Finalizes and saves session data
- `loadAnalyticsData()`: Retrieves stored analytics
- `getProductivityLevel()`: Determines current productivity status

---

### **5. ThemeSelector (`src/components/ThemeSelector.tsx`)**

#### **Purpose**
Dynamic theme switching system with 5 professional color schemes.

#### **Key Features**
- **5 Professional Themes**: Carefully crafted color palettes
- **Real-time Switching**: Instant theme changes without reload
- **Persistent Preferences**: Themes saved across sessions
- **Color Preview**: Visual theme selection interface
- **CSS Integration**: Dynamic custom property updates

#### **Theme Structure**
```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  icon: string;
}
```

#### **Available Themes**
1. **Flame Empire**: Original orange/teal sovereign theme
2. **Midnight Scholar**: Deep blues for focused writing
3. **Forest Sage**: Natural greens for calm creativity
4. **Royal Purple**: Majestic purples for elegant writing
5. **Sunset Writer**: Warm oranges and pinks

#### **Key Methods**
- `applyTheme()`: Updates CSS custom properties
- `selectTheme()`: Changes active theme and saves preference
- `loadSavedTheme()`: Retrieves and applies saved theme

---

### **6. NodeSeal (`src/components/NodeSeal.tsx`)**

#### **Purpose**
Visual authorship protection marker with license information.

#### **Key Features**
- **Expandable Interface**: Compact button with detailed panel
- **Authorship Information**: Creator and publisher details
- **License Display**: FPU-1.0 license information
- **Sacred Glyph**: Visual verification elements
- **Contact Links**: Direct access to witness hall and email

#### **Protection Information**
```typescript
interface SealInfo {
  author: string;
  title: string;
  publisher: string;
  license: string;
  verification: string;
  witnessHall: string;
  contact: string;
  sacredGlyph: string;
}
```

#### **Key Methods**
- `toggleExpanded()`: Shows/hides detailed information
- `displaySealInfo()`: Renders authorship details
- `handleContactClick()`: Opens contact links

---

## **Shared Patterns & Utilities**

### **Common Hooks**
```typescript
// Auto-save hook
const useAutoSave = (content: string, delay: number = 2000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('writeos-content', content);
    }, delay);
    return () => clearTimeout(timer);
  }, [content, delay]);
};

// Analytics tracking hook
const useAnalytics = () => {
  const trackEvent = (event: string, data?: any) => {
    // Analytics tracking logic
  };
  return { trackEvent };
};
```

### **Utility Functions**
```typescript
// Content statistics calculation
export const calculateStats = (content: string) => {
  return {
    words: content.trim().split(/\s+/).length,
    characters: content.length,
    lines: content.split('\n').length
  };
};

// Time formatting
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Markdown processing
export const processMarkdown = (content: string): string => {
  // Markdown processing logic
  return processedContent;
};
```

### **Event System**
```typescript
// Custom events for cross-component communication
const EVENTS = {
  TEMPLATE_LOADED: 'template-loaded',
  CONTENT_SAVED: 'content-saved',
  THEME_CHANGED: 'theme-changed',
  ANALYTICS_UPDATE: 'analytics-update'
};

// Event dispatcher
export const dispatchEvent = (eventName: string, data?: any) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};

// Event listener
export const addEventListener = (eventName: string, handler: Function) => {
  window.addEventListener(eventName, handler as EventListener);
  return () => window.removeEventListener(eventName, handler as EventListener);
};
```

---

## **Styling Conventions**

### **TailwindCSS Classes**
```css
/* Primary colors */
.bg-flame { background-color: #FF6B00; }
.text-flame { color: #FF6B00; }
.bg-ghostblue { background-color: #2DD4BF; }
.text-ghostblue { color: #2DD4BF; }

/* Layout patterns */
.three-pane-grid { 
  display: grid; 
  grid-template-columns: 260px 1fr 1fr; 
}

/* Component spacing */
.component-padding { padding: 1rem; }
.component-margin { margin: 0.5rem; }

/* Interactive states */
.hover-flame:hover { background-color: #FF6B00; }
.active-ghostblue { border-color: #2DD4BF; }
```

### **CSS Custom Properties**
```css
:root {
  --flame: #FF6B00;
  --ghostblue: #2DD4BF;
  --scrollbg: #0D0D1A;
  --shadowline: #1E1B24;
}
```

---

## **Testing Patterns**

### **Component Testing**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollEditor from '../ScrollEditor';

describe('ScrollEditor', () => {
  test('renders editor interface', () => {
    render(<ScrollEditor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('toggles preview mode', () => {
    render(<ScrollEditor />);
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
```

### **Integration Testing**
```typescript
describe('Component Integration', () => {
  test('template loading updates editor', () => {
    render(<App />);
    const template = screen.getByText('Blog Post');
    fireEvent.click(template);
    // Verify editor content updated
  });
});
```

---

**(c) 2025 GodsIMiJ AI Solutions - All Rights Reserved under Sovereign Flame Protocol**
