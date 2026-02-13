import { useState } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { Button } from '../Button';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (project: {
    name: string;
    client: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
}

export function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameError = name.length > 100 ? 'Name must be 100 characters or less' : null;
  const canSubmit = name.trim().length > 0 && !nameError && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onCreate({
        name: name.trim(),
        client: client.trim(),
        description: description.trim(),
        tags,
      });
      onClose();
    } catch {
      setError('Failed to create project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <FolderPlus size={20} className="text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-dark-100">Create Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vromm App Rebrand"
              className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
              autoFocus
            />
            {nameError && (
              <p className="mt-1 text-xs text-danger">{nameError}</p>
            )}
            <p className="mt-1 text-xs text-dark-500">{name.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              Client
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Instinctly AB"
              className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="mobile, rebrand, dark-mode"
              className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
            />
            <p className="mt-1 text-xs text-dark-500">Separate tags with commas</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              icon={saving ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />}
            >
              {saving ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
