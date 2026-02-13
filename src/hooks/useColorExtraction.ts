import { useCallback } from 'react';
import { generateSamplePalette } from '../utils/colorConversion';
import { extractColorsFromImage } from '../utils/colorExtraction';
import { extractFromURL } from '../utils/extractFromURL';
import { useDesignStore } from '../stores/designStore';
import type { DesignPalette } from '../types';

export function useColorExtraction() {
  const setPalette = useDesignStore(s => s.setPalette);
  const setStep = useDesignStore(s => s.setStep);
  const setSourceUrl = useDesignStore(s => s.setSourceUrl);
  const setExtractionData = useDesignStore(s => s.setExtractionData);

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
    try {
      // Check if URL looks like an image
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
      const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));

      if (isImage) {
        // Treat as image URL - clear sourceUrl
        setSourceUrl(null);
        return extractFromImage(url);
      }

      // Store source URL for website extraction (for live preview comparison)
      setSourceUrl(url);

      // Try AI-powered CSS extraction
      const { palette, extraction, error } = await extractFromURL(url);

      if (error) {
        console.warn('URL extraction warning:', error);
      }

      // Store extraction data for display in Analysis page
      if (extraction) {
        setExtractionData(extraction);
      }

      setPalette(palette);
      setStep('analysis');
      return palette;
    } catch (error) {
      console.warn('URL extraction failed, using sample palette:', error);
      setSourceUrl(null);
      const palette = generateSamplePalette();
      setPalette(palette);
      setStep('analysis');
      return palette;
    }
  }, [extractFromImage, setPalette, setStep, setSourceUrl, setExtractionData]);

  return { extractFromImage, extractFromUrl };
}
