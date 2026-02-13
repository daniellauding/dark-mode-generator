# Agent Brief: accessibility-presets

**Role:** Frontend + Algorithm Developer (Accessibility)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Add 3 accessibility-focused presets (WCAG AA, AAA, APCA Optimized) with auto-fix.

## Prerequisites

- Wait for `palette-crud` (creates Preview page with presets)

## Tasks

1. **Add Accessibility Dropdown** (`src/pages/Preview.tsx`)
   - Below existing presets (Midnight, Dimmed, AMOLED)
   - Dropdown: "Accessibility Level"
   - Options:
     - None (custom)
     - WCAG AA
     - WCAG AAA
     - APCA Optimized

2. **Implement WCAG AA Preset**
   - **Rules:**
     - Text-on-background: 4.5:1 contrast ratio (WCAG 2.1)
     - Large text (18px+): 3:1 contrast ratio
     - APCA: 60+ for body text, 90+ for small text
   - **Algorithm:**
     - Check each text color against background
     - If fails, adjust lightness until passes
     - Use chroma.js `contrast()` function
   - **Apply:**
     - Adjust `textLightness` slider automatically
     - Show validation badge: "✅ Passes WCAG AA"

3. **Implement WCAG AAA Preset**
   - **Rules:**
     - Text-on-background: 7:1 contrast ratio
     - Large text: 4.5:1 contrast ratio
     - APCA: 75+ for body text, 100+ for small text
   - **Algorithm:**
     - More aggressive adjustments than AA
     - May need to darken background OR lighten text
   - **Apply:**
     - Adjust both background + text if needed
     - Show badge: "✅ Passes WCAG AAA"

4. **Implement APCA Optimized Preset**
   - **Rules:**
     - Ignore WCAG 2.x ratios entirely
     - Use only APCA Lc values
     - Recommended colors from guide:
       - Background: `#121212` (not pure black)
       - Text: `#e4e4e4` (not pure white)
       - Accents: Desaturated (200-tone instead of 500-tone)
   - **Algorithm:**
     - Set background to #121212
     - Set text to #e4e4e4
     - Adjust accent saturation to 50-60%
     - Ensure APCA Lc ≥ 60 for body, ≥ 75 for headings
   - **Apply:**
     - Override all sliders
     - Show badge: "✅ APCA Optimized"

5. **Real-time Validation Badge**
   - Show badge above preview:
     - ✅ "Passes WCAG AA" (green)
     - ❌ "Fails WCAG AA (3 colors need adjustment)" (red)
   - Click badge → Highlight failing colors
   - Show which colors fail (e.g., "Accent on background: 2.8:1, needs 4.5:1")

6. **Auto-Fix Button**
   - Below validation badge
   - "Auto-Fix" button (only if validation fails)
   - Click to automatically adjust colors to pass selected preset
   - Show before/after preview (side-by-side)
   - Confirm with "Apply" or "Cancel"

7. **APCA Calculation**
   - Use existing APCA utils from project
   - Check: `src/utils/apca.ts` (should exist from initial setup)
   - If not, create:
     ```ts
     calculateAPCA(bgColor, textColor): number // Returns Lc value
     ```
   - Use formula from: https://git.apcacontrast.com/

8. **Testing**
   - Test with real color palettes:
     - Light blue on white (should fail AA)
     - Dark gray on black (should fail AAA)
     - #e0e0e0 on #121212 (should pass APCA Optimized)
   - Verify auto-fix adjusts colors correctly

## Expected Deliverables

- ✅ Accessibility dropdown on Preview page
- ✅ WCAG AA preset (4.5:1 contrast)
- ✅ WCAG AAA preset (7:1 contrast)
- ✅ APCA Optimized preset (#121212 bg, #e4e4e4 text)
- ✅ Real-time validation badge (✅ or ❌)
- ✅ "Auto-Fix" button with before/after preview
- ✅ APCA calculation utils
- ✅ Build succeeds

## Success Criteria

- User can select WCAG AA and colors auto-adjust
- User can select WCAG AAA and colors pass 7:1
- User can select APCA Optimized and get #121212/#e4e4e4
- Validation badge shows pass/fail status
- Auto-Fix button fixes failing colors
- All APCA scores are calculated correctly

## References

- APCA Calculator: https://www.myndex.com/APCA/
- WCAG 2.1 Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Chroma.js contrast: https://gka.github.io/chroma.js/#chroma-contrast
- Dark mode guide: `DARK-MODE-GUIDE.md` (in project root)

---

**Start now!** 🔥
