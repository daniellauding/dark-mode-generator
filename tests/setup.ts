import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../src/firebase/config', () => ({
  auth: {},
  database: {},
}));

vi.mock('../src/firebase/auth', () => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../src/firebase/database', () => ({
  savePalette: vi.fn(),
  loadPalettes: vi.fn(),
  deletePalette: vi.fn(),
  updatePalette: vi.fn(),
  createProject: vi.fn(),
  loadProjects: vi.fn(),
}));
