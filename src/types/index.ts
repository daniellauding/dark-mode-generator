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

export type UploadSource = 'file' | 'url' | 'clipboard';

export type AppStep = 'landing' | 'upload' | 'analysis' | 'preview';
