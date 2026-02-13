import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  FolderOpen,
  Loader2,
  AlertCircle,
  Palette,
  Calendar,
  Building2,
  Pencil,
  Trash2,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { loadProjects, deleteProjectSoft } from '../firebase/database';
import { CreateProjectModal } from '../components/project/CreateProjectModal';
import { createProject } from '../firebase/database';
import type { Project } from '../types';

export function Projects() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [clientFilter, setClientFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadProjects(user.uid);
        setProjects(data);
      } catch {
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const clients = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.client) set.add(p.client);
    });
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (clientFilter === 'all') return projects;
    return projects.filter((p) => p.client === clientFilter);
  }, [projects, clientFilter]);

  const handleCreate = async (data: {
    name: string;
    client: string;
    description: string;
    tags: string[];
  }) => {
    if (!user) return;
    await createProject(user.uid, {
      ...data,
      paletteIds: [],
      sharedWith: [],
    });
    const updated = await loadProjects(user.uid);
    setProjects(updated);
  };

  const handleDelete = async (projectId: string) => {
    setDeleting(true);
    try {
      await deleteProjectSoft(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setDeleteConfirm(null);
    } catch {
      setError('Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={28} className="text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-dark-100 mb-2">Projects</h1>
          <p className="text-dark-400 mb-8">Log in to organize your palettes by project.</p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Loader2 size={32} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={28} className="text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-dark-100 mb-2">Something went wrong</h1>
          <p className="text-dark-400 mb-8">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Projects</h1>
            <p className="text-dark-400 text-sm mt-1">
              Organize your palettes by client and project
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            icon={<FolderPlus size={16} />}
          >
            Create Project
          </Button>
        </div>

        {/* Client filter */}
        {clients.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <Filter size={16} className="text-dark-400" />
            <div className="relative">
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-dark-800 border border-dark-600 text-sm text-dark-200 focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                <option value="all">All Clients</option>
                {clients.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none"
              />
            </div>
            {clientFilter !== 'all' && (
              <button
                onClick={() => setClientFilter('all')}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={28} className="text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-dark-100 mb-2">
              No projects yet
            </h2>
            <p className="text-dark-400 mb-8">Organize your palettes!</p>
            <Button
              onClick={() => setShowCreate(true)}
              icon={<FolderPlus size={16} />}
            >
              Create your first project
            </Button>
          </div>
        )}

        {/* Filtered empty */}
        {projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark-400">No projects match this filter.</p>
            <button
              onClick={() => setClientFilter('all')}
              className="mt-3 text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            >
              Show all projects
            </button>
          </div>
        )}

        {/* Project grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-500 transition-all cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-dark-100 truncate">
                        {project.name}
                      </h3>
                      {project.client && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Building2 size={13} className="text-dark-500 shrink-0" />
                          <span className="text-sm text-dark-400 truncate">
                            {project.client}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="p-1.5 rounded-md hover:bg-dark-600 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id!)}
                        className="p-1.5 rounded-md hover:bg-danger/10 text-dark-400 hover:text-danger transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-sm text-dark-400 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-dark-500">
                    <div className="flex items-center gap-1.5">
                      <Palette size={12} />
                      <span>
                        {project.paletteIds?.length || 0} palette
                        {(project.paletteIds?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-xs bg-dark-700 text-dark-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-dark-100 mb-2">
              Delete Project?
            </h3>
            <p className="text-sm text-dark-400 mb-6">
              This will remove the project. Palettes won't be deleted.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                icon={
                  deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )
                }
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
