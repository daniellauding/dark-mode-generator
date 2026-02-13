# Agent Brief: vitest-unit

**Role:** Unit Testing Engineer (Vitest + React Testing Library)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Set up Vitest and write comprehensive unit tests for components, utilities, and hooks.

## Tasks

1. **Install Vitest & Testing Library**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

2. **Create Vitest config** (`vitest.config.ts`)
   - Test environment: jsdom
   - Setup file: `tests/setup.ts`
   - Coverage: Istanbul
   - Coverage threshold: 80%

3. **Create test setup** (`tests/setup.ts`)
   - Import @testing-library/jest-dom
   - Mock Firebase (avoid real API calls)
   - Mock Zustand stores

4. **Write Unit Tests**

   **Test 1: Firebase Helpers** (`src/firebase/auth.test.ts`)
   - ✅ `signUp()` - creates user
   - ✅ `signIn()` - authenticates user
   - ✅ `signOut()` - logs out user
   - ✅ `onAuthStateChange()` - listens to auth state
   - ✅ Error handling (invalid email, wrong password)

   **Test 2: Database Helpers** (`src/firebase/database.test.ts`)
   - ✅ `savePalette()` - saves to Firebase
   - ✅ `loadPalettes()` - fetches user's palettes
   - ✅ `deletePalette()` - soft deletes
   - ✅ `updatePalette()` - updates existing
   - ✅ `createProject()` - creates project
   - ✅ `loadProjects()` - fetches projects

   **Test 3: Color Utilities** (`src/utils/colorConversion.test.ts`)
   - ✅ `convertToAPCA()` - calculates APCA Lc
   - ✅ `adjustForWCAGAA()` - adjusts to 4.5:1
   - ✅ `adjustForWCAGAAA()` - adjusts to 7:1
   - ✅ `applyAPCAOptimized()` - applies #121212/#e4e4e4
   - ✅ `validateAccessibility()` - validates palette
   - ✅ `autoFixPalette()` - fixes failing colors

   **Test 4: APCA Utilities** (`src/utils/apca.test.ts`)
   - ✅ `calculateAPCA()` - accurate Lc values
   - ✅ Edge cases: pure black, pure white, same color
   - ✅ Known values (e.g., #121212 bg + #e4e4e4 text = ~90 Lc)

   **Test 5: Hooks** (`src/hooks/useAuth.test.tsx`)
   - ✅ `useAuth()` - returns user state
   - ✅ `useAuth()` - updates on login/logout
   - ✅ `usePermissions()` - checks owner/collaborator/public

   **Test 6: Components** (`src/components/`)

   **AuthModal.test.tsx**
   - ✅ Renders login form
   - ✅ Switches to signup on link click
   - ✅ Shows validation errors
   - ✅ Calls signIn on submit
   - ✅ Closes on X button

   **UserMenu.test.tsx**
   - ✅ Shows user email
   - ✅ "My Library" link navigates to /library
   - ✅ "Logout" calls signOut
   - ✅ Dropdown opens/closes on click

   **SavePaletteModal.test.tsx**
   - ✅ Renders form fields
   - ✅ Loads projects on mount
   - ✅ Creates new project inline
   - ✅ Calls savePalette on submit
   - ✅ Shows success toast

   **AccessibilityPanel.test.tsx**
   - ✅ Renders dropdown with presets
   - ✅ Selecting WCAG AA adjusts colors
   - ✅ Validation badge shows pass/fail
   - ✅ Auto-fix button appears when failing
   - ✅ Before/after preview works

   **IterationTimeline.test.tsx**
   - ✅ Renders iteration cards
   - ✅ Vote button increments vote count
   - ✅ "Best Version" badge on most voted
   - ✅ Load button calls loadIteration

5. **Add test scripts to package.json**
   ```json
   {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage",
     "test:watch": "vitest --watch"
   }
   ```

6. **Coverage report** (`.github/workflows/test.yml`)
   - Run unit tests on every PR
   - Upload coverage to Codecov
   - Fail PR if coverage < 80%

7. **Mock Firebase** (`tests/mocks/firebase.ts`)
   - Mock Auth methods (signUp, signIn, signOut)
   - Mock Database methods (savePalette, loadPalettes)
   - Return fake data for tests

## Expected Deliverables

- ✅ `vitest.config.ts`
- ✅ `tests/setup.ts`
- ✅ `src/firebase/auth.test.ts`
- ✅ `src/firebase/database.test.ts`
- ✅ `src/utils/colorConversion.test.ts`
- ✅ `src/utils/apca.test.ts`
- ✅ `src/hooks/useAuth.test.tsx`
- ✅ `src/components/auth/AuthModal.test.tsx`
- ✅ `src/components/auth/UserMenu.test.tsx`
- ✅ `src/components/palette/SavePaletteModal.test.tsx`
- ✅ `src/components/AccessibilityPanel.test.tsx`
- ✅ `src/components/palette/IterationTimeline.test.tsx`
- ✅ `tests/mocks/firebase.ts`
- ✅ `.github/workflows/test.yml` (CI config)
- ✅ All tests pass
- ✅ Coverage report: 80%+

## Success Criteria

- All test suites pass
- Tests run in < 30 seconds
- Coverage: 80%+ (utilities, hooks, components)
- No console warnings during tests
- CI pipeline works on GitHub Actions

## References

- Vitest Docs: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Jest DOM matchers: https://github.com/testing-library/jest-dom

---

**Start now!** 🔥
