"use client";

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  icon: string;
  content: string;
  description: string;
  category: 'writing' | 'business' | 'technical' | 'creative';
}

export default function TemplateSidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: Template[] = [
    {
      id: '1',
      name: "Blank Scroll",
      icon: "📜",
      content: "# New Document\n\nStart writing here...",
      description: "Empty document to start fresh",
      category: 'writing'
    },
    {
      id: '2',
      name: "Technical Doc",
      icon: "⚙️",
      content: "# Technical Documentation\n\n## Overview\n\n## Requirements\n\n## Implementation\n\n## Testing\n\n## Deployment",
      description: "Structure for technical documentation",
      category: 'technical'
    },
    {
      id: '3',
      name: "Creative Writing",
      icon: "✨",
      content: "# Story Title\n\n*Genre: [Your Genre]*\n\n## Characters\n\n## Plot Outline\n\n## Chapter 1\n\nOnce upon a time...",
      description: "Template for creative stories",
      category: 'creative'
    },
    {
      id: '4',
      name: "Meeting Notes",
      icon: "📝",
      content: "# Meeting Notes\n\n**Date:** [Date]\n**Attendees:** [Names]\n**Agenda:**\n\n## Discussion Points\n\n## Action Items\n\n## Next Steps",
      description: "Structured meeting documentation",
      category: 'business'
    },
    {
      id: '5',
      name: "Project Plan",
      icon: "🎯",
      content: "# Project Plan\n\n## Objective\n\n## Scope\n\n## Timeline\n\n## Resources\n\n## Milestones\n\n## Risk Assessment",
      description: "Comprehensive project planning",
      category: 'business'
    },
    {
      id: '6',
      name: "Blog Post",
      icon: "📰",
      content: "# Blog Post Title\n\n*Published: [Date]*\n*Tags: [tag1, tag2]*\n\n## Introduction\n\n## Main Content\n\n## Conclusion\n\n---\n*What do you think? Leave a comment below!*",
      description: "Blog post structure",
      category: 'writing'
    },
    {
      id: '7',
      name: "API Documentation",
      icon: "🔌",
      content: "# API Documentation\n\n## Endpoints\n\n### GET /api/endpoint\n\n**Description:** \n\n**Parameters:**\n\n**Response:**\n\n```json\n{\n  \"status\": \"success\"\n}\n```",
      description: "API reference template",
      category: 'technical'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const loadTemplate = (template: Template) => {
    // Store the template content to be loaded by the editor
    localStorage.setItem('scroll-content', template.content);
    // Trigger a custom event to notify the editor
    window.dispatchEvent(new CustomEvent('loadTemplate', { detail: template }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-flame text-lg font-bold mb-4">📜 Templates</div>

      {/* Category filter */}
      <div className="mb-4">
        <div className="text-xs text-zinc-400 mb-2">Categories</div>
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedCategory === category.id
                  ? 'bg-ghostblue text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates list */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => loadTemplate(template)}
            className="w-full text-left p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{template.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium group-hover:text-ghostblue transition-colors">
                  {template.name}
                </div>
                <div className="text-zinc-400 text-xs mt-1 line-clamp-2">
                  {template.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-zinc-700 space-y-2">
        <button className="w-full bg-ghostblue hover:bg-ghostblue/80 text-zinc-900 py-2 px-4 rounded font-medium text-sm transition-colors">
          + New Template
        </button>
        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded font-medium text-sm transition-colors">
          📁 Browse Scrolls
        </button>
      </div>
    </div>
  );
}
