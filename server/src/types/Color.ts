export interface ExtractedColor {
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'text' | 'border';
  usage: number; // percentage 0-100
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface DarkColor extends ExtractedColor {
  originalHex: string;
  adjustments: {
    luminanceInverted: boolean;
    saturationAdjusted: number;
    contrastValidated: boolean;
  };
}

export interface ContrastResult {
  apcaScore: number;
  passes: boolean;
  threshold: number;
  level: 'body' | 'large' | 'small' | 'non-text';
}

export interface ContrastIssue {
  foreground: string;
  background: string;
  apcaScore: number;
  requiredScore: number;
  suggestion: string;
}
