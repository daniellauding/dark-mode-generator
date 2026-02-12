# Dark Mode Best Practices Guide

A comprehensive checklist for creating beautiful, accessible dark mode designs.

Based on research from Material Design, Apple HIG, WCAG 3.0/APCA, and industry experts.

---

## Table of Contents

1. [Color Fundamentals](#color-fundamentals)
2. [Contrast & Accessibility](#contrast--accessibility)
3. [Typography](#typography)
4. [UI Elements](#ui-elements)
5. [Images & Media](#images--media)
6. [Common Mistakes](#common-mistakes)
7. [Testing Checklist](#testing-checklist)
8. [Implementation](#implementation)

---

## Color Fundamentals

### Background Colors

**✅ DO:**
- Use **#121212** (12% white) for primary background
  - Nearly as OLED-efficient as pure black
  - Avoids halation effect (text glow)
  - Reduces eye strain
  
- Use **elevation overlays** for depth:
  - Base: #121212
  - Raised +1dp: #1e1e1e (5% white overlay)
  - Raised +2dp: #232323 (7% white overlay)
  - Raised +4dp: #272727 (9% white overlay)
  - Raised +8dp: #2c2c2c (11% white overlay)

**❌ DON'T:**
- Pure black (#000000) — causes **halation** (text appears to glow)
- 50% gray (#808080) — too light for dark mode
- Random grays without system — inconsistent elevation

### Text Colors

**✅ DO:**
- Primary text: **#e4e4e4** (90% white)
  - Not pure white to reduce eye strain
  - High enough contrast for readability
  
- Secondary text: **#a3a3a3** (64% white)
  - For labels, captions, less important info
  
- Disabled text: **#6b6b6b** (42% white)

**❌ DON'T:**
- Pure white (#ffffff) — too harsh, causes eye strain
- Light grays (<40% white) — poor contrast, inaccessible

### Accent Colors

**✅ DO:**
- **Desaturate** by 10-30% compared to light mode
  - Light mode: #3b82f6 (blue, 76% saturation)
  - Dark mode: #60a5fa (blue, 65% saturation)
  
- Increase **lightness** by 10-20%
  - Makes colors pop against dark background
  - Better APCA contrast scores

- Use **200-tone** from color scales (not 500-tone)

**❌ DON'T:**
- Use same accent colors as light mode (too saturated)
- Use dark accents (e.g., dark blue on dark bg)
- Neon colors (eye strain, unprofessional)

### Color Palette Strategy

**Warm vs Cool Grays:**
- **Warm grays** (#2d2d2d) = friendly, inviting
  - Good for: Social apps, creative tools, consumer products
  
- **Cool grays** (#1e1e1e) = technical, professional
  - Good for: Developer tools, productivity apps, dashboards

**Choose one and stick with it!**

---

## Contrast & Accessibility

### WCAG 2.x is Broken for Dark Mode

Traditional contrast ratios (4.5:1, 7:1) **don't work well** for dark backgrounds.

**Use APCA (WCAG 3.0) instead:**

| Content | APCA Lc Score |
|---------|---------------|
| **Small text** (<18px) | **90+** |
| **Body text** (16-18px) | **60+** |
| **Large text** (>18px, bold) | **45+** |
| **Non-text** (icons, borders) | **30+** |

**Tools:**
- [APCA Calculator](https://www.myndex.com/APCA/)
- [Who Can Use](https://www.whocanuse.com/)
- [Accessible Colors](https://accessible-colors.com/)

### Examples (on #121212 background):

| Text Color | APCA Lc | Use Case |
|------------|---------|----------|
| #ffffff | 107 | ✅ Headings (too harsh for body) |
| #e4e4e4| 92 | ✅ Body text (sweet spot) |
| #a3a3a3 | 58 | ✅ Secondary text (large only) |
| #6b6b6b | 32 | ⚠️ Disabled only |

---

## Typography

### Font Weight

**✅ DO:**
- **Increase font-weight by 1 step** in dark mode
  - Light mode Regular (400) → Dark mode Medium (500)
  - Light mode Medium (500) → Dark mode Semibold (600)
  
- Reason: Halation effect makes text appear thinner
  - Extra weight compensates

**❌ DON'T:**
- Use same weights as light mode (text looks too thin)
- Go bold everywhere (reduces hierarchy)

### Font Size

**✅ DO:**
- Keep sizes same as light mode (mostly)
- Increase small text (<14px) by 1-2px if readability suffers

**❌ DON'T:**
- Make everything larger (breaks layout)

### Line Height

**✅ DO:**
- Maintain 1.5+ line-height (WCAG requirement)
- Increase to 1.6-1.7 for dense text

**❌ DON'T:**
- Reduce line-height in dark mode (harder to read)

---

## UI Elements

### Buttons

**Primary Button:**
- Background: Accent color (e.g., #60a5fa)
- Text: #121212 (dark on light)
- Hover: Lighten by 10% (#76b5fb)

**Secondary Button:**
- Background: Transparent
- Border: 1px solid #3d3d3d
- Text: #e4e4e4
- Hover: Background #1e1e1e

**Ghost Button:**
- Background: Transparent
- Text: #60a5fa
- Hover: Background #1e1e1e

### Inputs

**Default:**
- Background: #1e1e1e
- Border: 1px solid #3d3d3d
- Text: #e4e4e4
- Placeholder: #6b6b6b

**Focus:**
- Border: 2px solid #60a5fa
- Glow: 0 0 0 3px rgba(96, 165, 250, 0.2)

**Error:**
- Border: 2px solid #f87171
- Background: rgba(248, 113, 113, 0.1)

### Cards

**Use elevation overlays:**
- Card on base: #1e1e1e (5% white)
- Nested card: #232323 (7% white)

**Don't use:**
- Drop shadows (invisible on dark)
- Use subtle outlines instead: 1px solid #2d2d2d

### Dividers

**✅ DO:**
- Use #2d2d2d (18% white) for subtle dividers
- Use #3d3d3d (24% white) for prominent dividers

**❌ DON'T:**
- Pure black borders (invisible)
- Light gray borders (too harsh)

---

## Images & Media

### Photos

**✅ DO:**
- **Reduce opacity to 80-90%** in dark mode
  - Prevents overly bright images from dominating
  
- Or use **separate dark-optimized versions**
  - Slightly desaturated
  - Reduced brightness

**❌ DON'T:**
- Show full-brightness photos (eye strain, harsh)

### Icons

**✅ DO:**
- **Increase stroke-weight by 0.5-1px** in dark mode
  - Icons appear thinner due to halation
  
- Use **outlined** icons (not filled) for better visibility

**❌ DON'T:**
- Use same icon weights as light mode

### Illustrations

**✅ DO:**
- Create dark-specific versions
- Reduce saturation by 20%
- Add subtle glows for depth

**❌ DON'T:**
- Just invert colors (looks bad)

---

## Common Mistakes

### ❌ Mistake #1: Pure Black Background (#000)
**Problem:** Halation effect (text appears to glow)  
**Fix:** Use #121212 (12% white)

### ❌ Mistake #2: Same Colors as Light Mode
**Problem:** Too saturated, poor contrast  
**Fix:** Desaturate by 10-30%, use lighter shades

### ❌ Mistake #3: Pure White Text (#fff)
**Problem:** Eye strain, too harsh  
**Fix:** Use #e4e4e4 (90% white)

### ❌ Mistake #4: No Elevation System
**Problem:** Flat, no depth perception  
**Fix:** Use Material Design overlays (5%, 7%, 9%, 11%)

### ❌ Mistake #5: Drop Shadows
**Problem:** Invisible on dark backgrounds  
**Fix:** Use outlines or subtle glows

### ❌ Mistake #6: Ignoring APCA
**Problem:** Poor accessibility  
**Fix:** Validate all text with APCA (60+ body, 90+ small)

### ❌ Mistake #7: Same Font Weights
**Problem:** Text looks thin  
**Fix:** Increase weight by 1 step

### ❌ Mistake #8: Full-Brightness Images
**Problem:** Eye strain, dominates UI  
**Fix:** Reduce opacity to 80-90%

### ❌ Mistake #9: No Testing with Real Users
**Problem:** Missed issues  
**Fix:** Test with VoiceOver, keyboard, color blind simulators

### ❌ Mistake #10: Auto-Dark (Simple Invert)
**Problem:** Looks terrible  
**Fix:** Manual color mapping with design system

---

## Testing Checklist

### Visual Testing

- [ ] **View on OLED screen** (iPhone, Samsung) — check for smearing
- [ ] **View on LCD** (most monitors) — check contrast
- [ ] **Test at night** in low light — eye strain check
- [ ] **Test at 200% zoom** — still readable?
- [ ] **Test on projector** (if applicable) — visibility check

### Accessibility Testing

- [ ] **APCA validation** for all text (use [Myndex APCA](https://www.myndex.com/APCA/))
  - Body text: 60+
  - Small text: 90+
  
- [ ] **Screen reader** (VoiceOver, NVDA)
  - No color-only meaning (icons + text)
  
- [ ] **Keyboard navigation**
  - Visible focus indicators (2px ring, high contrast)
  
- [ ] **Color blind simulation** (Chromatic Vision Simulator)
  - Deuteranopia (red-green)
  - Protanopia (red-green)
  - Tritanopia (blue-yellow)
  
- [ ] **Reduced motion** support
  - Respect `prefers-reduced-motion: reduce`

### Browser/Device Testing

- [ ] **Chrome** (desktop + mobile)
- [ ] **Safari** (macOS + iOS)
- [ ] **Firefox**
- [ ] **Edge**
- [ ] **Android** (Chrome, Samsung Internet)
- [ ] **High-contrast mode** (Windows)

### Performance

- [ ] **OLED battery life** — dark mode should save power
- [ ] **Image loading** — optimized dark versions?

---

## Implementation

### CSS

**Using Custom Properties:**

```css
:root {
  /* Light mode (default) */
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --accent-primary: #3b82f6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #121212;
    --text-primary: #e4e4e4;
    --accent-primary: #60a5fa;
  }
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

**Manual Toggle:**

```css
[data-theme="dark"] {
  --bg-primary: #121212;
  --text-primary: #e4e4e4;
  --accent-primary: #60a5fa;
}
```

```javascript
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

### React Native

```typescript
import { useColorScheme, Appearance } from 'react-native';

function App() {
  const colorScheme = useColorScheme(); // 'light' | 'dark'
  
  const colors = colorScheme === 'dark' ? {
    background: '#121212',
    text: '#e4e4e4',
    accent: '#60a5fa',
  } : {
    background: '#ffffff',
    text: '#111827',
    accent: '#3b82f6',
  };
  
  return <View style={{ backgroundColor: colors.background }} />;
}
```

### Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        'dm-bg': '#121212',
        'dm-surface': '#1e1e1e',
        'dm-text': '#e4e4e4',
        'dm-accent': '#60a5fa',
      }
    }
  }
}
```

```html
<div class="bg-white dark:bg-dm-bg text-gray-900 dark:text-dm-text">
  Dark mode aware!
</div>
```

---

## Quick Reference

### Color Palette Template

```
Background (Elevation):
- Base:     #121212 (0dp)
- Surface:  #1e1e1e (+1dp, 5% white)
- Raised:   #232323 (+2dp, 7% white)
- Higher:   #2c2c2c (+8dp, 11% white)

Text:
- Primary:   #e4e4e4 (90% white, APCA 92)
- Secondary: #a3a3a3 (64% white, APCA 58)
- Disabled:  #6b6b6b (42% white, APCA 32)

Accent (Blue):
- Light mode: #3b82f6 (500)
- Dark mode:  #60a5fa (400, desaturated)

Borders:
- Subtle:    #2d2d2d (18% white)
- Prominent: #3d3d3d (24% white)

Success:  #34d399 (green-400)
Error:    #f87171 (red-400)
Warning:  #fbbf24 (amber-400)
```

### APCA Thresholds (Quick Ref)

| Content | Min APCA | Example Color |
|---------|----------|---------------|
| Small text (<18px) | 90+ | #e4e4e4 on #121212 |
| Body text (16-18px) | 60+ | #a3a3a3 on #121212 |
| Large text (>18px bold) | 45+ | #8b8b8b on #121212 |
| Non-text (icons) | 30+ | #6b6b6b on #121212 |

---

## Resources

**Standards:**
- [WCAG 3.0 APCA](https://www.w3.org/WAI/WCAG3/APCA/)
- [Material Design Dark Theme](https://material.io/design/color/dark-theme.html)
- [Apple Human Interface Guidelines - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

**Tools:**
- [APCA Contrast Calculator](https://www.myndex.com/APCA/)
- [Accessible Colors](https://accessible-colors.com/)
- [Who Can Use](https://www.whocanuse.com/)
- [Color Review](https://color.review/)
- [Chromatic Vision Simulator](https://asada.website/webCVS/)

**Further Reading:**
- [Dark Mode UX Best Practices](https://uxdesign.cc/dark-mode-ui-design-best-practices-8dce3a1f9e06)
- [Why Dark Mode Causes More Accessibility Issues Than It Solves](https://jessbudd.com/blog/dark-mode-accessibility-issues/)
- [The Science of Color Contrast](https://www.myndex.com/APCA/)

---

**Built by:** Dark Mode Generator Team  
**Last updated:** February 2026  
**License:** CC BY 4.0
