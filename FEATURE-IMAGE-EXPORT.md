# Image Export Features

## Export Options

After converting to dark mode, users can save results as images:

### 1. **Dark Mode Only** (Single Image)
- Just the dark mode version
- Same dimensions as original
- PNG format (transparency preserved)
- Download as: `design-dark-mode.png`

### 2. **Before/After Comparison** (Side-by-Side)
- Original (light) + Dark mode side-by-side
- 2× width of original
- Divider line in middle
- Labels: "Light Mode" | "Dark Mode"
- Download as: `design-comparison.png`

### 3. **Slider Comparison** (Interactive GIF/Video)
- Animated slider revealing dark mode
- GIF or MP4 format
- Good for portfolios, presentations
- Download as: `design-slider.gif`

### 4. **Live Site Screenshot** (For URL mode)
- Full-page screenshot of live CSS override
- Scrollable areas captured
- Before + After versions
- Download as: `stripe-dark-mode.png`

### 5. **Color Palette Card**
- Visual reference card with:
  - Color swatches (before → after)
  - Hex codes
  - APCA scores
  - Labels (Background, Text, Accent, etc.)
- Download as: `palette.png`

---

## Implementation

### Option 1: Dark Mode Image (Client-Side)

**For uploaded images:**

```typescript
// Apply dark mode transformation to image
async function generateDarkModeImage(originalImage: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  
  // Draw original
  ctx.drawImage(originalImage, 0, 0);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Transform each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to dark mode (apply color mapping)
    const darkColor = convertColorToDark({ r, g, b });
    
    data[i] = darkColor.r;
    data[i + 1] = darkColor.g;
    data[i + 2] = darkColor.b;
    // Alpha stays same: data[i + 3]
  }
  
  // Put modified data back
  ctx.putImageData(imageData, 0, 0);
  
  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-dark-mode.png';
    a.click();
  });
}
```

### Option 2: Before/After Comparison

```typescript
async function generateComparison(
  originalImage: HTMLImageElement,
  darkImage: HTMLImageElement
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const width = originalImage.width;
  const height = originalImage.height;
  
  // Canvas is 2× width + gap
  const gap = 40; // Space for labels
  canvas.width = width * 2 + gap;
  canvas.height = height + 80; // Extra space for labels
  
  // Fill background
  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw original (left)
  ctx.drawImage(originalImage, 0, 40);
  
  // Draw dark (right)
  ctx.drawImage(darkImage, width + gap, 40);
  
  // Draw divider
  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(width, 0, gap, canvas.height);
  
  // Labels
  ctx.fillStyle = '#a3a3a3';
  ctx.font = '16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Light Mode', width / 2, 25);
  ctx.fillText('Dark Mode', width + gap + width / 2, 25);
  
  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-comparison.png';
    a.click();
  });
}
```

### Option 3: Live Site Screenshot (Server-Side)

**For URL mode with CSS override:**

```typescript
// Backend: /api/screenshot
app.post('/api/screenshot', async (req, res) => {
  const { url, darkCSS } = req.body;
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to URL
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Inject dark mode CSS
  await page.addStyleTag({ content: darkCSS });
  
  // Wait for CSS to apply
  await page.waitForTimeout(500);
  
  // Take screenshot
  const screenshot = await page.screenshot({
    type: 'png',
    fullPage: true // Capture entire scrollable page
  });
  
  await browser.close();
  
  // Return as base64
  res.json({
    image: screenshot.toString('base64'),
    width: 1920,
    height: await page.evaluate(() => document.body.scrollHeight)
  });
});
```

**Frontend downloads:**

```typescript
async function downloadLiveScreenshot() {
  const response = await fetch('/api/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://stripe.com',
      darkCSS: generatedDarkCSS
    })
  });
  
  const { image } = await response.json();
  
  // Convert base64 to blob
  const blob = await fetch(`data:image/png;base64,${image}`).then(r => r.blob());
  
  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'stripe-dark-mode.png';
  a.click();
}
```

### Option 4: Color Palette Card

```typescript
function generatePaletteCard(originalColors, darkColors) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = 800;
  canvas.height = 600;
  
  // Background
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#e4e4e4';
  ctx.font = 'bold 24px Inter';
  ctx.fillText('Dark Mode Color Palette', 40, 50);
  
  // Draw each color pair
  let y = 100;
  originalColors.forEach((original, index) => {
    const dark = darkColors[index];
    
    // Original swatch
    ctx.fillStyle = original.hex;
    ctx.fillRect(40, y, 80, 80);
    
    // Arrow
    ctx.fillStyle = '#6b6b6b';
    ctx.font = '32px sans-serif';
    ctx.fillText('→', 140, y + 50);
    
    // Dark swatch
    ctx.fillStyle = dark.hex;
    ctx.fillRect(190, y, 80, 80);
    
    // Labels
    ctx.fillStyle = '#a3a3a3';
    ctx.font = '14px Inter';
    ctx.fillText(original.role, 40, y + 100);
    ctx.fillText(original.hex, 40, y + 120);
    
    ctx.fillText(dark.hex, 190, y + 100);
    ctx.fillText(`APCA: ${dark.apca}`, 190, y + 120);
    
    y += 150;
  });
  
  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.png';
    a.click();
  });
}
```

---

## UI Updates

### Export Modal (Updated)

```
┌─────────────────────────────────────────┐
│  Export Dark Mode                   [×] │
├─────────────────────────────────────────┤
│                                         │
│  📋 Code                                │
│  ┌─────────────────────────────────┐   │
│  │  ☐ CSS Variables               │   │
│  │  ☐ JSON Tokens                 │   │
│  │  ☐ Tailwind Config             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🖼️ Images                              │
│  ┌─────────────────────────────────┐   │
│  │  ☑ Dark Mode Image (PNG)       │   │
│  │  ☑ Before/After Comparison     │   │
│  │  ☐ Slider Animation (GIF)      │   │
│  │  ☐ Color Palette Card          │   │
│  │  ☐ Full Page Screenshot        │   │  ← For URL mode
│  └─────────────────────────────────┘   │
│                                         │
│  🔗 Share                               │
│  ┌─────────────────────────────────┐   │
│  │  Share Link (30 days)          │   │
│  │  https://darkgen.app/a3k9x     │   │
│  │  [Copy Link]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Download Selected (3)]  [Download All]│
│                                         │
└─────────────────────────────────────────┘
```

### Preview Screen (Quick Export)

```
┌──────────────────────────────────────┐
│  Before/After Preview           [⬇️] │ ← Quick download button
├──────────────────────────────────────┤
│                                      │
│  [Original]  [Dark Mode]             │
│                                      │
└──────────────────────────────────────┘
```

**Dropdown on ⬇️ button:**
- Download Dark Mode (PNG)
- Download Comparison (PNG)
- Download Palette (PNG)
- More Export Options... → Opens full modal

---

## File Naming Convention

```
Original filename: "dashboard-design.png"

Exported files:
- dashboard-design-dark.png          (Dark mode only)
- dashboard-design-comparison.png    (Before/after)
- dashboard-design-palette.png       (Color palette card)
- dashboard-design-slider.gif        (Animated comparison)

URL mode:
- stripe-dark-mode.png               (Screenshot)
- stripe-comparison.png              (Before/after screenshot)
```

---

## Advanced: Animated Slider Comparison

**Use case:** Portfolio, presentations, social media

**Implementation:**

```typescript
// Generate GIF with slider animation
async function generateSliderGIF(original, dark) {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: original.width,
    height: original.height
  });
  
  // 20 frames of slider moving left to right
  for (let i = 0; i <= 20; i++) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = original.width;
    canvas.height = original.height;
    
    const splitX = (original.width / 20) * i;
    
    // Draw dark mode (full)
    ctx.drawImage(dark, 0, 0);
    
    // Draw original (clipped to left of slider)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, original.height);
    ctx.clip();
    ctx.drawImage(original, 0, 0);
    ctx.restore();
    
    // Draw slider line
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, original.height);
    ctx.stroke();
    
    gif.addFrame(canvas, { delay: 50 }); // 50ms per frame
  }
  
  gif.on('finished', blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-slider.gif';
    a.click();
  });
  
  gif.render();
}
```

**Libraries:**
- `gif.js` for GIF generation
- Or use `ffmpeg` on backend for MP4 (better quality)

---

## Performance Considerations

### Client-Side Exports
- **Dark Mode Image:** Fast (~100ms for 1920×1080)
- **Before/After:** Fast (~200ms)
- **Palette Card:** Fast (~50ms)

### Server-Side Exports
- **Live Screenshot:** Slow (3-5 seconds with Puppeteer)
- **Animated GIF:** Slow (5-10 seconds for 20 frames)

**Solution:** Show progress indicator
```
Generating screenshot...
[█████████░░░] 75%
This may take 5-10 seconds
```

---

## Storage & Sharing

### Share Link (Optional)

When user clicks "Share", upload images to temporary storage:

```typescript
// Upload to S3/Cloudinary
const darkImageUrl = await uploadToCloud(darkImageBlob);
const comparisonUrl = await uploadToCloud(comparisonBlob);

// Create shareable link
const shareId = generateId(); // e.g., "a3k9x"
await db.insert('shares', {
  id: shareId,
  darkImageUrl,
  comparisonUrl,
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
});

// Return link
return `https://darkgen.app/share/${shareId}`;
```

**Share page shows:**
- Before/After comparison
- Download buttons
- "Create your own" CTA

---

## Export Analytics

Track which export formats are most popular:

```typescript
trackEvent('export', {
  format: 'dark-image' | 'comparison' | 'palette' | 'screenshot' | 'gif' | 'css' | 'json',
  source: 'upload' | 'url' | 'clipboard',
  fileSize: blob.size
});
```

Use data to prioritize which formats to improve.

---

## Next Steps

### Phase 1 (Core Exports)
1. ✅ **Dark Mode Image** (PNG download)
2. ✅ **Before/After Comparison** (side-by-side PNG)
3. ✅ **Quick download button** on preview screen

### Phase 2 (Advanced)
4. ⏳ **Color Palette Card** (visual reference)
5. ⏳ **Live Screenshot** (for URL mode)
6. ⏳ **Share links** (upload to S3, 30-day expiry)

### Phase 3 (Portfolio Features)
7. 🔮 **Animated Slider GIF**
8. 🔮 **MP4 export** (better quality than GIF)
9. 🔮 **Batch export** (ZIP with all formats)

---

## Implementation Priority

**Must-have (MVP):**
- Dark Mode Image (PNG) ✅
- Before/After Comparison ✅

**Nice-to-have:**
- Color Palette Card
- Share links

**Future:**
- Animated exports (GIF/MP4)
- Live screenshots

---

Want me to **add image export to the frontend agent**? Quick win, big UX improvement! 🖼️
