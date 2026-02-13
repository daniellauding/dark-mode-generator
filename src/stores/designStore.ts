import { create } from 'zustand';
import type { DesignPalette, DarkPalette, AppStep, BatchImage, ClipboardState, AccessibilityLevel } from '../types';
import type { URLExtractionResult } from '../utils/extractFromURL';
import { generateDarkPalette, generateSamplePalette, PRESETS, autoFixPalette, applyAPCAOptimizedPreset } from '../utils/colorConversion';

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

  // URL Extraction data (from AI)
  extractionData: URLExtractionResult | null;

  // Accessibility state
  accessibilityLevel: AccessibilityLevel;

  // Batch state
  batchImages: BatchImage[];
  batchMode: boolean;

  // Clipboard state
  clipboard: ClipboardState;

  // Editing state (when loading from library)
  editingPaletteId: string | null;

  setStep: (step: AppStep) => void;
  setImage: (preview: string, name: string) => void;
  setPalette: (palette: DesignPalette) => void;
  setExtractionData: (data: URLExtractionResult | null) => void;
  setPreset: (presetId: string) => void;
  setBgDarkness: (value: number) => void;
  setTextLightness: (value: number) => void;
  setAccentSaturation: (value: number) => void;
  regenerateDark: () => void;
  setShowExportModal: (show: boolean) => void;
  loadSample: () => void;
  reset: () => void;

  // Accessibility actions
  setAccessibilityLevel: (level: AccessibilityLevel) => void;
  applyAutoFix: () => void;

  // Batch actions
  addBatchImages: (images: BatchImage[]) => void;
  removeBatchImage: (id: string) => void;
  updateBatchImage: (id: string, update: Partial<BatchImage>) => void;
  clearBatch: () => void;
  setBatchMode: (on: boolean) => void;

  // Clipboard actions
  setClipboard: (state: Partial<ClipboardState>) => void;

  // Editing actions
  setEditingPaletteId: (id: string | null) => void;
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

  extractionData: null,

  accessibilityLevel: 'none' as AccessibilityLevel,

  batchImages: [],
  batchMode: false,
  clipboard: { hasImage: false, isReading: false, error: null },

  editingPaletteId: null,

  setStep: (step) => set({ step }),

  setImage: (preview, name) => set({ imagePreview: preview, imageName: name }),

  setPalette: (palette) => {
    const { bgDarkness, textLightness, accentSaturation } = get();
    const darkPalette = generateDarkPalette(palette, bgDarkness, textLightness, accentSaturation);
    set({ palette, darkPalette });
  },

  setExtractionData: (data) => set({ extractionData: data }),

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

  setAccessibilityLevel: (level) => {
    set({ accessibilityLevel: level });
    if (level === 'apca-optimized') {
      const { palette } = get();
      if (!palette) return;
      const darkPalette = applyAPCAOptimizedPreset(palette);
      set({ darkPalette });
    }
  },

  applyAutoFix: () => {
    const { darkPalette, accessibilityLevel, palette } = get();
    if (!darkPalette || !palette || accessibilityLevel === 'none') return;
    const fixed = autoFixPalette(darkPalette, accessibilityLevel, palette);
    set({ darkPalette: fixed });
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
    extractionData: null,
    accessibilityLevel: 'none' as AccessibilityLevel,
    showExportModal: false,
    editingPaletteId: null,
    batchImages: [],
    batchMode: false,
    clipboard: { hasImage: false, isReading: false, error: null },
  }),

  addBatchImages: (images) => set(s => ({
    batchImages: [...s.batchImages, ...images],
    batchMode: true,
  })),

  removeBatchImage: (id) => set(s => {
    const batchImages = s.batchImages.filter(img => img.id !== id);
    return { batchImages, batchMode: batchImages.length > 0 };
  }),

  updateBatchImage: (id, update) => set(s => ({
    batchImages: s.batchImages.map(img =>
      img.id === id ? { ...img, ...update } : img
    ),
  })),

  clearBatch: () => set({ batchImages: [], batchMode: false }),

  setBatchMode: (on) => set({ batchMode: on }),

  setClipboard: (state) => set(s => ({
    clipboard: { ...s.clipboard, ...state },
  })),

  setEditingPaletteId: (id) => set({ editingPaletteId: id }),
}));
