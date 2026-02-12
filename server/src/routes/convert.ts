import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { convertToDarkMode } from '../utils/darkModeAlgorithm';
import { validateContrast } from '../services/apcaService';
import { ExtractedColor, DarkModePreset } from '../types';

const router = Router();

const colorSchema = z.object({
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  role: z.enum(['primary', 'secondary', 'accent', 'background', 'text', 'border']),
  usage: z.number().min(0).max(100),
  rgb: z.object({ r: z.number(), g: z.number(), b: z.number() }),
  hsl: z.object({ h: z.number(), s: z.number(), l: z.number() }),
});

const convertSchema = z.object({
  colors: z.array(colorSchema).min(1, 'At least one color is required'),
  preset: z.enum(['default', 'high-contrast', 'amoled']).default('default'),
});

router.post('/', (req: Request, res: Response) => {
  try {
    const parsed = convertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { colors, preset } = parsed.data;
    const result = convertToDarkMode(
      colors as ExtractedColor[],
      preset as DarkModePreset
    );

    // Enhance issues with real APCA scores
    const bgColor = result.darkColors.find((c) => c.role === 'background');
    if (bgColor) {
      for (const issue of result.issues) {
        try {
          const contrast = validateContrast(issue.foreground, issue.background, 16);
          issue.apcaScore = contrast.apcaScore;
        } catch {
          // Keep placeholder score
        }
      }
    }

    // Mark colors as contrast-validated
    if (bgColor) {
      for (const color of result.darkColors) {
        if (color.role !== 'background') {
          try {
            const contrast = validateContrast(color.hex, bgColor.hex, 16);
            color.adjustments.contrastValidated = contrast.passes;
          } catch {
            // Leave as false
          }
        }
      }
    }

    res.json({
      darkColors: result.darkColors,
      issues: result.issues,
      preset,
      metadata: {
        totalColors: result.darkColors.length,
        issueCount: result.issues.length,
        autoFixedCount: 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Conversion failed';
    res.status(500).json({ error: message });
  }
});

export default router;
