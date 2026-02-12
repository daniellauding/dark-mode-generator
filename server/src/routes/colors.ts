import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { extractColors } from '../services/colorService';

const router = Router();

const colorsSchema = z.object({
  imageData: z.string().min(1, 'imageData is required'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = colorsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { imageData } = parsed.data;
    const colors = await extractColors(imageData);

    res.json({ colors });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Color extraction failed';
    res.status(500).json({ error: message });
  }
});

export default router;
