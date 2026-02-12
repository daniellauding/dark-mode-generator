import type { DarkPalette } from '../types';

const CANVAS_WIDTH = 1200;
const PADDING = 40;
const SWATCH_SIZE = 120;
const SWATCH_GAP = 16;
const SWATCH_RADIUS = 12;
const HEADER_HEIGHT = 80;
const META_ROW_HEIGHT = 60;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function generatePaletteImage(palette: DarkPalette): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const colors = palette.colors;
    const colsPerRow = Math.min(colors.length, 6);
    const rows = Math.ceil(colors.length / colsPerRow);

    const swatchAreaWidth = colsPerRow * SWATCH_SIZE + (colsPerRow - 1) * SWATCH_GAP;
    const canvasWidth = Math.max(CANVAS_WIDTH, swatchAreaWidth + PADDING * 2);
    const canvasHeight = HEADER_HEIGHT + META_ROW_HEIGHT + rows * (SWATCH_SIZE + SWATCH_GAP + 32) + PADDING * 2;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas context unavailable'));

    // Background
    ctx.fillStyle = palette.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = palette.textColor;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('Dark Mode Palette', PADDING, PADDING + 28);

    // Subtitle
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${colors.length} colors • Generated with Dark Mode Generator`, PADDING, PADDING + 52);

    // Foundation colors row
    const metaY = HEADER_HEIGHT + PADDING;
    const foundationColors = [
      { label: 'Background', hex: palette.backgroundColor },
      { label: 'Surface', hex: palette.surfaceColor },
      { label: 'Text', hex: palette.textColor },
    ];

    foundationColors.forEach((fc, i) => {
      const x = PADDING + i * 180;
      ctx.fillStyle = fc.hex;
      roundRect(ctx, x, metaY, 32, 32, 6);
      ctx.fill();

      ctx.fillStyle = palette.textColor;
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText(fc.label, x + 40, metaY + 14);
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px monospace';
      ctx.fillText(fc.hex, x + 40, metaY + 28);
    });

    // Color swatches
    const swatchStartY = metaY + META_ROW_HEIGHT + 16;
    const swatchStartX = PADDING;

    colors.forEach((color, i) => {
      const col = i % colsPerRow;
      const row = Math.floor(i / colsPerRow);
      const x = swatchStartX + col * (SWATCH_SIZE + SWATCH_GAP);
      const y = swatchStartY + row * (SWATCH_SIZE + SWATCH_GAP + 32);

      // Swatch
      ctx.fillStyle = color.hex;
      roundRect(ctx, x, y, SWATCH_SIZE, SWATCH_SIZE, SWATCH_RADIUS);
      ctx.fill();

      // Original color indicator (small circle)
      ctx.fillStyle = color.originalHex;
      ctx.beginPath();
      ctx.arc(x + SWATCH_SIZE - 12, y + 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = luminance(color.originalHex) > 0.5 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Color name
      ctx.fillStyle = palette.textColor;
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText(color.name, x, y + SWATCH_SIZE + 16);

      // Hex value
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px monospace';
      ctx.fillText(color.hex, x, y + SWATCH_SIZE + 28);
    });

    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    }, 'image/png');
  });
}

export async function downloadPaletteImage(palette: DarkPalette, filename = 'dark-mode-palette.png') {
  const blob = await generatePaletteImage(palette);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
