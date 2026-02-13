import { aiClient, trackAIUsage } from './aiClient';
import { createExtractURLPrompt } from '../prompts/extractURL';
import type { DesignPalette } from '../types';

export interface URLExtractionResult {
  palette: {
    background: string;
    foreground: string;
    primary: string;
    secondary?: string;
    accent?: string;
    muted?: string;
    border?: string;
  };
  cssVariables?: string;
  tailwindConfig?: string;
  figmaTokens?: any;
  designSystem?: {
    grid?: string;
    typography?: string[];
    spacing?: string[];
    radius?: string[];
  };
  wcag?: {
    compliant: boolean;
    issues: string[];
  };
  implementationNotes?: string;
  bestPractices?: string[];
}

/**
 * Fetch HTML and CSS from URL (client-side, CORS-limited)
 */
async function fetchWebsite(url: string): Promise<{ html: string; css: string }> {
  try {
    // Try direct fetch (will work for CORS-enabled sites)
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'User-Agent': 'DarkModeGenerator/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract inline styles and linked stylesheets
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let css = '';

    // Get inline styles
    const styleElements = doc.querySelectorAll('style');
    styleElements.forEach(el => {
      css += el.textContent + '\n';
    });

    // Note: Cannot fetch external stylesheets due to CORS
    // This is a limitation of client-side approach
    // Future: Use Supabase Edge Function for server-side proxy

    return { html, css };
  } catch (error) {
    throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract dark mode palette and design system from URL using AI
 */
export async function extractFromURL(url: string): Promise<{
  palette: DesignPalette;
  extraction: URLExtractionResult | null;
  error?: string;
}> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  // Check if AI is configured
  if (!aiClient.isConfigured()) {
    return {
      palette: createFallbackPalette(),
      extraction: null,
      error: 'AI client not configured. Add your API key in Settings to use CSS extraction.',
    };
  }

  try {
    // Fetch website
    console.log(`[extractFromURL] Fetching ${url}...`);
    const { html, css } = await fetchWebsite(url);
    console.log(`[extractFromURL] Got ${html.length} bytes HTML, ${css.length} bytes CSS`);

    if (!css || css.trim().length === 0) {
      console.warn('[extractFromURL] No CSS found - CORS may be blocking');
      return {
        palette: createFallbackPalette(),
        extraction: null,
        error: '⚠️ No CSS found. The website blocks cross-origin requests (CORS). Try uploading a screenshot instead.',
      };
    }

    // Create AI prompt
    console.log('[extractFromURL] Calling AI to extract colors...');
    const prompt = createExtractURLPrompt(url, html, css);

    // Call AI
    trackAIUsage();
    const result = await aiClient.call(prompt);

    if (!result.success || !result.data) {
      console.error('[extractFromURL] AI extraction failed:', result.error);
      return {
        palette: createFallbackPalette(),
        extraction: null,
        error: `❌ AI extraction failed: ${result.error}`,
      };
    }

    console.log('[extractFromURL] Success! Extracted palette:', result.data.palette);

    const extraction = result.data as URLExtractionResult;

    // Convert extracted palette to DesignPalette format
    const palette: DesignPalette = {
      colors: [
        {
          hex: extraction.palette.background ?? '#0a0a0a',
          name: 'Background',
          area: 500,
          role: 'background',
        },
        {
          hex: extraction.palette.foreground ?? '#e4e4e4',
          name: 'Text',
          area: 300,
          role: 'text',
        },
        {
          hex: extraction.palette.primary ?? '#8b5cf6',
          name: 'Primary',
          area: 150,
          role: 'accent',
        },
        {
          hex: extraction.palette.secondary ?? '#06b6d4',
          name: 'Secondary',
          area: 100,
          role: 'accent',
        },
        {
          hex: extraction.palette.border ?? '#2a2a2a',
          name: 'Border',
          area: 50,
          role: 'border',
        },
        {
          hex: extraction.palette.muted ?? '#1a1a1a',
          name: 'Surface',
          area: 200,
          role: 'surface',
        },
      ],
      dominantColor: extraction.palette.primary ?? '#8b5cf6',
      backgroundColor: extraction.palette.background ?? '#0a0a0a',
      textColor: extraction.palette.foreground ?? '#e4e4e4',
    };

    return { palette, extraction };
  } catch (error) {
    return {
      palette: createFallbackPalette(),
      extraction: null,
      error: error instanceof Error ? error.message : 'Unknown error during extraction',
    };
  }
}

/**
 * Create fallback palette when extraction fails
 */
function createFallbackPalette(): DesignPalette {
  return {
    colors: [
      { hex: '#0a0a0a', name: 'Background', area: 500, role: 'background' },
      { hex: '#e4e4e4', name: 'Text', area: 300, role: 'text' },
      { hex: '#8b5cf6', name: 'Primary', area: 150, role: 'accent' },
      { hex: '#06b6d4', name: 'Secondary', area: 100, role: 'accent' },
      { hex: '#2a2a2a', name: 'Border', area: 50, role: 'border' },
      { hex: '#1a1a1a', name: 'Surface', area: 200, role: 'surface' },
    ],
    dominantColor: '#8b5cf6',
    backgroundColor: '#0a0a0a',
    textColor: '#e4e4e4',
  };
}
