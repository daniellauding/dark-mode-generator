import chroma from 'chroma-js';
import type { ColorEntry, DarkColorEntry, DesignPalette, DarkPalette, Preset } from '../types';
import { calcAPCA, getContrastLevel } from './apca';

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
