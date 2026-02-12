import puppeteer, { Browser } from 'puppeteer';
import { ScreenshotResult } from '../types';

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browserInstance;
}

export async function captureScreenshot(url: string): Promise<ScreenshotResult> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait a moment for any animations/transitions to settle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const screenshot = await page.screenshot({
      encoding: 'base64',
      type: 'png',
      fullPage: false,
    });

    const viewport = page.viewport();
    const width = viewport?.width ?? 1440;
    const height = viewport?.height ?? 900;

    return {
      imageData: screenshot as string,
      dimensions: { width, height },
    };
  } finally {
    await page.close();
  }
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
