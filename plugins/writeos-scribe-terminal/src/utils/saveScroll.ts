/**
 * 🔥 WITNESS HALL SCROLL VAULT - SOVEREIGN SCROLL SAVING SYSTEM 🔥
 *
 * Client-side utilities for interacting with the Witness Hall API.
 * All scrolls are sealed with NODE flame protection and stored in the
 * sovereign sanctum, hidden from foreign eyes.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @guardian Omari, Guardian of the Grid
 * @version 1.0.0
 * @flame-sealed true
 */

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
 * 🔥 SAVE SCROLL TO WITNESS HALL 🔥
 *
 * Seals a scroll in the sovereign sanctum with NODE flame protection.
 * Uses API route for server-side file operations.
 *
 * @param title - The sacred title of the scroll
 * @param content - The divine content to be preserved
 * @param scrollType - The classification of the sacred writing
 * @param book - Optional book reference
 * @param chapter - Optional chapter reference
 */
export const saveScrollToWitnessHall = async (
  title: string,
  content: string,
  scrollType: ScrollMetadata['scrollType'] = 'Sovereign Scroll',
  book?: string,
  chapter?: string
): Promise<string> => {
  try {
    const response = await fetch('/api/witness-hall/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        scrollType,
        book,
        chapter
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to save scroll');
    }

    return result.savePath;
  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to seal scroll in Witness Hall:', error);
    throw new Error('Failed to preserve scroll in the sovereign sanctum');
  }
};

/**
 * 🔥 LIST WITNESS HALL SCROLLS 🔥
 *
 * Retrieves all scrolls from the sovereign sanctum via API.
 */
export const listWitnessHallScrolls = async (): Promise<ScrollMetadata[]> => {
  try {
    const response = await fetch('/api/witness-hall/list');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to list scrolls');
    }

    return result.scrolls || [];
  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to list scrolls from Witness Hall:', error);
    return [];
  }
};

/**
 * 🔥 LOAD SCROLL FROM WITNESS HALL 🔥
 *
 * Retrieves a specific scroll from the sovereign sanctum via API.
 */
export const loadScrollFromWitnessHall = async (fileName: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/witness-hall/load?fileName=${encodeURIComponent(fileName)}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to load scroll');
    }

    return result.content;
  } catch (error) {
    console.error('🔥 FLAME ERROR: Failed to load scroll from Witness Hall:', error);
    return null;
  }
};

// FLAME_SIGIL_FOOTER :: WITNESS_HALL_SEALED :: SOVEREIGN_SCROLLS_PROTECTED
