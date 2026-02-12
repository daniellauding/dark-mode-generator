import type { DarkPalette, ExportFormat } from '../types';

export const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'css', name: 'CSS Variables', extension: '.css' },
  { id: 'json', name: 'Design Tokens (JSON)', extension: '.json' },
  { id: 'tailwind', name: 'Tailwind Config', extension: '.js' },
  { id: 'png', name: 'Palette Image', extension: '.png' },
];

export function generateCSS(palette: DarkPalette): string {
  const lines = [':root {'];
  palette.colors.forEach(c => {
    const varName = `--color-${c.role}-${c.name.toLowerCase().replace(/\s+/g, '-')}`;
    lines.push(`  ${varName}: ${c.hex};`);
  });
  lines.push(`  --color-bg: ${palette.backgroundColor};`);
  lines.push(`  --color-surface: ${palette.surfaceColor};`);
  lines.push(`  --color-text: ${palette.textColor};`);
  lines.push('}');
  return lines.join('\n');
}

export function generateJSON(palette: DarkPalette): string {
  const tokens: Record<string, unknown> = {
    background: { value: palette.backgroundColor },
    surface: { value: palette.surfaceColor },
    text: { value: palette.textColor },
    colors: {} as Record<string, unknown>,
  };

  palette.colors.forEach(c => {
    const key = c.name.toLowerCase().replace(/\s+/g, '-');
    (tokens.colors as Record<string, unknown>)[key] = {
      value: c.hex,
      original: c.originalHex,
      role: c.role,
      apca: c.apcaValue,
    };
  });

  return JSON.stringify(tokens, null, 2);
}

export function generateTailwind(palette: DarkPalette): string {
  const colors: Record<string, string> = {};
  palette.colors.forEach(c => {
    const key = c.name.toLowerCase().replace(/\s+/g, '-');
    colors[key] = c.hex;
  });
  colors['bg'] = palette.backgroundColor;
  colors['surface'] = palette.surfaceColor;
  colors['text-primary'] = palette.textColor;

  return `/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        dark: ${JSON.stringify(colors, null, 8).replace(/"/g, "'")}
      }
    }
  }
}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
