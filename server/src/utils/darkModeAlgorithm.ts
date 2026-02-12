import { ExtractedColor, DarkColor, ContrastIssue, DarkModePreset } from '../types';

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Preset configurations
const PRESETS: Record<DarkModePreset, { bgLightness: number; saturationBoost: number; contrastMultiplier: number }> = {
  default: { bgLightness: 12, saturationBoost: 0.85, contrastMultiplier: 1.0 },
  'high-contrast': { bgLightness: 8, saturationBoost: 0.9, contrastMultiplier: 1.2 },
  amoled: { bgLightness: 0, saturationBoost: 0.8, contrastMultiplier: 1.1 },
};

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6; break;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Invert luminance for dark mode while preserving hue and adjusting saturation.
 * Background colors get very dark, text colors get light, accents are preserved.
 */
function invertForDarkMode(color: ExtractedColor, preset: DarkModePreset): DarkColor {
  const config = PRESETS[preset];
  const hsl = rgbToHsl(color.rgb);
  let newHsl: HSL;

  switch (color.role) {
    case 'background': {
      // Backgrounds become very dark
      newHsl = { h: hsl.h, s: hsl.s * 0.3, l: config.bgLightness };
      break;
    }
    case 'text': {
      // Text becomes light (invert luminance)
      const invertedL = 100 - hsl.l;
      newHsl = { h: hsl.h, s: hsl.s * 0.5, l: Math.max(invertedL, 85) };
      break;
    }
    case 'primary':
    case 'accent': {
      // Keep hue, desaturate slightly, adjust brightness for dark bg
      const targetL = Math.min(Math.max(hsl.l, 45), 65);
      newHsl = { h: hsl.h, s: hsl.s * config.saturationBoost, l: targetL };
      break;
    }
    case 'secondary': {
      const targetL = Math.min(Math.max(100 - hsl.l, 35), 55);
      newHsl = { h: hsl.h, s: hsl.s * config.saturationBoost * 0.8, l: targetL };
      break;
    }
    case 'border': {
      // Borders become subtle in dark mode
      newHsl = { h: hsl.h, s: hsl.s * 0.2, l: 20 };
      break;
    }
    default: {
      // Generic inversion
      newHsl = { h: hsl.h, s: hsl.s * config.saturationBoost, l: 100 - hsl.l };
    }
  }

  const newRgb = hslToRgb(newHsl);
  const newHex = rgbToHex(newRgb);

  return {
    ...color,
    hex: newHex,
    rgb: newRgb,
    hsl: newHsl,
    originalHex: color.hex,
    adjustments: {
      luminanceInverted: true,
      saturationAdjusted: config.saturationBoost,
      contrastValidated: false, // Will be set after APCA check
    },
  };
}

/**
 * Convert an array of light-mode colors to dark-mode equivalents.
 */
export function convertToDarkMode(
  colors: ExtractedColor[],
  preset: DarkModePreset = 'default'
): { darkColors: DarkColor[]; issues: ContrastIssue[] } {
  const darkColors = colors.map((c) => invertForDarkMode(c, preset));
  const issues: ContrastIssue[] = [];

  // Find background and text colors to check contrast
  const bgColor = darkColors.find((c) => c.role === 'background');
  const textColors = darkColors.filter((c) => c.role === 'text' || c.role === 'primary' || c.role === 'secondary');

  if (bgColor) {
    for (const textColor of textColors) {
      // Simple luminance contrast check (will be replaced by APCA in route handler)
      const bgL = rgbToHsl(bgColor.rgb).l;
      const txtL = rgbToHsl(textColor.rgb).l;
      const contrast = Math.abs(txtL - bgL);

      if (contrast < 50) {
        issues.push({
          foreground: textColor.hex,
          background: bgColor.hex,
          apcaScore: 0, // Placeholder — real APCA calculated in route
          requiredScore: textColor.role === 'text' ? 60 : 45,
          suggestion: `Increase lightness of ${textColor.role} color for better contrast`,
        });
      }
    }
  }

  return { darkColors, issues };
}
