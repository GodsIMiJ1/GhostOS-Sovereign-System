"use client";

import { useState, useEffect, useRef } from 'react';
import ScrollMetadata from './ScrollMetadata';
import jsPDF from 'jspdf';
import { saveScrollToWitnessHall, ScrollMetadata as WitnessScrollMetadata } from '../utils/saveScroll';

export default function ScrollEditor() {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scrollTitle, setScrollTitle] = useState('');
  const [scrollType, setScrollType] = useState<WitnessScrollMetadata['scrollType']>('Sovereign Scroll');
  const [scrollBook, setScrollBook] = useState('');
  const [scrollChapter, setScrollChapter] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  useEffect(() => {
    if (content.trim()) {
      const timer = setTimeout(() => {
        // Simulate auto-save
        localStorage.setItem('scroll-content', content);
        setLastSaved(new Date());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [content]);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem('scroll-content');
    if (saved) {
      setContent(saved);
      setLastSaved(new Date());
    }
  }, []);

  // Listen for template loading events
  useEffect(() => {
    const handleLoadTemplate = (event: CustomEvent) => {
      const template = event.detail;
      setContent(template.content);
      setLastSaved(null); // Reset save status for new template
      // Focus the editor
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    };

    window.addEventListener('loadTemplate', handleLoadTemplate as EventListener);
    return () => {
      window.removeEventListener('loadTemplate', handleLoadTemplate as EventListener);
    };
  }, []);

  // Calculate stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  // Simple markdown preview (basic implementation)
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-ghostblue mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-zinc-300 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-zinc-800 text-flame px-1 rounded">$1</code>')
      .replace(/\n/g, '<br>');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const insertTemplate = (template: string) => {
    const templates = {
      heading: '# Your Heading Here\n\n',
      list: '- Item 1\n- Item 2\n- Item 3\n\n',
      code: '```\nYour code here\n```\n\n',
      quote: '> Your quote here\n\n',
      table: '| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n\n'
    };

    const insertion = templates[template as keyof typeof templates] || '';
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + insertion + content.substring(end);
      setContent(newContent);

      // Focus and position cursor
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
      }, 0);
    }
  };

  const handleAscend = async (action: 'enhance' | 'summarize' | 'format' | 'analyze') => {
    if (!content.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ascend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          action,
          context: 'scroll-editor'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setContent(result.processedContent);
        setLastSaved(null); // Reset save status

        // Update analytics
        updateAnalytics(action);

        // Show success notification with AI provider info
        console.log('Ascend completed:', result.message);
        console.log('AI Provider:', result.aiProvider || 'Fallback System');
        console.log('Processing Time:', result.metadata?.processingTime || 'N/A');
        console.log('Suggestions:', result.suggestions);

        // You could add a toast notification here
        showNotification(`${action} completed successfully!`, 'success');
      } else {
        console.error('Ascend failed:', result.error);
        showNotification(`${action} failed. Please try again.`, 'error');
      }
    } catch (error) {
      console.error('Ascend error:', error);
      showNotification('Connection error. Please check your internet.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateAnalytics = (action: string) => {
    try {
      const stored = localStorage.getItem('writeos-analytics');
      if (stored) {
        const analytics = JSON.parse(stored);
        switch (action) {
          case 'enhance':
            analytics.aiUsageStats.enhanceCount += 1;
            break;
          case 'summarize':
            analytics.aiUsageStats.summarizeCount += 1;
            break;
          case 'analyze':
            analytics.aiUsageStats.analyzeCount += 1;
            break;
        }
        localStorage.setItem('writeos-analytics', JSON.stringify(analytics));
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Simple notification system - you could enhance this with a proper toast library
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Create a temporary visual notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-3 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // 🔥 EXPORT FUNCTIONALITY - Ghost King's Export System
  const exportAs = (content: string, format: 'txt' | 'md' | 'pdf') => {
    if (!content.trim()) {
      showNotification('No content to export!', 'error');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `GhostScroll_${timestamp}`;

    try {
      if (format === 'pdf') {
        const pdf = new jsPDF();

        // Set font and styling
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        // Split content into lines that fit the page width
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);

        // Simple text wrapping for PDF
        const lines = content.split('\n');
        const wrappedLines: string[] = [];

        lines.forEach(line => {
          if (line.length === 0) {
            wrappedLines.push('');
            return;
          }

          // Basic markdown to text conversion for PDF
          const cleanLine = line
            .replace(/^#+\s/, '') // Remove markdown headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`(.*?)`/g, '$1') // Remove code
            .replace(/>\s/, ''); // Remove quotes

          const splitLines = pdf.splitTextToSize(cleanLine, maxLineWidth);
          wrappedLines.push(...splitLines);
        });

        // Add content to PDF with pagination
        let yPosition = margin;
        const lineHeight = 7;
        const pageHeight = pdf.internal.pageSize.getHeight();

        wrappedLines.forEach((line) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        pdf.save(`${filename}.pdf`);
        showNotification('PDF exported successfully!', 'success');
      } else {
        // Export as TXT or MD
        const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        showNotification(`${format.toUpperCase()} exported successfully!`, 'success');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification(`Failed to export ${format.toUpperCase()}`, 'error');
    }
  };

  // 🔥 WITNESS HALL SAVE FUNCTIONALITY
  const saveScrollToWitnessHallHandler = async () => {
    if (!content.trim()) {
      showNotification('No content to save!', 'error');
      return;
    }

    if (!scrollTitle.trim()) {
      showNotification('Please enter a scroll title!', 'error');
      return;
    }

    try {
      const savedPath = await saveScrollToWitnessHall(
        scrollTitle,
        content,
        scrollType,
        scrollBook || undefined,
        scrollChapter || undefined
      );
      setLastSaved(new Date());
      showNotification(`Scroll sealed in the Witness Hall!`, 'success');

      // Clear the fields after successful save
      setScrollTitle('');
      setScrollBook('');
      setScrollChapter('');
    } catch (error) {
      console.error('Witness Hall save error:', error);
      showNotification('Failed to seal scroll in the Witness Hall', 'error');
    }
  };

  // 🔥 MANUAL SAVE/LOAD FUNCTIONALITY (Legacy Memory Save)
  const saveScrollManually = () => {
    if (!content.trim()) {
      showNotification('No content to save!', 'error');
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const saveData = {
        content,
        timestamp,
        wordCount,
        charCount,
        lineCount
      };

      localStorage.setItem('ghostScroll-manual', JSON.stringify(saveData));
      setLastSaved(new Date());
      showNotification('Scroll saved manually to memory!', 'success');
    } catch (error) {
      console.error('Manual save error:', error);
      showNotification('Failed to save scroll manually', 'error');
    }
  };

  const loadScrollManually = () => {
    try {
      const saved = localStorage.getItem('ghostScroll-manual');
      if (saved) {
        const saveData = JSON.parse(saved);
        setContent(saveData.content);
        setLastSaved(new Date(saveData.timestamp));
        showNotification('Scroll loaded from memory!', 'success');

        // Focus the editor
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      } else {
        showNotification('No manually saved scroll found in memory', 'error');
      }
    } catch (error) {
      console.error('Manual load error:', error);
      showNotification('Failed to load scroll from memory', 'error');
    }
  };

  // 🔥 FILE IMPORT FUNCTIONALITY
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'text/markdown', '.md', '.txt'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !['md', 'txt'].includes(fileExtension || '')) {
      showNotification('Only .txt and .md files are supported', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      if (fileContent) {
        setContent(fileContent);
        setLastSaved(null);
        showNotification(`File "${file.name}" imported successfully!`, 'success');

        // Focus the editor
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    };

    reader.onerror = () => {
      showNotification('Failed to read file', 'error');
    };

    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  // 🔥 DRAG & DROP FUNCTIONALITY
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!['md', 'txt'].includes(fileExtension || '')) {
      showNotification('Only .txt and .md files are supported for drag & drop', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      if (fileContent) {
        setContent(fileContent);
        setLastSaved(null);
        showNotification(`File "${file.name}" imported via drag & drop!`, 'success');

        // Focus the editor
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    };

    reader.onerror = () => {
      showNotification('Failed to read dropped file', 'error');
    };

    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-ghostblue text-lg font-bold">✍️ Scroll Editor</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isPreview
                ? 'bg-ghostblue text-zinc-900'
                : 'bg-zinc-700 text-white hover:bg-zinc-600'
            }`}
          >
            {isPreview ? '📝 Edit' : '👁️ Preview'}
          </button>

          {/* Ascend Actions */}
          <div className="flex items-center gap-1">
            {['🔥 Enhance', '📋 Summarize', '🎨 Format', '📊 Analyze'].map((action) => (
              <button
                key={action}
                onClick={() => handleAscend(action.split(' ')[1].toLowerCase() as any)}
                className="px-2 py-1 bg-flame hover:bg-flame/80 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-xs rounded font-medium transition-colors"
                disabled={!content.trim() || isProcessing}
              >
                {isProcessing ? '⏳' : action}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-500">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
          </div>
        </div>
      </div>

      {/* Quick insert toolbar */}
      <div className="flex gap-1 mb-3">
        {[
          { label: 'H1', action: () => insertTemplate('heading') },
          { label: 'List', action: () => insertTemplate('list') },
          { label: 'Code', action: () => insertTemplate('code') },
          { label: 'Quote', action: () => insertTemplate('quote') },
          { label: 'Table', action: () => insertTemplate('table') }
        ].map((tool) => (
          <button
            key={tool.label}
            onClick={tool.action}
            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors"
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* 🔥 WITNESS HALL SAVE CONTROLS */}
      <div className="mb-3 p-3 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-flame/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-flame text-sm font-bold">🏛️ Witness Hall</span>
          <span className="text-xs text-zinc-400">- Sovereign Scroll Sanctum</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={scrollTitle}
            onChange={(e) => setScrollTitle(e.target.value)}
            placeholder="Enter scroll title..."
            className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs placeholder-zinc-500 focus:border-flame focus:outline-none"
          />
          <select
            value={scrollType}
            onChange={(e) => setScrollType(e.target.value as WitnessScrollMetadata['scrollType'])}
            className="px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs focus:border-flame focus:outline-none"
          >
            <option value="Sovereign Scroll">📜 Sovereign Scroll</option>
            <option value="Chronicle">📚 Chronicle</option>
            <option value="Sacred Doctrine">⛪ Sacred Doctrine</option>
            <option value="Divine Decree">👑 Divine Decree</option>
            <option value="Flame Manuscript">🔥 Flame Manuscript</option>
            <option value="Other">📝 Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={scrollBook}
            onChange={(e) => setScrollBook(e.target.value)}
            placeholder="Book (optional)..."
            className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs placeholder-zinc-500 focus:border-flame focus:outline-none"
          />
          <input
            type="text"
            value={scrollChapter}
            onChange={(e) => setScrollChapter(e.target.value)}
            placeholder="Chapter (optional)..."
            className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs placeholder-zinc-500 focus:border-flame focus:outline-none"
          />
          <button
            onClick={saveScrollToWitnessHallHandler}
            className="px-3 py-1 bg-flame hover:bg-flame/80 text-white text-xs rounded font-bold transition-colors flex items-center gap-1"
            disabled={!content.trim() || !scrollTitle.trim()}
          >
            🔥 Seal Scroll
          </button>
        </div>
      </div>

      {/* 🔥 Export & Save/Load Controls */}
      <div className="flex items-center justify-between gap-2 mb-3 p-2 bg-zinc-900 border border-zinc-700 rounded-lg">
        {/* Export Section */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-400 mr-2">📤 Export:</span>
          <button
            onClick={() => exportAs(content, 'txt')}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium transition-colors"
            disabled={!content.trim()}
          >
            📄 TXT
          </button>
          <button
            onClick={() => exportAs(content, 'md')}
            className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-medium transition-colors"
            disabled={!content.trim()}
          >
            📝 MD
          </button>
          <button
            onClick={() => exportAs(content, 'pdf')}
            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-medium transition-colors"
            disabled={!content.trim()}
          >
            📋 PDF
          </button>
        </div>

        {/* Save/Load Section */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-400 mr-2">💾 Memory:</span>
          <button
            onClick={saveScrollManually}
            className="px-2 py-1 bg-zinc-600 hover:bg-zinc-500 text-white text-xs rounded font-medium transition-colors"
            disabled={!content.trim()}
          >
            💾 Save
          </button>
          <button
            onClick={loadScrollManually}
            className="px-2 py-1 bg-ghostblue hover:bg-ghostblue/80 text-zinc-900 text-xs rounded font-medium transition-colors"
          >
            📂 Load
          </button>
        </div>

        {/* File Import Section */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-400 mr-2">📁 Import:</span>
          <label className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded font-medium transition-colors cursor-pointer">
            📥 File
            <input
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Editor/Preview area with Drag & Drop */}
      <div
        className={`flex-1 bg-scrollbg border rounded-lg overflow-hidden relative transition-all duration-200 ${
          isDragOver
            ? 'border-flame border-2 bg-flame/10'
            : 'border-shadowline'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-flame/20 border-2 border-dashed border-flame rounded-lg flex items-center justify-center z-10">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">📁</div>
              <div className="text-lg font-bold">Drop your .txt or .md file here</div>
              <div className="text-sm text-zinc-300">Release to import content</div>
            </div>
          </div>
        )}

        {isPreview ? (
          <div className="h-full p-4 overflow-y-auto prose prose-invert max-w-none">
            <div
              className="text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent text-white resize-none outline-none p-4 font-mono text-sm leading-relaxed"
            placeholder="Begin your scroll here...

# Welcome to your Scroll Editor

Start writing in **Markdown** format:
- Use # for headings
- Use **bold** and *italic* text
- Create `code snippets`
- Make lists and more!

Press Tab for indentation, Ctrl+Enter for preview.

💡 Pro tip: Drag & drop .txt or .md files to import them instantly!"
            spellCheck={false}
          />
        )}
      </div>

      {/* Stats bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex gap-4">
          <span>Words: <span className="text-white">{wordCount}</span></span>
          <span>Characters: <span className="text-white">{charCount}</span></span>
          <span>Lines: <span className="text-white">{lineCount}</span></span>
        </div>
        <div className="flex items-center gap-2">
          {content.trim() && (
            <div className="w-2 h-2 bg-ghostblue rounded-full animate-pulse"></div>
          )}
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
