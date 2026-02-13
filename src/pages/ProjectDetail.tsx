import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  Palette,
  Plus,
  Download,
  Pencil,
  Check,
  X,
  FolderOpen,
  Users,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import {
  loadProject,
  loadPalettesByIds,
  updateProjectData,
  loadPalettes,
  addPaletteToProject,
  type SavedPalette,
} from '../firebase/database';
import { generateCSS, generateJSON } from '../utils/exportFormats';
import type { Project } from '../types';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editClient, setEditClient] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [saving, setSaving] = useState(false);

  // Add palette
  const [showAddPalette, setShowAddPalette] = useState(false);
  const [allPalettes, setAllPalettes] = useState<SavedPalette[]>([]);
  const [loadingPalettes, setLoadingPalettes] = useState(false);

  // Export
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user || !projectId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const proj = await loadProject(projectId);
        if (!proj) {
          setError('Project not found.');
          setLoading(false);
          return;
        }
        setProject(proj);

        if (proj.paletteIds?.length) {
          const pals = await loadPalettesByIds(proj.paletteIds);
          setPalettes(pals);
        }
      } catch {
        setError('Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, projectId]);

  const startEditing = () => {
    if (!project) return;
    setEditName(project.name);
    setEditClient(project.client);
    setEditDescription(project.description);
    setEditTags(project.tags?.join(', ') || '');
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!project?.id || !editName.trim()) return;
    setSaving(true);
    try {
      const tags = editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await updateProjectData(project.id, {
        name: editName.trim(),
        client: editClient.trim(),
        description: editDescription.trim(),
        tags,
      });
      setProject({
        ...project,
        name: editName.trim(),
        client: editClient.trim(),
        description: editDescription.trim(),
        tags,
      });
      setEditing(false);
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleShowAddPalette = async () => {
    if (!user) return;
    setShowAddPalette(true);
    setLoadingPalettes(true);
    try {
      const all = await loadPalettes(user.uid);
      // Exclude already-added palettes
      const existing = new Set(project?.paletteIds || []);
      setAllPalettes(all.filter((p) => !existing.has(p.id!)));
    } catch {
      setError('Failed to load palettes.');
    } finally {
      setLoadingPalettes(false);
    }
  };

  const handleAddPalette = async (paletteId: string) => {
    if (!project?.id) return;
    try {
      await addPaletteToProject(project.id, paletteId);
      const palette = allPalettes.find((p) => p.id === paletteId);
      if (palette) {
        setPalettes((prev) => [...prev, palette]);
        setAllPalettes((prev) => prev.filter((p) => p.id !== paletteId));
        setProject((prev) =>
          prev
            ? { ...prev, paletteIds: [...(prev.paletteIds || []), paletteId] }
            : prev
        );
      }
    } catch {
      setError('Failed to add palette.');
    }
  };

  const handleExportAll = async () => {
    if (!project || palettes.length === 0) return;
    setExporting(true);

    try {
      const zip = new JSZip();

      palettes.forEach((p, i) => {
        const safeName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const prefix = `palette-${i + 1}-${safeName}`;
        zip.file(`${prefix}.css`, generateCSS(p.darkPalette));
        zip.file(`${prefix}.json`, generateJSON(p.darkPalette));
      });

      // README
      const readmeLines = [
        `# ${project.name}`,
        '',
        project.client ? `**Client:** ${project.client}` : '',
        project.description ? `\n${project.description}` : '',
        '',
        `## Palettes (${palettes.length})`,
        '',
        ...palettes.map(
          (p, i) =>
            `${i + 1}. **${p.name}** — ${p.darkPalette.colors.length} colors, preset: ${p.preset}`
        ),
        '',
        `Generated by Dark Mode Generator on ${new Date().toLocaleDateString()}`,
      ];
      zip.file('README.md', readmeLines.filter((l) => l !== undefined).join('\n'));

      const blob = await zip.generateAsync({ type: 'blob' });
      const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-palettes.zip`;
      saveAs(blob, filename);
    } catch {
      setError('Failed to export palettes.');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Loader2 size={32} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={28} className="text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-dark-100 mb-2">Project not found</h1>
          <p className="text-dark-400 mb-8">{error}</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark-200 transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          All Projects
        </Link>

        {/* Project header */}
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-6 mb-6">
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 text-lg font-semibold focus:outline-none focus:border-primary-500 transition-colors"
              />
              <input
                type="text"
                value={editClient}
                onChange={(e) => setEditClient(e.target.value)}
                placeholder="Client name"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              />
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma-separated)"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={saving || !editName.trim()}
                  icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                >
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-dark-100">{project.name}</h1>
                  {project.client && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Building2 size={14} className="text-dark-500" />
                      <span className="text-sm text-dark-400">{project.client}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditing}
                  icon={<Pencil size={14} />}
                >
                  Edit
                </Button>
              </div>

              {project.description && (
                <p className="text-dark-300 text-sm mb-4">{project.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-dark-500">
                <div className="flex items-center gap-1.5">
                  <Palette size={12} />
                  <span>{palettes.length} palette{palettes.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
                {project.sharedWith?.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span>{project.sharedWith.length} member{project.sharedWith.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs bg-dark-700 text-dark-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-dark-100">Palettes</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShowAddPalette}
              icon={<Plus size={14} />}
            >
              Add Palette
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/upload')}
              icon={<Palette size={14} />}
            >
              Create New Palette
            </Button>
            {palettes.length > 0 && (
              <Button
                size="sm"
                onClick={handleExportAll}
                disabled={exporting}
                icon={
                  exporting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )
                }
              >
                {exporting ? 'Exporting...' : 'Export All'}
              </Button>
            )}
          </div>
        </div>

        {/* Palettes grid */}
        {palettes.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-dark-800/50 border border-dark-700 border-dashed">
            <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
              <Palette size={20} className="text-dark-400" />
            </div>
            <p className="text-dark-400 text-sm mb-4">
              No palettes in this project yet
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShowAddPalette}
                icon={<Plus size={14} />}
              >
                Add Existing Palette
              </Button>
              <Button size="sm" onClick={() => navigate('/upload')} icon={<Palette size={14} />}>
                Create New Palette
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Palette grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {palettes.map((palette) => (
                <div
                  key={palette.id}
                  className="rounded-xl bg-dark-800 border border-dark-700 overflow-hidden hover:border-dark-500 transition-colors"
                >
                  {/* Color swatches row */}
                  <div className="flex h-12">
                    {palette.darkPalette.colors.slice(0, 6).map((color, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-dark-100 truncate">
                      {palette.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-dark-500">
                      <span>{palette.darkPalette.colors.length} colors</span>
                      <span>{palette.preset}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-dark-100 mb-4">Timeline</h2>
              <div className="space-y-4">
                {palettes.map((palette) => (
                  <div key={palette.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-500 mt-1.5" />
                      <div className="w-px flex-1 bg-dark-700" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-dark-200">{palette.name}</p>
                      <p className="text-xs text-dark-500 mt-0.5">
                        {palette.darkPalette.colors.length} colors &middot; {palette.preset} preset &middot;{' '}
                        {formatDate(palette.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add palette modal */}
      {showAddPalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddPalette(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <FolderOpen size={20} className="text-primary-400" />
                </div>
                <h2 className="text-lg font-semibold text-dark-100">Add Palette</h2>
              </div>
              <button
                onClick={() => setShowAddPalette(false)}
                className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {loadingPalettes ? (
                <div className="text-center py-8">
                  <Loader2 size={24} className="text-primary-500 animate-spin mx-auto mb-2" />
                  <p className="text-dark-400 text-sm">Loading palettes...</p>
                </div>
              ) : allPalettes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-dark-400 text-sm">
                    No available palettes to add.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setShowAddPalette(false);
                      navigate('/upload');
                    }}
                  >
                    Create a New Palette
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {allPalettes.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => handleAddPalette(palette.id!)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-900 hover:bg-dark-700 border border-dark-700 hover:border-dark-500 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex h-8 w-16 rounded overflow-hidden shrink-0">
                        {palette.darkPalette.colors.slice(0, 4).map((c, i) => (
                          <div
                            key={i}
                            className="flex-1"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-200 truncate">
                          {palette.name}
                        </p>
                        <p className="text-xs text-dark-500">
                          {palette.darkPalette.colors.length} colors
                        </p>
                      </div>
                      <Plus size={16} className="text-dark-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
