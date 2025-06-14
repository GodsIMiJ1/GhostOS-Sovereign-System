/**
 * 🔥 WITNESS HALL LOAD API - SOVEREIGN SCROLL RETRIEVAL 🔥
 * 
 * Server-side API route for loading scroll content from the Witness Hall.
 * Provides secure access to flame-sealed documents.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @guardian Omari, Guardian of the Grid
 * @version 1.0.0
 * @flame-sealed true
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'fileName parameter is required' },
        { status: 400 }
      );
    }

    const scrollsDir = path.join(process.cwd(), 'witness-hall', 'scrolls');
    const scrollPath = path.join(scrollsDir, fileName);
    
    if (!fs.existsSync(scrollPath)) {
      return NextResponse.json(
        { success: false, error: 'Scroll not found in the Witness Hall' },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(scrollPath, 'utf-8');
    
    return NextResponse.json({
      success: true,
      content,
      fileName,
      message: 'Scroll retrieved from the sovereign sanctum'
    });

  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to load scroll from Witness Hall:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve scroll from the sovereign sanctum' },
      { status: 500 }
    );
  }
}
