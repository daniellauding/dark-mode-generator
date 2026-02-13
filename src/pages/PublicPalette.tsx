import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  GitFork,
  Loader2,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/Button';
import { ExportModal } from '../components/ExportModal';
import { ContrastBadge } from '../components/ContrastBadge';
import { ColorSwatch } from '../components/ColorSwatch';
import { useAuth } from '../hooks/useAuth';
import { useContrastValidation } from '../hooks/useContrastValidation';
import {
  getShareLink,
  getPalette,
  forkPalette,
  type SavedPalette,
} from '../firebase/database';
import { PRESETS } from '../utils/colorConversion';

type PageState = 'loading' | 'found' | 'not-found' | 'expired';

export function PublicPalette() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [palette, setPalette] = useState<SavedPalette | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [forking, setForking] = useState(false);
  const [forked, setForked] = useState(false);

  const darkPalette = palette?.darkPalette ?? null;
  const { issues, passCount, totalChecked } = useContrastValidation(darkPalette);

  useEffect(() => {
    if (!shareId) {
      setPageState('not-found');
      return;
    }

    (async () => {
      try {
        const link = await getShareLink(shareId);
        if (!link) {
          setPageState('not-found');
          return;
        }

        const p = await getPalette(link.paletteId);
        if (!p) {
          setPageState('not-found');
          return;
        }

        setPalette(p);
        setPageState('found');
      } catch {
        setPageState('not-found');
      }
    })();
  }, [shareId]);

  const handleFork = async () => {
    if (!user || !palette?.id) return;
    setForking(true);
    try {
      await forkPalette(palette.id, user.uid);
      setForked(true);
      setTimeout(() => navigate('/library'), 1500);
    } catch {
      // ignore
    } finally {
      setForking(false);
    }
  };

  const presetName = palette
    ? PRESETS.find((p) => p.id === palette.preset)?.name ?? 'Custom'
    : '';

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400 text-sm">Loading palette...</p>
        </div>
      </div>
    );
  }

  // 404 state
  if (pageState === 'not-found' || pageState === 'expired' || !palette) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-dark-100 mb-2">
            {pageState === 'expired' ? 'Link Expired' : 'Palette Not Found'}
          </h1>
          <p className="text-dark-400 mb-8">
            {pageState === 'expired'
              ? 'This share link has expired. Ask the owner for a new link.'
              : "This palette doesn't exist or the link is invalid."}
          </p>
          <Button onClick={() => navigate('/')} icon={<ArrowLeft size={16} />}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const lightPalette = palette.lightPalette;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-dark-500 mb-1">Shared palette</p>
            <h1 className="text-2xl font-bold text-dark-100">{palette.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-dark-400">Preset: {presetName}</span>
              <span className="text-dark-600">|</span>
              <span className="text-sm text-dark-400">
                {palette.darkPalette.colors.length} colors
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowExport(true)}
              icon={<Download size={16} />}
            >
              Export
            </Button>
            {user ? (
              <Button
                onClick={handleFork}
                disabled={forking || forked}
                icon={
                  forking ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : forked ? (
                    <Check size={16} />
                  ) : (
                    <GitFork size={16} />
                  )
                }
              >
                {forked ? 'Forked!' : forking ? 'Forking...' : 'Fork to My Library'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/?signup=1')} icon={<UserPlus size={16} />}>
                Sign up to save
              </Button>
            )}
          </div>
        </div>

        {/* Contrast summary */}
        <div className="mb-6 p-4 rounded-xl bg-dark-800/50 border border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-success">
                <Check size={18} />
                <span className="text-sm font-medium">
                  All {totalChecked} color pairs pass APCA
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">
                  {issues.length} contrast {issues.length === 1 ? 'issue' : 'issues'} found
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-500">
              {passCount}/{totalChecked} passing
            </span>
            <div className="w-24 h-1.5 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-success transition-all"
                style={{
                  width: `${totalChecked > 0 ? (passCount / totalChecked) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Settings info */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-dark-800/50 border border-dark-700 text-center">
            <p className="text-xs text-dark-500 mb-1">BG Darkness</p>
            <p className="text-lg font-semibold text-dark-200">{palette.bgDarkness}%</p>
          </div>
          <div className="p-3 rounded-lg bg-dark-800/50 border border-dark-700 text-center">
            <p className="text-xs text-dark-500 mb-1">Text Lightness</p>
            <p className="text-lg font-semibold text-dark-200">{palette.textLightness}%</p>
          </div>
          <div className="p-3 rounded-lg bg-dark-800/50 border border-dark-700 text-center">
            <p className="text-xs text-dark-500 mb-1">Accent Saturation</p>
            <p className="text-lg font-semibold text-dark-200">{palette.accentSaturation}%</p>
          </div>
        </div>

        {/* Color grids */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Original colors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun size={14} className="text-warning" />
              <span className="text-sm font-medium text-dark-300">Original Colors</span>
            </div>
            <div className="rounded-xl bg-dark-800/50 border border-dark-700 p-4 space-y-3">
              {lightPalette.colors.map((color, i) => (
                <ColorSwatch
                  key={i}
                  hex={color.hex}
                  name={color.name}
                  role={color.role}
                />
              ))}
            </div>
          </div>

          {/* Dark mode colors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Moon size={14} className="text-primary-400" />
              <span className="text-sm font-medium text-dark-300">Dark Mode Colors</span>
            </div>
            <div className="rounded-xl bg-dark-800/50 border border-dark-700 p-4 space-y-3">
              {palette.darkPalette.colors.map((color, i) => (
                <ColorSwatch
                  key={i}
                  hex={color.hex}
                  name={color.name}
                  role={color.role}
                  originalHex={color.originalHex}
                  apcaValue={color.apcaValue}
                  showContrast
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contrast issues detail */}
        {issues.length > 0 && (
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
              Contrast Issues
            </h2>
            <div className="space-y-3">
              {issues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 border border-dark-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-dark-800"
                        style={{ backgroundColor: issue.foreground }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-dark-800"
                        style={{ backgroundColor: issue.background }}
                      />
                    </div>
                    <div>
                      <span className="text-sm text-dark-200">{issue.element}</span>
                      <span className="text-xs text-dark-500 ml-2">
                        needs Lc {issue.minRequired}+
                      </span>
                    </div>
                  </div>
                  <ContrastBadge apcaValue={issue.apcaValue} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showExport && darkPalette && (
        <ExportModal palette={darkPalette} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
