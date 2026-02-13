# Agent Brief: testing-qa

**Role:** QA Tester  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Test all Firebase features, find bugs, verify anonymous mode still works.

## Prerequisites

- Wait for ALL 7 agents to finish:
  - firebase-setup
  - auth-ui
  - palette-crud
  - projects-organization
  - sharing-collab
  - iterations-voting
  - accessibility-presets

## Testing Checklist

### 1. Firebase Auth (auth-ui)

- [ ] User can open LoginModal from Nav
- [ ] User can sign up with email + password
- [ ] Error shown for invalid email
- [ ] Error shown for weak password (< 6 chars)
- [ ] Error shown for existing email
- [ ] User can login after signup
- [ ] UserMenu appears after login (avatar + dropdown)
- [ ] User can logout from UserMenu
- [ ] Auth state persists after page reload
- [ ] LoginModal closes with X button
- [ ] SignupModal switches to LoginModal on "Login" link

**Test on:**
- [ ] Desktop (Chrome, Safari, Firefox)
- [ ] Mobile (iOS Safari, Android Chrome)

---

### 2. Palette CRUD (palette-crud)

- [ ] "Save to Library" button shows on Preview (logged in)
- [ ] SavePaletteModal opens on click
- [ ] User can name palette
- [ ] User can select project (or none)
- [ ] User can add tags (comma-separated)
- [ ] User can select platform (web, mobile, desktop)
- [ ] User can set privacy (private, public)
- [ ] Palette saves to Firebase
- [ ] Palette appears in /library page
- [ ] Palette card shows name, date, thumbnail
- [ ] Click palette → Loads into generator
- [ ] Delete button shows confirmation modal
- [ ] Delete removes palette from library
- [ ] Edit button loads palette + allows update
- [ ] "Save" updates existing palette
- [ ] "Save as New" creates new palette

**Test on:**
- [ ] Desktop
- [ ] Mobile

---

### 3. Projects (projects-organization)

- [ ] "Create Project" button shows on /projects
- [ ] CreateProjectModal opens
- [ ] User can name project + add client
- [ ] Project saves to Firebase
- [ ] Project appears on /projects page
- [ ] Click project → Opens /projects/:id
- [ ] ProjectDetail shows all palettes in project
- [ ] User can assign palette to project (via SavePaletteModal dropdown)
- [ ] Palette appears under project
- [ ] Client filter works (filters by client name)
- [ ] Delete project shows confirmation
- [ ] Delete removes project from Firebase

**Test on:**
- [ ] Desktop
- [ ] Mobile

---

### 4. Sharing & Collaboration (sharing-collab)

- [ ] "Share" button shows on palette card
- [ ] ShareModal opens with Link + Invite tabs
- [ ] "Generate Link" creates public link
- [ ] Copy button copies link to clipboard
- [ ] Public link works (`/palette/:shareId`)
- [ ] Public palette shows read-only view
- [ ] "Fork to My Library" button works (if logged in)
- [ ] Invite user by email adds to `sharedWith`
- [ ] Collaborator sees shared palette in their library
- [ ] Collaborator can view but not delete
- [ ] Owner can remove collaborator
- [ ] Expired links return 404 (if expiration implemented)

**Test on:**
- [ ] Desktop
- [ ] Mobile
- [ ] Incognito (test public links)

---

### 5. Iterations & Voting (iterations-voting)

- [ ] "Save as Iteration" button shows on Preview (editing existing palette)
- [ ] AddIterationModal opens
- [ ] User can add comment (optional)
- [ ] Iteration saves to Firebase
- [ ] Iteration appears in IterationTimeline
- [ ] Iteration shows comment, date, author, vote count
- [ ] Upvote button works (adds vote)
- [ ] User can only vote once per iteration
- [ ] Most voted iteration shows "Best Version" badge
- [ ] "Load" button loads iteration into generator
- [ ] Loaded iteration populates colors + settings correctly

**Test on:**
- [ ] Desktop
- [ ] Mobile

---

### 6. Accessibility Presets (accessibility-presets)

- [ ] Accessibility dropdown shows on Preview
- [ ] WCAG AA preset adjusts colors to pass 4.5:1
- [ ] WCAG AAA preset adjusts colors to pass 7:1
- [ ] APCA Optimized preset uses #121212/#e4e4e4
- [ ] Validation badge shows ✅ or ❌
- [ ] Failing colors highlighted on badge click
- [ ] Auto-Fix button shows when validation fails
- [ ] Auto-Fix adjusts colors to pass
- [ ] Before/after preview shows changes
- [ ] "Apply" button confirms changes
- [ ] "Cancel" reverts changes

**Test on:**
- [ ] Desktop
- [ ] Mobile

---

### 7. Anonymous Mode (Regression Testing)

- [ ] User can upload image WITHOUT logging in
- [ ] User can extract colors WITHOUT logging in
- [ ] User can customize with presets + sliders WITHOUT logging in
- [ ] User can export (CSS, JSON, PNG) WITHOUT logging in
- [ ] "Sign up to save" prompt shows (dismissible)
- [ ] Prompt doesn't block workflow
- [ ] Anonymous user can use entire tool EXCEPT save/library

**Test on:**
- [ ] Desktop
- [ ] Mobile
- [ ] Incognito mode

---

### 8. Mobile Responsiveness

- [ ] All modals fullscreen on mobile
- [ ] All pages work on small screens (320px width)
- [ ] Buttons large enough for touch (min 44x44px)
- [ ] Text readable without zoom
- [ ] Grid layouts stack on mobile (1 column)
- [ ] Dropdowns work on mobile
- [ ] Forms submit on Enter key (mobile keyboard)

**Test on:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

---

### 9. Firebase Security Rules

- [ ] Unauthenticated user can't read `/users`
- [ ] User can only read their own `/users/:uid`
- [ ] User can't read private palettes of other users
- [ ] User can read public palettes
- [ ] User can read palettes shared with them
- [ ] User can't write to other users' palettes
- [ ] Collaborator can write iterations (not delete palette)

**Test manually:**
```bash
# Try unauthorized access in browser console
firebase.database().ref('users/otherUserId').once('value')
# Should fail with permission denied
```

---

### 10. Performance

- [ ] Library page loads in < 2 seconds (with 10 palettes)
- [ ] Preview page renders without lag
- [ ] Uploading image works smoothly
- [ ] Exporting PNG doesn't freeze UI
- [ ] Firebase writes complete in < 1 second
- [ ] No memory leaks (check dev tools)

**Test on:**
- [ ] Desktop (Chrome DevTools)
- [ ] Mobile (Safari Web Inspector)

---

## Bug Report Template

When you find a bug, write it like this:

```
**Bug:** SavePaletteModal doesn't close after saving

**Steps to Reproduce:**
1. Login
2. Upload image
3. Click "Save to Library"
4. Fill name + click Save
5. Modal stays open

**Expected:** Modal should close + redirect to /library

**Actual:** Modal stays open, palette saves but no redirect

**Severity:** Medium (annoying but doesn't break functionality)

**Platform:** Desktop Chrome 120

**Screenshot:** [attach if helpful]
```

## Expected Deliverables

- ✅ Test report (markdown file: `TEST-REPORT.md`)
- ✅ List of bugs found (with severity: Critical, High, Medium, Low)
- ✅ Verification that anonymous mode still works
- ✅ Performance metrics (load times, Firebase write times)
- ✅ Mobile responsiveness report
- ✅ Security rules test results

## Success Criteria

- All features work as expected
- Anonymous mode unaffected (can still use tool without login)
- No critical bugs (app doesn't crash)
- Mobile works smoothly
- Firebase security rules prevent unauthorized access
- Report written in markdown

## References

- All agent briefs (firebase-setup, auth-ui, etc.)
- Design system: `src/index.css`
- Firebase console: https://console.firebase.google.com/project/darkmodegenerator

---

**Start now!** 🔥
