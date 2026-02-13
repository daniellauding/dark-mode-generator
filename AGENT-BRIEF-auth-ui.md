# Agent Brief: auth-ui

**Role:** Frontend Developer (Authentication UI)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Build login/signup modals and user menu UI that integrates with Firebase auth helpers.

## Prerequisites

- Wait for `firebase-setup` agent to finish (creates `src/firebase/auth.ts`)
- If not ready, check their progress: `tmux attach -t firebase-setup`

## Tasks

1. **Create LoginModal** (`src/components/auth/LoginModal.tsx`)
   - Email + password inputs
   - "Login" button
   - "Don't have an account? Sign up" link (switches to SignupModal)
   - "Forgot password?" link (optional for MVP)
   - Error handling (show Firebase error messages)
   - Loading state while authenticating
   - Close button (X)

2. **Create SignupModal** (`src/components/auth/SignupModal.tsx`)
   - Email + password inputs
   - "Sign Up" button
   - "Already have an account? Login" link (switches to LoginModal)
   - Password strength indicator (optional)
   - Terms of service checkbox (optional)
   - Error handling
   - Loading state
   - Close button

3. **Create UserMenu** (`src/components/auth/UserMenu.tsx`)
   - Avatar (user initials or default icon)
   - Dropdown menu:
     - My Library
     - Settings
     - Logout
   - Show user email
   - Handle logout (call `signOut()` from firebase/auth.ts)

4. **Update Nav component** (`src/components/Nav.tsx`)
   - Add "Sign In" button (top-right) when NOT logged in
   - Show UserMenu when logged in
   - Use `onAuthStateChange()` to detect auth state

5. **Auth State Management**
   - Create React Context or Zustand store for auth state
   - Track: `user`, `loading`, `error`
   - Listen to `onAuthStateChange()` from firebase/auth.ts
   - Provide auth state to entire app

6. **Non-intrusive Prompts**
   - After user customizes palette, show toast: "Sign up to save this palette"
   - Toast should be dismissible
   - Don't block workflow (anonymous mode still works)

7. **Mobile Responsive**
   - Modals fullscreen on mobile, centered on desktop
   - User menu works on small screens
   - Touch-friendly buttons

## Design System

Match existing dark theme:
- Background: `#0b0f19`
- Surface: `#1a1f2e`
- Text: `#e0e0e0`
- Primary: `#3b82f6`
- Inputs: Dark with subtle borders
- Modals: Backdrop blur + dark overlay

## Expected Deliverables

- ✅ `src/components/auth/LoginModal.tsx`
- ✅ `src/components/auth/SignupModal.tsx`
- ✅ `src/components/auth/UserMenu.tsx`
- ✅ Updated `src/components/Nav.tsx` (sign in button + user menu)
- ✅ Auth state management (Context or Zustand)
- ✅ Non-intrusive "Sign up to save" prompts
- ✅ Mobile responsive
- ✅ Build succeeds

## Success Criteria

- User can open LoginModal from Nav
- User can sign up via SignupModal
- After login, UserMenu appears in Nav
- User can logout via UserMenu
- Auth state persists across page reloads
- Anonymous users see "Sign up to save" prompts (dismissible)
- Works on mobile

## References

- Existing design system: `src/index.css`
- Firebase auth helpers: `src/firebase/auth.ts` (created by firebase-setup agent)
- React Context: https://react.dev/reference/react/useContext
- Zustand: https://github.com/pmndrs/zustand (if preferred)

---

**Start now!** 🔥
