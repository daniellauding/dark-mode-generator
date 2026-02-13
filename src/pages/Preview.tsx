import { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertTriangle, Check, Moon, Sun, FileDown, GitBranch, Save } from 'lucide-react';
import { Button } from '../components/Button';
import { ExportModal } from '../components/ExportModal';
import { ContrastBadge } from '../components/ContrastBadge';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { LivePreviewCompare } from '../components/LivePreviewCompare';
import { Toast } from '../components/Toast';
import { useDesignStore } from '../stores/designStore';
import { useContrastValidation } from '../hooks/useContrastValidation';
import { useAuth } from '../hooks/useAuth';
import { AddIterationModal } from '../components/palette/AddIterationModal';
import { SavePaletteModal } from '../components/palette/SavePaletteModal';
import { generateCSS, downloadFile } from '../utils/exportFormats';

function MockUI({ palette, mode }: { palette: { bg: string; surface: string; text: string; accent: string; border: string; muted: string }; mode: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden border h-full"
      style={{ backgroundColor: palette.bg, borderColor: palette.border }}
    >
      {/* Mock nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: palette.accent }} />
          <div className="w-20 h-3 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.8 }} />
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-3 rounded-full" style={{ backgroundColor: palette.muted }} />
          <div className="w-12 h-3 rounded-full" style={{ backgroundColor: palette.muted }} />
          <div className="w-12 h-3 rounded-full" style={{ backgroundColor: palette.muted }} />
        </div>
      </div>

      {/* Mock content */}
      <div className="p-5 space-y-4">
        {/* Hero area */}
        <div className="space-y-2">
          <div className="w-3/4 h-5 rounded" style={{ backgroundColor: palette.text, opacity: 0.9 }} />
          <div className="w-full h-3 rounded" style={{ backgroundColor: palette.muted }} />
          <div className="w-2/3 h-3 rounded" style={{ backgroundColor: palette.muted }} />
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: palette.accent, color: '#fff' }}>
            Get Started
          </div>
          <div className="px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: palette.border, color: palette.text }}>
            Learn More
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[1, 2].map(i => (
            <div key={i} className="rounded-lg p-3 border" style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
              <div className="w-8 h-8 rounded-md mb-2" style={{ backgroundColor: palette.accent, opacity: 0.2 }} />
              <div className="w-3/4 h-3 rounded mb-1.5" style={{ backgroundColor: palette.text, opacity: 0.8 }} />
              <div className="w-full h-2 rounded" style={{ backgroundColor: palette.muted }} />
              <div className="w-2/3 h-2 rounded mt-1" style={{ backgroundColor: palette.muted }} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: palette.surface }}>
              <div className="w-8 h-4 rounded mx-auto mb-1" style={{ backgroundColor: palette.accent, opacity: 0.7 }} />
              <div className="w-12 h-2 rounded mx-auto" style={{ backgroundColor: palette.muted }} />
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="px-4 py-2 border-t text-center" style={{ borderColor: palette.border }}>
        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: palette.muted }}>
          {mode === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </span>
      </div>
    </div>
  );
}

export function Preview() {
  const navigate = useNavigate();
  const { palette, darkPalette, showExportModal, setShowExportModal, editingPaletteId, activePreset, bgDarkness, textLightness, accentSaturation, sourceUrl } = useDesignStore();
  const { issues, passCount, totalChecked } = useContrastValidation(darkPalette);
  const { user, loading: authLoading } = useAuth();
  
  // Detect if source is URL extraction (not image upload)
  const isURLSource = sourceUrl !== null;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [quickDownloaded, setQuickDownloaded] = useState(false);
  const [showSignupToast, setShowSignupToast] = useState(false);
  const [showIterationModal, setShowIterationModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [iterationSavedToast, setIterationSavedToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const dismissed = sessionStorage.getItem('signup-toast-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowSignupToast(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [authLoading, user]);

  const handleQuickDownload = useCallback(() => {
    if (!darkPalette) return;
    const css = generateCSS(darkPalette);
    downloadFile(css, 'dark-mode-palette.css', 'text/css');
    setQuickDownloaded(true);
    setTimeout(() => setQuickDownloaded(false), 2000);
  }, [darkPalette]);

  const handleScroll = useCallback((source: 'left' | 'right') => {
    const from = source === 'left' ? leftRef.current : rightRef.current;
    const to = source === 'left' ? rightRef.current : leftRef.current;
    if (from && to) {
      to.scrollTop = from.scrollTop;
    }
  }, []);

  if (!palette || !darkPalette) {
    navigate('/upload');
    return null;
  }

  const lightPalette = {
    bg: palette.backgroundColor,
    surface: palette.colors.find(c => c.role === 'surface')?.hex ?? '#f8fafc',
    text: palette.textColor,
    accent: palette.colors.find(c => c.role === 'accent')?.hex ?? '#3b82f6',
    border: palette.colors.find(c => c.role === 'border')?.hex ?? '#e2e8f0',
    muted: '#94a3b8',
  };

  const darkUI = {
    bg: darkPalette.backgroundColor,
    surface: darkPalette.surfaceColor,
    text: darkPalette.textColor,
    accent: darkPalette.colors.find(c => c.role === 'accent')?.hex ?? '#60a5fa',
    border: darkPalette.colors.find(c => c.role === 'border')?.hex ?? '#1f2937',
    muted: '#4b5563',
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Preview</h1>
            <p className="text-dark-400 text-sm mt-1">Side-by-side comparison of your light and dark modes</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/analysis')} icon={<ArrowLeft size={16} />}>
              Customize
            </Button>
            <Button
              variant="ghost"
              onClick={handleQuickDownload}
              icon={quickDownloaded ? <Check size={16} className="text-success" /> : <FileDown size={16} />}
              title="Quick download as CSS"
            >
              {quickDownloaded ? 'Downloaded!' : 'Quick CSS'}
            </Button>
            <Button onClick={() => setShowExportModal(true)} icon={<Download size={16} />}>
              Export
            </Button>
            {user && (
              <Button
                variant="secondary"
                onClick={() => setShowSaveModal(true)}
                icon={<Save size={16} />}
              >
                Save
              </Button>
            )}
            {user && editingPaletteId && (
              <Button
                variant="secondary"
                onClick={() => setShowIterationModal(true)}
                icon={<GitBranch size={16} />}
              >
                Save Iteration
              </Button>
            )}
          </div>
        </div>

        {/* Contrast summary bar */}
        <div className="mb-6 p-4 rounded-xl bg-dark-800/50 border border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-success">
                <Check size={18} />
                <span className="text-sm font-medium">All {totalChecked} color pairs pass APCA</span>
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
                style={{ width: `${totalChecked > 0 ? (passCount / totalChecked) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Accessibility panel */}
        <div className="mb-6">
          <AccessibilityPanel />
        </div>

        {/* Preview */}
        {isURLSource && sourceUrl ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-dark-300">Live Comparison</span>
              <span className="text-xs text-dark-500">Drag slider to compare</span>
            </div>
            <LivePreviewCompare
              url={sourceUrl}
              darkCSS={generateCSS(darkPalette)}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              ref={leftRef}
              onScroll={() => handleScroll('left')}
              className="overflow-auto"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sun size={14} className="text-warning" />
                <span className="text-sm font-medium text-dark-300">Light Mode</span>
              </div>
              <MockUI palette={lightPalette} mode="light" />
            </div>
            <div
              ref={rightRef}
              onScroll={() => handleScroll('right')}
              className="overflow-auto"
            >
              <div className="flex items-center gap-2 mb-3">
                <Moon size={14} className="text-primary-400" />
                <span className="text-sm font-medium text-dark-300">Dark Mode</span>
              </div>
              <MockUI palette={darkUI} mode="dark" />
            </div>
          </div>
        )}

        {/* Contrast issues detail */}
        {issues.length > 0 && (
          <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
              Contrast Issues
            </h2>
            <div className="space-y-3">
              {issues.map((issue, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 border border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full border-2 border-dark-800" style={{ backgroundColor: issue.foreground }} />
                      <div className="w-6 h-6 rounded-full border-2 border-dark-800" style={{ backgroundColor: issue.background }} />
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

      {showExportModal && darkPalette && (
        <ExportModal palette={darkPalette} onClose={() => setShowExportModal(false)} />
      )}

      {showIterationModal && editingPaletteId && (
        <AddIterationModal
          paletteId={editingPaletteId}
          onClose={() => setShowIterationModal(false)}
          onSaved={() => setIterationSavedToast(true)}
        />
      )}

      {iterationSavedToast && (
        <Toast
          message="Iteration saved successfully"
          onDismiss={() => setIterationSavedToast(false)}
          duration={3000}
        />
      )}

      {showSaveModal && palette && darkPalette && (
        <SavePaletteModal
          lightPalette={palette}
          darkPalette={darkPalette}
          preset={activePreset}
          bgDarkness={bgDarkness}
          textLightness={textLightness}
          accentSaturation={accentSaturation}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => setSavedToast(true)}
        />
      )}

      {savedToast && (
        <Toast
          message="Palette saved to your library!"
          onDismiss={() => setSavedToast(false)}
          duration={3000}
        />
      )}

      {showSignupToast && (
        <Toast
          message="Sign up to save this palette"
          action={{ label: 'Sign up', onClick: () => navigate('/?signup=1') }}
          onDismiss={() => {
            setShowSignupToast(false);
            sessionStorage.setItem('signup-toast-dismissed', '1');
          }}
        />
      )}
    </div>
  );
}
