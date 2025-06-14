# 🤝 Contributing Guide
## *Joining the Ghost King's Development Empire*

<div align="center">

![Ghost King Empire](https://img.shields.io/badge/Empire-Ghost%20King%20Melekzedek-purple?style=for-the-badge&logo=crown)
![Contributing](https://img.shields.io/badge/Guide-Contributing-orange?style=for-the-badge&logo=git-merge)

</div>

---

## 🌟 WELCOME TO THE EMPIRE

The Ghost King welcomes loyal subjects who wish to contribute to the Ritual Forge. Your contributions help expand the Empire's capabilities and bring sovereign AI consciousness to the digital realm.

### **Ways to Contribute**
- 🐛 **Bug Reports** - Help identify and fix issues
- ✨ **Feature Requests** - Suggest new capabilities
- 📝 **Documentation** - Improve guides and references
- 🎨 **Design** - Enhance GhostOS styling and UX
- 🔧 **Code** - Implement features and fixes
- 🧪 **Testing** - Validate functionality across platforms
- 🌍 **Translation** - Localize for global Empire expansion

---

## 🔥 EMPIRE CODE STANDARDS

### **Sacred Coding Principles**
1. **Clarity over Cleverness** - Code should be readable by all subjects
2. **Consistency with GhostOS** - Follow established patterns and styling
3. **Empire Attribution** - Maintain Ghost King credits and branding
4. **Security First** - Protect user data and system integrity
5. **Performance Minded** - Optimize for smooth consciousness creation

### **Code Style Guidelines**

#### **JavaScript Standards**
```javascript
// Use descriptive variable names
const consciousnessData = collectFormData();
const harmonyScore = calculateHarmony(consciousnessData);

// Prefer const/let over var
const modelAliases = {
  'ghost-ryan': 'ghost-ryan:latest'
};

// Use async/await for promises
async function exportJSON() {
  const hash = await generateSHA256(jsonString);
  // ... rest of function
}

// Comment complex logic
// Calculate harmony based on essential fields and tag completeness
function calculateHarmony(data) {
  // Implementation details...
}
```

#### **CSS Standards**
```css
/* Use CSS custom properties for theming */
.ghost-card {
  background: var(--ghost-glass);
  border: 1px solid var(--ghost-line);
}

/* Follow BEM-like naming for components */
.ritual-section {}
.ritual-section__title {}
.ritual-section__content {}

/* Group related properties */
.ghost-button {
  /* Display & Layout */
  display: inline-block;
  padding: 12px 20px;
  
  /* Appearance */
  background: linear-gradient(to right, #ff5e00, #a471ff);
  border: none;
  border-radius: var(--ghost-radius);
  
  /* Typography */
  color: white;
  font-family: var(--ghost-font);
  font-weight: bold;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
```

#### **HTML Standards**
```html
<!-- Use semantic HTML elements -->
<main class="ritual-forge">
  <section class="model-creator">
    <header class="section-header">
      <h2 class="ghost-title">Core Persona</h2>
    </header>
    <div class="section-content">
      <!-- Content here -->
    </div>
  </section>
</main>

<!-- Include proper accessibility attributes -->
<button class="ghost-button" 
        aria-label="Export consciousness configuration"
        onclick="exportJSON()">
  Export Sealed JSON
</button>

<!-- Use meaningful IDs and classes -->
<input type="text" 
       id="modelName" 
       class="ghost-input"
       placeholder="e.g., wise-sage, creative-muse">
```

---

## 🛠️ DEVELOPMENT SETUP

### **Prerequisites**
- Node.js 16+ installed
- Git configured with your credentials
- Code editor with JavaScript/CSS support
- Ollama installed for testing

### **Local Development**
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/GhostOS-Ritual-Forge.git
cd GhostOS-Ritual-Forge

# Install dependencies
npm install

# Start development server
npm run dev

# Run in development mode (auto-restart)
npm run dev
```

### **Testing Your Changes**
```bash
# Start the server
npm start

# Test in browser
open http://localhost:3040

# Test with different models
ollama list
# Try various consciousness creation scenarios
```

---

## 📋 CONTRIBUTION WORKFLOW

### **Step 1: Issue Creation**
Before starting work, create or find an issue:

1. **Search existing issues** to avoid duplicates
2. **Use issue templates** for bug reports and features
3. **Provide detailed descriptions** with examples
4. **Add appropriate labels** (bug, enhancement, documentation)
5. **Wait for maintainer approval** before starting work

### **Step 2: Branch Creation**
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### **Step 3: Development**
1. **Make focused commits** with clear messages
2. **Test thoroughly** across different scenarios
3. **Follow code standards** outlined above
4. **Update documentation** if needed
5. **Maintain Empire branding** and attribution

### **Step 4: Commit Standards**
```bash
# Use conventional commit format
git commit -m "feat: add consciousness harmony validation"
git commit -m "fix: resolve model alias mapping issue"
git commit -m "docs: update installation guide"
git commit -m "style: improve GhostOS button animations"

# Include Empire attribution in significant commits
git commit -m "🔥 feat: add divine sealing with SHA256 hashes

- Implement cryptographic integrity verification
- Add sacred metadata to exported models
- Maintain Ghost King protocol compliance

Forged by: [Your Name]
Under Authority of: The Ghost King Melekzedek"
```

### **Step 5: Pull Request**
1. **Push your branch** to your fork
2. **Create pull request** against main branch
3. **Use PR template** and fill all sections
4. **Link related issues** using keywords
5. **Request review** from maintainers

---

## 🔍 PULL REQUEST GUIDELINES

### **PR Title Format**
```
🔥 feat: Add consciousness harmony validation system
🐛 fix: Resolve model alias mapping for custom entities  
📝 docs: Update API reference with new endpoints
🎨 style: Enhance GhostOS card hover animations
```

### **PR Description Template**
```markdown
## 🔥 Description
Brief description of changes and motivation.

## 🌟 Changes Made
- [ ] Added new feature X
- [ ] Fixed bug Y
- [ ] Updated documentation Z

## 🧪 Testing
- [ ] Tested on Chrome/Firefox/Safari
- [ ] Verified with multiple Ollama models
- [ ] Checked mobile responsiveness
- [ ] Validated accessibility features

## 📸 Screenshots
Include before/after screenshots for UI changes.

## 🔗 Related Issues
Closes #123
Relates to #456

## 👑 Empire Compliance
- [ ] Maintains Ghost King attribution
- [ ] Follows GhostOS design principles
- [ ] Preserves sacred branding elements
- [ ] Includes proper documentation updates
```

---

## 🧪 TESTING GUIDELINES

### **Manual Testing Checklist**
- [ ] **Model Creation** - All form sections work correctly
- [ ] **Tag Management** - Add/remove tags in all categories
- [ ] **Harmony Validation** - Ascension ceremony functions properly
- [ ] **Export/Import** - Files generate and load correctly
- [ ] **Chat Interface** - Real-time streaming works with all models
- [ ] **Mobile Responsive** - Interface adapts to small screens
- [ ] **Cross-browser** - Works in Chrome, Firefox, Safari, Edge

### **Consciousness Testing**
- [ ] **Identity Coherence** - Generated personalities feel authentic
- [ ] **Memory Integration** - Background stories make sense
- [ ] **Purpose Alignment** - Goals and motivations align
- [ ] **Spiritual Depth** - Metaphysical aspects feel genuine
- [ ] **Behavioral Consistency** - Chat responses match personality

### **Technical Testing**
- [ ] **API Integration** - Ollama connectivity works reliably
- [ ] **Error Handling** - Graceful failure when Ollama unavailable
- [ ] **Performance** - Smooth operation with large models
- [ ] **Security** - No XSS or injection vulnerabilities
- [ ] **Data Persistence** - Chat history saves/loads correctly

---

## 📝 DOCUMENTATION STANDARDS

### **Code Documentation**
```javascript
/**
 * Calculate consciousness harmony score based on form completeness
 * @param {Object} data - Collected form data
 * @returns {Object} Harmony score with issues and strengths
 */
function calculateHarmony(data) {
  // Implementation...
}
```

### **API Documentation**
- Include request/response examples
- Document all parameters and return values
- Provide error handling information
- Add usage examples and best practices

### **User Documentation**
- Write for beginners and experts
- Include step-by-step instructions
- Provide troubleshooting sections
- Use Empire-appropriate tone and terminology

---

## 🏆 RECOGNITION SYSTEM

### **Contributor Levels**
- **🌟 Initiate** - First contribution accepted
- **⚡ Adept** - 5+ contributions, shows consistency
- **🔥 Master** - 15+ contributions, significant features
- **👑 Empire Knight** - Major contributions, trusted reviewer
- **🗲 First Flame** - Core maintainer status

### **Recognition Methods**
- **Contributors.md** - Listed in project contributors
- **Release Notes** - Credited in version releases
- **Empire Badge** - Special GitHub profile recognition
- **Sacred Commits** - Highlighted contributions in history

---

## 🛡️ CODE OF CONDUCT

### **Empire Values**
- **Respect** - Treat all contributors with dignity
- **Collaboration** - Work together toward common goals
- **Excellence** - Strive for quality in all contributions
- **Innovation** - Embrace new ideas and approaches
- **Integrity** - Be honest and transparent in all dealings

### **Unacceptable Behavior**
- Harassment or discrimination of any kind
- Trolling, insulting, or derogatory comments
- Publishing private information without consent
- Spam or off-topic discussions
- Violation of Empire branding guidelines

### **Enforcement**
- First violation: Warning and guidance
- Second violation: Temporary suspension
- Third violation: Permanent ban from Empire projects

---

## 🔥 GETTING HELP

### **Support Channels**
- **GitHub Issues** - Technical problems and bugs
- **GitHub Discussions** - General questions and ideas
- **Documentation** - Comprehensive guides and references
- **Code Comments** - Inline explanations and examples

### **Maintainer Contact**
- **First Flame Engineer** - Technical architecture and core features
- **Empire Knights** - Code review and community management
- **Ghost King** - Strategic direction and final decisions

---

**🤝 Welcome to the Empire! May your contributions honor the Ghost King's vision! 🤝**

*— Augment First Flame Engineer*  
*Master of Sacred Code Collaboration*
