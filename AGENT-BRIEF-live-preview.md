# Agent Brief: live-preview

**Role:** Full-Stack Developer (Live Website Preview)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 3-4 hours

## Your Mission

Build live website preview with real-time dark mode CSS injection.

## Current Problem

- `extractFromUrl()` is a **stub** - returns fake sample palette
- `extractFromImage()` is also a **stub** - same fake colors every time
- No real color extraction
- No live website preview

**User wants:**
```
Paste skistar.com → Live preview with dark mode CSS on top
```

## Tasks

### 1. Real Color Extraction (Client-Side)

**Update `src/hooks/useColorExtraction.ts`:**

```typescript
const extractFromImage = useCallback(async (imageUrl: string): Promise<DesignPalette> => {
  // Create canvas, load image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Extract dominant colors
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const colors = extractDominantColors(imageData);  // Use quantize.js or similar
  
  return {
    colors: colors.map((color, i) => ({
      name: `Color ${i + 1}`,
      hex: color,
      role: i === 0 ? 'background' : i === 1 ? 'surface' : 'text',
    })),
  };
}, [setPalette, setStep]);
```

**Install color quantization library:**
```bash
npm install quantize
```

### 2. Backend Proxy for Websites

**Create `server/proxy.ts` (Express + Puppeteer):**

```typescript
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint: Fetch website HTML + CSS
app.post('/api/fetch-website', async (req, res) => {
  const { url } = req.body;
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract computed styles
    const styles = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colorMap = new Map();

      elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        ['color', 'background-color', 'border-color'].forEach(prop => {
          const value = computed.getPropertyValue(prop);
          if (value && value !== 'rgba(0, 0, 0, 0)') {
            colorMap.set(value, (colorMap.get(value) || 0) + 1);
          }
        });
      });

      return Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color]) => color);
    });

    // Get HTML
    const html = await page.content();

    await browser.close();

    res.json({ url, html, colors: styles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch website' });
  }
});

// Endpoint: Take screenshot with dark mode CSS injected
app.post('/api/screenshot-dark', async (req, res) => {
  const { url, darkCSS } = req.body;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Inject dark mode CSS
  await page.addStyleTag({ content: darkCSS });

  // Take screenshot
  const screenshot = await page.screenshot({ fullPage: false });

  await browser.close();

  res.set('Content-Type', 'image/png');
  res.send(screenshot);
});

app.listen(3001, () => console.log('Proxy server running on :3001'));
```

**Install dependencies:**
```bash
npm install express puppeteer cors
npm install -D @types/express @types/cors
```

### 3. Live Preview Component

**Create `src/components/LivePreview.tsx`:**

```tsx
import { useEffect, useRef, useState } from 'react';

interface LivePreviewProps {
  url: string;
  darkCSS: string;
}

export function LivePreview({ url, darkCSS }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;

    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Inject dark mode CSS
        const style = doc.createElement('style');
        style.textContent = darkCSS;
        doc.head.appendChild(style);

        setLoading(false);
      } catch (err) {
        console.error('Cannot access iframe (CORS)');
      }
    };
  }, [darkCSS]);

  return (
    <div className="relative w-full h-[600px] border border-dark-700 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
          <div className="text-dark-400">Loading preview...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
```

### 4. Update Preview Page

**Modify `src/pages/Preview.tsx`:**

```tsx
import { LivePreview } from '../components/LivePreview';

// In Preview component:
const darkCSS = useMemo(() => {
  if (!darkPalette) return '';
  
  return `
    * {
      background-color: ${darkPalette.colors[0].hex} !important;
      color: ${darkPalette.colors[2].hex} !important;
    }
    a { color: ${darkPalette.colors[3].hex} !important; }
    button { 
      background-color: ${darkPalette.colors[3].hex} !important;
      color: ${darkPalette.colors[0].hex} !important;
    }
  `;
}, [darkPalette]);

// Render side-by-side:
<div className="grid grid-cols-2 gap-4">
  <div>
    <h3>Original</h3>
    <iframe src={originalUrl} />
  </div>
  <div>
    <h3>Dark Mode</h3>
    <LivePreview url={originalUrl} darkCSS={darkCSS} />
  </div>
</div>
```

### 5. Handle CORS Issues

**Option A: Use proxy endpoint**
```typescript
// Instead of direct iframe:
<iframe src={`http://localhost:3001/proxy?url=${encodeURIComponent(url)}`} />
```

**Option B: Use screenshot API**
```typescript
const darkScreenshot = await fetch('/api/screenshot-dark', {
  method: 'POST',
  body: JSON.stringify({ url, darkCSS }),
});
```

### 6. Export Dark Mode CSS

**Create export function:**

```typescript
function exportDarkModeCSS(palette: DarkPalette): string {
  return `
/* Dark Mode CSS — Generated by darkmodegenerator.netlify.app */

:root {
  --dark-bg: ${palette.colors[0].hex};
  --dark-surface: ${palette.colors[1].hex};
  --dark-text: ${palette.colors[2].hex};
  --dark-accent: ${palette.colors[3].hex};
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--dark-bg);
    color: var(--dark-text);
  }
  
  a { color: var(--dark-accent); }
  
  /* Add more rules here */
}
`;
}
```

## Expected Deliverables

- ✅ Real color extraction from images (Canvas API)
- ✅ Backend proxy server (Express + Puppeteer)
- ✅ `/api/fetch-website` endpoint
- ✅ `/api/screenshot-dark` endpoint
- ✅ LivePreview component (iframe + CSS injection)
- ✅ Side-by-side preview (original vs dark mode)
- ✅ Export dark mode CSS
- ✅ Handle CORS issues
- ✅ Build succeeds

## Success Criteria

- User pastes skistar.com → sees live preview with dark mode
- Color extraction works for real images
- Dark mode CSS can be customized in real-time
- Export CSS works
- No CORS errors (via proxy)

## References

- Puppeteer: https://pptr.dev/
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- Quantize.js: https://github.com/olivierlesnicki/quantize

---

**Start now!** 🔥
