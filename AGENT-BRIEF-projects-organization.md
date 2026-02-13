# Agent Brief: projects-organization

**Role:** Full-Stack Developer (Projects & Clients)  
**Project:** Dark Mode Generator v2.0  
**ETA:** 3-4 hours

## Your Mission

Build project management system to organize palettes by client/project.

## Prerequisites

- Wait for `palette-crud` (creates Library page + palette save logic)

## Tasks

1. **Create Projects Page** (`src/pages/Projects.tsx`)
   - Grid of project cards (2 columns desktop, 1 mobile)
   - Each card shows:
     - Project name
     - Client name
     - Palette count
     - Created date
     - Actions (View, Edit, Delete)
   - "Create Project" button (top-right)
   - Empty state: "No projects yet. Organize your palettes!"

2. **Create Project Detail Page** (`src/pages/ProjectDetail.tsx`)
   - URL: `/projects/:projectId`
   - Show:
     - Project name + client
     - Description
     - Tags
     - All palettes in this project (grid, same as Library)
     - "Add Palette" button (assign existing palette)
     - "Create New Palette" button (goes to generator)
   - Timeline of palette iterations (vertical list)
   - Team members (if project is shared)
   - "Export All" button (ZIP of all palettes as CSS/JSON)

3. **Create CreateProjectModal** (`src/components/project/CreateProjectModal.tsx`)
   - Name input (required, e.g., "Vromm App Rebrand")
   - Client input (optional, e.g., "Instinctly AB")
   - Description textarea (optional)
   - Tags input (comma-separated)
   - "Create" button
   - Validation: Name required, max 100 chars

4. **Implement Project CRUD**
   - **Create:** `createProject(userId, project)` in `src/firebase/database.ts`
     ```ts
     {
       userId: "userId123",
       name: "Vromm App",
       client: "Instinctly AB",
       description: "Driving school booking app dark mode",
       tags: ["mobile", "rebrand"],
       paletteIds: [],
       sharedWith: [],
       createdAt: Date.now(),
       updatedAt: Date.now()
     }
     ```
   - **Read:** `loadProjects(userId)` - Fetch user's projects
   - **Update:** `updateProject(projectId, updates)`
   - **Delete:** `deleteProject(projectId)` - Soft delete

5. **Assign Palettes to Projects**
   - In SavePaletteModal (palette-crud agent's work), add "Project" dropdown
   - Dropdown shows:
     - "No project"
     - List of user's projects
     - "Create new project" (opens CreateProjectModal inline)
   - When saving palette, set `projectId` field
   - In Projects page, show palettes grouped by project

6. **Client Filtering**
   - In Projects page, add filter dropdown: "All Clients" + list of unique clients
   - Filter projects by selected client
   - Example: Filter "Instinctly AB" shows Vromm, FlexIQ, Daniel Lauding projects

7. **Export All (Future Phase)**
   - "Export All" button on ProjectDetail page
   - Creates ZIP file with:
     - `palette-1.css`, `palette-1.json`
     - `palette-2.css`, `palette-2.json`
     - `README.md` (project info + palette names)
   - Use JSZip library (already installed)
   - Download ZIP

## Data Model (Firebase)

```json
{
  "projects": {
    "projectId789": {
      "userId": "userId123",
      "name": "Vromm App",
      "description": "Driving school booking app",
      "client": "Instinctly AB",
      "tags": ["mobile", "rebrand"],
      "paletteIds": ["paletteId456", "paletteId999"],
      "sharedWith": [],
      "deleted": false,
      "createdAt": 1707782400000,
      "updatedAt": 1707782400000
    }
  }
}
```

## Expected Deliverables

- ✅ `/projects` page (grid of projects)
- ✅ `/projects/:id` page (project detail)
- ✅ CreateProjectModal component
- ✅ Project CRUD functions in database.ts
- ✅ Assign palettes to projects (dropdown in SavePaletteModal)
- ✅ Client filtering
- ✅ Empty/loading/error states
- ✅ Mobile responsive
- ✅ Build succeeds

## Success Criteria

- User can create a project
- User can assign palettes to project when saving
- User can view all palettes in a project (ProjectDetail page)
- User can filter projects by client
- User can delete a project (with confirmation)
- All CRUD operations work with Firebase

## References

- Firebase database helpers: `src/firebase/database.ts`
- SavePaletteModal: `src/components/palette/SavePaletteModal.tsx` (created by palette-crud)
- Design system: `src/index.css`

---

**Start now!** 🔥
