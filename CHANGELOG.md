# Changelog

All notable changes to Dark Mode Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-02-12

### 🎉 Major Release: Firebase User Accounts & Collaboration

### Added

#### Authentication
- Email/password signup and login
- Persistent authentication (stay logged in)
- User profile with avatar
- Anonymous mode preserved (no login required to use tool)

#### Palette Management
- Save palettes to personal library
- Assign palettes to projects
- Add tags for organization (e.g., "mobile", "rebrand")
- Filter palettes by project, tag, platform, privacy
- Search palettes by name/tag
- Edit existing palettes
- Delete palettes (soft delete)

#### Projects & Organization
- Create projects (e.g., "Website Rebrand 2026")
- Assign client names to projects
- View all palettes in a project
- Filter projects by client
- Export all project palettes as ZIP (CSS + JSON)

#### Sharing & Collaboration
- Generate public share links
- Invite collaborators by email
- Permission system (Owner, Collaborator, Public)
- Expiring links (30 days or forever)
- Fork public palettes to your library
- Collaborators can add iterations and vote

#### Iterations & Voting
- Save multiple versions of a palette
- Add comments to iterations
- Upvote/downvote iterations
- "Best Version" badge on most-voted iteration
- Load any iteration into generator
- Timeline view (like Git commits)

#### Accessibility Features
- WCAG AA preset (4.5:1 contrast)
- WCAG AAA preset (7:1 contrast)
- APCA Optimized preset (modern dark mode best practices)
- Real-time validation badge (✅ or ❌)
- "Auto-Fix" button for failing colors
- Before/after preview for auto-fix

#### Components
- `src/components/auth/AuthModal.tsx` - Login/signup flow
- `src/components/auth/UserMenu.tsx` - User dropdown menu
- `src/components/palette/SavePaletteModal.tsx` - Save palette with metadata
- `src/components/palette/ShareModal.tsx` - Share links & invites
- `src/components/palette/DeleteConfirmModal.tsx` - Delete confirmation
- `src/components/palette/IterationTimeline.tsx` - Version history
- `src/components/palette/AddIterationModal.tsx` - Add iteration with comment
- `src/components/project/CreateProjectModal.tsx` - Create project
- `src/components/AccessibilityPanel.tsx` - WCAG/APCA presets
- `src/pages/Library.tsx` - Palette library page
- `src/pages/Projects.tsx` - Projects list
- `src/pages/ProjectDetail.tsx` - Project detail page
- `src/pages/PublicPalette.tsx` - Public share view

#### Firebase Integration
- Firebase Authentication (email/password)
- Firebase Realtime Database
- Security rules for users, palettes, projects, shares, iterations
- Database helpers: `src/firebase/auth.ts`, `src/firebase/database.ts`

#### Routes
- `/library` - User's saved palettes
- `/projects` - User's projects
- `/projects/:id` - Project detail
- `/palette/:shareId` - Public palette view

### Changed
- Nav component now shows "Sign In" button or UserMenu based on auth state
- Preview page shows "Save to Library" button (logged in only)
- Design store now tracks `editingPaletteId` for palette editing

### Security
- Owner-only write access for palettes
- Collaborators can add iterations (not delete palettes)
- Public palettes are read-only
- Share creation restricted to palette owners
- Iteration creation restricted to owners + collaborators

### Technical
- Added Firebase SDK dependencies
- Added Zustand for state management
- TypeScript types for SavedPalette, Project, Iteration, etc.
- APCA contrast validation utilities
- Color conversion utilities (WCAG AA/AAA adjustments)

### Performance
- Build size: 1.18 MB JS (354 KB gzipped)
- Bundle warning: chunks larger than 500 KB (will optimize in v2.1)

---

## [1.0.0] - 2026-02-10

### Initial Release

#### Core Features
- Upload image and extract color palette
- Generate dark mode palette from light mode
- 3 visual presets: Midnight, Dimmed, AMOLED
- Customization sliders: Background Darkness, Text Lightness, Accent Saturation
- APCA contrast validation
- Export: CSS Variables, JSON, Tailwind Config, PNG

#### Pages
- Landing page with hero, features, examples
- Upload page (drag-drop or URL)
- Analysis page (color extraction)
- Preview page (customization + export)
- Guide page (dark mode best practices)

#### Design
- Dark theme UI (#0b0f19 background, #3b82f6 primary)
- Mobile-responsive
- Tailwind CSS v4
- Framer Motion animations

---

## Upcoming (v2.1)

### Planned Features
- Real image color extraction (ML-powered)
- Google/GitHub OAuth login
- Font preview with selected colors
- Typography recommendations for dark mode
- Email invites (Firebase Functions + SendGrid)
- Code splitting for smaller bundle size
- Desktop app (Electron)

---

**Full documentation:** See [RELEASE-NOTES.md](./RELEASE-NOTES.md) for detailed use cases and examples.
