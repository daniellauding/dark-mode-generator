# Dark Mode Generator - Component Documentation

## Design Tokens

All tokens are in `tokens/design-tokens.json` (DTCG format) and `tokens/tokens.css` (CSS custom properties).

### Core Values
- **Background**: `#0b0f19` (navy-tinted dark)
- **Primary**: `#3b82f6` (blue-500)
- **Font**: Inter (UI) / JetBrains Mono (code)
- **Base spacing**: 4px
- **Default radius**: 6-8px

---

## Components

### 1. Buttons

**Variants**: Primary, Secondary, Outline, Ghost, Destructive, Link
**Sizes**: SM (32px), MD (40px), LG (48px)

| Size | Height | Font Size | Padding | Radius |
|------|--------|-----------|---------|--------|
| SM   | 32px   | 13px      | 6px 12px | 4px  |
| MD   | 40px   | 14px      | 8px 16px | 6px  |
| LG   | 48px   | 16px      | 10px 24px | 8px |

**States**: default, hover, active, focus-visible, disabled (0.5 opacity)

**Usage**:
- Primary: Main CTAs ("Generate Dark Mode", "Download")
- Secondary: Secondary actions ("Preview", "Customize")
- Outline: Tertiary actions, form cancels
- Ghost: Toolbar buttons, icon buttons
- Destructive: Delete/remove actions
- Link: Inline text links that look like buttons

```jsx
<Button variant="primary" size="md">Generate Dark Mode</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" size="md" disabled>Delete</Button>
```

---

### 2. Input Fields

**Types**: Text, URL, Search (with icon), Select, Textarea
**States**: default, hover, focus, error, disabled

| Property      | Value                     |
|---------------|---------------------------|
| Height        | 40px                      |
| Font size     | 14px                      |
| Padding       | 10px 12px                 |
| Border        | 1px solid `--border-default` |
| Radius        | 6px                       |
| Focus ring    | 3px blue glow             |
| Error border  | `--border-error` (#ef4444)|

**Structure**:
```
input-group
  ├── input-label (optional .required indicator)
  ├── input-wrapper (optional, for icon inputs)
  │   ├── input-icon
  │   └── input
  └── input-helper OR input-error-msg
```

---

### 3. Color Swatches

**Sizes**: Small (32px), Medium (48px), Large (72px)

| Size   | Dimensions | Radius | Border | Use Case              |
|--------|-----------|--------|--------|-----------------------|
| Small  | 32×32px   | 6px    | 2px    | Inline palette strips |
| Medium | 48×48px   | 8px    | 2px    | Extracted color lists  |
| Large  | 72×72px   | 12px   | 2px    | Color detail/editing   |

**Interactions**: Hover scales to 1.05 with shadow. Click to select/edit.

---

### 4. Color Picker Panel

**Dimensions**: 280px wide, auto height
**Background**: `--bg-secondary` with `--shadow-lg`

**Structure**:
```
color-picker (280px)
  ├── cp-saturation (full width × 160px, crosshair cursor)
  │   └── cp-cursor (16px circle, draggable)
  ├── cp-hue-slider (14px height, rainbow gradient)
  │   └── cp-hue-thumb (18px circle, draggable)
  ├── cp-hex-row (HEX input + preview swatch)
  ├── cp-inputs (R/G/B row)
  └── cp-inputs (H/S/L row)
```

---

### 5. Sliders

**Track**: 6px height, `--bg-tertiary`, full radius
**Thumb**: 20px circle, `--brand-primary`, white 2px border, blue glow shadow

**Structure**:
```
slider-group
  ├── slider-header
  │   ├── slider-label (left)
  │   └── slider-value (right, blue tinted badge)
  └── input[type=range].slider
```

**Presets** (3 modes):
- Gentle: Brightness -80%, Contrast 105%, Saturation -10%
- Standard: Brightness -85%, Contrast 110%, Saturation -20%
- High Contrast: Brightness -90%, Contrast 120%, Saturation -30%

---

### 6. Upload Zone

**Padding**: 48px 32px
**Border**: 2px dashed `--border-subtle`
**Radius**: 12px

**States**:
- Default: Dashed border, muted icon
- Hover: Border turns blue, background tints blue
- Drag over: Blue glow shadow, slight scale (1.01)

**Includes**: Drag-drop area + "or" divider + URL input + Capture button

---

### 7. Before/After Comparison

**Layout**: CSS Grid, 2 columns (1fr 1fr), 2px gap
**Radius**: 12px (outer container)

**Panels**:
- Left: Light mode (white bg, dark text)
- Right: Dark mode (secondary bg, light text)

Each panel has:
- Label badge (BEFORE/AFTER with colored dot)
- Mock content cards demonstrating the transformation

---

### 8. Contrast Indicators

**Badge variants**: Pass (green), Warn (amber), Fail (red)
**Badge format**: `APCA [score] - [status]` with status icon

**Contrast Cards**:
- Preview swatch (64×44px) showing text on background
- APCA score (mono font, bold)
- Color pair description
- Pass/fail badge

**APCA Thresholds**:
- 60+: Pass for body text (16px+)
- 90+: Pass for small text (12-14px)
- 45-59: Warning (decorative only)
- Below 45: Fail

---

### 9. Export Modal

**Max width**: 480px
**Radius**: 16px
**Shadow**: `--shadow-xl`

**Structure**:
```
modal-backdrop (overlay)
  └── modal
      ├── modal-header (title + close button)
      ├── modal-body
      │   ├── export-tabs (CSS | JSON | PNG)
      │   └── code-preview (syntax highlighted)
      └── modal-footer (Cancel + Download button)
```

**Export formats**:
- CSS Variables (`:root { --var: value }`)
- JSON Tokens (design token format)
- PNG Screenshot (comparison image)

---

### 10. Toast Notifications

**Max width**: 400px
**Radius**: 8px
**Shadow**: `--shadow-lg`

**Variants**: success (green), error (red), warning (amber), info (blue)
**Left border accent**: 3px solid status color

**Structure**:
```
toast .toast-[variant]
  ├── toast-icon (20px, status colored)
  ├── toast-content
  │   ├── toast-title (14px, semibold)
  │   └── toast-message (13px, secondary color)
  └── toast-close (24px button)
```

**Animation**: Slides up with fade-in (300ms ease)
**Auto-dismiss**: 5s for success/info, persistent for error/warning

---

## Additional Components

### Toggle Switch
- Width: 44px, Height: 24px
- Thumb: 18px white circle
- Off: `--bg-active`, On: `--brand-primary`
- Transition: 150ms ease

### Badges/Tags
- Padding: 2px 8px, full radius
- Variants: default, primary, success, error, warning
- Font: 12px/500

### Select/Dropdown
- Same height/styling as inputs (40px)
- Custom chevron icon via background-image
- Focus ring matches input focus

---

## Z-Index Scale

| Layer    | Value | Usage                    |
|----------|-------|--------------------------|
| base     | 0     | Content                  |
| dropdown | 10    | Dropdowns, popovers      |
| sticky   | 20    | Sticky header            |
| overlay  | 30    | Modal backdrop           |
| modal    | 40    | Modal dialog             |
| toast    | 50    | Toast notifications      |
