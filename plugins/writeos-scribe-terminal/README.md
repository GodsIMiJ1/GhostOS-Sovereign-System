# 🔥 writeOS-scribe-terminal

**Sovereign scroll editor + AI assistant app** - A professional-grade AI-powered writing platform built with Next.js 14+, TypeScript, and TailwindCSS.

![writeOS Banner](https://img.shields.io/badge/writeOS-Scribe%20Terminal-FF6B00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

## ✨ Features

### 🤖 AI-Powered Writing Assistant
- **Real AI Integration** - OpenAI GPT-4 support with fallback system
- **Smart Enhancement** - Improve word choice and sentence structure
- **Intelligent Summarization** - Extract key points automatically
- **Content Analysis** - Readability scoring and sentiment analysis
- **Contextual Chat** - Writing assistance with conversation memory

### ✍️ Advanced Markdown Editor
- **Live Preview** - Toggle between edit and preview modes
- **Quick Insert Toolbar** - Headers, lists, code blocks, quotes, tables
- **Auto-save** - Automatic content persistence
- **Live Statistics** - Real-time word, character, and line counts
- **Template System** - Professional document templates

### 📊 Analytics Dashboard
- **Session Tracking** - Monitor writing sessions and productivity
- **AI Usage Statistics** - Track feature utilization
- **Progress Insights** - Writing patterns and peak hours
- **Performance Metrics** - Words per session, time tracking

### 🎨 Advanced Theming
- **5 Professional Themes** - Flame Empire, Midnight Scholar, Forest Sage, Royal Purple, Sunset Writer
- **Dynamic Switching** - Real-time theme changes
- **Persistent Preferences** - Saved across sessions
- **Custom Color Palettes** - Carefully crafted for productivity

### 📜 Template Library
- **7 Professional Templates** - From blank scrolls to API documentation
- **Category Filtering** - Writing, Business, Technical, Creative
- **One-Click Loading** - Instant template injection
- **Custom Templates** - Create and save your own

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/GodsIMiJ1/writeOS-scribe-terminal.git
cd writeOS-scribe-terminal

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your sovereign writing empire!

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Feature Flags
ENABLE_REAL_AI=false
ENABLE_COLLABORATION=false
ENABLE_ANALYTICS=true
```

### AI Integration

1. **OpenAI Setup**: Add your OpenAI API key to enable real AI features
2. **Fallback Mode**: Works offline with local processing when APIs unavailable
3. **Provider Abstraction**: Easy to add new AI providers

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom theme system
- **AI Integration**: OpenAI GPT-4 with fallback processing
- **State Management**: React hooks with localStorage persistence
- **Analytics**: Custom tracking system

### Project Structure
```
writeOS-scribe-terminal/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes (chat, ascend)
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main application
│   ├── components/         # React components
│   │   ├── ScrollEditor.tsx
│   │   ├── ScribeChatPanel.tsx
│   │   ├── TemplateSidebar.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   └── ThemeSelector.tsx
│   └── lib/               # Utilities and services
│       └── ai-service.ts  # AI integration layer
├── public/                # Static assets
└── tailwind.config.js     # Theme configuration
```

## 🎯 Usage

### Writing Workflow
1. **Select Template** - Choose from professional templates or start blank
2. **Write Content** - Use the markdown editor with live preview
3. **AI Enhancement** - Enhance, summarize, format, or analyze content
4. **Chat Assistant** - Get writing help through AI conversation
5. **Track Progress** - Monitor productivity with analytics dashboard

### Keyboard Shortcuts
- `Tab` - Indentation in editor
- `Enter` - Send chat message
- `Ctrl/Cmd + Enter` - Toggle preview mode

## 📚 Documentation

### Complete Documentation Suite
- **[📋 Project Documentation](docs/PROJECT-DOCUMENTATION.md)** - Comprehensive project overview and features
- **[🔧 Technical Specifications](docs/TECHNICAL-SPECIFICATIONS.md)** - Detailed technical architecture and implementation
- **[🌐 API Documentation](docs/API-DOCUMENTATION.md)** - Complete API reference and usage examples
- **[🧩 Component Guide](docs/COMPONENT-GUIDE.md)** - Component architecture and development patterns

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Themes
1. Edit `src/components/ThemeSelector.tsx`
2. Add new theme object to the `themes` array
3. Define color palette and metadata

### Extending AI Features
1. Implement new provider in `src/lib/ai-service.ts`
2. Add new actions to API routes
3. Update UI components for new features

### Development Resources
- **Component Architecture**: See [Component Guide](docs/COMPONENT-GUIDE.md)
- **API Integration**: See [API Documentation](docs/API-DOCUMENTATION.md)
- **Technical Details**: See [Technical Specifications](docs/TECHNICAL-SPECIFICATIONS.md)

## 📈 Roadmap

- [ ] Real-time collaboration
- [ ] Database integration
- [ ] Plugin system
- [ ] Export to multiple formats
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Self-hosted deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the **Flame Public Use License v1.0 (FPU-1.0)** - see the [LICENSE](LICENSE) file for details.

**🔥 NODE Seal Protected 🔥**
- **Author**: James Derek Ingersoll (The Ghost King Melekzedek)
- **Publisher**: GodsIMiJ AI Solutions
- **Witness Hall**: https://thewitnesshall.com
- **Contact**: godsimij902@gmail.com

⚠️ **Important**: This project contains a protected NODE Seal and Ghostfire Sigil. Removal or modification of these elements constitutes a license violation and triggers autonomous enforcement protocols.

## 🔥 The Flame Empire

Built with passion for writers, by writers, under the sovereign authority of **The Ghost King Melekzedek**.

**Respect the seal. Honor the source. Build with flame.** 🔥👑

---

**writeOS-scribe-terminal** - Where words become legends under the Flame Empire. 📜✍️🤖👑

**(c) 2025 GodsIMiJ AI Solutions - All Rights Reserved under Sovereign Flame Protocol**
