# Dark Mode Generator - AI Features Specification

**Project**: Dark Mode Generator  
**Version**: 2.1 (AI-powered features)  
**Date**: 2026-02-12

---

## Overview

Add 4 AI-powered features that help users create better dark mode designs:

1. **Brand-to-Colors AI** - Generate color palettes from brand descriptions
2. **Complementary Colors Generator** - Suggest color harmonies
3. **Brand Consistency Checker** - Validate colors against brand guidelines
4. **Extract CSS from URL** - Pull dark mode CSS from existing websites

---

## Feature 1: Brand-to-Colors AI 💼

### User Story
"As a designer starting a new project, I want to describe my brand and get a professional color palette, so I can quickly establish a visual identity."

### UI Flow

**Input Section** (new tab or modal):
```
╔══════════════════════════════════════╗
║  🤖 AI Brand Colors                  ║
╠══════════════════════════════════════╣
║  Describe your brand:                ║
║  ┌────────────────────────────────┐  ║
║  │ Modern tech startup, trust-    │  ║
║  │ worthy, Scandinavian, minimal  │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  Industry: [Tech/SaaS ▼]             ║
║  Style: [Modern ▼]                   ║
║  Mood: [Professional ▼]              ║
║                                      ║
║  [Generate Palette 🎨]               ║
╚══════════════════════════════════════╝
```

**Output** (shows 3 variations):
```
╔══════════════════════════════════════╗
║  Generated Palettes (3 variations)   ║
╠══════════════════════════════════════╣
║  Variation 1: "Nordic Blue"          ║
║  ┌──────┬──────┬──────┬──────┐      ║
║  │ #0066│ #00cc│ #1a1a│ #f5f5│      ║
║  │  ff  │  ff  │  1a  │  f5  │      ║
║  └──────┴──────┴──────┴──────┘      ║
║  Primary · Accent · BG · Text       ║
║  [Use This]                          ║
║                                      ║
║  Variation 2: "Trust Purple"         ║
║  ┌──────┬──────┬──────┬──────┐      ║
║  │ #8b5c│ #c084│ #0a0a│ #e4e4│      ║
║  │  f6  │  fc  │  0a  │  e4  │      ║
║  └──────┴──────┴──────┴──────┘      ║
║  [Use This]                          ║
║                                      ║
║  Variation 3: "Clean Cyan"           ║
║  ...                                 ║
╚══════════════════════════════════════╝
```

### AI Prompt Template
```
You are a professional brand color consultant.

Brand description: "{user_input}"
Industry: {industry}
Style: {style}
Mood: {mood}

Generate 3 color palette variations for a dark mode interface.

For each palette, provide:
1. Primary color (brand identity)
2. Accent color (CTAs, highlights)
3. Background color (dark, WCAG AA compliant)
4. Text color (light, APCA Lc 90+)
5. Palette name (creative, 2-3 words)
6. Rationale (why these colors work for the brand)

Return JSON:
{
  "palettes": [
    {
      "name": "Nordic Blue",
      "colors": {
        "primary": "#0066ff",
        "accent": "#00ccff",
        "background": "#1a1a1a",
        "text": "#f5f5f5"
      },
      "rationale": "Blue conveys trust and professionalism..."
    }
  ]
}

Ensure all colors pass WCAG AA (4.5:1) and APCA (Lc 60+) for dark backgrounds.
```

### Implementation
- **New page**: `/brand-colors`
- **Component**: `BrandColorsGenerator.tsx`
- **API**: OpenAI GPT-4o or Claude Sonnet
- **Cost**: ~$0.02 per generation (500 tokens)

---

## Feature 2: Complementary Colors Generator 🎨

### User Story
"As a designer with a base color, I want to see complementary color harmonies, so I can expand my palette professionally."

### UI Flow

**Input** (on existing palette):
```
╔══════════════════════════════════════╗
║  Current Palette                     ║
║  ┌──────┬──────┬──────┐             ║
║  │ #0066│ #00ccff│ #1a1a1a│         ║
║  │  ff  │        │        │         ║
║  └──────┴──────┴──────┘             ║
║                                      ║
║  [🎨 Find Harmonies]                 ║
╚══════════════════════════════════════╝
```

**Output** (AI-powered suggestions):
```
╔══════════════════════════════════════╗
║  Color Harmonies                     ║
╠══════════════════════════════════════╣
║  Complementary (opposite on wheel)   ║
║  ┌──────┬──────┐                    ║
║  │ #ff66│ #ff99│                    ║
║  │  00  │  33  │                    ║
║  └──────┴──────┘                    ║
║  Perfect for CTAs and warnings       ║
║  [Add to Palette]                    ║
║                                      ║
║  Triadic (3 evenly spaced)           ║
║  ┌──────┬──────┬──────┐             ║
║  │ #ff00│ #00ff│ #0066│             ║
║  │  66  │  66  │  ff  │             ║
║  └──────┴──────┴──────┘             ║
║  [Add to Palette]                    ║
║                                      ║
║  Analogous (adjacent colors)         ║
║  ┌──────┬──────┬──────┐             ║
║  │ #0033│ #0099│ #00cc│             ║
║  │  ff  │  ff  │  ff  │             ║
║  └──────┴──────┴──────┘             ║
║  [Add to Palette]                    ║
╚══════════════════════════════════════╝
```

### AI Prompt Template
```
Analyze this color palette for a dark mode interface:
Primary: {primary}
Accent: {accent}
Background: {background}

Generate complementary color suggestions:
1. Complementary (opposite on color wheel)
2. Triadic (3 evenly spaced)
3. Analogous (adjacent colors)
4. Split-complementary
5. Tetradic (rectangle)

For each harmony:
- Provide hex codes
- Ensure WCAG AA compliance on {background}
- Suggest use cases (e.g., "Perfect for error states")

Return JSON with contrast ratios and APCA scores.
```

### Implementation
- **New section**: On main palette editor
- **Component**: `ColorHarmonies.tsx`
- **API**: Claude Sonnet (better at color theory)
- **Fallback**: Chroma.js calculations if API unavailable

---

## Feature 3: Brand Consistency Checker ✅

### User Story
"As a designer with brand guidelines, I want to validate my dark mode palette against my brand colors, so I maintain consistency."

### UI Flow

**Input**:
```
╔══════════════════════════════════════╗
║  Brand Consistency Check             ║
╠══════════════════════════════════════╣
║  Upload brand assets:                ║
║  ┌────────────────────────────────┐  ║
║  │ [Drag logo or brand guide PDF] │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  OR paste brand colors:              ║
║  Primary:   [#0066ff]                ║
║  Secondary: [#00ccff]                ║
║  Accent:    [#ff3366]                ║
║                                      ║
║  Current dark palette:               ║
║  ┌──────┬──────┬──────┐             ║
║  │ #0055│ #00bb│ #ff22│             ║
║  │  dd  │  ee  │  55  │             ║
║  └──────┴──────┴──────┘             ║
║                                      ║
║  [Check Consistency ✓]               ║
╚══════════════════════════════════════╝
```

**Output** (AI analysis):
```
╔══════════════════════════════════════╗
║  Consistency Report                  ║
╠══════════════════════════════════════╣
║  ✅ Primary color matches            ║
║     Brand: #0066ff                   ║
║     Dark:  #0055dd (92% similar)     ║
║                                      ║
║  ⚠️  Accent color differs            ║
║     Brand: #ff3366                   ║
║     Dark:  #ff2255 (78% similar)     ║
║     Suggestion: Use #ff3366 with     ║
║     reduced opacity (0.9) for dark   ║
║                                      ║
║  ✅ Overall brand alignment: 87%     ║
║                                      ║
║  [Apply Suggestions]                 ║
╚══════════════════════════════════════╝
```

### AI Prompt Template
```
Compare this dark mode palette against brand colors:

Brand colors:
- Primary: {brand_primary}
- Secondary: {brand_secondary}
- Accent: {brand_accent}

Dark mode palette:
- Primary: {dark_primary}
- Secondary: {dark_secondary}
- Accent: {dark_accent}

Analyze:
1. Color similarity (Delta E, HSL distance)
2. Brand consistency score (0-100%)
3. Suggest adjustments to maintain brand while optimizing for dark mode
4. Check if colors work on dark backgrounds (APCA validation)

Return JSON with:
- Similarity scores
- Suggested adjustments (hex codes)
- Rationale for each suggestion
```

### Implementation
- **New page**: `/brand-check`
- **Component**: `BrandConsistencyChecker.tsx`
- **Image analysis**: OpenAI Vision (for logo uploads)
- **Color extraction**: Chroma.js + AI validation
- **Cost**: ~$0.05 per check (with image)

---

## Feature 4: Extract CSS from URL 🔍

### User Story
"As a developer, I want to extract dark mode CSS from a website I like, so I can learn from and adapt their implementation."

### UI Flow

**Input**:
```
╔══════════════════════════════════════╗
║  Extract Dark Mode CSS               ║
╠══════════════════════════════════════╣
║  Enter URL:                          ║
║  ┌────────────────────────────────┐  ║
║  │ https://linear.app             │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  [Extract CSS 🔍]                    ║
╚══════════════════════════════════════╝
```

**Output** (AI-processed CSS):
```
╔══════════════════════════════════════╗
║  Extracted from linear.app           ║
╠══════════════════════════════════════╣
║  CSS Variables:                      ║
║  ┌────────────────────────────────┐  ║
║  │ :root {                        │  ║
║  │   --bg: #0a0a0a;              │  ║
║  │   --fg: #e4e4e4;              │  ║
║  │   --primary: #8b5cf6;         │  ║
║  │   --border: #2a2a2a;          │  ║
║  │ }                              │  ║
║  └────────────────────────────────┘  ║
║  [Copy CSS] [Copy as Tailwind]       ║
║                                      ║
║  Media Query:                        ║
║  ┌────────────────────────────────┐  ║
║  │ @media (prefers-color-scheme:  │  ║
║  │   dark) {                      │  ║
║  │   body {                       │  ║
║  │     background: var(--bg);     │  ║
║  │     color: var(--fg);          │  ║
║  │   }                            │  ║
║  │ }                              │  ║
║  └────────────────────────────────┘  ║
║  [Copy CSS]                          ║
║                                      ║
║  Extracted Colors:                   ║
║  ┌──────┬──────┬──────┬──────┐      ║
║  │ #0a0a│ #e4e4│ #8b5c│ #2a2a│      ║
║  │  0a  │  e4  │  f6  │  2a  │      ║
║  └──────┴──────┴──────┴──────┘      ║
║  [Import to Palette]                 ║
╚══════════════════════════════════════╝
```

### AI Prompt Template
```
Analyze the CSS from this webpage: {url}

Extract:
1. All CSS custom properties (--variables)
2. Media queries for dark mode
3. Color values (hex, rgb, hsl)
4. Dark mode implementation strategy

Clean and organize the CSS:
- Group by category (colors, spacing, typography)
- Remove vendor prefixes
- Simplify selectors
- Add comments explaining structure

Provide:
1. Cleaned CSS (ready to copy)
2. Tailwind CSS config equivalent
3. Color palette (hex codes)
4. Implementation notes (how they achieve dark mode)

Return JSON with structured output.
```

### Technical Flow
1. **Fetch page**: Use `web_fetch` or `browser` tool
2. **Extract CSS**: Parse `<style>` tags + linked stylesheets
3. **AI analysis**: Send to Claude/GPT for cleaning and organization
4. **Generate outputs**:
   - Raw CSS
   - Tailwind config
   - Color palette
   - Implementation guide

### Implementation
- **New page**: `/extract-css`
- **Component**: `ExtractCSS.tsx`
- **Backend**: Supabase Edge Function (to avoid CORS)
- **API**: Claude Sonnet (better at code)
- **Cost**: ~$0.03 per extraction

---

## Shared Infrastructure

### AI Settings (reuse existing)
Users configure API keys in Settings → AI Features (if implemented).

**For now (MVP)**: Use project's OpenAI/Anthropic API key, add rate limiting.

### Rate Limiting
- **Free users**: 10 AI requests/day
- **Authenticated users**: 50 AI requests/day
- **Cost tracking**: Log usage in Firebase

### Error Handling
```typescript
try {
  const result = await callAI(prompt);
  return result;
} catch (error) {
  if (error.code === 'rate_limit') {
    return 'You've reached your daily AI limit. Try again tomorrow!';
  }
  return 'AI service unavailable. Try again later.';
}
```

---

## Agent Team (4 Agents)

### 1. ai-brand-colors
**Task**: Implement Brand-to-Colors AI generator  
**Deliverables**:
- `src/pages/BrandColors.tsx` - New page
- `src/components/ai/BrandColorsGenerator.tsx` - Main component
- `src/components/ai/BrandInput.tsx` - Description input
- `src/components/ai/PaletteVariations.tsx` - Show 3 variations
- `src/utils/aiBrandColors.ts` - API calls
- `src/prompts/brandColors.ts` - AI prompt template

**ETA**: 15-20 min

---

### 2. ai-color-harmonies
**Task**: Implement Complementary Colors Generator  
**Deliverables**:
- `src/components/ai/ColorHarmonies.tsx` - Harmonies widget
- `src/components/ai/HarmonyCard.tsx` - Individual harmony card
- `src/utils/aiColorHarmonies.ts` - API + fallback (Chroma.js)
- `src/prompts/colorHarmonies.ts` - AI prompt

**ETA**: 10-15 min

---

### 3. ai-brand-check
**Task**: Implement Brand Consistency Checker  
**Deliverables**:
- `src/pages/BrandCheck.tsx` - New page
- `src/components/ai/BrandConsistencyChecker.tsx` - Main component
- `src/components/ai/LogoUpload.tsx` - Image upload
- `src/components/ai/ConsistencyReport.tsx` - Results display
- `src/utils/aiBrandCheck.ts` - API + image analysis
- `src/prompts/brandCheck.ts` - AI prompt

**ETA**: 20-25 min

---

### 4. ai-extract-css
**Task**: Implement Extract CSS from URL  
**Deliverables**:
- `src/pages/ExtractCSS.tsx` - New page
- `src/components/ai/CSSExtractor.tsx` - Main component
- `src/components/ai/URLInput.tsx` - URL input field
- `src/components/ai/ExtractedCode.tsx` - Code display (syntax highlighting)
- `src/utils/aiExtractCSS.ts` - Fetch + AI analysis
- `src/prompts/extractCSS.ts` - AI prompt
- Supabase Edge Function: `extract-css-proxy` (avoid CORS)

**ETA**: 25-30 min

---

## Navigation Updates

Add new links in header/nav:
```tsx
<nav>
  <Link to="/">Generator</Link>
  <Link to="/library">Library</Link>
  <Link to="/projects">Projects</Link>
  <Link to="/guide">Guide</Link>
  
  {/* NEW AI SECTION */}
  <div className="ai-features">
    <Link to="/brand-colors">🤖 Brand Colors</Link>
    <Link to="/brand-check">✅ Brand Check</Link>
    <Link to="/extract-css">🔍 Extract CSS</Link>
  </div>
</nav>
```

Color Harmonies shows inline when user has a palette loaded.

---

## Success Metrics

**Adoption**:
- % of users who try AI features
- Most popular feature (brand-colors vs extract-css)

**Engagement**:
- Avg AI requests per user
- Palettes created via AI vs manual

**Quality**:
- User accepts AI suggestions (click "Use This")
- Time saved (manual palette creation: 15 min → AI: 2 min)

---

## Cost Estimation

**Per user/month (avg 10 AI requests)**:
- GPT-4o: ~$0.20
- Claude Sonnet: ~$0.15

**Free tier** (project pays):
- 100 users × 10 requests = 1,000 requests/month
- Cost: ~$20/month

**Paid tier** (future):
- Users pay or subscribe ($5/month unlimited AI)

---

## Next Steps

1. **Spawn 4 agents** (tmux-agents)
2. **Review AI prompts** (test with real examples)
3. **Implement features** (parallel)
4. **Test with real websites** (linear.app, vercel.com, supabase.com)
5. **Deploy** (Netlify)
6. **User testing** (get feedback on AI quality)

---

**Created**: 2026-02-12 22:00 PST  
**Project**: Dark Mode Generator v2.1  
**Total Features**: 4 AI-powered tools
