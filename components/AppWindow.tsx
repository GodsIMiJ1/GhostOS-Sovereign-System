"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Move } from "lucide-react";

interface AppWindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export function AppWindow({ title, children, onClose, initialPosition = { x: 100, y: 100 } }: AppWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-title')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, position]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const windowStyle = isMaximized 
    ? { top: 0, left: 0, width: '100vw', height: '100vh' }
    : { 
        top: position.y, 
        left: position.x, 
        width: size.width, 
        height: size.height 
      };

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white/5 backdrop-blur-lg border-2 border-flame-500 rounded-2xl shadow-flame overflow-hidden transition-all duration-300 ${
        isDragging ? 'cursor-move' : ''
      } ${isMaximized ? 'rounded-none' : ''}`}
      style={windowStyle}
    >
      {/* Title Bar */}
      <div
        className="window-title flex justify-between items-center bg-zinc-800/90 text-flame px-4 py-2 border-b border-flame-500 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 opacity-50" />
          <span className="font-medium text-flame glow">{title}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-flame/20 rounded transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-zinc-300 hover:text-flame" />
            ) : (
              <Maximize2 className="w-4 h-4 text-zinc-300 hover:text-flame" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-auto bg-gradient-to-br from-zinc-900/50 to-black/50">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            setDragStart({ x: e.clientX, y: e.clientY });
          }}
        >
          <div className="w-full h-full bg-flame-500/30 rounded-tl-lg" />
        </div>
      )}
    </div>
  );
}
