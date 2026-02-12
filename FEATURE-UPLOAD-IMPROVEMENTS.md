# Upload Experience Improvements

## Current State
- ✅ File upload (browse)
- ✅ URL input
- ❌ Paste from clipboard
- ❌ Multiple images
- ❌ Figma integration

---

## Feature 1: Paste from Clipboard

### UX Flow
```
1. User copies image (Cmd+C from Figma, screenshot, etc.)
2. User visits upload page
3. Auto-detect clipboard OR show "Paste" button
4. Click paste OR Cmd+V anywhere on page
5. Image appears, ready to convert
```

### Implementation

**Browser API:**
```javascript
// Clipboard API (modern browsers)
async function pasteFromClipboard() {
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
        const blob = await item.getType(item.types[0]);
        // Convert blob to File and process
        processImage(blob);
      }
    }
  } catch (err) {
    // Fallback: show manual paste area
    console.error('Clipboard access denied');
  }
}
```

**Keyboard Shortcut:**
```javascript
document.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      processImage(blob);
    }
  }
});
```

**UI:**
- "📋 Paste Image (Cmd+V)" button
- Highlight when clipboard contains image
- Show toast: "Image detected in clipboard! Press Cmd+V to paste"

**Permissions:**
- Chrome: Requires user gesture (button click)
- Safari: Auto-detects on focus
- Firefox: Shows permission prompt

---

## Feature 2: Multiple Images / Batch Mode

### UX Flow
```
1. User uploads 2-5 images at once
2. Show grid preview of all images
3. "Convert All" button
4. Process in parallel
5. Show results side-by-side
6. Export all as ZIP
```

### Implementation

**File Input:**
```html
<input type="file" multiple accept="image/*" />
```

**Drag & Drop:**
```javascript
dropZone.addEventListener('drop', (e) => {
  const files = Array.from(e.dataTransfer.files);
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      processImage(file);
    }
  });
});
```

**Processing:**
```javascript
async function processBatch(images) {
  const results = await Promise.all(
    images.map(img => convertToDarkMode(img))
  );
  return results;
}
```

**UI:**
- Grid layout (2×2 or 3×3)
- Individual progress bars
- "Convert All" button
- Export as ZIP with all results

**Limits:**
- Max 5 images per batch (avoid overload)
- Total size limit: 20MB combined

---

## Feature 3: Figma Integration

### Option A: Figma Plugin (Recommended)

**User Flow:**
```
1. User opens Figma plugin in Figma app
2. Select frame/component
3. Click "Generate Dark Mode"
4. Plugin exports frame as PNG
5. Sends to Dark Mode Generator API
6. Returns dark palette + creates duplicate frame
7. Applies dark colors directly in Figma
```

**Implementation:**
- Build Figma plugin (TypeScript)
- Use Figma Plugin API to:
  - Export selected frame as PNG
  - Read fill colors
  - Create duplicate frame
  - Apply dark mode colors

**Benefits:**
- Seamless workflow (stay in Figma)
- Direct color application (no manual export/import)
- Can update existing designs

**Effort:**
- Medium (2-3 days to build plugin)
- Requires Figma API knowledge

---

### Option B: Figma File URL

**User Flow:**
```
1. User pastes Figma file URL
   Example: https://figma.com/file/abc123/My-Design
2. Dark Mode Generator uses Figma API
3. Fetches file, exports frame as PNG
4. Processes like normal upload
5. Returns dark palette + export options
```

**Implementation:**

**Figma REST API:**
```javascript
// Get file data
fetch('https://api.figma.com/v1/files/FILE_KEY', {
  headers: { 'X-Figma-Token': FIGMA_ACCESS_TOKEN }
})

// Export frame as image
fetch('https://api.figma.com/v1/images/FILE_KEY?ids=NODE_ID&format=png')
```

**Requirements:**
- User must provide Figma access token (personal or OAuth)
- Or: We provide OAuth flow ("Connect Figma" button)

**Challenges:**
- Figma API rate limits (slow for free tier)
- Requires authentication
- Complex file structure (need to select frame)

**Effort:**
- High (4-5 days with OAuth flow)

---

### Option C: Figma Screenshot (Simple)

**User Flow:**
```
1. User takes screenshot in Figma (Cmd+Shift+4 on Mac)
2. Paste into Dark Mode Generator (Feature 1: Clipboard)
3. Process as normal
```

**Benefits:**
- Zero integration effort (already works with Feature 1)
- No API needed
- Fast

**Drawbacks:**
- Manual step
- Can't apply colors back to Figma

**Effort:**
- Zero (just document the workflow)

---

## Recommendation: Implementation Priority

### Phase 1 (MVP Improvements) — 1-2 days
1. ✅ **Paste from Clipboard** (easy, high impact)
2. ✅ **Better drag-drop UX** (visual feedback, error handling)
3. ✅ **Figma Screenshot workflow documentation** (zero effort)

### Phase 2 (Advanced) — 3-5 days
4. ⏳ **Multiple images / Batch mode** (medium effort, nice-to-have)
5. ⏳ **Figma Plugin** (high effort, power users)

### Phase 3 (Enterprise) — 1-2 weeks
6. 🔮 **Figma File URL** (OAuth, complex)
7. 🔮 **Sketch integration**
8. 🔮 **Adobe XD integration**

---

## Updated Upload Component (with Paste)

```tsx
// UploadZone.tsx
function UploadZone() {
  const [hasClipboardImage, setHasClipboardImage] = useState(false);
  
  // Check clipboard on mount
  useEffect(() => {
    checkClipboard();
  }, []);
  
  async function checkClipboard() {
    try {
      const items = await navigator.clipboard.read();
      const hasImage = items.some(item => 
        item.types.some(type => type.startsWith('image/'))
      );
      setHasClipboardImage(hasImage);
    } catch {
      // Permission denied or unsupported
    }
  }
  
  async function handlePaste() {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      if (item.types.includes('image/png')) {
        const blob = await item.getType('image/png');
        processImage(blob);
        break;
      }
    }
  }
  
  // Listen for Cmd+V
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) processImage(file);
        }
      }
    }
    
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, []);
  
  return (
    <div className="upload-zone">
      {/* Drag & Drop */}
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <UploadIcon />
        <p>Drag & drop your design</p>
        <p className="text-sm">or click to browse</p>
      </div>
      
      {/* Paste Button */}
      {hasClipboardImage && (
        <Button onClick={handlePaste} variant="secondary">
          📋 Paste from Clipboard (Cmd+V)
        </Button>
      )}
      
      {/* URL Input */}
      <div className="mt-4">
        <input 
          type="text" 
          placeholder="Or paste a URL (website, Figma screenshot, etc.)"
          onChange={handleUrlChange}
        />
      </div>
      
      {/* Supported Sources */}
      <p className="text-xs text-gray-500 mt-2">
        Supports: Figma screenshots, local files, URLs
      </p>
    </div>
  );
}
```

---

## UI Copy Updates

**Before:**
```
Upload your design
PNG, JPG, WebP up to 10MB
```

**After:**
```
Upload your design
• Paste from clipboard (Cmd+V)
• Drag & drop files
• Enter website URL
• Figma screenshot

PNG, JPG, WebP, SVG • Up to 10MB
```

---

## Analytics Events (for tracking usage)

```javascript
// Track which upload method is used
trackEvent('upload_method', {
  method: 'clipboard' | 'drag_drop' | 'browse' | 'url' | 'figma'
});

// Track batch mode
trackEvent('batch_upload', {
  count: images.length
});
```

---

## Next Steps

1. **Update frontend agent task** with paste + batch features
2. **Document Figma screenshot workflow** (zero-effort integration)
3. **Test clipboard API** across browsers (Chrome, Safari, Firefox)
4. **Add "Paste" button** with keyboard shortcut hint
5. **Improve drag-drop visual feedback** (show preview grid)

---

Want me to **spawn frontend agent** to implement Phase 1 (Paste + Better UX)?
