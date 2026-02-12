# Firebase User Accounts & Palette Management - Product Brief

**Project:** Dark Mode Generator v2.0  
**Date:** February 12, 2026  
**PM:** laubot  
**Approved by:** @supdawgx

---

## Executive Summary

Add Firebase Authentication + Realtime Database to enable users to:
- **Save** color palettes to their account
- **Share** palettes via public links
- **Organize** by project/client with tags
- **Collaborate** with team members
- **Track iterations** and vote on versions
- **Work anonymously** (no login required, but can't save)

**Core Principle:** Don't break existing anonymous workflow. Accounts are OPTIONAL.

---

## Current State (What Works)

✅ **Anonymous workflow:**
- Upload image → Extract colors → Generate dark mode
- Customize with presets + sliders
- APCA validation
- Export (CSS, JSON, PNG)
- Guide page with best practices

✅ **UI shown in screenshot:**
- Original palette (7 colors extracted)
- Dark mode palette with APCA Lc scores
- 3 presets: Midnight, Dimmed, AMOLED
- Fine-tune sliders: Background Darkness, Text Lightness, Accent Saturation
- APCA Contrast Check (0/6 passing indicators)

---

## New Features (Firebase-Powered)

### 1. User Authentication

**Sign Up / Login:**
- Email + Password (Firebase Auth)
- Google OAuth (optional Phase 2)
- GitHub OAuth (optional Phase 2)

**Anonymous Mode:**
- Users can use tool WITHOUT logging in
- Can't save, share, or access library
- Prompt: "Sign up to save this palette" (non-intrusive)

**UI:**
- Small "Sign In" button in header (top-right)
- Modal for login/signup (don't redirect away)
- After login: Show user avatar + dropdown (Library, Settings, Logout)

---

### 2. Palette Library (Firebase Realtime Database)

**Data Structure:**

```json
{
  "users": {
    "userId123": {
      "email": "daniel@lauding.se",
      "displayName": "Daniel Lauding",
      "createdAt": 1707782400000
    }
  },
  "palettes": {
    "paletteId456": {
      "userId": "userId123",
      "name": "Vromm App Dark Mode",
      "projectId": "projectId789",
      "tags": ["mobile", "ios", "android"],
      "platform": "mobile",
      "privacy": "private", // or "public"
      "originalColors": [...],
      "darkColors": [...],
      "preset": "midnight",
      "customSettings": {
        "backgroundDarkness": 90,
        "textLightness": 95,
        "accentSaturation": 80
      },
      "apcaScores": [...],
      "iterations": [
        {
          "id": "iter1",
          "createdAt": 1707782400000,
          "colors": [...],
          "comment": "First attempt",
          "votes": 3
        }
      ],
      "sharedWith": ["userId999"],
      "createdAt": 1707782400000,
      "updatedAt": 1707782400000
    }
  },
  "projects": {
    "projectId789": {
      "userId": "userId123",
      "name": "Vromm",
      "description": "Driving school booking app",
      "client": "Instinctly AB",
      "paletteIds": ["paletteId456"],
      "sharedWith": ["userId999"],
      "createdAt": 1707782400000
    }
  }
}
```

**Features:**

- **Save Palette:**
  - Button: "Save to Library" (after customization)
  - Modal: Name, Project (dropdown), Tags, Platform (web/mobile/desktop), Privacy
  - Auto-saves settings + colors + APCA scores

- **My Library:**
  - New page: `/library`
  - Grid view of saved palettes (thumbnail preview cards)
  - Filter: By project, tag, platform, privacy
  - Sort: Newest, Oldest, Name A-Z
  - Search: By name, tag, client

- **Edit Palette:**
  - Click saved palette → Load into generator
  - Make changes → "Save" (update) or "Save as New" (fork)

- **Delete Palette:**
  - Right-click → Delete (with confirmation)
  - Soft delete (keep in trash for 30 days)

---

### 3. Projects & Client Organization

**Project = Container for Palettes**

- **Create Project:**
  - Modal: Name, Client, Description
  - Assign palettes to project
  - Project has own tags (e.g., "rebrand-2026")

- **Project Page:**
  - `/projects/:projectId`
  - Shows all palettes in project
  - Timeline of iterations
  - Team members (if shared)
  - Export all as ZIP

- **Client Filter:**
  - Group projects by client
  - Example: "Vromm" client has 3 projects (App, Landing, Admin)

---

### 4. Sharing & Collaboration

**Share Palette:**
- Button: "Share"
- Options:
  1. **Public Link** (anyone with link can view, not edit)
     - `https://darkmodegen.app/palette/a3k9x`
     - Expire after 30 days OR keep forever (user choice)
  
  2. **Invite Collaborators** (by email)
     - They get edit access
     - Can add iterations, vote, comment

**Permissions:**
- Owner: Full control (edit, delete, share)
- Collaborator: Can view, add iterations, vote, comment (can't delete)
- Public: View only

**UI:**
- Share modal with tabs: Link | Invite Users
- Copy link button
- Email input + "Invite" button
- List of current collaborators (with Remove option)

---

### 5. Iterations & Voting

**Iteration = Version of Palette**

- **Add Iteration:**
  - After editing, click "Save as Iteration"
  - Modal: Comment (optional, e.g., "Reduced accent saturation for better contrast")
  - Saved as child of original palette

- **View Iterations:**
  - Timeline view (vertical list)
  - Each iteration shows:
    - Thumbnail preview
    - Comment
    - Date + Author
    - Vote count (upvotes)
  - Click to load iteration into generator

- **Vote:**
  - Upvote button (👍)
  - Team members can vote on iterations
  - Most voted = "Best Version" badge

**Use Case:**
- Designer creates 3 dark mode variations
- Team votes on which one to use
- Winner gets built into product

---

### 6. Accessibility Presets (WCAG Levels)

**Current:** 3 visual presets (Midnight, Dimmed, AMOLED)

**Add:** 3 accessibility-focused presets

1. **WCAG AA** (Minimum compliance)
   - Text-on-background: 4.5:1 contrast ratio
   - Large text: 3:1
   - APCA: 60+ for body, 90+ for small

2. **WCAG AAA** (Enhanced compliance)
   - Text-on-background: 7:1 contrast ratio
   - Large text: 4.5:1
   - APCA: 75+ for body, 100+ for small

3. **APCA Optimized** (Dark mode best practices)
   - Ignore WCAG 2.x ratios
   - Only focus on APCA Lc scores
   - Use recommended values from guide (#121212 bg, #e4e4e4 text)

**UI:**
- Dropdown: "Accessibility Level"
- Options: None (custom), WCAG AA, WCAG AAA, APCA Optimized
- When selected, automatically adjusts colors to pass

**Validation:**
- Real-time check: "✅ Passes WCAG AA" or "❌ Fails WCAG AAA (3 colors need adjustment)"
- Click "Auto-Fix" to adjust failing colors

---

### 7. Typography / Font Checking (Optional Future)

**Phase 2 Feature:**

- **Font Preview:**
  - User can select font (Google Fonts API)
  - Preview text at different sizes (12px, 14px, 16px, 18px, 24px)
  - Show APCA score for each size

- **Font Weight Adjustment:**
  - Slider: Regular (400) → Bold (700)
  - Show how weight affects contrast perception

- **Recommendation:**
  - "For #e4e4e4 text on #121212 bg, use Medium (500) weight instead of Regular (400) to compensate for halation"

**Not in MVP** - too complex, add later.

---

## Technical Implementation

### Firebase Setup

**Services Used:**
- **Authentication:** Email/Password
- **Realtime Database:** User data, palettes, projects
- **Storage:** (Phase 2) Upload images directly to Firebase Storage
- **Hosting:** (Optional) Can host on Firebase Hosting instead of Netlify

**Security Rules (Firebase Realtime Database):**

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "palettes": {
      "$paletteId": {
        ".read": "data.child('privacy').val() === 'public' || data.child('userId').val() === auth.uid || data.child('sharedWith').hasChild(auth.uid)",
        ".write": "data.child('userId').val() === auth.uid || data.child('sharedWith').hasChild(auth.uid)"
      }
    },
    "projects": {
      "$projectId": {
        ".read": "data.child('userId').val() === auth.uid || data.child('sharedWith').hasChild(auth.uid)",
        ".write": "data.child('userId').val() === auth.uid"
      }
    }
  }
}
```

**Environment Variables (.env.local):**

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Firebase CLI Setup:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init (Realtime Database + Hosting)
cd ~/Work/dark-mode-generator
firebase init

# Deploy database rules
firebase deploy --only database

# Deploy hosting (if using Firebase Hosting)
firebase deploy --only hosting
```

---

## Agent Responsibilities

### Agent 1: **firebase-setup** (Infrastructure)
**Role:** Firebase Integration Specialist

**Tasks:**
1. Initialize Firebase SDK in project
2. Create `src/firebase/config.ts` (Firebase app initialization)
3. Create `src/firebase/auth.ts` (Auth helpers: signup, login, logout)
4. Create `src/firebase/database.ts` (Database helpers: save, load, delete palettes)
5. Set up environment variables
6. Write Firebase security rules
7. Deploy rules to Firebase project
8. Test auth + database locally

**Deliverables:**
- Firebase SDK integrated
- Auth working (signup, login, logout)
- Database CRUD working (save/load palette)
- Security rules deployed
- README: Firebase setup instructions

**ETA:** 2-3 hours

---

### Agent 2: **auth-ui** (Authentication UI)
**Role:** Frontend Developer (Auth)

**Tasks:**
1. Create `src/components/auth/LoginModal.tsx` (email/password form)
2. Create `src/components/auth/SignupModal.tsx`
3. Create `src/components/auth/UserMenu.tsx` (avatar dropdown)
4. Add "Sign In" button to Nav (top-right)
5. Integrate with Firebase auth helpers
6. Handle auth state (logged in vs logged out)
7. Redirect to Library after login
8. Show "Sign up to save" prompts (non-intrusive)

**Deliverables:**
- Login/Signup modals functional
- User menu with Library, Settings, Logout
- Auth state management
- Mobile responsive

**ETA:** 2-3 hours

---

### Agent 3: **palette-crud** (Palette Management)
**Role:** Full-Stack Developer

**Tasks:**
1. Create `src/pages/Library.tsx` (user's saved palettes)
2. Add "Save to Library" button on Preview page
3. Create SavePaletteModal.tsx (name, project, tags, platform, privacy)
4. Implement save logic (write to Firebase)
5. Implement load logic (fetch user's palettes)
6. Implement delete logic (soft delete)
7. Implement edit (load palette into generator, allow update)
8. Filter/search/sort palettes in Library

**Deliverables:**
- /library page functional
- Save/Load/Delete working
- Filters & search
- Mobile responsive

**ETA:** 3-4 hours

---

### Agent 4: **projects-organization** (Projects & Clients)
**Role:** Backend + Frontend Developer

**Tasks:**
1. Create `src/pages/Projects.tsx` (list of projects)
2. Create `src/pages/ProjectDetail.tsx` (project page with palettes)
3. Create CreateProjectModal.tsx
4. Implement project CRUD (create, read, update, delete)
5. Assign palettes to projects
6. Client grouping (filter projects by client)
7. Project timeline (iterations)

**Deliverables:**
- /projects page functional
- Project detail page
- CRUD working
- Client filtering

**ETA:** 3-4 hours

---

### Agent 5: **sharing-collab** (Sharing & Collaboration)
**Role:** Full-Stack Developer

**Tasks:**
1. Create ShareModal.tsx (public link + invite users)
2. Generate shareable links (`/palette/:id`)
3. Create public palette view page (read-only)
4. Implement invite system (add userId to sharedWith array)
5. Send email invites (optional: use Firebase Functions + SendGrid)
6. Permission checks (owner vs collaborator vs public)
7. Collaborator list UI (show who has access, remove option)

**Deliverables:**
- Share modal functional
- Public palette links working
- Invite system working
- Permission checks in place

**ETA:** 3-4 hours

---

### Agent 6: **iterations-voting** (Iterations & Voting)
**Role:** Frontend Developer

**Tasks:**
1. Create IterationTimeline.tsx (vertical list of iterations)
2. Add "Save as Iteration" button on Preview
3. Create AddIterationModal.tsx (comment input)
4. Implement iteration save logic
5. Implement voting (upvote button)
6. Show vote count
7. Badge for "Most Voted" iteration
8. Load iteration into generator on click

**Deliverables:**
- Iteration timeline UI
- Save iteration working
- Voting functional
- Load iteration working

**ETA:** 2-3 hours

---

### Agent 7: **accessibility-presets** (WCAG Presets)
**Role:** Frontend + Algorithm Developer

**Tasks:**
1. Add "Accessibility Level" dropdown to Preview page
2. Implement WCAG AA preset (4.5:1 contrast, APCA 60+)
3. Implement WCAG AAA preset (7:1 contrast, APCA 75+)
4. Implement APCA Optimized preset (ignore WCAG 2.x, use #121212/#e4e4e4)
5. Real-time validation badge (✅ Passes WCAG AA)
6. "Auto-Fix" button (adjust failing colors)
7. Show before/after when auto-fixing

**Deliverables:**
- 3 accessibility presets working
- Validation badge
- Auto-fix functional

**ETA:** 2-3 hours

---

### Agent 8: **testing-qa** (Quality Assurance)
**Role:** QA Tester

**Tasks:**
1. Test all Firebase auth flows (signup, login, logout)
2. Test save/load/delete palettes
3. Test projects CRUD
4. Test sharing (public links, invites)
5. Test iterations & voting
6. Test accessibility presets
7. Test on mobile (responsive check)
8. Test Firebase security rules (try unauthorized access)
9. Write test report with bugs found
10. Verify existing features still work (don't break anonymous mode)

**Deliverables:**
- Test report (bugs found + severity)
- Verification that anonymous mode still works
- Regression testing complete

**ETA:** 2-3 hours

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- ✅ Agent 1: Firebase setup (2-3 hours)
- ✅ Agent 2: Auth UI (2-3 hours)
- ✅ Agent 3: Palette CRUD (3-4 hours)

**Deliverable:** Users can sign up, log in, save palettes, view library.

---

### Phase 2: Organization & Collaboration (Week 2)
- ✅ Agent 4: Projects & Clients (3-4 hours)
- ✅ Agent 5: Sharing & Collaboration (3-4 hours)
- ✅ Agent 6: Iterations & Voting (2-3 hours)

**Deliverable:** Users can organize by project, share palettes, invite team members, track iterations.

---

### Phase 3: Polish & Testing (Week 3)
- ✅ Agent 7: Accessibility Presets (2-3 hours)
- ✅ Agent 8: Testing & QA (2-3 hours)
- Polish UI (animations, loading states, error handling)
- Write documentation (how to use new features)

**Deliverable:** Production-ready with WCAG presets, fully tested.

---

## UI/UX Principles

### 1. **Don't Break Anonymous Mode**
- Users should be able to use tool WITHOUT signing up
- Show "Sign up to save" prompts, but NOT walls
- Example: After customization, show toast: "Sign up to save this palette" (dismissible)

### 2. **Progressive Disclosure**
- Don't show advanced features (projects, iterations) until user has saved a few palettes
- Start simple: Save palette → Later: Organize by project → Later: Invite team

### 3. **Fast Onboarding**
- Signup: Email + Password (no verification required for MVP)
- Auto-login after signup
- Show tutorial tooltip: "Welcome! Your palette is saved in Library"

### 4. **Mobile-First**
- All new features must work on mobile
- Library: Grid view (1 column on mobile, 3 on desktop)
- Modals: Fullscreen on mobile, centered on desktop

---

## Firebase Credentials (From User)

**Project:** (User will provide in `.env.local`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

**User has enabled:**
- Realtime Database ✅
- Storage ✅
- Authentication (Email/Password) ✅

**Security:**
- Store Firebase config in `.env.local` (NOT committed to git)
- Add `.env.local` to `.gitignore`
- User will set up environment variables in Netlify UI

---

## Success Metrics

**Adoption:**
- % of users who sign up (target: 20-30% of active users)
- % of logged-in users who save ≥1 palette (target: 80%)
- Average palettes saved per user (target: 5+)

**Collaboration:**
- % of palettes shared (target: 10-15%)
- % of projects with >1 collaborator (target: 5-10%)

**Retention:**
- % of users who return within 7 days (target: 40%)
- % of users with ≥2 projects (target: 20%)

---

## Risks & Mitigations

### Risk 1: Firebase Costs
**Problem:** Realtime Database charges per GB downloaded  
**Mitigation:** 
- Limit palette data size (compress color arrays)
- Use pagination (load 20 palettes at a time)
- Free tier: 1GB/month (enough for 1,000s of palettes)

### Risk 2: Breaking Existing Flow
**Problem:** New auth might confuse existing users  
**Mitigation:**
- Keep anonymous mode working
- Add features behind "Sign up" prompts (not walls)
- A/B test: Show signup prompt after 1st palette vs 3rd palette

### Risk 3: Complexity Overload
**Problem:** Too many features at once  
**Mitigation:**
- Ship Phase 1 first (save/load only)
- Get user feedback
- Ship Phase 2 after validation

---

## Next Steps

1. **User approves brief** ✅
2. **Spawn 8 agents** (as needed, not all at once)
3. **Start with Phase 1** (Firebase setup, Auth, Palette CRUD)
4. **Test Phase 1** before moving to Phase 2
5. **Iterate based on feedback**

---

## Questions for User

1. **Firebase Project Name?** (or should agents create it?)
2. **Netlify vs Firebase Hosting?** (Netlify is easier, Firebase gives more control)
3. **Email invites?** (requires Firebase Functions + SendGrid, or skip for MVP?)
4. **Google/GitHub OAuth?** (or just Email/Password for MVP?)
5. **Typography checking?** (Phase 2 or skip entirely?)

---

**End of Brief**

Ready to spawn agents when you approve! 🚀
