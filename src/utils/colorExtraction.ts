import chroma from 'chroma-js';
import type { ColorEntry, DesignPalette } from '../types';

interface ColorCount {
  hex: string;
  count: number;
  luminance: number;
}

/**
 * Extract dominant colors from an image using Canvas API
 */
export async function extractColorsFromImage(imageUrl: string): Promise<DesignPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Resize for performance (max 400x400)
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractDominantColors(imageData);
        
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Extract dominant colors from ImageData using color quantization
 */
function extractDominantColors(imageData: ImageData): DesignPalette {
  const colorMap = new Map<string, number>();
  const data = imageData.data;
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Quantize to reduce color variations (round to nearest 16)
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    
    const hex = chroma(qr, qg, qb).hex();
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }
  
  // Sort by frequency
  const sortedColors: ColorCount[] = Array.from(colorMap.entries())
    .map(([hex, count]) => ({
      hex,
      count,
      luminance: chroma(hex).luminance(),
    }))
    .sort((a, b) => b.count - a.count);
  
  // Extract distinct colors (avoid too similar colors)
  const distinctColors: ColorCount[] = [];
  for (const color of sortedColors) {
    if (distinctColors.length >= 10) break;
    
    const isSimilar = distinctColors.some(existing => {
      const distance = chroma.deltaE(color.hex, existing.hex);
      return distance < 20; // CIEDE2000 distance threshold
    });
    
    if (!isSimilar) {
      distinctColors.push(color);
    }
  }
  
  // Classify colors by role
  const totalPixels = sortedColors.reduce((sum, c) => sum + c.count, 0);
  const colors: ColorEntry[] = distinctColors.slice(0, 7).map((color, i) => {
    const percentage = (color.count / totalPixels) * 100;
    
    let role: ColorEntry['role'];
    if (i === 0 && color.luminance > 0.7) {
      role = 'background';
    } else if (color.luminance < 0.2) {
      role = 'text';
    } else if (color.luminance > 0.5 && i <= 1) {
      role = 'surface';
    } else if (chroma(color.hex).get('hsl.s') > 0.3) {
      role = 'accent';
    } else if (color.luminance > 0.4 && color.luminance < 0.6) {
      role = 'border';
    } else {
      role = i === 0 ? 'background' : 'text';
    }
    
    return {
      hex: color.hex,
      name: `Color ${i + 1}`,
      area: Math.round(percentage),
      role,
    };
  });
  
  // Find background (lightest or most common)
  const background = colors.find(c => c.role === 'background') || colors[0];
  
  // Find text color (darkest)
  const textColor = colors.find(c => c.role === 'text') || 
    colors.reduce((darkest, c) => 
      chroma(c.hex).luminance() < chroma(darkest.hex).luminance() ? c : darkest
    );
  
  return {
    colors,
    dominantColor: colors[0].hex,
    backgroundColor: background.hex,
    textColor: textColor.hex,
  };
}
