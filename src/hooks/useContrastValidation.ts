import { useMemo } from 'react';
import type { DarkPalette, ContrastIssue } from '../types';
import { calcAPCA, getContrastLevel, getMinContrast } from '../utils/apca';

export function useContrastValidation(darkPalette: DarkPalette | null) {
  const issues = useMemo<ContrastIssue[]>(() => {
    if (!darkPalette) return [];

    const result: ContrastIssue[] = [];
    const bg = darkPalette.backgroundColor;

    darkPalette.colors.forEach(color => {
      if (color.role === 'background') return;

      const apca = calcAPCA(color.hex, bg);
      const abs = Math.abs(apca);

      const textSize = color.role === 'text' ? 'body' : 'large';
      const minRequired = getMinContrast(textSize);
      const level = getContrastLevel(apca);

      if (level !== 'pass') {
        result.push({
          foreground: color.hex,
          background: bg,
          apcaValue: apca,
          minRequired,
          element: color.name,
          severity: level === 'fail' ? 'error' : 'warning',
        });
      }
    });

    return result;
  }, [darkPalette]);

  const passCount = darkPalette
    ? darkPalette.colors.filter(c => c.role !== 'background' && !c.hasIssue).length
    : 0;

  const totalChecked = darkPalette
    ? darkPalette.colors.filter(c => c.role !== 'background').length
    : 0;

  return { issues, passCount, totalChecked };
}
