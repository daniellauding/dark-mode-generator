export interface ColorEntry {
  hex: string;
  name: string;
  area: number;
  role: 'background' | 'text' | 'accent' | 'border' | 'surface';
}

export interface DarkColorEntry extends ColorEntry {
  originalHex: string;
  contrastRatio: number;
  apcaValue: number;
  hasIssue: boolean;
}

export interface DesignPalette {
  colors: ColorEntry[];
  dominantColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface DarkPalette {
  colors: DarkColorEntry[];
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  bgDarkness: number;
  textLightness: number;
  accentSaturation: number;
}

export interface ExportFormat {
  id: 'css' | 'json' | 'tailwind' | 'png';
  name: string;
  extension: string;
}

export interface ContrastIssue {
  foreground: string;
  background: string;
  apcaValue: number;
  minRequired: number;
  element: string;
  severity: 'warning' | 'error';
}

export interface BatchImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  palette?: DesignPalette;
  darkPalette?: DarkPalette;
  error?: string;
}

export interface ClipboardState {
  hasImage: boolean;
  isReading: boolean;
  error: string | null;
}

export interface Iteration {
  id: string;
  paletteId: string;
  userId: string;
  userName: string;
  colors: DarkColorEntry[];
  preset: string;
  customSettings: {
    backgroundDarkness: number;
    textLightness: number;
    accentSaturation: number;
  };
  comment: string;
  votes: number;
  voters: string[];
  createdAt: number;
}

export type UploadSource = 'file' | 'url' | 'clipboard';

export type AppStep = 'landing' | 'upload' | 'analysis' | 'preview';

export type AccessibilityLevel = 'none' | 'wcag-aa' | 'wcag-aaa' | 'apca-optimized';

export interface AccessibilityPresetConfig {
  id: AccessibilityLevel;
  name: string;
  description: string;
  wcagMinContrast: number;
  wcagLargeTextContrast: number;
  apcaBodyMin: number;
  apcaSmallMin: number;
}

export interface AccessibilityIssue {
  colorName: string;
  colorHex: string;
  bgHex: string;
  wcagRatio: number;
  wcagRequired: number;
  apcaValue: number;
  apcaRequired: number;
  fixedHex?: string;
}

export interface AccessibilityValidation {
  level: AccessibilityLevel;
  passes: boolean;
  issues: AccessibilityIssue[];
  totalChecked: number;
  passCount: number;
}

export interface Project {
  id?: string;
  userId: string;
  name: string;
  client: string;
  description: string;
  tags: string[];
  paletteIds: string[];
  sharedWith: string[];
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}
