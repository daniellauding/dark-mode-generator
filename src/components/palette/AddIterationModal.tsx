import { useState } from 'react';
import { X, GitBranch, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../hooks/useAuth';
import { useDesignStore } from '../../stores/designStore';
import { saveIteration, getUserProfile } from '../../firebase/database';

interface AddIterationModalProps {
  paletteId: string;
  onClose: () => void;
  onSaved?: () => void;
}

export function AddIterationModal({ paletteId, onClose, onSaved }: AddIterationModalProps) {
  const { user } = useAuth();
  const { darkPalette, activePreset, bgDarkness, textLightness, accentSaturation } = useDesignStore();
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || !darkPalette) return;

    setSaving(true);
    setError(null);

    try {
      const profile = await getUserProfile(user.uid);
      const userName = profile?.displayName ?? user.email?.split('@')[0] ?? 'Anonymous';

      await saveIteration(paletteId, {
        userId: user.uid,
        userName,
        colors: darkPalette.colors,
        preset: activePreset,
        customSettings: {
          backgroundDarkness: bgDarkness,
          textLightness,
          accentSaturation,
        },
        comment: comment.trim(),
      });

      onSaved?.();
      onClose();
    } catch {
      setError('Failed to save iteration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-primary-400" />
            <h2 className="text-lg font-semibold text-dark-100">Save Iteration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Preview swatches */}
          {darkPalette && (
            <div>
              <label className="text-xs text-dark-500 uppercase tracking-wider font-medium mb-2 block">
                Current Colors
              </label>
              <div className="flex gap-1.5">
                {darkPalette.colors.slice(0, 7).map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border border-dark-600"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Settings summary */}
          <div className="flex items-center gap-3 text-xs text-dark-500">
            <span className="capitalize">{activePreset} preset</span>
            <span>&middot;</span>
            <span>BG {bgDarkness}%</span>
            <span>&middot;</span>
            <span>Text {textLightness}%</span>
            <span>&middot;</span>
            <span>Accent {accentSaturation}%</span>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="iter-comment" className="text-xs text-dark-500 uppercase tracking-wider font-medium mb-2 block">
              Comment (optional)
            </label>
            <textarea
              id="iter-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Increased text lightness to 95% for better readability"
              className="w-full rounded-xl bg-dark-900 border border-dark-700 text-dark-200 text-sm px-4 py-3 placeholder:text-dark-600 focus:outline-none focus:border-primary-500/50 resize-none"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !darkPalette}
            icon={saving ? <Loader2 size={16} className="animate-spin" /> : <GitBranch size={16} />}
          >
            {saving ? 'Saving...' : 'Save Iteration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
