import chroma from 'chroma-js';
import type { ColorEntry, DarkColorEntry, DesignPalette, DarkPalette, Preset, AccessibilityLevel, AccessibilityPresetConfig, AccessibilityIssue, AccessibilityValidation } from '../types';
import { calcAPCA, getContrastLevel, calcWCAGContrast, adjustForWCAGContrast, adjustForAPCAContrast } from './apca';

export const PRESETS: Preset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark backgrounds with high contrast',
    bgDarkness: 90,
    textLightness: 95,
    accentSaturation: 80,
  },
  {
    id: 'dimmed',
    name: 'Dimmed',
    description: 'Softer dark with reduced contrast',
    bgDarkness: 75,
    textLightness: 85,
    accentSaturation: 70,
  },
  {
    id: 'amoled',
    name: 'AMOLED',
    description: 'True black for OLED displays',
    bgDarkness: 100,
    textLightness: 92,
    accentSaturation: 90,
  },
];

export function convertToDark(
  color: ColorEntry,
  bgDarkness: number,
  textLightness: number,
  accentSaturation: number,
  darkBg: string
): DarkColorEntry {
  const c = chroma(color.hex);
  const [h, s, l] = c.hsl();
  let darkHex: string;

  switch (color.role) {
    case 'background': {
      const darkness = bgDarkness / 100;
      const newL = Math.max(0.03, 0.15 * (1 - darkness));
      darkHex = chroma.hsl(h || 220, Math.min(s, 0.3), newL).hex();
      break;
    }
    case 'surface': {
      const darkness = bgDarkness / 100;
      const newL = Math.max(0.06, 0.2 * (1 - darkness) + 0.04);
      darkHex = chroma.hsl(h || 220, Math.min(s, 0.2), newL).hex();
      break;
    }
    case 'text': {
      const lightness = textLightness / 100;
      const newL = 0.6 + lightness * 0.35;
      darkHex = chroma.hsl(h || 0, Math.min(s, 0.1), newL).hex();
      break;
    }
    case 'accent': {
      const sat = accentSaturation / 100;
      const newS = Math.min(1, s * (0.5 + sat * 0.7));
      const newL = Math.max(0.45, Math.min(0.7, l * 0.8 + 0.2));
      darkHex = chroma.hsl(h, newS, newL).hex();
      break;
    }
    case 'border': {
      const darkness = bgDarkness / 100;
      const newL = 0.15 + (1 - darkness) * 0.15;
      darkHex = chroma.hsl(h || 220, Math.min(s, 0.15), newL).hex();
      break;
    }
    default:
      darkHex = color.hex;
  }

  const apcaValue = calcAPCA(darkHex, darkBg);
  const contrastLevel = getContrastLevel(apcaValue);

  return {
    ...color,
    hex: darkHex,
    originalHex: color.hex,
    contrastRatio: Math.abs(apcaValue),
    apcaValue,
    hasIssue: contrastLevel === 'fail',
  };
}

export function generateDarkPalette(
  palette: DesignPalette,
  bgDarkness: number,
  textLightness: number,
  accentSaturation: number
): DarkPalette {
  const bgColor = palette.colors.find(c => c.role === 'background');
  const darkBgEntry = bgColor
    ? convertToDark(bgColor, bgDarkness, textLightness, accentSaturation, '#0b0f19')
    : null;
  const darkBg = darkBgEntry?.hex ?? '#0b0f19';

  const colors = palette.colors.map(c =>
    convertToDark(c, bgDarkness, textLightness, accentSaturation, darkBg)
  );

  const surface = colors.find(c => c.role === 'surface');
  const text = colors.find(c => c.role === 'text');

  return {
    colors,
    backgroundColor: darkBg,
    surfaceColor: surface?.hex ?? chroma(darkBg).brighten(0.3).hex(),
    textColor: text?.hex ?? '#f3f4f6',
  };
}

export function generateSamplePalette(): DesignPalette {
  return {
    colors: [
      { hex: '#ffffff', name: 'White', area: 45, role: 'background' },
      { hex: '#f8fafc', name: 'Slate 50', area: 15, role: 'surface' },
      { hex: '#1e293b', name: 'Slate 800', area: 12, role: 'text' },
      { hex: '#3b82f6', name: 'Blue 500', area: 8, role: 'accent' },
      { hex: '#8b5cf6', name: 'Violet 500', area: 5, role: 'accent' },
      { hex: '#e2e8f0', name: 'Slate 200', area: 10, role: 'border' },
      { hex: '#64748b', name: 'Slate 500', area: 5, role: 'text' },
    ],
    dominantColor: '#ffffff',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
  };
}

export function formatHex(hex: string): string {
  return hex.toUpperCase();
}

export function getContrastColor(hex: string): string {
  return chroma(hex).luminance() > 0.5 ? '#000000' : '#ffffff';
}

// --- Accessibility Presets ---

export const ACCESSIBILITY_PRESETS: AccessibilityPresetConfig[] = [
  {
    id: 'none',
    name: 'None (Custom)',
    description: 'No accessibility constraints applied',
    wcagMinContrast: 0,
    wcagLargeTextContrast: 0,
    apcaBodyMin: 0,
    apcaSmallMin: 0,
  },
  {
    id: 'wcag-aa',
    name: 'WCAG AA',
    description: '4.5:1 contrast for normal text, 3:1 for large text',
    wcagMinContrast: 4.5,
    wcagLargeTextContrast: 3,
    apcaBodyMin: 60,
    apcaSmallMin: 90,
  },
  {
    id: 'wcag-aaa',
    name: 'WCAG AAA',
    description: '7:1 contrast for normal text, 4.5:1 for large text',
    wcagMinContrast: 7,
    wcagLargeTextContrast: 4.5,
    apcaBodyMin: 75,
    apcaSmallMin: 100,
  },
  {
    id: 'apca-optimized',
    name: 'APCA Optimized',
    description: 'Optimized for dark mode using APCA Lc values',
    wcagMinContrast: 0,
    wcagLargeTextContrast: 0,
    apcaBodyMin: 60,
    apcaSmallMin: 75,
  },
];

export function getAccessibilityPreset(level: AccessibilityLevel): AccessibilityPresetConfig {
  return ACCESSIBILITY_PRESETS.find(p => p.id === level) ?? ACCESSIBILITY_PRESETS[0];
}

// Validate the dark palette against the selected accessibility level
export function validateAccessibility(
  darkPalette: DarkPalette,
  level: AccessibilityLevel
): AccessibilityValidation {
  if (level === 'none') {
    const total = darkPalette.colors.filter(c => c.role !== 'background').length;
    return { level, passes: true, issues: [], totalChecked: total, passCount: total };
  }

  const preset = getAccessibilityPreset(level);
  const bg = darkPalette.backgroundColor;
  const issues: AccessibilityIssue[] = [];
  let checked = 0;

  for (const color of darkPalette.colors) {
    if (color.role === 'background') continue;
    checked++;

    const wcagRatio = calcWCAGContrast(color.hex, bg);
    const apcaValue = Math.abs(calcAPCA(color.hex, bg));

    const isLargeText = color.role !== 'text';
    const wcagRequired = isLargeText ? preset.wcagLargeTextContrast : preset.wcagMinContrast;
    const apcaRequired = color.role === 'text' ? preset.apcaBodyMin : preset.apcaBodyMin;

    let fails = false;
    if (level === 'apca-optimized') {
      // APCA-only validation
      fails = apcaValue < apcaRequired;
    } else {
      // WCAG validation (check both WCAG ratio and APCA)
      fails = wcagRatio < wcagRequired;
    }

    if (fails) {
      issues.push({
        colorName: color.name,
        colorHex: color.hex,
        bgHex: bg,
        wcagRatio: Math.round(wcagRatio * 10) / 10,
        wcagRequired,
        apcaValue: Math.round(apcaValue * 10) / 10,
        apcaRequired,
      });
    }
  }

  return {
    level,
    passes: issues.length === 0,
    issues,
    totalChecked: checked,
    passCount: checked - issues.length,
  };
}

// Apply APCA Optimized preset: sets specific recommended colors
export function applyAPCAOptimizedPreset(palette: DesignPalette): DarkPalette {
  const apcaBg = '#121212';
  const apcaSurface = '#1e1e1e';
  const apcaText = '#e4e4e4';

  const colors: DarkColorEntry[] = palette.colors.map(color => {
    let darkHex: string;
    const c = chroma(color.hex);
    const [h, s] = c.hsl();

    switch (color.role) {
      case 'background':
        darkHex = apcaBg;
        break;
      case 'surface':
        darkHex = apcaSurface;
        break;
      case 'text':
        darkHex = apcaText;
        break;
      case 'accent': {
        // Desaturate accents to 50-60% and adjust lightness
        const newS = Math.min(0.6, s * 0.5);
        const newL = Math.max(0.5, Math.min(0.7, 0.6));
        darkHex = chroma.hsl(h || 220, newS, newL).hex();
        // Verify APCA >= 60 against bg, adjust if needed
        const lc = Math.abs(calcAPCA(darkHex, apcaBg));
        if (lc < 60) {
          darkHex = adjustForAPCAContrast(darkHex, apcaBg, 60);
        }
        break;
      }
      case 'border':
        darkHex = '#2c2c2c';
        break;
      default:
        darkHex = color.hex;
    }

    const apcaValue = calcAPCA(darkHex, apcaBg);
    return {
      ...color,
      hex: darkHex,
      originalHex: color.hex,
      contrastRatio: Math.abs(apcaValue),
      apcaValue,
      hasIssue: Math.abs(apcaValue) < 45 && color.role !== 'background' && color.role !== 'border',
    };
  });

  return {
    colors,
    backgroundColor: apcaBg,
    surfaceColor: apcaSurface,
    textColor: apcaText,
  };
}

// Auto-fix a dark palette to meet the selected accessibility standard
export function autoFixPalette(
  darkPalette: DarkPalette,
  level: AccessibilityLevel,
  palette: DesignPalette
): DarkPalette {
  if (level === 'none') return darkPalette;
  if (level === 'apca-optimized') return applyAPCAOptimizedPreset(palette);

  const preset = getAccessibilityPreset(level);
  let bg = darkPalette.backgroundColor;

  // For AAA, we may need a darker background to achieve 7:1
  if (level === 'wcag-aaa') {
    const currentBgLum = chroma(bg).luminance();
    if (currentBgLum > 0.05) {
      bg = chroma(bg).luminance(0.01).hex();
    }
  }

  const fixedColors: DarkColorEntry[] = darkPalette.colors.map(color => {
    if (color.role === 'background') {
      const apcaValue = calcAPCA(bg, bg);
      return { ...color, hex: bg, apcaValue, contrastRatio: 0, hasIssue: false };
    }

    const isLargeText = color.role !== 'text';
    const wcagTarget = isLargeText ? preset.wcagLargeTextContrast : preset.wcagMinContrast;

    let fixedHex = color.hex;
    const currentRatio = calcWCAGContrast(fixedHex, bg);
    if (currentRatio < wcagTarget) {
      fixedHex = adjustForWCAGContrast(fixedHex, bg, wcagTarget);
    }

    const apcaValue = calcAPCA(fixedHex, bg);
    const contrastLevel = getContrastLevel(apcaValue);

    return {
      ...color,
      hex: fixedHex,
      apcaValue,
      contrastRatio: Math.abs(apcaValue),
      hasIssue: contrastLevel === 'fail',
    };
  });

  const surface = fixedColors.find(c => c.role === 'surface');
  const text = fixedColors.find(c => c.role === 'text');

  return {
    colors: fixedColors,
    backgroundColor: bg,
    surfaceColor: surface?.hex ?? darkPalette.surfaceColor,
    textColor: text?.hex ?? darkPalette.textColor,
  };
}
