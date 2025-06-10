"use client";

import { useEffect, useRef, useState } from "react";
import { Scroll, Terminal, Flame } from "lucide-react";

interface FlameTerminalProps {
  onCommand?: (command: string) => void;
  output?: string[];
}

export function FlameTerminal({ onCommand, output = [] }: FlameTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<string[]>([
    "🔥 Welcome to FlameCLI v0.1.0",
    "🔥 Sovereign Terminal Shell - GhostOS Command Interface",
    "🔥 Ghost King Melekzedek - James Derek Ingersoll",
    "🔥 \"The Empire's Digital Backbone\"",
    "",
    "Type 'help' for available commands.",
    "Type 'flame' for sovereign operations.",
    "Type 'ghost' for system-level access.",
    "",
  ]);
  const [currentLine, setCurrentLine] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Add external output to lines
  useEffect(() => {
    if (output.length > 0) {
      setLines(prev => [...prev, ...output]);
    }
  }, [output]);

  // Simulate cursor blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Initialize prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLine("flame > ");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    const commandText = command.trim();
    const newLines = [...lines, `🔥 flame > ${commandText}`];

    // Add to command history
    setCommandHistory(prev => [...prev, commandText]);
    setHistoryIndex(-1);

    // Handle clear command locally
    if (commandText.toLowerCase() === 'clear') {
      setLines([]);
      setCurrentLine("flame > ");
      return;
    }

    setLines(newLines);
    setIsProcessing(true);

    try {
      // Call external command handler if provided, otherwise use CLI API
      if (onCommand) {
        onCommand(commandText);
      } else {
        // Call the CLI API bridge
        const response = await fetch('/api/cli', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: commandText }),
        });

        const data = await response.json();

        if (data.success && data.output) {
          setLines(prev => [...prev, ...data.output, ""]);
        } else {
          setLines(prev => [...prev, "❌ Command failed", ""]);
        }
      }
    } catch (error) {
      setLines(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, ""]);
    } finally {
      setIsProcessing(false);
      setCurrentLine("flame > ");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isProcessing) return; // Prevent input while processing

    if (e.key === 'Enter') {
      const command = currentLine.replace('flame > ', '');
      handleCommand(command);
    } else if (e.key === 'Backspace') {
      if (currentLine.length > 8) { // Don't delete the prompt
        setCurrentLine(currentLine.slice(0, -1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentLine(`flame > ${commandHistory[newIndex]}`);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentLine('flame > ');
        } else {
          setHistoryIndex(newIndex);
          setCurrentLine(`flame > ${commandHistory[newIndex]}`);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for common commands
      const partial = currentLine.replace('flame > ', '');
      const commands = ['help', 'status', 'list', 'plugin list', 'augmenth status', 'flame tokens', 'clear'];
      const matches = commands.filter(cmd => cmd.startsWith(partial));
      if (matches.length === 1) {
        setCurrentLine(`flame > ${matches[0]}`);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      setCurrentLine(currentLine + e.key);
    }
  };

  return (
    <div className="h-96 w-full bg-gradient-to-br from-black via-zinc-900 to-black rounded-lg border border-flame-500/30 shadow-flame overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-flame-500/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-flame" />
          <span className="text-flame font-medium">FlameCLI</span>
          <span className="text-xs text-zinc-400">v0.1.0</span>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-flame-400 rounded-full animate-pulse" />
              <span className="text-xs text-flame">Processing...</span>
            </div>
          )}
          <Scroll className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* Terminal Content */}
      <div
        className="h-full p-4 font-mono text-sm overflow-y-auto focus:outline-none bg-black/50 backdrop-blur-sm"
        tabIndex={0}
        onKeyDown={handleKeyPress}
        ref={terminalRef}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#fb923c #1a1a1a'
        }}
      >
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`
                transition-all duration-300 ease-in-out
                ${line.startsWith('🔥') ? 'text-flame drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' :
                  line.startsWith('✅') ? 'text-green-400' :
                  line.startsWith('❌') ? 'text-red-400' :
                  line.startsWith('⚠️') ? 'text-yellow-400' :
                  line.startsWith('📊') || line.startsWith('📈') || line.startsWith('📦') ? 'text-blue-400' :
                  line.startsWith('🔌') || line.startsWith('🤖') ? 'text-purple-400' :
                  line.startsWith('💡') ? 'text-cyan-400' :
                  'text-zinc-200'
                }
                ${line.includes('OPERATIONAL') || line.includes('Active') ? 'font-semibold' : ''}
                ${line.includes('ERROR') || line.includes('Failed') ? 'font-semibold text-red-400' : ''}
              `}
            >
              {line}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center mt-2">
            <span className="text-flame drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]">
              {currentLine}
            </span>
            <span
              className={`
                w-2 h-5 ml-1 bg-flame-400 transition-opacity duration-300
                ${cursorVisible ? 'opacity-100' : 'opacity-0'}
                ${isProcessing ? 'animate-pulse' : ''}
              `}
            >
              █
            </span>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 mt-2 text-flame animate-pulse">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs">Executing command...</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-1 bg-zinc-800/30 border-t border-zinc-700/50 text-xs text-zinc-400">
        <div className="flex justify-between items-center">
          <span>Use ↑↓ for history, Tab for completion</span>
          <span>{lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}
