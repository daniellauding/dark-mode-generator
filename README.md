# Dark Mode Generator

**Transform any light mode design to dark mode in 30 seconds—with perfect contrast, every time.**

APCA-validated dark mode conversion tool. Upload a design or enter a URL, get an accessible dark mode version with customizable presets and multiple export formats.

## Features

- 🎨 **Automatic color extraction** from images or URLs
- 🌙 **Smart dark mode conversion** with APCA contrast validation
- ⚡ **Real-time customization** - 3 presets + granular sliders
- ♿ **Accessibility-first** - WCAG 2.1 AAA compliant
- 📤 **Multiple export formats** - CSS Variables, JSON tokens, Tailwind config, PNG
- 📱 **Fully responsive** - Mobile-first design

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Zustand (state management)
- Chroma.js (color manipulation)

**Backend:**
- Node.js + Express
- Puppeteer (screenshot capture)
- Vibrant.js (color extraction)
- APCA-W3 (contrast validation)
- Sharp (image processing)

**Design:**
- Design tokens (DTCG format)
- Component library (HTML reference)
- Responsive specs (320px-1440px)

## Project Structure

```
dark-mode-generator/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages (Landing, Upload, Analysis, Preview)
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # APCA, color conversion, exports
│   │   ├── stores/      # Zustand state
│   │   └── types/       # TypeScript types
│   └── package.json
│
├── server/              # Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Puppeteer, color, APCA services
│   │   ├── utils/       # Dark mode algorithm
│   │   └── types/       # TypeScript types
│   └── package.json
│
├── design-system/       # Design reference
│   ├── tokens/          # Design tokens (JSON + CSS)
│   ├── component-library.html
│   └── docs/            # Responsive specs, component docs
│
└── docs/
    └── COMPLETE-DESIGN-DOC.md  # Full product spec (3,847 words)
```

## Local Development

### Frontend
```bash
cd client
npm install
npm run dev
# Opens http://localhost:5173
```

### Backend
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:3001
# Swagger docs: http://localhost:3001/docs
```

## Deployment

### Frontend (Netlify)

**Build settings:**
- Build command: `cd client && npm install && npm run build`
- Publish directory: `client/dist`
- Node version: 20

**Environment variables:**
- `VITE_API_URL`: Backend API URL (e.g., `https://api.darkmodegen.app`)

### Backend (Railway/Render/Fly.io)

**Build command:**
```bash
cd server && npm install && npm run build
```

**Start command:**
```bash
cd server && npm start
```

**Environment variables:**
- `PORT`: 3001 (or dynamic from platform)
- `NODE_ENV`: production

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/screenshot` | POST | Capture webpage screenshot |
| `/api/extract-colors` | POST | Extract color palette from image |
| `/api/convert-to-dark` | POST | Convert colors to dark mode |
| `/api/validate-contrast` | POST | APCA contrast validation |
| `/api/export-image` | POST | Generate before/after PNG |
| `/docs` | GET | Swagger UI documentation |

See `server/src/openapi.ts` for full OpenAPI spec.

## Design System

View the component library:
```bash
open design-system/component-library.html
```

Design tokens available in:
- JSON: `design-system/tokens/design-tokens.json`
- CSS: `design-system/tokens/tokens.css`

## Accessibility

- **WCAG 2.1 AAA** compliance
- **APCA thresholds:** 90+ (small text), 60+ (body), 45+ (large), 30+ (non-text)
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader support (ARIA labels, live regions)
- High-contrast mode support
- Reduced motion support

## License

MIT

## Credits

Built by a parallel agent team:
- 🎨 Designer (Figma component library)
- ⚛️ Frontend Developer (React app)
- 🔧 Backend Developer (API services)
- ♿ Accessibility Specialist (WCAG AAA audit)

Managed by **laubot** (OpenClaw AI) for **Daniel Lauding** (@supdawgx)
