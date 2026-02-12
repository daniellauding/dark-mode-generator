# Dark Mode Generator - Responsive Specs

## Breakpoints

| Name | Width   | Target          | Layout                        |
|------|---------|-----------------|-------------------------------|
| xs   | 320px   | Small mobile    | Single column, stacked        |
| sm   | 480px   | Large mobile    | Single column, wider padding  |
| md   | 768px   | Tablet          | 2-column comparison           |
| lg   | 1024px  | Small desktop   | Full layout, sidebar controls |
| xl   | 1280px  | Desktop         | Optimal reading width         |
| 2xl  | 1440px  | Large desktop   | Max container, centered       |

## Container

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| xs-sm      | 100%      | 16px    |
| md         | 100%      | 24px    |
| lg         | 1024px    | 32px    |
| xl         | 1200px    | 32px    |
| 2xl        | 1320px    | 32px    |

## Page Layouts

### Landing Page (Hero)

```
xs-sm (320-479px):
┌──────────────────────┐
│    Logo / Nav Menu    │ height: 56px
├──────────────────────┤
│                      │
│    Hero Title        │ text-3xl (30px)
│    Subtitle          │ text-base (16px)
│    [CTA Button]      │ full width
│                      │
├──────────────────────┤
│  Upload Zone         │ full width, stacked
│  (file + URL below)  │
└──────────────────────┘

md (768px):
┌────────────────────────────────┐
│  Logo          Nav Links  Menu │ height: 64px
├────────────────────────────────┤
│                                │
│      Hero Title (text-4xl)     │
│      Subtitle (text-lg)        │
│      [CTA Button - auto width] │
│                                │
├────────────────────────────────┤
│  Upload Zone (wider, centered) │
│  [file drop]  or  [URL input] │
└────────────────────────────────┘

lg+ (1024px+):
┌───────────────────────────────────────────┐
│  Logo          Nav Links       [CTA Btn]  │
├───────────────────────────────────────────┤
│                                           │
│  Left: Hero Text (5xl)  │  Right: Upload  │
│  + subtitle + CTA       │  Zone + Preview │
│                                           │
└───────────────────────────────────────────┘
```

### Editor Page (Main App)

```
xs-sm (320-479px):
┌──────────────────────┐
│  ← Back    [Export]  │ sticky header 48px
├──────────────────────┤
│                      │
│  Before (Light)      │ full width
│  ─ tabs: Before/After│
│  After (Dark)        │
│                      │
├──────────────────────┤
│  Color Palette       │ horizontal scroll
│  [■] [■] [■] [■] →  │
├──────────────────────┤
│  Presets             │
│  [Gentle][Std][High] │
├──────────────────────┤
│  Sliders             │ full width
│  Brightness ──●──    │
│  Contrast   ──●──    │
│  Saturation ──●──    │
├──────────────────────┤
│  Contrast Issues     │
│  [card] [card]       │
├──────────────────────┤
│  [Export Full Width]  │
└──────────────────────┘

md (768px):
┌────────────────────────────────┐
│  ← Back         [Settings][▼] │ 56px
├────────────────────────────────┤
│                                │
│  ┌─────────┐  ┌─────────┐    │
│  │ Before  │  │ After   │    │ side-by-side
│  │ (Light) │  │ (Dark)  │    │ min-h: 360px
│  └─────────┘  └─────────┘    │
│                                │
├────────────────────────────────┤
│  Colors: [■][■][■][■][■][■]  │
│  [Gentle] [Standard] [High]   │
├──────────┬─────────────────────┤
│ Sliders  │  Contrast Issues   │
│ ──●──    │  [card]            │
│ ──●──    │  [card]            │
│ ──●──    │  [card]            │
├──────────┴─────────────────────┤
│       [Cancel]  [Export ▼]     │
└────────────────────────────────┘

lg+ (1024px+):
┌───────────────────────────────────────────┐
│  ← Back     Dark Mode Generator    [▼][⚙]│
├─────┬────────────────────────┬────────────┤
│     │                        │            │
│ NAV │  ┌──────┐  ┌──────┐   │  CONTROLS  │
│     │  │Before│  │After │   │            │
│ ○ 1 │  │      │  │      │   │  Presets   │
│ ○ 2 │  │      │  │      │   │  ──●──     │
│ ○ 3 │  └──────┘  └──────┘   │  ──●──     │
│     │                        │  ──●──     │
│     │  Colors:               │            │
│     │  [■][■][■][■][■]      │  Issues:   │
│     │                        │  [card]    │
│     │                        │  [card]    │
├─────┴────────────────────────┴────────────┤
│                    [Export Dark Mode]       │
└───────────────────────────────────────────┘

  NAV width: 64px (collapsed icons)
  CONTROLS width: 320px (fixed sidebar)
  CENTER: flex 1 (fluid)
```

## Component Responsive Behavior

### Buttons
| Breakpoint | Behavior                           |
|------------|------------------------------------|
| xs-sm      | Full width for CTAs, inline others |
| md+        | Auto width, inline                 |

### Inputs
| Breakpoint | Behavior              |
|------------|-----------------------|
| xs-sm      | Full width, stacked   |
| md+        | Inline with buttons   |

### Upload Zone
| Breakpoint | Behavior                              |
|------------|---------------------------------------|
| xs-sm      | Compact padding (32px 16px)           |
| md         | Standard padding (48px 32px)          |
| lg+        | Can sit alongside hero text           |

### Comparison Panels
| Breakpoint | Behavior                         |
|------------|----------------------------------|
| xs-sm      | Stacked (1 column), tab switcher |
| md+        | Side-by-side (2 columns)         |

### Color Palette
| Breakpoint | Behavior                      |
|------------|-------------------------------|
| xs-sm      | Horizontal scroll, small swatches |
| md         | Wrap, medium swatches         |
| lg+        | Grid layout, large swatches   |

### Sliders
| Breakpoint | Behavior            |
|------------|---------------------|
| xs-sm      | Full width, stacked |
| md         | 2-column grid       |
| lg+        | In sidebar panel    |

### Export Modal
| Breakpoint | Behavior                          |
|------------|-----------------------------------|
| xs-sm      | Full screen (bottom sheet style)  |
| md+        | Centered dialog (max-width 480px) |

### Toasts
| Breakpoint | Position                    |
|------------|-----------------------------|
| xs-sm      | Full width, bottom of screen |
| md+        | Fixed bottom-right, 400px   |

## Touch Targets

- Minimum touch target: 44×44px (WCAG 2.5.5)
- Button SM on mobile: height remains 32px but tap area extends to 44px via padding
- Slider thumb: 20px visual, 44px touch area via transparent padding
- Close buttons: 32px visual, 44px touch area

## Typography Scale (Responsive)

| Token | xs-sm  | md     | lg+    |
|-------|--------|--------|--------|
| 5xl   | 30px   | 36px   | 48px   |
| 4xl   | 24px   | 30px   | 36px   |
| 3xl   | 20px   | 24px   | 30px   |
| 2xl   | 20px   | 24px   | 24px   |
| xl    | 18px   | 20px   | 20px   |
| lg    | 16px   | 18px   | 18px   |
| base  | 16px   | 16px   | 16px   |
| sm    | 14px   | 14px   | 14px   |
| xs    | 12px   | 12px   | 12px   |

## Spacing Scale (Responsive)

| Context        | xs-sm | md    | lg+   |
|----------------|-------|-------|-------|
| Page padding   | 16px  | 24px  | 32px  |
| Section gap    | 48px  | 64px  | 80px  |
| Card padding   | 16px  | 20px  | 24px  |
| Component gap  | 12px  | 16px  | 16px  |
| Inline gap     | 8px   | 8px   | 8px   |
