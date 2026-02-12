import { Router, Request, Response } from 'express';
import { z } from 'zod';
import sharp from 'sharp';

const router = Router();

const exportSchema = z.object({
  beforeImage: z.string().min(1, 'beforeImage is required'),
  afterImage: z.string().min(1, 'afterImage is required'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = exportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
      return;
    }

    const { beforeImage, afterImage } = parsed.data;

    const beforeBuf = Buffer.from(beforeImage, 'base64');
    const afterBuf = Buffer.from(afterImage, 'base64');

    // Get dimensions of both images
    const beforeMeta = await sharp(beforeBuf).metadata();
    const afterMeta = await sharp(afterBuf).metadata();

    const width = Math.max(beforeMeta.width ?? 720, afterMeta.width ?? 720);
    const height = Math.max(beforeMeta.height ?? 450, afterMeta.height ?? 450);

    // Resize both to same dimensions
    const beforeResized = await sharp(beforeBuf)
      .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();

    const afterResized = await sharp(afterBuf)
      .resize(width, height, { fit: 'contain', background: { r: 11, g: 15, b: 25, alpha: 1 } })
      .png()
      .toBuffer();

    // Compose side-by-side with a 4px divider
    const gap = 4;
    const compositeWidth = width * 2 + gap;

    const result = await sharp({
      create: {
        width: compositeWidth,
        height,
        channels: 4,
        background: { r: 30, g: 30, b: 30, alpha: 1 },
      },
    })
      .composite([
        { input: beforeResized, left: 0, top: 0 },
        { input: afterResized, left: width + gap, top: 0 },
      ])
      .png()
      .toBuffer();

    const pngData = result.toString('base64');
    const finalMeta = await sharp(result).metadata();

    res.json({
      pngData,
      dimensions: {
        width: finalMeta.width ?? compositeWidth,
        height: finalMeta.height ?? height,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Image export failed';
    res.status(500).json({ error: message });
  }
});

export default router;
