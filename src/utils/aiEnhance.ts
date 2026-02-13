import { aiClient, trackAIUsage } from './aiClient';
import { createEnhancePrompt } from '../prompts/enhance';
import type { DarkPalette, DarkColorEntry } from '../types';

export interface ColorFix {
  original: string;
  fixed: string;
  name: string;
  contrast: {
    wcag: number;
    apca: number;
  };
  reasoning: string;
}

export interface EnhanceResult {
  fixed: {
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    colors: ColorFix[];
  };
  summary: string;
  suggestions: string[];
}

/**
 * Enhance dark mode palette using AI
 */
export async function enhancePalette(
  darkPalette: DarkPalette,
  issues: string[],
): Promise<{
  result: EnhanceResult | null;
  error?: string;
}> {
  // Check if AI is configured
  if (!aiClient.isConfigured()) {
    return {
      result: null,
      error: 'AI client not configured. Add your API key in Settings to use AI enhancement.',
    };
  }

  try {
    // Create AI prompt
    const prompt = createEnhancePrompt(darkPalette, issues);

    // Call AI
    trackAIUsage();
    const response = await aiClient.call(prompt);

    if (!response.success || !response.data) {
      return {
        result: null,
        error: response.error ?? 'AI enhancement failed',
      };
    }

    return { result: response.data as EnhanceResult };
  } catch (error) {
    return {
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error during enhancement',
    };
  }
}

/**
 * Apply AI fixes to dark palette
 */
export function applyEnhancement(
  darkPalette: DarkPalette,
  enhancement: EnhanceResult,
): DarkPalette {
  // Create map of original -> fixed colors
  const fixMap = new Map<string, string>();
  enhancement.fixed.colors.forEach(fix => {
    fixMap.set(fix.original.toLowerCase(), fix.fixed);
  });

  // Apply fixes to colors
  const updatedColors: DarkColorEntry[] = darkPalette.colors.map(color => {
    const fixed = fixMap.get(color.hex.toLowerCase());
    if (fixed) {
      return { ...color, hex: fixed };
    }
    return color;
  });

  return {
    ...darkPalette,
    backgroundColor: enhancement.fixed.backgroundColor,
    surfaceColor: enhancement.fixed.surfaceColor,
    textColor: enhancement.fixed.textColor,
    colors: updatedColors,
  };
}
