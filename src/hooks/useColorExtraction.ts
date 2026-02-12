import { useCallback } from 'react';
import { generateSamplePalette } from '../utils/colorConversion';
import { useDesignStore } from '../stores/designStore';
import type { DesignPalette } from '../types';

export function useColorExtraction() {
  const setPalette = useDesignStore(s => s.setPalette);
  const setStep = useDesignStore(s => s.setStep);

  const extractFromImage = useCallback((_imageUrl: string): Promise<DesignPalette> => {
    // Simulated extraction with delay for UX
    return new Promise(resolve => {
      setTimeout(() => {
        const palette = generateSamplePalette();
        setPalette(palette);
        setStep('analysis');
        resolve(palette);
      }, 1500);
    });
  }, [setPalette, setStep]);

  const extractFromUrl = useCallback((url: string): Promise<DesignPalette> => {
    return extractFromImage(url);
  }, [extractFromImage]);

  return { extractFromImage, extractFromUrl };
}
