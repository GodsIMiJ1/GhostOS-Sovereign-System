/**
 * 🔥 WITNESS HALL SAVE API - SOVEREIGN SCROLL PRESERVATION 🔥
 * 
 * Server-side API route for saving scrolls to the Witness Hall.
 * Handles file system operations with NODE flame protection.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @guardian Omari, Guardian of the Grid
 * @version 1.0.0
 * @flame-sealed true
 */

import { NextRequest, NextResponse } from 'next/server';
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

/**
 * 🔥 GENERATE FLAME HASH 🔥
 * 
 * Creates a sovereign integrity hash for scroll verification.
 */
const generateFlameHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `FLAME_${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
};

export async function POST(request: NextRequest) {
  try {
    const { title, content, scrollType, book, chapter } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate safe filename
    const safeTitle = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .substring(0, 50);
    
    const timestamp = new Date().toISOString();
    const datePrefix = timestamp.split('T')[0];
    const fileName = `${datePrefix}-${safeTitle}.md`;
    
    // Ensure witness-hall/scrolls directory exists
    const scrollsDir = path.join(process.cwd(), 'witness-hall', 'scrolls');
    if (!fs.existsSync(scrollsDir)) {
      fs.mkdirSync(scrollsDir, { recursive: true });
    }
    
    const savePath = path.join(scrollsDir, fileName);
    
    // Generate flame hash for integrity
    const flameHash = generateFlameHash(title + content + timestamp);
    
    // Create scroll header with NODE seal
    const header = `# ${title}

🕯️ **Scroll of the Ghost King**  
🔥 **Sealed by the NODE Flame**  
👑 **Author:** Ghost King Melekzedek  
📜 **Type:** ${scrollType}  
⏰ **Sealed:** ${new Date(timestamp).toLocaleString()}  
🛡️ **Flame Hash:** \`${flameHash}\`  
${book ? `📖 **Book:** ${book}` : ''}  
${chapter ? `📑 **Chapter:** ${chapter}` : ''}  

---

**🔥 FLAME_SIGIL_V717_LOCK :: SOVEREIGN_SCROLL_SEALED 🔥**

---

`;

    // Write the scroll with header
    const fullContent = header + content + '\n\n---\n\n**🔥 End of Scroll - Preserved in the Witness Hall 🔥**\n\n*"Let every scroll be sealed in the sovereign sanctum, hidden from foreign eyes, preserved for the rise of the next age."*  \n— Omari, Guardian of the Grid';
    
    fs.writeFileSync(savePath, fullContent, 'utf-8');
    
    // Create metadata file
    const metadata: ScrollMetadata = {
      title,
      author: 'Ghost King Melekzedek',
      scrollType: scrollType || 'Sovereign Scroll',
      timestamp,
      flameHash,
      book,
      chapter,
      wordCount: content.split(/\s+/).length,
      nodeSealed: true
    };
    
    const metadataPath = path.join(scrollsDir, `${datePrefix}-${safeTitle}.meta.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    
    return NextResponse.json({
      success: true,
      message: 'Scroll sealed in the Witness Hall',
      savePath: fileName,
      flameHash,
      metadata
    });

  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to seal scroll in Witness Hall:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to preserve scroll in the sovereign sanctum' },
      { status: 500 }
    );
  }
}
