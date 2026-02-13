# Firebase Setup Guide

## 1. Environment Variables

Create a `.env.local` file in the project root with your Firebase config:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

These are read at build time via `import.meta.env` (Vite).

## 2. Project Structure

```
src/firebase/
  config.ts    - Firebase app initialization (exports app, auth, database)
  auth.ts      - Auth helpers (signup, login, logout, onAuthChange, getCurrentUser)
  database.ts  - Realtime Database CRUD (savePalette, loadPalettes, deletePalette, updatePalette)
```

## 3. Deploy Security Rules

Install the Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

Then deploy the rules:

```bash
firebase login
firebase init database   # select the existing project, use firebase-rules.json
firebase deploy --only database
```

The rules in `firebase-rules.json` ensure:
- Users can only read/write their own data under `/users/$uid`
- Palettes are readable if public, owned by the user, or shared with the user
- Palettes are writable only by the owner or users in the `sharedWith` list

## 4. Testing Auth

```ts
import { signup, login, logout, getCurrentUser, onAuthChange } from './firebase/auth';

// Sign up
const cred = await signup('test@example.com', 'password123');
console.log('Signed up:', cred.user.uid);

// Listen to auth state
const unsubscribe = onAuthChange((user) => {
  console.log('Auth state:', user?.email ?? 'signed out');
});

// Login
await login('test@example.com', 'password123');

// Get current user
const user = getCurrentUser();
console.log('Current user:', user?.email);

// Logout
await logout();

// Cleanup listener
unsubscribe();
```

## 5. Testing Database

```ts
import { savePalette, loadPalettes, updatePalette, deletePalette } from './firebase/database';

const userId = 'user-uid-from-auth';

// Save a palette
const paletteId = await savePalette(userId, {
  name: 'My Dark Theme',
  lightPalette: { /* DesignPalette */ },
  darkPalette: { /* DarkPalette */ },
  preset: 'midnight',
  bgDarkness: 90,
  textLightness: 95,
  accentSaturation: 80,
  privacy: 'private',
});

// Load all palettes for user
const palettes = await loadPalettes(userId);
console.log('Palettes:', palettes.length);

// Update a palette
await updatePalette(paletteId, { name: 'Updated Theme' });

// Soft-delete a palette
await deletePalette(paletteId);
```
