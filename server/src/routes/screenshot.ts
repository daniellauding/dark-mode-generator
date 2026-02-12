import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { captureScreenshot } from '../services/puppeteerService';

const router = Router();

const screenshotSchema = z.object({
  url: z.string().url('Must be a valid URL'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = screenshotSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { url } = parsed.data;
    const result = await captureScreenshot(url);

    res.json({
      imageData: result.imageData,
      dimensions: result.dimensions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Screenshot capture failed';
    res.status(500).json({ error: message });
  }
});

export default router;
