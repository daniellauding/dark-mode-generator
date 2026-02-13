# Agent Brief: palette-crud

**Role:** Full-Stack Developer (Palette Management)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 3-4 hours

## Your Mission

Build the palette library page, save/load/delete functionality, and integrate with Firebase.

## Prerequisites

- Wait for `firebase-setup` (creates `src/firebase/database.ts`)
- Wait for `auth-ui` (creates auth state management)

## Tasks

1. **Create Library Page** (`src/pages/Library.tsx`)
   - Grid of saved palettes (3 columns desktop, 1 mobile)
   - Each card shows:
     - Palette thumbnail (5-7 color swatches)
     - Palette name
     - Created date
     - Actions (Edit, Delete)
   - Empty state: "No saved palettes yet. Create your first one!"
   - Loading state while fetching from Firebase
   - Error state if Firebase fails

2. **Add route** (`src/App.tsx`)
   - `/library` route pointing to Library page
   - Protected route (redirect to home if not logged in)

3. **Create SavePaletteModal** (`src/components/palette/SavePaletteModal.tsx`)
   - Name input (required)
   - Project dropdown (optional, create new or select existing)
   - Tags input (comma-separated, e.g., "mobile, ios, dark")
   - Platform select (web, mobile, desktop)
   - Privacy radio (private, public)
   - "Save" button
   - Validation: Name required, max 50 chars
   - Save to Firebase via `savePalette()` from database.ts

4. **Add "Save to Library" button** (`src/pages/Preview.tsx`)
   - Show button below export options
   - Only visible if user is logged in
   - Opens SavePaletteModal
   - Disabled if no colors extracted

5. **Implement Save Logic**
   - Collect palette data:
     ```ts
     {
       userId: currentUser.uid,
       name: "Vromm App Dark Mode",
       projectId: "proj123" | null,
       tags: ["mobile", "ios"],
       platform: "mobile",
       privacy: "private",
       originalColors: [...],
       darkColors: [...],
       preset: "midnight",
       customSettings: {
         backgroundDarkness: 90,
         textLightness: 95,
         accentSaturation: 80
       },
       apcaScores: [...],
       createdAt: Date.now(),
       updatedAt: Date.now()
     }
     ```
   - Call `savePalette(userId, palette)` from database.ts
   - Show success toast: "Palette saved!"
   - Redirect to /library

6. **Implement Load Logic** (`src/pages/Library.tsx`)
   - Fetch palettes on mount: `loadPalettes(userId)`
   - Display in grid
   - Click palette card → Load into generator
   - Populate originalColors, darkColors, preset, customSettings
   - Navigate to /preview

7. **Implement Delete Logic**
   - Delete button on palette card (trash icon)
   - Confirmation modal: "Delete this palette? This can't be undone."
   - Call `deletePalette(paletteId)` from database.ts
   - Soft delete (set `deleted: true` in Firebase)
   - Remove from UI immediately
   - Show toast: "Palette deleted"

8. **Implement Edit/Update**
   - "Edit" button on palette card
   - Loads palette into generator
   - After editing, show "Save" vs "Save as New"
   - "Save" → Update existing (`updatePalette()`)
   - "Save as New" → Create new palette

9. **Filters & Search** (Optional MVP+)
   - Filter by project, tag, platform
   - Search by name
   - Sort by: Newest, Oldest, Name A-Z

## Data Model (Firebase)

```json
{
  "palettes": {
    "paletteId123": {
      "userId": "userId456",
      "name": "Vromm App Dark Mode",
      "projectId": null,
      "tags": ["mobile", "ios"],
      "platform": "mobile",
      "privacy": "private",
      "originalColors": ["#ffffff", "#000000", ...],
      "darkColors": ["#121212", "#e0e0e0", ...],
      "preset": "midnight",
      "customSettings": {
        "backgroundDarkness": 90,
        "textLightness": 95,
        "accentSaturation": 80
      },
      "apcaScores": [75, 90, 60, ...],
      "deleted": false,
      "createdAt": 1707782400000,
      "updatedAt": 1707782400000
    }
  }
}
```

## Expected Deliverables

- ✅ `/library` page (grid of palettes)
- ✅ SavePaletteModal component
- ✅ "Save to Library" button on Preview page
- ✅ Load palette into generator from library
- ✅ Delete palette (soft delete)
- ✅ Edit/update palette
- ✅ Empty/loading/error states
- ✅ Mobile responsive
- ✅ Build succeeds

## Success Criteria

- Logged-in user can save a palette
- Palette appears in /library
- User can load palette from library into generator
- User can delete palette (with confirmation)
- User can update existing palette
- All CRUD operations work with Firebase
- UI is responsive and matches dark theme

## References

- Firebase database helpers: `src/firebase/database.ts`
- Auth state: `src/components/auth/AuthContext.tsx` (or Zustand)
- Design system: `src/index.css`

---

**Start now!** 🔥
