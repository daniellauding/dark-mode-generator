# Dark Mode Generator - AI Features (Integrated Approach)

**Approach**: AI är TILLÄGG i befintliga features, inte separata pages  
**Date**: 2026-02-12 22:08 PST

---

## Design Philosophy

❌ **NOT**: Separata /brand-colors, /brand-check, /extract-css pages  
✅ **YES**: AI-knappar och widgets inbyggda i befintliga UI

**Varför?**
- AI känns naturligt, inte separat verktyg
- Lägre trösklar - user ser AI-förslag direkt i sitt workflow
- Mindre context switching - stanna kvar i samma vy

---

## 1. AI i Palette Editor (Huvudsida)

### När user laddar bild/URL:

**Nuvarande**:
```
[Bild laddad] → [Extraherade färger visas]
```

**Med AI (tillägg)**:
```
[Bild laddad] → [Extraherade färger] + [✨ AI Enhance]

Click "✨ AI Enhance":
╔══════════════════════════════════════╗
║  AI Analysis                         ║
╠══════════════════════════════════════╣
║  Detected style: "Modern SaaS UI"    ║
║  Mood: Professional, trustworthy     ║
║                                      ║
║  💡 Suggestions:                     ║
║  • Increase contrast (3.2 → 4.5:1)  ║
║  • Add subtle variant (#0a0a0c)     ║
║  • Font pairing: Inter + JetBrains  ║
║                                      ║
║  [Apply Suggestions]                 ║
╚══════════════════════════════════════╝
```

**Implementation**:
- `src/components/palette/AIEnhanceButton.tsx` - Knapp i palette editor
- `src/components/palette/AIAnalysisModal.tsx` - Modal med förslag
- `src/utils/aiEnhance.ts` - AI call + apply logic

---

## 2. Color Harmonies Widget (Inline)

**Nuvarande**:
```
[Palette loaded] → [Preview + Export buttons]
```

**Med AI (widget under palette)**:
```
[Palette loaded] → [Preview] → [🎨 Color Harmonies ▼]

Click expand:
╔══════════════════════════════════════╗
║  🎨 Color Harmonies                  ║
╠══════════════════════════════════════╣
║  Complementary:                      ║
║  ┌──────┬──────┐ [Add]              ║
║  │ #ff66│ #ff99│                    ║
║  │  00  │  33  │                    ║
║  └──────┴──────┘                    ║
║                                      ║
║  Triadic:                            ║
║  ┌──────┬──────┬──────┐ [Add]       ║
║  │ #ff00│ #00ff│ #0066│             ║
║  │  66  │  66  │  ff  │             ║
║  └──────┴──────┴──────┘             ║
║                                      ║
║  [Powered by AI ✨]                  ║
╚══════════════════════════════════════╝
```

**Implementation**:
- `src/components/palette/ColorHarmoniesWidget.tsx` - Collapsible widget
- Visas under palette preview när palette är loaded
- Fallback: Chroma.js calculations if no API key

---

## 3. Import from URL (Modal)

**Nuvarande**:
```
Upload/Paste → [Image only]
```

**Med AI (URL support)**:
```
Upload/Paste → [Image OR URL]

Tabs:
┌─────────┬─────────┐
│ Image   │ URL     │ ← Click URL tab
└─────────┴─────────┘

URL tab:
╔══════════════════════════════════════╗
║  Import from Website                 ║
╠══════════════════════════════════════╣
║  URL: [https://linear.app        ]   ║
║                                      ║
║  ☑ Extract CSS variables             ║
║  ☑ AI analysis (requires API key)    ║
║                                      ║
║  [Import 🔍]                         ║
╚══════════════════════════════════════╝

Result:
╔══════════════════════════════════════╗
║  Extracted from linear.app           ║
╠══════════════════════════════════════╣
║  Colors:                             ║
║  ┌──────┬──────┬──────┬──────┐      ║
║  │ #0a0a│ #e4e4│ #8b5c│ #2a2a│      ║
║  │  0a  │  e4  │  f6  │  2a  │      ║
║  └──────┴──────┴──────┴──────┘      ║
║  [Use These Colors]                  ║
║                                      ║
║  🤖 AI Insights:                     ║
║  • Design system: Custom (8pt grid)  ║
║  • Typography: Inter                 ║
║  • WCAG AA: ✅ Pass                  ║
║                                      ║
║  CSS Variables:                      ║
║  ┌────────────────────────────────┐  ║
║  │ --bg: #0a0a0a;                 │  ║
║  │ --fg: #e4e4e4;                 │  ║
║  └────────────────────────────────┘  ║
║  [Copy CSS] [Copy Tailwind]          ║
╚══════════════════════════════════════╝
```

**Implementation**:
- Update `src/components/upload/UploadSection.tsx` - Add URL tab
- `src/components/upload/URLImport.tsx` - URL input + extract
- `src/utils/extractFromURL.ts` - Fetch + AI analysis

---

## 4. Library: AI Suggestions per Palette

**Nuvarande**:
```
Library → [List of saved palettes]
Click palette → [Preview + Edit/Delete]
```

**Med AI (suggestions badge)**:
```
Library → [List of saved palettes with AI badges]

╔══════════════════════════════════════╗
║  My Palettes                         ║
╠══════════════════════════════════════╣
║  Nordic Blue                         ║
║  ┌──────┬──────┬──────┐             ║
║  │ #0066│ #00cc│ #1a1a│             ║
║  │  ff  │  ff  │  1a  │  🤖 2       ║
║  └──────┴──────┴──────┘             ║
║  [Edit] [Delete]                     ║
║                                      ║
║  Hover "🤖 2":                       ║
║  ┌────────────────────────────────┐  ║
║  │ AI Suggestions:                │  ║
║  │ • Add accent #ff3366           │  ║
║  │ • Improve text contrast        │  ║
║  └────────────────────────────────┘  ║
╚══════════════════════════════════════╝
```

**Implementation**:
- `src/components/library/AISuggestionsBadge.tsx` - Badge med count
- `src/components/library/AISuggestionsTooltip.tsx` - Hover tooltip
- Run AI analysis when palette saved (background)

---

## 5. Projects: Brand Colors Generator

**Nuvarande**:
```
Projects → Create New → [Manual setup]
```

**Med AI (quick start)**:
```
Projects → Create New:

╔══════════════════════════════════════╗
║  New Project                         ║
╠══════════════════════════════════════╣
║  Name: [My SaaS Product          ]   ║
║                                      ║
║  ✨ Quick start with AI:             ║
║  Describe your brand:                ║
║  ┌────────────────────────────────┐  ║
║  │ Modern tech, trustworthy, blue │  ║
║  └────────────────────────────────┘  ║
║  [Generate Colors 🤖]                ║
║                                      ║
║  OR                                  ║
║  [Start with blank palette]          ║
╚══════════════════════════════════════╝

After "Generate Colors":
→ 3 palette variations
→ User picks one
→ Project created med chosen palette
```

**Implementation**:
- Update `src/components/projects/NewProjectModal.tsx`
- Add "AI Quick Start" section
- `src/utils/generateBrandColors.ts` - AI brand color generation

---

## AI Settings (User API Key)

**Settings page** (eller modal):
```
╔══════════════════════════════════════╗
║  ⚙️ AI Settings                      ║
╠══════════════════════════════════════╣
║  AI features are optional.           ║
║  Add your API key to unlock:         ║
║  • Deeper analysis                   ║
║  • Brand color generation            ║
║  • CSS extraction                    ║
║                                      ║
║  Provider: [OpenAI ▼]                ║
║  API Key: [sk-...] [Test]            ║
║                                      ║
║  Status: ✅ Connected                ║
║  Usage: 12 requests today            ║
║                                      ║
║  [Save]                              ║
╚══════════════════════════════════════╝
```

**Implementation**:
- `src/pages/Settings.tsx` - Settings page (new)
- `src/components/settings/AISettings.tsx` - AI config section
- Store API key in localStorage (encrypted)
- OR use Firebase (like existing auth)

---

## File Structure

```
src/
├── components/
│   ├── palette/
│   │   ├── AIEnhanceButton.tsx ← NEW
│   │   ├── AIAnalysisModal.tsx ← NEW
│   │   └── ColorHarmoniesWidget.tsx ← NEW
│   ├── upload/
│   │   ├── UploadSection.tsx (UPDATE - add URL tab)
│   │   └── URLImport.tsx ← NEW
│   ├── library/
│   │   ├── AISuggestionsBadge.tsx ← NEW
│   │   └── AISuggestionsTooltip.tsx ← NEW
│   ├── projects/
│   │   └── NewProjectModal.tsx (UPDATE - add AI quick start)
│   └── settings/
│       └── AISettings.tsx ← NEW
├── pages/
│   └── Settings.tsx ← NEW
├── utils/
│   ├── aiEnhance.ts ← NEW
│   ├── aiColorHarmonies.ts ← NEW
│   ├── extractFromURL.ts ← NEW
│   ├── generateBrandColors.ts ← NEW
│   └── aiClient.ts ← NEW (shared AI API calls)
└── prompts/
    ├── enhance.ts ← NEW
    ├── harmonies.ts ← NEW
    ├── extractURL.ts ← NEW
    └── brandColors.ts ← NEW
```

---

## Implementation Order

### Phase 1: Infrastructure (30 min)
1. ✅ `aiClient.ts` - Shared OpenAI/Anthropic client
2. ✅ `Settings.tsx` + `AISettings.tsx` - API key config
3. ✅ Store API key securely (localStorage encrypted OR Firebase)

### Phase 2: URL Import (45 min)
4. ✅ Update `UploadSection.tsx` - Add URL tab
5. ✅ `URLImport.tsx` - URL input + extract
6. ✅ `extractFromURL.ts` - Fetch CSS + AI analysis
7. ✅ `prompts/extractURL.ts` - AI prompt

### Phase 3: Color Harmonies (30 min)
8. ✅ `ColorHarmoniesWidget.tsx` - Collapsible widget
9. ✅ `aiColorHarmonies.ts` - API + Chroma.js fallback
10. ✅ `prompts/harmonies.ts` - AI prompt

### Phase 4: AI Enhance (45 min)
11. ✅ `AIEnhanceButton.tsx` - Button in palette editor
12. ✅ `AIAnalysisModal.tsx` - Modal with suggestions
13. ✅ `aiEnhance.ts` - AI analysis + apply
14. ✅ `prompts/enhance.ts` - AI prompt

### Phase 5: Brand Colors (30 min)
15. ✅ Update `NewProjectModal.tsx` - AI quick start
16. ✅ `generateBrandColors.ts` - AI generation
17. ✅ `prompts/brandColors.ts` - AI prompt

### Phase 6: Library Suggestions (30 min)
18. ✅ `AISuggestionsBadge.tsx` - Badge component
19. ✅ `AISuggestionsTooltip.tsx` - Tooltip
20. ✅ Background AI analysis on palette save

**Total**: ~3-4 hours

---

## AI Prompt Templates

### 1. AI Enhance (from image/palette)
```typescript
const enhancePrompt = `
Analyze this dark mode color palette:
${JSON.stringify(palette)}

Image context: ${imageAnalysis}

Provide:
1. Detected style (e.g., "Modern SaaS", "Gaming UI")
2. Mood assessment
3. Improvement suggestions:
   - Contrast fixes (WCAG AA + APCA)
   - Additional colors needed
   - Font pairing recommendations
4. Design system insights

Return JSON.
`;
```

### 2. Color Harmonies
```typescript
const harmoniesPrompt = `
Generate color harmonies for dark mode:
Primary: ${primary}
Background: ${background}

Return 5 harmony types:
1. Complementary (opposite on wheel)
2. Triadic (3 evenly spaced)
3. Analogous (adjacent)
4. Split-complementary
5. Tetradic (rectangle)

All colors must pass WCAG AA on ${background}.
Return JSON with hex codes + use cases.
`;
```

### 3. Extract from URL
```typescript
const extractURLPrompt = `
Analyze dark mode implementation from: ${url}

CSS provided:
${cssContent}

Extract:
1. Color palette (all colors used)
2. CSS variables (:root, [data-theme="dark"])
3. Design system insights:
   - Grid system
   - Typography scale
   - Spacing tokens
4. WCAG compliance check
5. Best practices used

Generate:
- Tailwind config equivalent
- Figma Tokens JSON
- Implementation notes

Return structured JSON.
`;
```

### 4. Brand Colors
```typescript
const brandColorsPrompt = `
Generate 3 dark mode color palette variations for:

Brand description: "${userInput}"
Industry: ${industry}
Style: ${style}
Mood: ${mood}

For each palette:
1. Name (creative, 2-3 words)
2. Colors:
   - Primary (brand identity)
   - Accent (CTAs)
   - Background (dark, WCAG AA)
   - Text (light, APCA Lc 90+)
3. Rationale (why these colors)

All colors WCAG AA + APCA compliant.
Return JSON.
`;
```

---

## Success Metrics

**Adoption**:
- % users who enable AI (add API key)
- % users who use AI features
- Most used feature (URL import vs harmonies vs enhance)

**Quality**:
- User accepts AI suggestions (click "Apply")
- Time saved (manual: 15 min → AI: 2 min)
- Accuracy (AI suggestions match user expectations)

**Engagement**:
- Avg AI requests per user per session
- Repeat usage (users come back for AI)

---

## Cost Management

**Free tier** (without API key):
- Basic color harmonies (Chroma.js fallback)
- No AI analysis

**With API key** (user pays):
- Full AI features
- User controls cost
- No rate limits

**Demo mode** (project API key):
- 10 free AI requests per day
- Show "Upgrade" message after limit

---

**Created**: 2026-02-12 22:08 PST  
**Approach**: AI integrated into existing features  
**Total work**: ~3-4 hours
