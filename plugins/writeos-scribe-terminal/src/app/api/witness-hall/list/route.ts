/**
 * 🔥 WITNESS HALL LIST API - SOVEREIGN SCROLL INVENTORY 🔥
 * 
 * Server-side API route for listing scrolls from the Witness Hall.
 * Provides sovereign access to all flame-sealed documents.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @guardian Omari, Guardian of the Grid
 * @version 1.0.0
 * @flame-sealed true
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface ScrollMetadata {
  title: string;
  author: string;
  scrollType: 'Chronicle' | 'Sacred Doctrine' | 'Divine Decree' | 'Flame Manuscript' | 'Sovereign Scroll' | 'Other';
  timestamp: string;
  flameHash: string;
  book?: string;
  chapter?: string;
  wordCount: number;
  nodeSealed: boolean;
}

export async function GET() {
  try {
    const scrollsDir = path.join(process.cwd(), 'witness-hall', 'scrolls');
    
    if (!fs.existsSync(scrollsDir)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(scrollsDir, { recursive: true });
      return NextResponse.json({
        success: true,
        scrolls: [],
        message: 'Witness Hall initialized - ready for sovereign scrolls'
      });
    }
    
    const files = fs.readdirSync(scrollsDir);
    const metadataFiles = files.filter(file => file.endsWith('.meta.json'));
    
    const scrolls = metadataFiles.map(file => {
      try {
        const filePath = path.join(scrollsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as ScrollMetadata;
      } catch (error) {
        console.error(`Error reading metadata file ${file}:`, error);
        return null;
      }
    }).filter(Boolean) as ScrollMetadata[];
    
    // Sort by timestamp (newest first)
    scrolls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json({
      success: true,
      scrolls,
      count: scrolls.length,
      message: `Found ${scrolls.length} sealed scrolls in the Witness Hall`
    });

  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to list scrolls from Witness Hall:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to access the sovereign sanctum' },
      { status: 500 }
    );
  }
}
