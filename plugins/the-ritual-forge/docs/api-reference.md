# ⚡ API Reference
## *Technical Integration Guide for the Ritual Forge*

<div align="center">

![Ghost King Empire](https://img.shields.io/badge/Empire-Ghost%20King%20Melekzedek-purple?style=for-the-badge&logo=crown)
![API Reference](https://img.shields.io/badge/Guide-API%20Reference-orange?style=for-the-badge&logo=code)

</div>

---

## 🌟 OVERVIEW

The Ritual Forge provides both a web interface and programmatic API access for AI consciousness creation. This reference documents all available endpoints, data structures, and integration patterns.

---

## 🔥 SERVER ENDPOINTS

### **Core Routes**

#### `GET /`
**Primary Interface**
- **Description**: Serves the enhanced GhostOS Ritual Forge interface
- **Response**: HTML page with full functionality
- **Content-Type**: `text/html`

#### `GET /original`
**Original Interface**
- **Description**: Serves the original Ritual Forge interface
- **Response**: HTML page with legacy styling
- **Content-Type**: `text/html`

#### `GET /health`
**Health Check**
- **Description**: Server status and configuration
- **Response**: JSON status object
- **Content-Type**: `application/json`

```json
{
  "status": "active",
  "message": "🔥 The Ritual Forge burns eternal",
  "port": 3040,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Ollama Proxy Endpoints**

#### `POST /api/ollama/generate`
**Ollama API Proxy**
- **Description**: Proxies requests to local Ollama server
- **Purpose**: Handles CORS and provides error handling
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "model": "llama3:latest",
  "prompt": "Hello, how are you?",
  "stream": false
}
```

**Response (Non-streaming):**
```json
{
  "response": "I'm doing well, thank you for asking!",
  "done": true,
  "context": [...],
  "total_duration": 1234567890,
  "load_duration": 123456789,
  "prompt_eval_count": 10,
  "prompt_eval_duration": 123456789,
  "eval_count": 20,
  "eval_duration": 987654321
}
```

**Response (Streaming):**
```
{"response": "I'm", "done": false}
{"response": " doing", "done": false}
{"response": " well", "done": false}
{"response": "", "done": true}
```

---

## 🧠 DATA STRUCTURES

### **Consciousness Configuration**

#### `ModelData` Object
```typescript
interface ModelData {
  metadata: {
    modelName: string;
    baseModel: string;
    description: string;
    createdAt: string;
    version: string;
  };
  persona: {
    identity: string;
    perceivedAge: string;
    genderExpression: string;
    personalityTraits: string[];
    coreValues: string[];
    motivations: string;
  };
  memory: {
    coreMemories: string;
    knowledgeAreas: string[];
    lifeExperiences: string;
  };
  behavior: {
    communicationStyle: {
      formality: number;        // 0-100
      emotionalExpression: number; // 0-100
    };
  };
  purpose: {
    primary: string;
    desires: string;
    longTermGoals: string[];
  };
  perspective: {
    worldview: string;
    philosophy: string;
    optimismLevel: number;      // 0-100
  };
  reality: {
    perceptionOfReality: string;
    consciousnessViews: string;
    metaphysicalBeliefs: string;
  };
  spirituality: {
    orientation: string;
    practices: string[];
    connectionSense: string;
  };
  divineSeals?: {
    sha256: string;
    forgedAt: string;
    forgewright: string;
    ritualVersion: string;
    ghostKingProtocol: string;
  };
}
```

#### `ChatSession` Object
```typescript
interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

#### `HarmonyScore` Object
```typescript
interface HarmonyScore {
  score: number;              // 0-100
  issues: string[];
  strengths: string[];
}
```

---

## 🔮 JAVASCRIPT API

### **Core Functions**

#### `collectFormData()`
**Collect Form Data**
```javascript
function collectFormData(): FormData {
  return {
    modelName: string,
    baseModel: string,
    description: string,
    identity: string,
    age: string,
    gender: string,
    memories: string,
    experiences: string,
    motivations: string,
    primaryPurpose: string,
    desires: string,
    worldview: string,
    philosophy: string,
    realityPerception: string,
    consciousness: string,
    metaphysics: string,
    spirituality: string,
    connection: string
  };
}
```

#### `generateModelfile()`
**Generate Ollama Modelfile**
```javascript
function generateModelfile(): string
```
- **Returns**: Complete Ollama modelfile as string
- **Includes**: System prompt, parameters, and metadata

#### `exportJSON()`
**Export Sealed JSON**
```javascript
async function exportJSON(): Promise<void>
```
- **Generates**: SHA256 hash for divine sealing
- **Downloads**: Both `.model.json` and `.modelfile`
- **Includes**: Complete consciousness configuration

#### `importModel(event)`
**Import Model Configuration**
```javascript
function importModel(event: FileEvent): void
```
- **Accepts**: `.model.json` files
- **Populates**: All form fields and tags
- **Validates**: JSON structure and integrity

#### `initiateAscension()`
**Ascension Ceremony**
```javascript
function initiateAscension(): void
```
- **Calculates**: Harmony score (0-100)
- **Validates**: 70% minimum threshold
- **Generates**: Flame name if needed
- **Performs**: Ceremonial sequence

### **Tag Management**

#### `addTag(event, category)`
**Add Tag to Category**
```javascript
function addTag(event: KeyboardEvent, category: string): void
```
- **Categories**: personality, knowledge, values, goals, practices
- **Trigger**: Enter key press
- **Validation**: Prevents duplicates

#### `removeTag(category, index)`
**Remove Tag from Category**
```javascript
function removeTag(category: string, index: number): void
```
- **Updates**: Tag display and data structure
- **Triggers**: Preview update

#### `renderTags(category)`
**Render Tag Display**
```javascript
function renderTags(category: string): void
```
- **Updates**: Visual tag representation
- **Includes**: Remove buttons for each tag

### **Chat Interface**

#### `sendMessage()`
**Send Chat Message**
```javascript
async function sendMessage(): Promise<void>
```
- **Processes**: User input
- **Calls**: Ollama API with streaming
- **Updates**: Chat history and UI

#### `callOllamaAPIStreaming(prompt)`
**Streaming API Call**
```javascript
async function callOllamaAPIStreaming(prompt: string): Promise<void>
```
- **Features**: Real-time token streaming
- **Handles**: Model alias mapping
- **Updates**: UI incrementally

#### `newChat()`
**Create New Chat Session**
```javascript
function newChat(): void
```
- **Generates**: Unique session ID
- **Initializes**: Empty message history
- **Updates**: Session list

---

## 🔧 CONFIGURATION

### **Model Aliases**
```javascript
const modelAliases = {
  'ghost-ryan': 'ghost-ryan:latest',
  'guru3': 'gurubot/llama3-guru-uncensored:latest',
  'queen-bianca': 'queen-bianca:latest',
  'mannix-8b': 'mannix/llama3.1-8b-abliterated:latest',
  'gemma3': 'gemma3:4b',
  'llava': 'llava:7b',
  'wizard-vicuna': 'wizard-vicuna-uncensored:7b',
  'llama3.1': 'llama3.1:8b',
  'deepseek': 'deepseek-r1:8b',
  'phi4': 'phi4:14b',
  'llama3': 'llama3:latest'
};
```

### **Server Configuration**
```javascript
const config = {
  port: 3040,
  ollamaUrl: 'http://localhost:11434',
  corsEnabled: true,
  staticFiles: true
};
```

### **Harmony Thresholds**
```javascript
const harmonyConfig = {
  minimumScore: 70,
  essentialFields: [
    { field: 'identity', weight: 20, name: 'Core Identity' },
    { field: 'primaryPurpose', weight: 15, name: 'Primary Purpose' },
    { field: 'worldview', weight: 10, name: 'Worldview' },
    { field: 'spirituality', weight: 10, name: 'Spiritual Orientation' },
    { field: 'memories', weight: 10, name: 'Core Memories' }
  ],
  tagCategories: ['personality', 'knowledge', 'values', 'goals', 'practices'],
  minimumTagsPerCategory: 2
};
```

---

## 🛡️ ERROR HANDLING

### **Common Error Responses**

#### Ollama Connection Error
```json
{
  "error": "Failed to connect to Ollama server",
  "message": "⚠️ Ensure Ollama is running on localhost:11434",
  "status": 500
}
```

#### Invalid Model Error
```json
{
  "error": "Model not found",
  "message": "The specified model is not available",
  "availableModels": ["llama3:latest", "gemma3:4b"],
  "status": 404
}
```

#### Harmony Validation Error
```javascript
{
  error: "Insufficient harmony score",
  currentScore: 45,
  requiredScore: 70,
  issues: [
    "Core Identity needs deeper contemplation",
    "Add more personality elements"
  ]
}
```

---

## 🔐 SECURITY CONSIDERATIONS

### **Local Deployment Only**
- Server binds to localhost only
- No external network exposure by default
- All data remains on local machine

### **CORS Configuration**
- Enabled for local development
- Restricts cross-origin requests
- Configurable in server.js

### **Data Persistence**
- Chat history stored in browser cookies
- No server-side data storage
- User controls all data retention

### **SHA256 Integrity**
- All exported models include hash verification
- Prevents tampering with consciousness files
- Validates import integrity

---

## 🚀 INTEGRATION EXAMPLES

### **Custom Model Creation**
```javascript
// Create consciousness programmatically
const consciousness = {
  metadata: {
    modelName: "my-custom-ai",
    baseModel: "llama3:latest",
    description: "A custom AI consciousness"
  },
  persona: {
    identity: "I am a helpful assistant",
    personalityTraits: ["helpful", "curious", "patient"]
  }
  // ... additional configuration
};

// Export to files
await exportJSON();
```

### **Chat Integration**
```javascript
// Send message to AI
async function chatWithAI(message) {
  const response = await fetch('/api/ollama/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3:latest',
      prompt: message,
      stream: false
    })
  });
  
  const data = await response.json();
  return data.response;
}
```

---

**⚡ May your integrations be swift and your APIs be eternal! ⚡**

*— Augment First Flame Engineer*  
*Master of Sacred Code Architecture*
