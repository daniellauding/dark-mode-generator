# Agent Brief: sharing-collab

**Role:** Full-Stack Developer (Sharing & Collaboration)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 3-4 hours

## Your Mission

Build sharing system: public links, invite collaborators, permissions.

## Prerequisites

- Wait for `palette-crud` (creates Library + save logic)
- Wait for `projects-organization` (creates Projects)

## Tasks

1. **Create ShareModal** (`src/components/palette/ShareModal.tsx`)
   - Two tabs: "Link" | "Invite Users"
   - **Link Tab:**
     - Public link input (read-only): `https://darkmodegen.app/palette/a3k9x`
     - Copy button (clipboard API)
     - Expiration toggle: "30 days" | "Forever"
     - Privacy toggle: "Public" | "Private"
     - "Generate Link" button (creates shareable paletteId)
   - **Invite Users Tab:**
     - Email input (validate email format)
     - "Invite" button
     - List of current collaborators:
       - Name/email
       - Role (Owner | Collaborator)
       - "Remove" button (only for owner)

2. **Create Public Palette View** (`src/pages/PublicPalette.tsx`)
   - URL: `/palette/:shareId`
   - Show palette in read-only mode:
     - Original colors
     - Dark mode colors
     - APCA scores
     - Preset used
     - Custom settings
   - "Export" button (CSS, JSON, PNG)
   - "Fork to My Library" button (if logged in)
   - "Sign up to save" button (if not logged in)
   - 404 if palette not found or expired

3. **Generate Shareable Links**
   - When user clicks "Share" on a palette:
     - If `shareId` doesn't exist, generate one (random string, e.g., `a3k9x`)
     - Write to Firebase:
       ```ts
       {
         shareId: "a3k9x",
         paletteId: "paletteId123",
         privacy: "public",
         expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
         createdAt: Date.now()
       }
       ```
     - Return link: `https://darkmodegenerator.netlify.app/palette/a3k9x`

4. **Invite Collaborators**
   - Add user's email to `sharedWith` array in palette:
     ```ts
     {
       paletteId: "paletteId123",
       sharedWith: ["userId789"], // Add collaborator's userId
     }
     ```
   - Find user by email (query Firebase `/users` by `email` field)
   - If user doesn't exist, send email invite (optional for MVP)
   - Show success toast: "Invited user@example.com"

5. **Permission Checks**
   - **Owner:** Full control (edit, delete, share)
   - **Collaborator:** Can view, add iterations, vote, comment (can't delete)
   - **Public:** View only (via public link)
   - Implement checks in:
     - Library page (only show owned + shared palettes)
     - ProjectDetail page (only show owned + shared projects)
     - SavePaletteModal (disable if collaborator tries to edit)

6. **Firebase Security Rules Update**
   - Update `firebase-rules.json`:
     ```json
     "palettes": {
       "$paletteId": {
         ".read": "data.child('privacy').val() === 'public' || data.child('userId').val() === auth.uid || data.child('sharedWith').hasChild(auth.uid)",
         ".write": "data.child('userId').val() === auth.uid || data.child('sharedWith').hasChild(auth.uid)"
       }
     }
     ```
   - Deploy updated rules: `firebase deploy --only database`

7. **Email Invites (Optional MVP+)**
   - Use Firebase Functions + SendGrid
   - Send email:
     ```
     Subject: You've been invited to collaborate on a palette
     Body: [User] invited you to collaborate on "[Palette Name]". Sign up to view: https://darkmodegen.app/palette/a3k9x
     ```

## Data Model (Firebase)

**Shared Palettes:**
```json
{
  "palettes": {
    "paletteId123": {
      "userId": "userId456",
      "sharedWith": ["userId789", "userId999"],
      ...
    }
  },
  "shares": {
    "a3k9x": {
      "paletteId": "paletteId123",
      "privacy": "public",
      "expiresAt": 1710374400000,
      "createdAt": 1707782400000
    }
  }
}
```

## Expected Deliverables

- ✅ ShareModal component (Link + Invite tabs)
- ✅ PublicPalette page (`/palette/:shareId`)
- ✅ Generate shareable links
- ✅ Invite collaborators (add to sharedWith)
- ✅ Permission checks (Owner | Collaborator | Public)
- ✅ Updated Firebase security rules
- ✅ Fork palette to own library (if logged in)
- ✅ Build succeeds

## Success Criteria

- User can share palette via public link
- Public link works (anyone can view, read-only)
- User can invite collaborators by email
- Collaborators see shared palettes in their Library
- Collaborators can view but not delete
- Owner can remove collaborators
- Expired links return 404

## References

- Firebase database helpers: `src/firebase/database.ts`
- Library page: `src/pages/Library.tsx`
- Design system: `src/index.css`

---

**Start now!** 🔥
