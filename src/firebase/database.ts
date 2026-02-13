import {
  ref,
  push,
  get,
  set,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { database } from './config';
import type { DesignPalette, DarkPalette, Iteration, DarkColorEntry, Project } from '../types';

// ── Types ──────────────────────────────────────────────────────────

export interface SavedPalette {
  id?: string;
  userId: string;
  name: string;
  projectId?: string | null;
  lightPalette: DesignPalette;
  darkPalette: DarkPalette;
  preset: string;
  bgDarkness: number;
  textLightness: number;
  accentSaturation: number;
  privacy: 'private' | 'public';
  sharedWith?: Record<string, boolean>;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ShareLink {
  shareId: string;
  paletteId: string;
  privacy: 'public' | 'private';
  expiresAt: number | null;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: number;
}

export type PaletteRole = 'owner' | 'collaborator' | 'public' | 'none';

// ── User Profiles ──────────────────────────────────────────────────

export async function saveUserProfile(uid: string, email: string, displayName?: string) {
  await set(ref(database, `users/${uid}`), {
    uid,
    email,
    displayName: displayName ?? email.split('@')[0],
    createdAt: Date.now(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await get(ref(database, `users/${uid}`));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const q = query(ref(database, 'users'), orderByChild('email'), equalTo(email));
  const snap = await get(q);
  if (!snap.exists()) return null;
  const data = snap.val() as Record<string, UserProfile>;
  const entries = Object.values(data);
  return entries[0] ?? null;
}

// ── Palettes (CRUD) ───────────────────────────────────────────────

export async function savePalette(
  userId: string,
  palette: Omit<SavedPalette, 'id' | 'userId' | 'deleted' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const palettesRef = ref(database, 'palettes');
  const newRef = push(palettesRef);
  const now = Date.now();

  const data: Omit<SavedPalette, 'id'> = {
    ...palette,
    userId,
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await set(newRef, data);
  return newRef.key!;
}

export async function getPalette(paletteId: string): Promise<SavedPalette | null> {
  const snap = await get(ref(database, `palettes/${paletteId}`));
  if (!snap.exists()) return null;
  const data = snap.val() as Omit<SavedPalette, 'id'>;
  if (data.deleted) return null;
  return { ...data, id: paletteId };
}

export async function loadPalettes(userId: string): Promise<SavedPalette[]> {
  const palettesRef = ref(database, 'palettes');
  const q = query(palettesRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(q);

  if (!snapshot.exists()) return [];

  const palettes: SavedPalette[] = [];
  snapshot.forEach((child) => {
    const data = child.val() as Omit<SavedPalette, 'id'>;
    if (!data.deleted) {
      palettes.push({ ...data, id: child.key! });
    }
  });

  return palettes.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSharedPalettes(userId: string): Promise<SavedPalette[]> {
  const snap = await get(ref(database, 'palettes'));
  if (!snap.exists()) return [];
  const palettes: SavedPalette[] = [];
  snap.forEach((child) => {
    const data = child.val() as Omit<SavedPalette, 'id'>;
    if (!data.deleted && data.sharedWith?.[userId]) {
      palettes.push({ ...data, id: child.key! });
    }
  });
  return palettes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deletePalette(paletteId: string): Promise<void> {
  const paletteRef = ref(database, `palettes/${paletteId}`);
  await update(paletteRef, { deleted: true, updatedAt: Date.now() });
}

export async function updatePalette(
  paletteId: string,
  updates: Partial<Pick<SavedPalette, 'name' | 'lightPalette' | 'darkPalette' | 'preset' | 'bgDarkness' | 'textLightness' | 'accentSaturation' | 'privacy' | 'sharedWith'>>
): Promise<void> {
  const paletteRef = ref(database, `palettes/${paletteId}`);
  await update(paletteRef, { ...updates, updatedAt: Date.now() });
}

// ── Share Links ────────────────────────────────────────────────────

function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function createShareLink(
  paletteId: string,
  privacy: 'public' | 'private' = 'public',
  expiresIn: '30days' | 'forever' = '30days'
): Promise<ShareLink> {
  // Check if a link already exists for this palette
  const existing = await getShareLinkByPalette(paletteId);
  if (existing) {
    // Update existing link
    const updated: ShareLink = {
      ...existing,
      privacy,
      expiresAt: expiresIn === '30days' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null,
    };
    await set(ref(database, `shares/${existing.shareId}`), updated);
    await update(ref(database, `palettes/${paletteId}`), { privacy });
    return updated;
  }

  const shareId = generateShareId();
  const link: ShareLink = {
    shareId,
    paletteId,
    privacy,
    expiresAt: expiresIn === '30days' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null,
    createdAt: Date.now(),
  };
  await set(ref(database, `shares/${shareId}`), link);
  await update(ref(database, `palettes/${paletteId}`), { privacy });
  return link;
}

export async function getShareLink(shareId: string): Promise<ShareLink | null> {
  const snap = await get(ref(database, `shares/${shareId}`));
  if (!snap.exists()) return null;
  const link = snap.val() as ShareLink;
  if (link.expiresAt && link.expiresAt < Date.now()) return null;
  return link;
}

export async function getShareLinkByPalette(paletteId: string): Promise<ShareLink | null> {
  const q = query(ref(database, 'shares'), orderByChild('paletteId'), equalTo(paletteId));
  const snap = await get(q);
  if (!snap.exists()) return null;
  const data = snap.val() as Record<string, ShareLink>;
  const links = Object.values(data).filter(
    (l) => !l.expiresAt || l.expiresAt > Date.now()
  );
  return links[0] ?? null;
}

export async function deleteShareLink(shareId: string) {
  await remove(ref(database, `shares/${shareId}`));
}

// ── Collaborators ──────────────────────────────────────────────────

export async function addCollaborator(paletteId: string, userId: string) {
  await update(ref(database, `palettes/${paletteId}/sharedWith`), { [userId]: true });
  await update(ref(database, `palettes/${paletteId}`), { updatedAt: Date.now() });
}

export async function removeCollaborator(paletteId: string, userId: string) {
  await remove(ref(database, `palettes/${paletteId}/sharedWith/${userId}`));
  await update(ref(database, `palettes/${paletteId}`), { updatedAt: Date.now() });
}

export async function getCollaboratorProfiles(palette: SavedPalette): Promise<UserProfile[]> {
  if (!palette.sharedWith) return [];
  const uids = Object.keys(palette.sharedWith);
  const profiles = await Promise.all(uids.map(getUserProfile));
  return profiles.filter((p): p is UserProfile => p !== null);
}

// ── Permissions ────────────────────────────────────────────────────

export function getPaletteRole(palette: SavedPalette, userId: string | null): PaletteRole {
  if (!userId) return palette.privacy === 'public' ? 'public' : 'none';
  if (palette.userId === userId) return 'owner';
  if (palette.sharedWith?.[userId]) return 'collaborator';
  if (palette.privacy === 'public') return 'public';
  return 'none';
}

// ── Fork ───────────────────────────────────────────────────────────

export async function forkPalette(sourcePaletteId: string, userId: string): Promise<string> {
  const original = await getPalette(sourcePaletteId);
  if (!original) throw new Error('Palette not found');

  return savePalette(userId, {
    name: `${original.name} (fork)`,
    lightPalette: original.lightPalette,
    darkPalette: original.darkPalette,
    preset: original.preset,
    bgDarkness: original.bgDarkness,
    textLightness: original.textLightness,
    accentSaturation: original.accentSaturation,
    privacy: 'private',
  });
}

// ── Iterations ──────────────────────────────────────────────────

export async function saveIteration(
  paletteId: string,
  data: {
    userId: string;
    userName: string;
    colors: DarkColorEntry[];
    preset: string;
    customSettings: Iteration['customSettings'];
    comment: string;
  }
): Promise<string> {
  const iterationsRef = ref(database, 'iterations');
  const newRef = push(iterationsRef);

  const iteration: Omit<Iteration, 'id'> = {
    paletteId,
    userId: data.userId,
    userName: data.userName,
    colors: data.colors,
    preset: data.preset,
    customSettings: data.customSettings,
    comment: data.comment,
    votes: 0,
    voters: [],
    createdAt: Date.now(),
  };

  await set(newRef, iteration);
  return newRef.key!;
}

export async function loadIterations(paletteId: string): Promise<Iteration[]> {
  const q = query(
    ref(database, 'iterations'),
    orderByChild('paletteId'),
    equalTo(paletteId)
  );
  const snap = await get(q);
  if (!snap.exists()) return [];

  const iterations: Iteration[] = [];
  snap.forEach((child) => {
    iterations.push({ ...child.val(), id: child.key! } as Iteration);
  });

  return iterations.sort((a, b) => b.createdAt - a.createdAt);
}

export async function voteIteration(iterationId: string, userId: string): Promise<void> {
  const iterRef = ref(database, `iterations/${iterationId}`);
  const snap = await get(iterRef);
  if (!snap.exists()) throw new Error('Iteration not found');

  const data = snap.val() as Omit<Iteration, 'id'>;
  const voters = data.voters ?? [];

  if (voters.includes(userId)) {
    // Already voted — remove vote (toggle)
    const updated = voters.filter((v: string) => v !== userId);
    await update(iterRef, { voters: updated, votes: updated.length });
  } else {
    // Add vote
    const updated = [...voters, userId];
    await update(iterRef, { voters: updated, votes: updated.length });
  }
}

// ── Projects (CRUD) ──────────────────────────────────────────────

export async function createProject(
  userId: string,
  project: Omit<Project, 'id' | 'userId' | 'deleted' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const projectsRef = ref(database, 'projects');
  const newRef = push(projectsRef);
  const now = Date.now();

  const data: Omit<Project, 'id'> = {
    userId,
    name: project.name,
    client: project.client || '',
    description: project.description || '',
    tags: project.tags || [],
    paletteIds: project.paletteIds || [],
    sharedWith: project.sharedWith || [],
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await set(newRef, data);
  return newRef.key!;
}

export async function loadProjects(userId: string): Promise<Project[]> {
  const projectsRef = ref(database, 'projects');
  const q = query(projectsRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  const projects: Project[] = [];
  snapshot.forEach((child) => {
    const data = child.val();
    if (!data.deleted) {
      projects.push({ ...data, id: child.key });
    }
  });
  return projects.sort((a, b) => b.createdAt - a.createdAt);
}

export async function loadProject(projectId: string): Promise<Project | null> {
  const snap = await get(ref(database, `projects/${projectId}`));
  if (!snap.exists()) return null;
  const data = snap.val();
  if (data.deleted) return null;
  return { ...data, id: projectId };
}

export async function updateProjectData(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const projectRef = ref(database, `projects/${projectId}`);
  await update(projectRef, { ...updates, updatedAt: Date.now() });
}

export async function deleteProjectSoft(projectId: string): Promise<void> {
  await updateProjectData(projectId, { deleted: true });
}

export async function addPaletteToProject(
  projectId: string,
  paletteId: string
): Promise<void> {
  const project = await loadProject(projectId);
  if (!project) return;
  const paletteIds = [...(project.paletteIds || [])];
  if (!paletteIds.includes(paletteId)) {
    paletteIds.push(paletteId);
    await updateProjectData(projectId, { paletteIds });
  }
}

export async function removePaletteFromProject(
  projectId: string,
  paletteId: string
): Promise<void> {
  const project = await loadProject(projectId);
  if (!project) return;
  const paletteIds = (project.paletteIds || []).filter((id) => id !== paletteId);
  await updateProjectData(projectId, { paletteIds });
}

export async function loadPalettesByIds(paletteIds: string[]): Promise<SavedPalette[]> {
  const palettes: SavedPalette[] = [];
  for (const id of paletteIds) {
    const p = await getPalette(id);
    if (p) palettes.push(p);
  }
  return palettes;
}
