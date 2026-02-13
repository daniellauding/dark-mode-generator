import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { Button } from '../Button';
import { deletePalette } from '../../firebase/database';

interface DeleteConfirmModalProps {
  paletteId: string;
  paletteName: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteConfirmModal({
  paletteId,
  paletteName,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deletePalette(paletteId);
      onDeleted();
      onClose();
    } catch {
      setError('Failed to delete palette. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <h2 className="text-lg font-semibold text-dark-100">Delete Palette</h2>
            <button
              onClick={onClose}
              className="ml-auto p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-dark-300 mb-1">
            Are you sure you want to delete <strong className="text-dark-100">{paletteName}</strong>?
          </p>
          <p className="text-sm text-dark-500">
            This action can't be undone.
          </p>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {deleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
