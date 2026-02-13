# Agent Brief: iterations-voting

**Role:** Frontend Developer (Iterations & Voting)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 2-3 hours

## Your Mission

Build iteration tracking system with voting for team collaboration.

## Prerequisites

- Wait for `palette-crud` (creates Library + save logic)
- Wait for `sharing-collab` (creates collaboration features)

## Tasks

1. **Create IterationTimeline** (`src/components/palette/IterationTimeline.tsx`)
   - Vertical timeline (like GitHub commits)
   - Each iteration shows:
     - Thumbnail preview (5-7 color swatches)
     - Comment (e.g., "Reduced accent saturation for better contrast")
     - Date + Author name
     - Vote count (👍 upvotes)
     - "Load" button (loads iteration into generator)
   - Most voted iteration has "Best Version" badge
   - Click to expand (show full color list + APCA scores)

2. **Add "Save as Iteration" button** (`src/pages/Preview.tsx`)
   - Show below "Save to Library" button
   - Only visible if:
     - User is logged in
     - Editing an existing palette (not creating new)
   - Opens AddIterationModal

3. **Create AddIterationModal** (`src/components/palette/AddIterationModal.tsx`)
   - Comment textarea (optional, e.g., "Increased text lightness to 95%")
   - "Save Iteration" button
   - Save to Firebase:
     ```ts
     {
       id: "iter123",
       paletteId: "paletteId456",
       userId: "userId789",
       colors: [...], // Current dark mode colors
       preset: "midnight",
       customSettings: { ... },
       comment: "Reduced accent saturation",
       votes: 0,
       voters: [], // UserIds who voted
       createdAt: Date.now()
     }
     ```

4. **Add iterations to palette detail**
   - In ProjectDetail page or Library card, show "Iterations" tab
   - Render IterationTimeline component
   - Fetch iterations from Firebase:
     ```ts
     loadIterations(paletteId) => Iteration[]
     ```

5. **Implement Voting**
   - Upvote button (👍) on each iteration
   - Click to vote:
     - Add userId to `voters` array
     - Increment `votes` count
     - Update in Firebase
   - User can only vote once per iteration
   - Show vote count badge

6. **"Best Version" Badge**
   - Find iteration with most votes
   - Show badge: "🏆 Best Version"
   - If tie, show badge on newest

7. **Load Iteration into Generator**
   - "Load" button on iteration card
   - Populate generator with:
     - `colors` (dark mode colors)
     - `preset`
     - `customSettings`
   - Navigate to /preview
   - Show toast: "Loaded iteration from [Date]"

8. **Firebase Functions**
   - Add to `src/firebase/database.ts`:
     ```ts
     saveIteration(paletteId, iteration) // Create new iteration
     loadIterations(paletteId) // Fetch all iterations for a palette
     voteIteration(iterationId, userId) // Add vote
     ```

## Data Model (Firebase)

```json
{
  "iterations": {
    "iter123": {
      "paletteId": "paletteId456",
      "userId": "userId789",
      "colors": ["#121212", "#e0e0e0", ...],
      "preset": "midnight",
      "customSettings": {
        "backgroundDarkness": 90,
        "textLightness": 95,
        "accentSaturation": 80
      },
      "comment": "Reduced accent saturation for better contrast",
      "votes": 5,
      "voters": ["userId111", "userId222", ...],
      "createdAt": 1707782400000
    }
  }
}
```

## Expected Deliverables

- ✅ IterationTimeline component
- ✅ "Save as Iteration" button on Preview
- ✅ AddIterationModal component
- ✅ Vote system (upvote button + count)
- ✅ "Best Version" badge
- ✅ Load iteration into generator
- ✅ Firebase functions (save, load, vote)
- ✅ Build succeeds

## Success Criteria

- User can save an iteration of a palette
- Iterations appear in timeline (vertical list)
- User can vote on iterations
- Most voted iteration shows "Best Version" badge
- User can load iteration into generator
- Only owner + collaborators can add iterations
- Voting works for all collaborators

## References

- Firebase database helpers: `src/firebase/database.ts`
- Preview page: `src/pages/Preview.tsx`
- Design system: `src/index.css`

---

**Start now!** 🔥
