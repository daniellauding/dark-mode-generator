import { create } from 'zustand';
import type { DesignPalette, DarkPalette, AppStep } from '../types';
import { generateDarkPalette, generateSamplePalette, PRESETS } from '../utils/colorConversion';

interface DesignState {
  step: AppStep;
  imagePreview: string | null;
  imageName: string | null;
  palette: DesignPalette | null;
  darkPalette: DarkPalette | null;
  activePreset: string;
  bgDarkness: number;
  textLightness: number;
  accentSaturation: number;
  showExportModal: boolean;

  setStep: (step: AppStep) => void;
  setImage: (preview: string, name: string) => void;
  setPalette: (palette: DesignPalette) => void;
  setPreset: (presetId: string) => void;
  setBgDarkness: (value: number) => void;
  setTextLightness: (value: number) => void;
  setAccentSaturation: (value: number) => void;
  regenerateDark: () => void;
  setShowExportModal: (show: boolean) => void;
  loadSample: () => void;
  reset: () => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  step: 'landing',
  imagePreview: null,
  imageName: null,
  palette: null,
  darkPalette: null,
  activePreset: 'midnight',
  bgDarkness: 90,
  textLightness: 95,
  accentSaturation: 80,
  showExportModal: false,

  setStep: (step) => set({ step }),

  setImage: (preview, name) => set({ imagePreview: preview, imageName: name }),

  setPalette: (palette) => {
    const { bgDarkness, textLightness, accentSaturation } = get();
    const darkPalette = generateDarkPalette(palette, bgDarkness, textLightness, accentSaturation);
    set({ palette, darkPalette });
  },

  setPreset: (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    set({
      activePreset: presetId,
      bgDarkness: preset.bgDarkness,
      textLightness: preset.textLightness,
      accentSaturation: preset.accentSaturation,
    });
    get().regenerateDark();
  },

  setBgDarkness: (value) => {
    set({ bgDarkness: value, activePreset: 'custom' });
    get().regenerateDark();
  },

  setTextLightness: (value) => {
    set({ textLightness: value, activePreset: 'custom' });
    get().regenerateDark();
  },

  setAccentSaturation: (value) => {
    set({ accentSaturation: value, activePreset: 'custom' });
    get().regenerateDark();
  },

  regenerateDark: () => {
    const { palette, bgDarkness, textLightness, accentSaturation } = get();
    if (!palette) return;
    const darkPalette = generateDarkPalette(palette, bgDarkness, textLightness, accentSaturation);
    set({ darkPalette });
  },

  setShowExportModal: (show) => set({ showExportModal: show }),

  loadSample: () => {
    const palette = generateSamplePalette();
    const { bgDarkness, textLightness, accentSaturation } = get();
    const darkPalette = generateDarkPalette(palette, bgDarkness, textLightness, accentSaturation);
    set({
      palette,
      darkPalette,
      imagePreview: null,
      imageName: 'Sample Design',
      step: 'analysis',
    });
  },

  reset: () => set({
    step: 'landing',
    imagePreview: null,
    imageName: null,
    palette: null,
    darkPalette: null,
    activePreset: 'midnight',
    bgDarkness: 90,
    textLightness: 95,
    accentSaturation: 80,
    showExportModal: false,
  }),
}));
