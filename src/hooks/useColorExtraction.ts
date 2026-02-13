import { useCallback } from 'react';
import { generateSamplePalette } from '../utils/colorConversion';
import { extractColorsFromImage } from '../utils/colorExtraction';
import { useDesignStore } from '../stores/designStore';
import type { DesignPalette } from '../types';

export function useColorExtraction() {
  const setPalette = useDesignStore(s => s.setPalette);
  const setStep = useDesignStore(s => s.setStep);

  const extractFromImage = useCallback(async (imageUrl: string): Promise<DesignPalette> => {
    try {
      // Try real color extraction
      const palette = await extractColorsFromImage(imageUrl);
      setPalette(palette);
      setStep('analysis');
      return palette;
    } catch (error) {
      console.warn('Color extraction failed, using sample palette:', error);
      // Fallback to sample palette if extraction fails
      const palette = generateSamplePalette();
      setPalette(palette);
      setStep('analysis');
      return palette;
    }
  }, [setPalette, setStep]);

  const extractFromUrl = useCallback(async (url: string): Promise<DesignPalette> => {
    // For now, URLs are treated as image URLs
    // TODO: Add backend proxy for website color extraction
    return extractFromImage(url);
  }, [extractFromImage]);

  return { extractFromImage, extractFromUrl };
}
