/**
 * AI Prompt for enhancing dark mode palettes
 */

import type { DarkPalette } from '../types';

export function createEnhancePrompt(
  darkPalette: DarkPalette,
  issues: string[],
): string {
  return `You are a dark mode design expert. Analyze this dark mode palette and fix all issues:

Current Palette:
${JSON.stringify(darkPalette, null, 2)}

Problems detected:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

Your task:
1. **Fix all contrast issues** - Ensure WCAG AA (4.5:1) and APCA (Lc 60+) compliance
2. **Fix color inversions** - If colors are too light (white/near-white), darken them appropriately
3. **Maintain color relationships** - Keep the same hue relationships between colors
4. **Preserve brand colors** - Adjust saturation/lightness but keep hue intact when possible
5. **Professional dark mode** - Background should be dark (#0a0a0a to #1a1a1a range)

Common fixes needed:
- Background too light? → Use #0a0a0a to #121212
- Text too dark? → Use #e4e4e4 to #f5f5f5
- Accent colors washed out? → Increase saturation slightly
- Colors too similar? → Increase contrast between them

Return JSON with:
{
  "fixed": {
    "backgroundColor": "#0a0a0a",
    "surfaceColor": "#121212",
    "textColor": "#e4e4e4",
    "colors": [
      {
        "original": "#FFFFFF",
        "fixed": "#0a0a0a",
        "name": "Background",
        "contrast": { "wcag": 21.0, "apca": 106.0 },
        "reasoning": "Changed from white to dark for proper dark mode"
      }
    ]
  },
  "summary": "Fixed 7 colors with contrast issues. Changed background from white (#FFF9F9) to dark (#0a0a0a). All colors now pass WCAG AA and APCA standards.",
  "suggestions": [
    "Consider using #1a1a1a for elevated surfaces",
    "Accent colors work well with current background"
  ]
}

Be specific about what you changed and why.`;
}
