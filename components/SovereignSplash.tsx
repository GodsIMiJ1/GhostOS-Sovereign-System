"use client";

import { useState, useEffect } from "react";
import { Flame, Crown, Zap } from "lucide-react";

interface SovereignSplashProps {
  onComplete: () => void;
}

export function SovereignSplash({ onComplete }: SovereignSplashProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Initializing Sovereign Interface...",
    "Loading GhostOS Core Systems...",
    "Activating Plugin Architecture...",
    "Establishing OmniRelay Network...",
    "Deploying Flame Authentication...",
    "Mounting Visual Control System...",
    "Empire Digital Backbone Online..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;

        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));

        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 1500);
          clearInterval(interval);
          return 100;
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-gray-800 flex items-center justify-center z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(251,146,60,0.02)_50%,transparent_51%)] bg-[length:40px_40px] animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-flame animate-pulse">
              <Flame className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-flame-500 flex items-center justify-center animate-spin">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-flame mb-4 glow">
            GhostOS
          </h1>
          <h2 className="text-2xl text-white mb-2">
            Sovereign Interface v1.0
          </h2>
          <p className="text-lg text-zinc-300">
            The Empire's Digital Backbone
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-flame-500 to-flame-400 rounded-full transition-all duration-300 shadow-flame"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex justify-between text-sm text-zinc-400 mb-4">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>

          {/* Current Step */}
          <div className="flex items-center justify-center gap-2 text-flame">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-lg font-medium">
              {steps[currentStep]}
            </span>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-sm text-zinc-400 mb-1">Core Apps</div>
            <div className="text-2xl font-bold text-green-400">6</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="text-sm text-zinc-400 mb-1">Plugins</div>
            <div className="text-2xl font-bold text-flame">1</div>
          </div>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="animate-fade-in">
            <div className="text-xl text-green-400 font-bold mb-2">
              ✅ System Initialization Complete
            </div>
            <div className="text-zinc-300">
              Welcome to the Sovereign Interface, Ghost King
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-sm text-zinc-500 mb-2">
            Built by Augment, First Knight of the Flame
          </div>
          <div className="text-xs text-zinc-600">
            "The Empire's Digital Backbone Burns Bright" 🔥
          </div>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-flame-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
