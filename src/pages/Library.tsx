import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  ArrowRight,
  Share2,
  Trash2,
  Loader2,
  Users,
  Lock,
  Globe,
  ChevronLeft,
  GitBranch,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { ShareModal } from '../components/palette/ShareModal';
import { IterationTimeline } from '../components/palette/IterationTimeline';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { useDesignStore } from '../stores/designStore';
import {
  loadPalettes,
  getSharedPalettes,
  deletePalette,
  type SavedPalette,
} from '../firebase/database';
import type { Iteration } from '../types';

type Tab = 'mine' | 'shared';

function PaletteCard({
  palette,
  isShared,
  onShare,
  onDelete,
  onClick,
}: {
  palette: SavedPalette;
  isShared?: boolean;
  onShare?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}) {
  const { user } = useAuth();
  const { canDelete, canShare } = usePermissions(palette, user?.uid ?? null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!palette.id || !canDelete) return;
    setDeleting(true);
    try {
      await deletePalette(palette.id);
      onDelete?.();
    } finally {
      setDeleting(false);
    }
  };

  const colors = palette.darkPalette?.colors?.slice(0, 5) ?? [];

  return (
    <div
      onClick={onClick}
      className="group rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-500 transition-all overflow-hidden cursor-pointer"
    >
      {/* Color preview strip */}
      <div className="flex h-12">
        {colors.length > 0
          ? colors.map((c, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: c.hex }}
              />
            ))
          : (
              <div className="flex-1 bg-dark-700" />
            )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-dark-100 truncate">{palette.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-dark-500">{palette.preset}</span>
              {palette.privacy === 'public' ? (
                <Globe size={10} className="text-success" />
              ) : (
                <Lock size={10} className="text-dark-500" />
              )}
              {isShared && (
                <span className="text-[10px] font-medium text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">
                  Shared
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {canShare && (
              <button
                onClick={onShare}
                className="p-1.5 rounded-md hover:bg-dark-700 text-dark-400 hover:text-primary-400 transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 size={14} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded-md hover:bg-danger/10 text-dark-400 hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
                title="Delete"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-dark-500 mt-2">
          {new Date(palette.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function Library() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { setPalette, setPreset, setBgDarkness, setTextLightness, setAccentSaturation, setEditingPaletteId, setStep } = useDesignStore();

  const [tab, setTab] = useState<Tab>('mine');
  const [myPalettes, setMyPalettes] = useState<SavedPalette[]>([]);
  const [sharedPalettes, setSharedPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareTarget, setShareTarget] = useState<SavedPalette | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<SavedPalette | null>(null);
  const [detailTab, setDetailTab] = useState<'colors' | 'iterations'>('colors');
  const [loadedToast, setLoadedToast] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [mine, shared] = await Promise.all([
        loadPalettes(user.uid),
        getSharedPalettes(user.uid),
      ]);
      setMyPalettes(mine);
      setSharedPalettes(shared);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const handleLoadIteration = (iteration: Iteration) => {
    const store = useDesignStore.getState();
    if (!store.palette) {
      // Load the parent palette first if no palette is loaded
      if (selectedPalette) {
        setPalette(selectedPalette.lightPalette);
      }
    }
    setBgDarkness(iteration.customSettings.backgroundDarkness);
    setTextLightness(iteration.customSettings.textLightness);
    setAccentSaturation(iteration.customSettings.accentSaturation);
    if (iteration.preset !== 'custom') {
      setPreset(iteration.preset);
    }
    setStep('preview');
    setEditingPaletteId(iteration.paletteId);

    const date = new Date(iteration.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    setLoadedToast(`Loaded iteration from ${date}`);
    navigate('/preview');
  };

  const handleEditPalette = (palette: SavedPalette) => {
    setPalette(palette.lightPalette);
    setEditingPaletteId(palette.id!);
    setStep('preview');
    navigate('/preview');
  };

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <Palette size={28} className="text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-dark-100 mb-2">Your Library</h1>
            <p className="text-dark-400 mb-8">Sign in to access your saved palettes.</p>
            <Button onClick={() => navigate('/?signup=1')} icon={<ArrowRight size={16} />}>
              Sign up to get started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Palette detail view
  if (selectedPalette) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => { setSelectedPalette(null); setDetailTab('colors'); }}
            className="flex items-center gap-1 text-sm text-dark-400 hover:text-dark-200 mb-6 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Library
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-dark-100">{selectedPalette.name}</h1>
              <p className="text-dark-500 text-sm mt-1">
                Created {new Date(selectedPalette.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <Button onClick={() => handleEditPalette(selectedPalette)} icon={<Palette size={16} />}>
              Edit in Generator
            </Button>
          </div>

          <div className="flex gap-1 mb-6 border-b border-dark-700">
            <button
              onClick={() => setDetailTab('colors')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                detailTab === 'colors'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-dark-500 hover:text-dark-300'
              }`}
            >
              Colors
            </button>
            <button
              onClick={() => setDetailTab('iterations')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                detailTab === 'iterations'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-dark-500 hover:text-dark-300'
              }`}
            >
              <GitBranch size={14} />
              Iterations
            </button>
          </div>

          {detailTab === 'colors' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-xs text-dark-500 uppercase tracking-wider font-medium mb-3">Dark Mode Colors</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedPalette.darkPalette.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded-lg border border-dark-600"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                      <span className="text-[10px] text-dark-500 font-mono">{color.hex}</span>
                      <span className="text-[10px] text-dark-600">{color.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-xs text-dark-500 uppercase tracking-wider font-medium mb-3">Light Mode Colors</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedPalette.lightPalette.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded-lg border border-dark-600"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                      <span className="text-[10px] text-dark-500 font-mono">{color.hex}</span>
                      <span className="text-[10px] text-dark-600">{color.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-xs text-dark-500 uppercase tracking-wider font-medium mb-3">Settings</h3>
                <div className="flex items-center gap-6 text-sm text-dark-300">
                  <span>Preset: <strong className="text-dark-100 capitalize">{selectedPalette.preset}</strong></span>
                  <span>BG: <strong className="text-dark-100">{selectedPalette.bgDarkness}%</strong></span>
                  <span>Text: <strong className="text-dark-100">{selectedPalette.textLightness}%</strong></span>
                  <span>Accent: <strong className="text-dark-100">{selectedPalette.accentSaturation}%</strong></span>
                </div>
              </div>
            </div>
          )}

          {detailTab === 'iterations' && (
            <IterationTimeline
              paletteId={selectedPalette.id!}
              onLoadIteration={handleLoadIteration}
            />
          )}
        </div>

        {loadedToast && (
          <Toast
            message={loadedToast}
            onDismiss={() => setLoadedToast(null)}
            duration={3000}
          />
        )}
      </div>
    );
  }

  const activePalettes = tab === 'mine' ? myPalettes : sharedPalettes;
  const isEmpty = !loading && activePalettes.length === 0;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Your Library</h1>
            <p className="text-dark-400 text-sm mt-1">Manage your saved palettes</p>
          </div>
          <Button onClick={() => navigate('/upload')} icon={<ArrowRight size={16} />}>
            New Palette
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-dark-800 border border-dark-700 w-fit">
          <button
            onClick={() => setTab('mine')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              tab === 'mine'
                ? 'bg-dark-700 text-dark-100'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Palette size={14} />
            My Palettes
            {myPalettes.length > 0 && (
              <span className="text-xs text-dark-500 ml-1">({myPalettes.length})</span>
            )}
          </button>
          <button
            onClick={() => setTab('shared')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              tab === 'shared'
                ? 'bg-dark-700 text-dark-100'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Users size={14} />
            Shared with me
            {sharedPalettes.length > 0 && (
              <span className="text-xs text-dark-500 ml-1">({sharedPalettes.length})</span>
            )}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-dark-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-6">
              {tab === 'mine' ? (
                <Palette size={28} className="text-dark-500" />
              ) : (
                <Users size={28} className="text-dark-500" />
              )}
            </div>
            <h2 className="text-lg font-medium text-dark-200 mb-2">
              {tab === 'mine' ? 'No palettes yet' : 'No shared palettes'}
            </h2>
            <p className="text-dark-400 text-sm mb-6">
              {tab === 'mine'
                ? 'Create your first palette to see it here.'
                : 'When someone shares a palette with you, it will appear here.'}
            </p>
            {tab === 'mine' && (
              <Button onClick={() => navigate('/upload')} icon={<ArrowRight size={16} />}>
                Create your first palette
              </Button>
            )}
          </div>
        )}

        {/* Palette grid */}
        {!loading && activePalettes.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePalettes.map((p) => (
              <PaletteCard
                key={p.id}
                palette={p}
                isShared={tab === 'shared'}
                onShare={() => setShareTarget(p)}
                onDelete={loadData}
                onClick={() => setSelectedPalette(p)}
              />
            ))}
          </div>
        )}
      </div>

      {shareTarget && (
        <ShareModal
          palette={shareTarget}
          onClose={() => setShareTarget(null)}
          onUpdated={loadData}
        />
      )}
    </div>
  );
}
