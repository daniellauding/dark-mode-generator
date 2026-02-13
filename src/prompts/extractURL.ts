/**
 * AI Prompt for extracting dark mode CSS from websites
 */

export function createExtractURLPrompt(url: string, html: string, css: string): string {
  return `Analyze the dark mode implementation of this website: ${url}

HTML structure (sample):
${html.slice(0, 2000)}...

CSS content:
${css}

Extract and analyze:

1. **Color Palette** - All colors used (hex codes)
2. **CSS Variables** - Dark mode custom properties (:root, [data-theme="dark"])
3. **Media Queries** - @media (prefers-color-scheme: dark) rules
4. **Design System Insights**:
   - Grid system (e.g., 8pt, 4px base)
   - Typography scale (font-size, line-height)
   - Spacing tokens (margin, padding values)
   - Border radius values
5. **WCAG Compliance** - Check text/background contrast ratios
6. **Best Practices** - Notable patterns or techniques used

Generate output formats:

1. **Tailwind Config** - Equivalent tailwind.config.js
2. **CSS Variables** - Clean :root {} with all tokens
3. **Figma Tokens** - JSON format for Figma Tokens plugin
4. **Implementation Notes** - How they achieve dark mode (approach used)

Return structured JSON with these sections:
{
  "palette": {
    "background": "#0a0a0a",
    "foreground": "#e4e4e4",
    "primary": "#8b5cf6",
    "secondary": "#06b6d4",
    "accent": "#f59e0b",
    "muted": "#1a1a1a",
    "border": "#2a2a2a"
  },
  "cssVariables": "string (formatted CSS)",
  "tailwindConfig": "string (formatted JS)",
  "figmaTokens": {},
  "designSystem": {
    "grid": "8pt base",
    "typography": ["font-family", "font-sizes"],
    "spacing": ["4", "8", "12", "16", "24", "32"],
    "radius": ["4px", "8px", "12px"]
  },
  "wcag": {
    "compliant": true,
    "issues": []
  },
  "implementationNotes": "string (markdown)",
  "bestPractices": ["practice 1", "practice 2"]
}

Important:
- Extract ONLY dark mode colors (ignore light mode)
- All colors must be valid hex codes
- Ensure WCAG AA compliance (4.5:1 for text)
- Provide actionable insights, not just data dump`;
}
