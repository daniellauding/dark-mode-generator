# Live CSS Override — Dark Mode Any Website

## Concept

**Instead of converting a static image:**
1. User pastes website URL
2. Tool loads site in iframe (or headless browser)
3. **Extracts CSS variables + computed styles**
4. **Generates dark mode CSS overrides**
5. **Injects live** into the page
6. User sees **real-time dark mode preview** with working links, animations, etc.

**Think:** Dark Reader extension, but as a web tool with export.

---

## UX Flow

### User Journey

```
1. User pastes URL: https://stripe.com
2. Click "Generate Dark Mode"
3. Tool loads site in preview iframe
4. Analyzes CSS (variables, colors, backgrounds)
5. Generates dark mode overrides
6. Injects CSS live into iframe
7. User sees dark Stripe.com!
8. Customize (sliders, presets)
9. Export CSS or browser extension
```

### Preview Screen

```
┌─────────────────────────────────────────────────┐
│ Dark Mode Generator                  [Export ▼] │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐     ┌──────────────┐          │
│  │              │     │              │          │
│  │   Original   │  →  │  Dark Mode   │          │
│  │   (Light)    │     │   (Live!)    │          │
│  │              │     │              │          │
│  │  stripe.com  │     │  stripe.com  │          │
│  │   in iframe  │     │  + CSS inject│          │
│  │              │     │              │          │
│  └──────────────┘     └──────────────┘          │
│                                                  │
│  Customization Panel:                           │
│  ┌─────────────────────────────────────────┐    │
│  │ Preset: [Midnight ▼] [Auto] [Custom]   │    │
│  │                                         │    │
│  │ Background:  [████████░░] #121212      │    │
│  │ Text:        [░░████████] #e4e4e4      │    │
│  │ Accent:      [░░░███████] #60a5fa      │    │
│  │                                         │    │
│  │ ⚙️ Advanced:                            │    │
│  │  ☑ Override images (reduce brightness) │    │
│  │  ☑ Invert colors smartly               │    │
│  │  ☑ Force dark scrollbars               │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Implementation Options

### Option 1: Client-Side (Iframe + Injected CSS)

**Pros:**
- Fast (no server round-trip)
- Real-time editing
- Works like browser extension

**Cons:**
- **CORS issues** — can't load cross-origin sites in iframe
- Limited to same-origin or sites with permissive CORS

**How it works:**
```html
<iframe src="https://example.com" id="preview"></iframe>
```

```javascript
// Inject CSS into iframe
const iframe = document.getElementById('preview');
iframe.onload = () => {
  const doc = iframe.contentDocument;
  const style = doc.createElement('style');
  style.textContent = `
    body { background: #121212 !important; color: #e4e4e4 !important; }
    a { color: #60a5fa !important; }
    /* ... more overrides ... */
  `;
  doc.head.appendChild(style);
};
```

**Problem:** CORS blocks most external sites.

---

### Option 2: Proxy + Server-Side Injection (Recommended)

**Pros:**
- **No CORS issues** — server fetches the page
- Works with any website
- Can modify HTML before sending to client

**Cons:**
- Slower (server round-trip)
- Requires backend proxy

**Architecture:**

```
User enters URL
    ↓
Frontend sends to /api/proxy?url=https://stripe.com
    ↓
Backend (Puppeteer):
  1. Fetches stripe.com HTML
  2. Extracts CSS variables/colors
  3. Generates dark mode CSS
  4. Injects <style> tag into HTML
  5. Rewrites URLs (assets, links) to proxy
  6. Returns modified HTML
    ↓
Frontend displays in iframe (same-origin, no CORS!)
    ↓
User customizes → send new CSS → re-inject
```

**Code:**

```typescript
// server/src/routes/proxy.ts
app.get('/api/proxy', async (req, res) => {
  const { url } = req.query;
  
  // Fetch page with Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // Extract CSS variables
  const cssVars = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      bgColor: styles.backgroundColor,
      textColor: styles.color,
      // ... more
    };
  });
  
  // Generate dark mode CSS
  const darkCSS = generateDarkMode(cssVars);
  
  // Inject into page
  await page.addStyleTag({ content: darkCSS });
  
  // Get modified HTML
  const html = await page.content();
  
  // Rewrite URLs to proxy through our server
  const rewritten = rewriteUrls(html, url);
  
  res.send(rewritten);
});
```

---

### Option 3: Browser Extension (Advanced)

**Pros:**
- Full access to any site (no CORS)
- Native browser integration
- Can persist settings per-site

**Cons:**
- Separate product (not web tool)
- Requires Chrome Web Store approval
- Maintenance overhead

**How it works:**
- Extension injects content script into every page
- Content script analyzes page styles
- Sends to Dark Mode Generator API
- API returns dark CSS
- Extension applies CSS

**Use case:** Power users who want persistent dark mode on specific sites.

---

## Technical Deep Dive

### CSS Analysis (Smart Override)

**Step 1: Extract color values**

```javascript
// Get all CSS custom properties
const root = document.documentElement;
const styles = getComputedStyle(root);

// CSS variables
const vars = {};
for (const prop of styles) {
  if (prop.startsWith('--')) {
    vars[prop] = styles.getPropertyValue(prop).trim();
  }
}

// Example output:
// {
//   '--color-bg': '#ffffff',
//   '--color-text': '#000000',
//   '--color-primary': '#0066cc'
// }
```

**Step 2: Detect semantic roles**

```javascript
// Heuristics to identify role
function detectRole(varName, value) {
  if (varName.includes('bg') || varName.includes('background')) {
    return 'background';
  }
  if (varName.includes('text') || varName.includes('foreground')) {
    return 'text';
  }
  if (varName.includes('primary') || varName.includes('accent')) {
    return 'accent';
  }
  // Luminance check
  if (getLuminance(value) > 0.8) {
    return 'background'; // Likely a light background
  }
  if (getLuminance(value) < 0.2) {
    return 'text'; // Likely dark text
  }
}
```

**Step 3: Generate dark mode overrides**

```javascript
function generateDarkCSS(vars) {
  const overrides = [];
  
  for (const [varName, value] of Object.entries(vars)) {
    const role = detectRole(varName, value);
    const darkValue = convertToDark(value, role);
    overrides.push(`${varName}: ${darkValue};`);
  }
  
  return `
    :root {
      ${overrides.join('\n  ')}
    }
    
    /* Fallback for sites without CSS variables */
    body {
      background: #121212 !important;
      color: #e4e4e4 !important;
    }
    
    a { color: #60a5fa !important; }
    button { background: #1e1e1e !important; color: #e4e4e4 !important; }
    input, textarea { background: #1e1e1e !important; color: #e4e4e4 !important; border-color: #3d3d3d !important; }
  `;
}
```

**Step 4: Inject CSS**

```javascript
// In iframe
const style = document.createElement('style');
style.id = 'dark-mode-generator';
style.textContent = darkCSS;
document.head.appendChild(style);

// Update on slider change
function updateDarkMode(newSettings) {
  const existingStyle = document.getElementById('dark-mode-generator');
  if (existingStyle) {
    existingStyle.textContent = generateDarkCSS(newSettings);
  }
}
```

---

## Advanced Features

### 1. Smart Image Handling

```css
/* Reduce brightness of images */
img, video {
  filter: brightness(0.8) contrast(1.1) !important;
}

/* Invert logos/icons (if mostly white) */
img[src*="logo"], .icon {
  filter: invert(1) brightness(0.8) !important;
}
```

### 2. Override Inline Styles

```javascript
// Find all elements with inline background/color
document.querySelectorAll('[style*="background"]').forEach(el => {
  const bg = el.style.backgroundColor;
  if (getLuminance(bg) > 0.8) {
    el.style.backgroundColor = '#1e1e1e';
  }
});
```

### 3. Handle Shadow DOM

```javascript
// Find all shadow roots
function injectIntoShadowDOM(css) {
  document.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      const style = document.createElement('style');
      style.textContent = css;
      el.shadowRoot.appendChild(style);
    }
  });
}
```

### 4. Preserve Branding Colors

```javascript
// Keep brand colors (just adjust saturation/lightness)
function preserveBrand(color, role) {
  if (role === 'accent') {
    // Don't change hue, just adjust for dark mode
    const hsl = rgbToHsl(color);
    return hslToRgb({
      h: hsl.h, // Keep hue
      s: hsl.s * 0.8, // Reduce saturation 20%
      l: Math.max(hsl.l, 0.5) // Ensure it's bright enough
    });
  }
}
```

---

## Export Options

### 1. CSS File

```css
/* dark-mode-stripe.css */
:root {
  --color-bg: #121212;
  --color-text: #e4e4e4;
  --color-primary: #60a5fa;
}

body {
  background: var(--color-bg) !important;
  color: var(--color-text) !important;
}

/* ... more overrides ... */
```

**Usage:**
```html
<!-- Add to your site -->
<link rel="stylesheet" href="dark-mode-stripe.css">
```

### 2. Browser Extension

**Generate a Chrome extension:**

```javascript
// manifest.json
{
  "name": "Dark Mode for Stripe",
  "version": "1.0",
  "manifest_version": 3,
  "content_scripts": [{
    "matches": ["https://stripe.com/*"],
    "css": ["dark-mode.css"]
  }]
}
```

**User downloads ZIP:**
- manifest.json
- dark-mode.css
- icon.png

**Install:**
1. Open chrome://extensions
2. Enable Developer Mode
3. Load unpacked → select ZIP folder

### 3. Bookmarklet

```javascript
javascript:(function(){
  const style = document.createElement('style');
  style.textContent = '/* dark mode CSS */';
  document.head.appendChild(style);
})();
```

**Usage:** Drag to bookmarks bar, click on any site to apply dark mode.

### 4. Tailwind Plugin

```javascript
// tailwind-dark-stripe.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'stripe-dark-bg': '#121212',
        'stripe-dark-text': '#e4e4e4',
        'stripe-dark-primary': '#60a5fa'
      }
    }
  }
}
```

---

## UI Updates

### Upload Page (New Tab)

```
Upload your design

[Upload File]  [Paste URL]  [Live Site] ← NEW
      ↓            ↓            ↓
   Image        Screenshot   Live CSS Override
```

### Live Site Tab

```
┌─────────────────────────────────────────┐
│  Enter website URL                      │
│  ┌───────────────────────────────────┐  │
│  │ https://stripe.com                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Generate Dark Mode]                   │
│                                         │
│  💡 We'll load the site and inject     │
│  dark mode CSS in real-time. Works     │
│  with any public website!              │
└─────────────────────────────────────────┘
```

---

## Challenges & Solutions

### Challenge 1: CORS
**Problem:** Can't load external sites in iframe  
**Solution:** Proxy through backend, rewrite URLs

### Challenge 2: Dynamic Content (JS-loaded)
**Problem:** Content loads after initial CSS injection  
**Solution:** 
- MutationObserver to watch DOM changes
- Re-apply dark mode to new elements

```javascript
const observer = new MutationObserver(() => {
  applyDarkModeToNewElements();
});
observer.observe(document.body, { childList: true, subtree: true });
```

### Challenge 3: Complex Sites (React, Vue)
**Problem:** Framework-specific styling  
**Solution:** Override at CSS variable level, not DOM

### Challenge 4: Authentication Required
**Problem:** Can't proxy sites that need login  
**Solution:** Show message: "This site requires login. Try uploading a screenshot instead."

---

## Performance

### Optimization Strategies

1. **Cache proxied pages** (5 min TTL)
2. **Limit iframe dimensions** (1920×1080 max)
3. **Lazy load images** in preview
4. **Debounce slider updates** (300ms)
5. **Rate limit** proxy requests (5/min per IP)

---

## Security

### Risks

1. **SSRF (Server-Side Request Forgery)**
   - User requests internal IPs (localhost, 192.168.x.x)
   
2. **XSS via proxied content**
   - Malicious site injects scripts

3. **Resource exhaustion**
   - User requests huge pages

### Mitigations

```javascript
// Validate URL
function isValidUrl(url) {
  const parsed = new URL(url);
  
  // Block internal IPs
  if (parsed.hostname === 'localhost' || 
      parsed.hostname.startsWith('192.168.') ||
      parsed.hostname.startsWith('10.')) {
    throw new Error('Internal URLs not allowed');
  }
  
  // Only HTTP/HTTPS
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP(S) allowed');
  }
  
  return true;
}

// Sanitize HTML
function sanitizeHTML(html) {
  // Remove <script> tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  html = html.replace(/on\w+="[^"]*"/gi, '');
  
  return html;
}

// Size limit
const MAX_PAGE_SIZE = 5 * 1024 * 1024; // 5MB
```

---

## Recommendation

### Phase 1 (MVP) — 2-3 days
- ✅ **Proxy endpoint** (`/api/proxy?url=`)
- ✅ **Basic CSS extraction** (CSS variables + computed styles)
- ✅ **Simple dark mode injection** (override bg, text, accent)
- ✅ **Side-by-side preview** (original vs dark)
- ✅ **Export CSS file**

### Phase 2 (Polish) — 3-4 days
- ⏳ **Smart image handling** (brightness reduction, invert logos)
- ⏳ **Override inline styles**
- ⏳ **MutationObserver** for dynamic content
- ⏳ **Advanced customization** (per-element overrides)
- ⏳ **Export browser extension** (ZIP with manifest.json)

### Phase 3 (Advanced) — 1-2 weeks
- 🔮 **Bookmarklet generator**
- 🔮 **Tailwind plugin export**
- 🔮 **Shadow DOM handling**
- 🔮 **Persistent settings** (save per-domain preferences)
- 🔮 **Chrome Extension** (full product)

---

## Next Steps

1. **Add proxy route** to backend (`/api/proxy`)
2. **Update frontend** with "Live Site" tab
3. **Test with popular sites** (Stripe, GitHub, Medium)
4. **Handle edge cases** (auth, CORS, huge pages)
5. **Export flow** (CSS, extension, bookmarklet)

---

Want me to **update the backend agent** to add the proxy + CSS injection feature?
