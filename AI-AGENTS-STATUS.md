# Dark Mode Generator - AI Features Agent Status

**Spec**: `/Users/lume/Work/dark-mode-generator/AI-FEATURES-SPEC.md` (15KB)  
**Spawned**: 2026-02-12 22:05 PST  
**Total Agents**: 4 (all running in parallel)

---

## 🏃 Active Agents (4/4)

### 1. ai-brand-colors 🤖
**Tmux**: `ai-brand-colors`  
**Status**: 🟢 Running  
**Priority**: High  
**Task**: Brand-to-Colors AI generator  

**What it builds**:
- Användare beskriver varumärke → AI genererar 3 färgpaletter
- Input: "Modern tech startup, trustworthy, Scandinavian"
- Output: 3 varianter med namn, färger, rationale
- Alla färger WCAG AA + APCA validerade

**Deliverables**:
- `src/pages/BrandColors.tsx` - New page
- `src/components/ai/BrandColorsGenerator.tsx` - Main component
- `src/components/ai/BrandInput.tsx` - Description input
- `src/components/ai/PaletteVariations.tsx` - Show 3 variations
- `src/utils/aiBrandColors.ts` - API calls
- `src/prompts/brandColors.ts` - AI prompt template

**ETA**: 15-20 min

---

### 2. ai-color-harmonies 🎨
**Tmux**: `ai-color-harmonies`  
**Status**: 🟢 Running  
**Priority**: High  
**Task**: Complementary Colors Generator  

**What it builds**:
- Analysera befintlig palett → föreslå färgharmonier
- Complementary (opposite on wheel)
- Triadic (3 evenly spaced)
- Analogous (adjacent colors)
- Split-complementary
- Tetradic (rectangle)

**Deliverables**:
- `src/components/ai/ColorHarmonies.tsx` - Harmonies widget
- `src/components/ai/HarmonyCard.tsx` - Individual harmony card
- `src/utils/aiColorHarmonies.ts` - API + fallback (Chroma.js)
- `src/prompts/colorHarmonies.ts` - AI prompt

**ETA**: 10-15 min

---

### 3. ai-brand-check ✅
**Tmux**: `ai-brand-check`  
**Status**: 🟢 Running  
**Priority**: Medium  
**Task**: Brand Consistency Checker  

**What it builds**:
- Ladda upp logotyp eller paste brand colors
- AI jämför mot current dark mode palette
- Consistency score (0-100%)
- Föreslår justeringar för bättre alignment

**Deliverables**:
- `src/pages/BrandCheck.tsx` - New page
- `src/components/ai/BrandConsistencyChecker.tsx` - Main component
- `src/components/ai/LogoUpload.tsx` - Image upload
- `src/components/ai/ConsistencyReport.tsx` - Results display
- `src/utils/aiBrandCheck.ts` - API + image analysis
- `src/prompts/brandCheck.ts` - AI prompt

**ETA**: 20-25 min

---

### 4. ai-extract-css 🔍
**Tmux**: `ai-extract-css`  
**Status**: 🟢 Running  
**Priority**: High  
**Task**: Extract CSS from URL  

**What it builds**:
- Input URL (linear.app, vercel.com, etc)
- AI extraherar dark mode CSS
- Visar:
  - CSS Variables (`:root`)
  - Media queries (`@media (prefers-color-scheme: dark)`)
  - Tailwind config equivalent
  - Extracted color palette
- Copy buttons för allt

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

## 📈 Progress Tracking

Kör dessa kommandon för att kolla status:

```bash
# Se alla aktiva sessions
./skills/tmux-agents/scripts/status.sh

# Kolla specifik agent
./skills/tmux-agents/scripts/check.sh ai-brand-colors

# Attach till en agent för att se live
tmux attach -t ai-extract-css
# (Ctrl+B, sedan D för att lämna)
```

---

## 🎯 Success Criteria

**Phase 1 Complete (Brand Colors)** när:
- ✅ User kan beskriva varumärke
- ✅ AI genererar 3 färgpaletter
- ✅ Alla färger WCAG AA compliant
- ✅ "Use This" knapp importerar till palette

**Phase 2 Complete (Harmonies)** när:
- ✅ User ser färgharmonier för current palette
- ✅ 5 harmony types visas (complementary, triadic, etc)
- ✅ "Add to Palette" knapp fungerar
- ✅ Fallback till Chroma.js om API fails

**Phase 3 Complete (Brand Check)** när:
- ✅ User kan ladda upp logotyp
- ✅ AI extraherar brand colors från bild
- ✅ Consistency score visas (0-100%)
- ✅ Suggestions för bättre alignment

**Phase 4 Complete (Extract CSS)** när:
- ✅ User kan paste URL
- ✅ AI extraherar CSS variables
- ✅ Tailwind config genereras
- ✅ Color palette importeras
- ✅ Copy buttons fungerar

---

## 🚀 Next Steps (efter agents är klara)

1. **Review output från varje agent** (check.sh)
2. **Test locally** - Browse http://localhost:5173
3. **Test AI features**:
   - Brand Colors: "Modern SaaS, trustworthy, blue/purple"
   - Harmonies: Load existing palette → click "Find Harmonies"
   - Brand Check: Upload logo → see consistency score
   - Extract CSS: Paste https://linear.app → extract variables
4. **Fix bugs** om några hittas
5. **Update navigation** - Add links to new pages
6. **Deploy to Netlify** (production)
7. **User testing** - Get feedback on AI quality

---

## 💰 Cost Estimation

**Development** (4 agents × 20 min avg):
- Estimated tokens: ~400K input + ~100K output
- Estimated cost: ~$6-8

**Production usage** (per user/month):
- 10 AI requests average
- GPT-4o: ~$0.20/month
- Claude Sonnet: ~$0.15/month

**Free tier** (project pays):
- 100 users × 10 requests = 1,000 requests/month
- Total cost: ~$20/month

---

## 🔒 Security & Rate Limiting

**Current approach** (MVP):
- Use project's OpenAI/Anthropic API key
- Rate limit: 10 requests/day (free users), 50/day (authenticated)
- Cost tracking in Firebase

**Future** (user API keys):
- Let users add own API keys (encrypted with AES-256)
- No rate limits for users with own keys
- Same infrastructure as Vromm AI (if implemented)

---

## 📊 Expected File Structure

```
dark-mode-generator/
├── src/
│   ├── pages/
│   │   ├── BrandColors.tsx ← NEW
│   │   ├── BrandCheck.tsx ← NEW
│   │   └── ExtractCSS.tsx ← NEW
│   ├── components/
│   │   └── ai/ ← NEW FOLDER
│   │       ├── BrandColorsGenerator.tsx
│   │       ├── BrandInput.tsx
│   │       ├── PaletteVariations.tsx
│   │       ├── ColorHarmonies.tsx
│   │       ├── HarmonyCard.tsx
│   │       ├── BrandConsistencyChecker.tsx
│   │       ├── LogoUpload.tsx
│   │       ├── ConsistencyReport.tsx
│   │       ├── CSSExtractor.tsx
│   │       ├── URLInput.tsx
│   │       └── ExtractedCode.tsx
│   ├── utils/
│   │   ├── aiBrandColors.ts
│   │   ├── aiColorHarmonies.ts
│   │   ├── aiBrandCheck.ts
│   │   └── aiExtractCSS.ts
│   └── prompts/ ← NEW FOLDER
│       ├── brandColors.ts
│       ├── colorHarmonies.ts
│       ├── brandCheck.ts
│       └── extractCSS.ts
└── supabase/
    └── functions/
        └── extract-css-proxy/ ← NEW (if needed for CORS)
            └── index.ts
```

**Total new files expected**: ~25-30 filer

---

## 🎨 Navigation Update

Add AI section to header:

```tsx
<nav>
  <Link to="/">Generator</Link>
  <Link to="/library">Library</Link>
  <Link to="/projects">Projects</Link>
  <Link to="/guide">Guide</Link>
  
  {/* AI FEATURES */}
  <div className="border-l pl-4 ml-4">
    <span className="text-xs uppercase tracking-wide text-gray-500">AI Tools</span>
    <Link to="/brand-colors">🤖 Brand Colors</Link>
    <Link to="/brand-check">✅ Brand Check</Link>
    <Link to="/extract-css">🔍 Extract CSS</Link>
  </div>
</nav>
```

Color Harmonies visas inline som widget när user har palette loaded.

---

**Skapad**: 2026-02-12 22:05 PST  
**Uppdaterad**: 2026-02-12 22:05 PST  
**Status**: 🟢 Alla 4 agenter spawnade och kör
