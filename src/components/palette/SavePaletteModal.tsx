import { useState, useEffect } from 'react';
import { X, Save, Loader2, FolderPlus, ChevronDown } from 'lucide-react';
import { Button } from '../Button';
import { CreateProjectModal } from '../project/CreateProjectModal';
import { useAuth } from '../../hooks/useAuth';
import {
  savePalette,
  loadProjects,
  createProject,
  addPaletteToProject,
} from '../../firebase/database';
import type { Project, DesignPalette, DarkPalette } from '../../types';

interface SavePaletteModalProps {
  lightPalette: DesignPalette;
  darkPalette: DarkPalette;
  preset: string;
  bgDarkness: number;
  textLightness: number;
  accentSaturation: number;
  onClose: () => void;
  onSaved?: (paletteId: string) => void;
}

export function SavePaletteModal({
  lightPalette,
  darkPalette,
  preset,
  bgDarkness,
  textLightness,
  accentSaturation,
  onClose,
  onSaved,
}: SavePaletteModalProps) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingProjects(true);
      try {
        const data = await loadProjects(user.uid);
        setProjects(data);
      } catch {
        // Silently fail — projects dropdown will just be empty
      } finally {
        setLoadingProjects(false);
      }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const paletteId = await savePalette(user.uid, {
        name: name.trim(),
        lightPalette,
        darkPalette,
        preset,
        bgDarkness,
        textLightness,
        accentSaturation,
        privacy: 'private',
      });

      // Add to project if selected
      if (selectedProjectId) {
        await addPaletteToProject(selectedProjectId, paletteId);
      }

      onSaved?.(paletteId);
      onClose();
    } catch {
      setError('Failed to save palette. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProject = async (data: {
    name: string;
    client: string;
    description: string;
    tags: string[];
  }) => {
    if (!user) return;
    const id = await createProject(user.uid, {
      ...data,
      paletteIds: [],
      sharedWith: [],
    });
    const updated = await loadProjects(user.uid);
    setProjects(updated);
    setSelectedProjectId(id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl animate-scale-in">
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Save size={20} className="text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-dark-100">Save Palette</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Color preview */}
            <div className="flex h-10 rounded-lg overflow-hidden">
              {darkPalette.colors.slice(0, 8).map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
              ))}
            </div>

            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">
                Palette Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vromm Dark Theme v2"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                autoFocus
              />
            </div>

            {/* Project dropdown */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">
                Project
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedProjectId || ''}
                    onChange={(e) =>
                      setSelectedProjectId(e.target.value || null)
                    }
                    disabled={loadingProjects}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 focus:outline-none focus:border-primary-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id!}>
                        {p.name}
                        {p.client ? ` — ${p.client}` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none"
                  />
                </div>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="p-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors cursor-pointer"
                  title="Create new project"
                >
                  <FolderPlus size={18} />
                </button>
              </div>
              <p className="mt-1 text-xs text-dark-500">
                Organize this palette within a project
              </p>
            </div>

            {/* Info */}
            <div className="text-xs text-dark-500 space-y-1">
              <p>Preset: <span className="text-dark-300 capitalize">{preset}</span></p>
              <p>{darkPalette.colors.length} colors</p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-700">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              icon={
                saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )
              }
            >
              {saving ? 'Saving...' : 'Save Palette'}
            </Button>
          </div>
        </div>
      </div>

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreate={handleCreateProject}
        />
      )}
    </>
  );
}
