import { DarkColor, ContrastIssue } from './Color';

export type DarkModePreset = 'default' | 'high-contrast' | 'amoled';

export interface ConversionResult {
  darkColors: DarkColor[];
  issues: ContrastIssue[];
  preset: DarkModePreset;
  metadata: {
    totalColors: number;
    issueCount: number;
    autoFixedCount: number;
  };
}

export interface ScreenshotResult {
  imageData: string; // base64
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ExportResult {
  pngData: string; // base64
  dimensions: {
    width: number;
    height: number;
  };
}
