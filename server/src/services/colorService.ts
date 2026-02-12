import Vibrant from 'node-vibrant';
import { ExtractedColor } from '../types';
import { hexToRgb, rgbToHsl } from '../utils/darkModeAlgorithm';

/**
 * Assign a semantic role based on color characteristics.
 */
function assignRole(hex: string, index: number, total: number): ExtractedColor['role'] {
  const hsl = rgbToHsl(hexToRgb(hex));

  // Very light = likely background
  if (hsl.l > 90) return 'background';
  // Very dark = likely text
  if (hsl.l < 15) return 'text';
  // First vibrant color = primary
  if (index === 0) return 'primary';
  // Second = secondary
  if (index === 1) return 'secondary';
  // Third = accent
  if (index === 2) return 'accent';
  // Low saturation, mid lightness = border
  if (hsl.s < 10 && hsl.l > 30 && hsl.l < 70) return 'border';

  return index < total / 2 ? 'primary' : 'secondary';
}

/**
 * Extract dominant colors from a base64-encoded image using Vibrant.js.
 */
export async function extractColors(imageData: string): Promise<ExtractedColor[]> {
  const buffer = Buffer.from(imageData, 'base64');
  const palette = await Vibrant.from(buffer).maxColorCount(64).getPalette();

  const swatches = [
    { name: 'Vibrant', swatch: palette.Vibrant },
    { name: 'DarkVibrant', swatch: palette.DarkVibrant },
    { name: 'LightVibrant', swatch: palette.LightVibrant },
    { name: 'Muted', swatch: palette.Muted },
    { name: 'DarkMuted', swatch: palette.DarkMuted },
    { name: 'LightMuted', swatch: palette.LightMuted },
  ].filter((s) => s.swatch !== null);

  const totalPopulation = swatches.reduce((sum, s) => sum + (s.swatch?.population ?? 0), 0);

  const colors: ExtractedColor[] = swatches.map((s, i) => {
    const hex = s.swatch!.hex;
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    const usage = totalPopulation > 0
      ? Math.round(((s.swatch?.population ?? 0) / totalPopulation) * 100)
      : Math.round(100 / swatches.length);

    return {
      hex,
      role: assignRole(hex, i, swatches.length),
      usage,
      rgb,
      hsl,
    };
  });

  // Ensure we have at least a background and text color
  const hasBackground = colors.some((c) => c.role === 'background');
  const hasText = colors.some((c) => c.role === 'text');

  if (!hasBackground) {
    colors.push({
      hex: '#ffffff',
      role: 'background',
      usage: 0,
      rgb: { r: 255, g: 255, b: 255 },
      hsl: { h: 0, s: 0, l: 100 },
    });
  }

  if (!hasText) {
    colors.push({
      hex: '#1a1a1a',
      role: 'text',
      usage: 0,
      rgb: { r: 26, g: 26, b: 26 },
      hsl: { h: 0, s: 0, l: 10 },
    });
  }

  return colors;
}
