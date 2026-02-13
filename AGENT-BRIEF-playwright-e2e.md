# Agent Brief: playwright-e2e

**Role:** E2E Testing Engineer (Playwright)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Set up Playwright and write comprehensive E2E tests for critical user flows.

## Tasks

1. **Install Playwright**
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Create Playwright config** (`playwright.config.ts`)
   - Base URL: http://localhost:5173
   - Browsers: chromium, firefox, webkit
   - Screenshots on failure
   - Video on first retry
   - Test timeout: 30 seconds

3. **Create test utilities** (`tests/e2e/utils/`)
   - `auth.ts` - signup, login, logout helpers
   - `firebase.ts` - cleanup test data
   - `selectors.ts` - common selectors

4. **Write E2E tests** (`tests/e2e/`)

   **Test 1: Anonymous User Flow** (`anonymous.spec.ts`)
   - ✅ Can upload image
   - ✅ Can customize dark palette
   - ✅ Can export CSS, JSON, PNG
   - ✅ Can view guide page
   - ✅ Sees "Sign up to save" prompts (dismissible)

   **Test 2: Authentication** (`auth.spec.ts`)
   - ✅ Can sign up with email/password
   - ✅ Shows validation errors (weak password, invalid email)
   - ✅ Can login
   - ✅ Can logout
   - ✅ Auth state persists across page reload
   - ✅ UserMenu shows after login

   **Test 3: Palette Management** (`palette-crud.spec.ts`)
   - ✅ Can save palette to library
   - ✅ Palette appears in /library
   - ✅ Can load palette from library
   - ✅ Can edit existing palette
   - ✅ Can delete palette (with confirmation)
   - ✅ Can filter/search palettes

   **Test 4: Projects** (`projects.spec.ts`)
   - ✅ Can create project
   - ✅ Can assign palette to project
   - ✅ Can view project detail page
   - ✅ Can filter projects by client
   - ✅ Can export all project palettes as ZIP

   **Test 5: Sharing** (`sharing.spec.ts`)
   - ✅ Can generate public share link
   - ✅ Public link works (read-only view)
   - ✅ Can invite collaborator by email
   - ✅ Can fork public palette to own library

   **Test 6: Iterations** (`iterations.spec.ts`)
   - ✅ Can save iteration with comment
   - ✅ Iteration appears in timeline
   - ✅ Can vote on iteration
   - ✅ Most voted iteration shows "Best Version" badge
   - ✅ Can load iteration into generator

   **Test 7: Accessibility Presets** (`accessibility.spec.ts`)
   - ✅ Can select WCAG AA preset
   - ✅ Can select WCAG AAA preset
   - ✅ Can select APCA Optimized preset
   - ✅ Validation badge shows pass/fail
   - ✅ Auto-fix adjusts failing colors
   - ✅ Before/after preview works

   **Test 8: Mobile Responsive** (`mobile.spec.ts`)
   - ✅ All pages work on mobile viewport (375x667)
   - ✅ Modals are fullscreen on mobile
   - ✅ Touch interactions work
   - ✅ Nav collapses on mobile

5. **Add test scripts to package.json**
   ```json
   {
     "test:e2e": "playwright test",
     "test:e2e:ui": "playwright test --ui",
     "test:e2e:debug": "playwright test --debug",
     "test:e2e:report": "playwright show-report"
   }
   ```

6. **GitHub Actions CI** (`.github/workflows/e2e.yml`)
   - Run E2E tests on every PR
   - Upload test artifacts (screenshots, videos)
   - Fail PR if tests fail

7. **Test Firebase cleanup**
   - After each test, delete created palettes/projects/users
   - Use Firebase Admin SDK for cleanup
   - Ensure tests don't pollute production database

## Expected Deliverables

- ✅ `playwright.config.ts`
- ✅ `tests/e2e/anonymous.spec.ts`
- ✅ `tests/e2e/auth.spec.ts`
- ✅ `tests/e2e/palette-crud.spec.ts`
- ✅ `tests/e2e/projects.spec.ts`
- ✅ `tests/e2e/sharing.spec.ts`
- ✅ `tests/e2e/iterations.spec.ts`
- ✅ `tests/e2e/accessibility.spec.ts`
- ✅ `tests/e2e/mobile.spec.ts`
- ✅ Test utilities (`auth.ts`, `firebase.ts`, `selectors.ts`)
- ✅ `.github/workflows/e2e.yml` (CI config)
- ✅ All tests pass

## Success Criteria

- All 8 test suites pass
- Tests run in < 5 minutes
- Test coverage: 80%+ of critical flows
- No flaky tests (run 3 times, all pass)
- CI pipeline works on GitHub Actions

## References

- Playwright Docs: https://playwright.dev/
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- GitHub Actions: https://docs.github.com/en/actions

---

**Start now!** 🔥
