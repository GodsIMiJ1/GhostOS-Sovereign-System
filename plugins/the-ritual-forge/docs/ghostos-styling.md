# 🎨 GhostOS Styling Guide
## *Design System for the Ghost King's Empire*

<div align="center">

![Ghost King Empire](https://img.shields.io/badge/Empire-Ghost%20King%20Melekzedek-purple?style=for-the-badge&logo=crown)
![Design System](https://img.shields.io/badge/Guide-GhostOS%20Styling-orange?style=for-the-badge&logo=palette)

</div>

---

## 🌟 DESIGN PHILOSOPHY

GhostOS embodies the Ghost King's vision of cyberpunk aesthetics merged with mystical elements. The design system creates an immersive digital realm that feels both futuristic and ancient, technological and spiritual.

### **Core Principles**
- **Dark Glass Morphism** - Translucent elements with backdrop blur
- **Cyberpunk Color Palette** - Orange, purple, and cyan accents
- **Mystical Typography** - Monospace fonts for digital authenticity
- **Smooth Animations** - Fluid transitions and hover effects
- **Sacred Geometry** - Consistent spacing and proportions

---

## 🔥 COLOR SYSTEM

### **Primary Palette**

#### **Background Colors**
```css
--ghost-black: #0a0a0a;     /* Primary background */
--ghost-deep: #121212;      /* Secondary background */
--ghost-glass: rgba(255, 255, 255, 0.03); /* Glass elements */
--ghost-line: rgba(255, 255, 255, 0.07);  /* Borders */
```

#### **Text Colors**
```css
--ghost-text: #f0f0f0;      /* Primary text */
--ghost-subtext: #888;      /* Secondary text */
```

#### **Accent Colors**
```css
--ghost-orange: #ff5e00;    /* Primary accent */
--ghost-blue: #0ff;         /* Secondary accent */
--ghost-purple: #a471ff;    /* Tertiary accent */
```

#### **Utility Colors**
```css
--ghost-border: rgba(255, 255, 255, 0.1); /* Standard borders */
--ghost-glow: 0 0 10px var(--ghost-orange); /* Glow effect */
```

### **Usage Guidelines**

**Backgrounds**
- Use `--ghost-black` for main page background
- Use `--ghost-deep` for input fields and secondary areas
- Use `--ghost-glass` for card backgrounds with backdrop blur

**Text**
- Use `--ghost-text` for primary content
- Use `--ghost-subtext` for labels and secondary information
- Use accent colors for titles and important elements

**Accents**
- `--ghost-orange` for primary actions and highlights
- `--ghost-blue` for titles and information elements
- `--ghost-purple` for secondary actions and gradients

---

## 🎯 TYPOGRAPHY

### **Font Stack**
```css
--ghost-font: 'Fira Code', 'Courier New', monospace;
```

### **Font Sizes**
```css
/* Headings */
.ghost-title { font-size: 1.4rem; }
.ghost-subtitle { font-size: 1.2rem; }

/* Body Text */
.ghost-body { font-size: 0.95rem; }
.ghost-small { font-size: 0.85rem; }
.ghost-tiny { font-size: 0.75rem; }
```

### **Font Weights**
- **Normal (400)** - Body text and descriptions
- **Medium (500)** - Labels and secondary headings
- **Bold (600)** - Primary headings and emphasis
- **Extra Bold (700)** - Special titles and branding

---

## 🔮 COMPONENT LIBRARY

### **Glass Cards**
```css
.glass-card {
  background: var(--ghost-glass);
  border: 1px solid var(--ghost-line);
  border-radius: var(--ghost-radius);
  padding: 24px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 0 30px rgba(255, 94, 0, 0.2);
  transform: scale(1.01);
}
```

### **Ghost Buttons**
```css
.ghost-button {
  background: linear-gradient(to right, #ff5e00, #a471ff);
  color: white;
  border: none;
  border-radius: var(--ghost-radius);
  padding: 12px 20px;
  cursor: pointer;
  font-weight: bold;
  font-family: var(--ghost-font);
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 8px var(--ghost-orange);
}

.ghost-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 12px var(--ghost-orange), 0 0 20px var(--ghost-purple);
}
```

### **Ghost Inputs**
```css
.ghost-input {
  background: var(--ghost-deep);
  color: var(--ghost-text);
  border: 1px solid var(--ghost-border);
  border-radius: var(--ghost-radius);
  padding: 10px 15px;
  width: 100%;
  font-family: var(--ghost-font);
  font-size: 0.95rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.ghost-input:focus {
  border-color: var(--ghost-orange);
  outline: none;
  box-shadow: 0 0 10px var(--ghost-orange);
  background: var(--ghost-black);
}
```

### **Chat Bubbles**
```css
.ghost-bubble {
  background: var(--ghost-glass);
  border: 1px solid var(--ghost-border);
  border-radius: var(--ghost-radius);
  padding: 12px 18px;
  margin: 10px 0;
  max-width: 80%;
  word-wrap: break-word;
  animation: fadeIn 0.3s ease-in-out;
}

.ghost-bubble.user {
  background: linear-gradient(to right, #ff5e00, #a471ff);
  color: white;
  align-self: flex-end;
}

.ghost-bubble.assistant {
  background: var(--ghost-deep);
  border-left: 3px solid var(--ghost-orange);
  color: var(--ghost-text);
}
```

### **Terminal Style**
```css
.ghost-terminal {
  background: #000000;
  color: #0ff;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  padding: 15px 20px;
  border-radius: var(--ghost-radius);
  border: 1px solid var(--ghost-line);
  box-shadow: inset 0 0 10px #0ff33a;
}
```

---

## ✨ ANIMATIONS

### **Flicker Effect**
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  45% { opacity: 0.8; }
  55% { opacity: 0.4; }
}

.ghost-pulse {
  animation: flicker 2s infinite;
  text-shadow: 0 0 8px var(--ghost-orange);
}
```

### **Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### **Glitch Effect**
```css
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-1px, 1px); }
  40% { transform: translate(1px, -1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}

.glitch-effect {
  text-shadow: 0 0 2px #ff5e00, 0 0 4px #a471ff;
  animation: glitch 1s infinite;
}
```

---

## 🎛️ LAYOUT SYSTEM

### **Grid Structure**
```css
.container {
  max-width: 1300px;
  margin: auto;
  padding: 40px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
```

### **Spacing System**
```css
/* Margins */
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
.m-4 { margin: 32px; }

/* Padding */
.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }

/* Gaps */
.gap-1 { gap: 8px; }
.gap-2 { gap: 16px; }
.gap-3 { gap: 24px; }
.gap-4 { gap: 32px; }
```

---

## 🔧 UTILITY CLASSES

### **Display**
```css
.hidden { display: none; }
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }
.inline { display: inline; }
.inline-block { display: inline-block; }
```

### **Flexbox**
```css
.flex-center { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}
.flex-between { 
  display: flex; 
  justify-content: space-between; 
}
.flex-column { 
  display: flex; 
  flex-direction: column; 
}
```

### **Text Alignment**
```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### **Scrollbars**
```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--ghost-purple);
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background: transparent;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### **Mobile Adaptations**
```css
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
  
  .ghost-button {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .chat-container {
    grid-template-columns: 1fr;
    height: auto;
  }
}
```

---

## 🎨 THEME CUSTOMIZATION

### **Creating Custom Themes**
```css
/* Dark Theme (Default) */
:root {
  --ghost-black: #0a0a0a;
  --ghost-deep: #121212;
  --ghost-orange: #ff5e00;
  --ghost-blue: #0ff;
  --ghost-purple: #a471ff;
}

/* Alternative: Neon Theme */
:root[data-theme="neon"] {
  --ghost-black: #000000;
  --ghost-deep: #0a0a0a;
  --ghost-orange: #00ff41;
  --ghost-blue: #ff0080;
  --ghost-purple: #8000ff;
}

/* Alternative: Fire Theme */
:root[data-theme="fire"] {
  --ghost-black: #1a0000;
  --ghost-deep: #2a0000;
  --ghost-orange: #ff4500;
  --ghost-blue: #ff6b35;
  --ghost-purple: #ff8c42;
}
```

### **Theme Switching**
```javascript
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('ghost-theme', themeName);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('ghost-theme') || 'default';
  setTheme(savedTheme);
}
```

---

## 🛠️ IMPLEMENTATION GUIDE

### **Basic Setup**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GhostOS Application</title>
  <link rel="stylesheet" href="ghostos-styles.css">
</head>
<body>
  <div class="container">
    <div class="glass-card">
      <h1 class="ghost-title">Welcome to GhostOS</h1>
      <p class="ghost-body">Your content here...</p>
      <button class="ghost-button">Take Action</button>
    </div>
  </div>
</body>
</html>
```

### **JavaScript Integration**
```javascript
// Apply GhostOS styling dynamically
function applyGhostOSTheme() {
  document.body.classList.add('ghost-theme');
  
  // Add glow effects on interaction
  document.querySelectorAll('.ghost-button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 20px var(--ghost-orange)';
    });
  });
}
```

---

## 🔥 BEST PRACTICES

### **Performance**
- Use CSS custom properties for consistent theming
- Minimize animation complexity for smooth performance
- Optimize backdrop-filter usage for better rendering

### **Accessibility**
- Maintain sufficient color contrast ratios
- Provide focus indicators for keyboard navigation
- Use semantic HTML with proper ARIA labels

### **Consistency**
- Follow the established color palette
- Use consistent spacing and typography
- Maintain animation timing and easing patterns

### **Customization**
- Extend the base system rather than overriding
- Document any custom additions
- Test across different screen sizes and devices

---

**🎨 May your designs honor the Ghost King's aesthetic vision! 🎨**

*— Augment First Flame Engineer*  
*Master of Sacred Visual Architecture*
