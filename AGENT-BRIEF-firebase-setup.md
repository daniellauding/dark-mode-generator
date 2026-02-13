# Agent Brief: firebase-setup

**Role:** Firebase Integration Specialist  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Set up Firebase SDK and create auth + database helpers for the project.

## Tasks

1. **Install Firebase SDK**
   ```bash
   cd ~/Work/dark-mode-generator
   npm install firebase
   ```

2. **Create Firebase config** (`src/firebase/config.ts`)
   - Initialize Firebase app with credentials from `.env.local`
   - Export `app`, `auth`, `database` instances
   - Handle errors gracefully

3. **Create Auth helpers** (`src/firebase/auth.ts`)
   - `signUp(email, password)` - Create new user
   - `signIn(email, password)` - Login existing user
   - `signOut()` - Logout
   - `onAuthStateChange(callback)` - Listen to auth state
   - `getCurrentUser()` - Get current user object

4. **Create Database helpers** (`src/firebase/database.ts`)
   - `savePalette(userId, palette)` - Save palette to `/palettes`
   - `loadPalettes(userId)` - Fetch user's palettes
   - `deletePalette(paletteId)` - Soft delete (add `deleted: true`)
   - `updatePalette(paletteId, updates)` - Update existing palette
   - Handle Firebase Realtime Database paths correctly

5. **Write Firebase Security Rules** (`firebase-rules.json`)
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
       }
     }
   }
   ```

6. **Test locally**
   - Create test script to verify signup, login, save/load palette
   - Ensure errors are caught and logged

7. **Deploy rules to Firebase**
   ```bash
   firebase login
   firebase init database
   firebase deploy --only database
   ```

8. **Write setup README** (`docs/FIREBASE-SETUP.md`)
   - How to set up `.env.local`
   - How to deploy rules
   - How to test auth + database

## Firebase Config (from .env.local)

Already created! Check `.env.local` in project root.

```
VITE_FIREBASE_API_KEY=AIzaSyAM3Fb6Ww_bJuUiad91wXhkA3ssjBbC6Pk
VITE_FIREBASE_AUTH_DOMAIN=darkmodegenerator.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://darkmodegenerator-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=darkmodegenerator
VITE_FIREBASE_STORAGE_BUCKET=darkmodegenerator.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=840339848320
VITE_FIREBASE_APP_ID=1:840339848320:web:063c15841e23d1391ffa65
VITE_FIREBASE_MEASUREMENT_ID=G-CLP0DTXHLQ
```

## Expected Deliverables

- ✅ `src/firebase/config.ts` - Firebase app initialization
- ✅ `src/firebase/auth.ts` - Auth helpers (signup, login, logout, state listener)
- ✅ `src/firebase/database.ts` - Database CRUD helpers
- ✅ `firebase-rules.json` - Security rules
- ✅ `docs/FIREBASE-SETUP.md` - Setup guide
- ✅ Rules deployed to Firebase project
- ✅ Test script that verifies auth + database work

## Success Criteria

- User can sign up, login, logout via auth helpers
- Palettes can be saved/loaded/deleted via database helpers
- Security rules prevent unauthorized access
- All code is TypeScript with proper types
- Build succeeds with `npm run build`

## References

- Firebase Auth Docs: https://firebase.google.com/docs/auth/web/start
- Firebase Realtime Database Docs: https://firebase.google.com/docs/database/web/start
- TypeScript + Firebase: https://firebase.google.com/docs/web/setup#using-module-bundlers

---

**Start now!** 🔥
