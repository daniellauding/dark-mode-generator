import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateContrast, validateContrastBatch } from '../services/apcaService';

const router = Router();

const validateSchema = z.object({
  fg: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  bg: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  fontSize: z.number().positive().default(16),
});

const batchSchema = z.object({
  pairs: z.array(z.object({
    fg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    bg: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    fontSize: z.number().positive().optional(),
  })).min(1).max(100),
});

router.post('/', (req: Request, res: Response) => {
  try {
    const parsed = validateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { fg, bg, fontSize } = parsed.data;
    const result = validateContrast(fg, bg, fontSize);

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Contrast validation failed';
    res.status(500).json({ error: message });
  }
});

router.post('/batch', (req: Request, res: Response) => {
  try {
    const parsed = batchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const results = validateContrastBatch(parsed.data.pairs);
    res.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Batch validation failed';
    res.status(500).json({ error: message });
  }
});

export default router;
