import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { colorParsley } from 'colorparsley';
import { ContrastResult } from '../types';

/**
 * APCA thresholds by font size context.
 * These follow the APCA readability guidelines:
 * - Body text (14-16px): Lc 60+
 * - Large text (24px+): Lc 45+
 * - Small text (<14px): Lc 90+
 * - Non-text elements: Lc 30+
 */
function getThreshold(fontSize: number): { threshold: number; level: ContrastResult['level'] } {
  if (fontSize >= 24) return { threshold: 45, level: 'large' };
  if (fontSize >= 14) return { threshold: 60, level: 'body' };
  if (fontSize > 0) return { threshold: 90, level: 'small' };
  return { threshold: 30, level: 'non-text' };
}

/**
 * Calculate APCA contrast between foreground and background colors.
 * Returns the Lc (Lightness Contrast) value and pass/fail assessment.
 */
export function validateContrast(fg: string, bg: string, fontSize: number = 16): ContrastResult {
  const fgParsed = colorParsley(fg);
  const bgParsed = colorParsley(bg);

  const fgY = sRGBtoY(fgParsed as [number, number, number]);
  const bgY = sRGBtoY(bgParsed as [number, number, number]);
  const lc = APCAcontrast(fgY, bgY) as number;

  const { threshold, level } = getThreshold(fontSize);
  const absLc = Math.abs(lc);

  return {
    apcaScore: Math.round(absLc * 10) / 10,
    passes: absLc >= threshold,
    threshold,
    level,
  };
}

/**
 * Batch validate multiple color pairs.
 */
export function validateContrastBatch(
  pairs: Array<{ fg: string; bg: string; fontSize?: number }>
): ContrastResult[] {
  return pairs.map((pair) => validateContrast(pair.fg, pair.bg, pair.fontSize ?? 16));
}
