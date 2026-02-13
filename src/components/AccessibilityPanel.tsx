import { useState, useMemo } from 'react';
import { Check, X, ChevronDown, Wand2, Eye, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { useDesignStore } from '../stores/designStore';
import { ACCESSIBILITY_PRESETS, validateAccessibility, autoFixPalette } from '../utils/colorConversion';
import type { AccessibilityLevel, DarkPalette } from '../types';

export function AccessibilityPanel() {
  const {
    darkPalette,
    palette,
    accessibilityLevel,
    setAccessibilityLevel,
    applyAutoFix,
  } = useDesignStore();

  const [showDetails, setShowDetails] = useState(false);
  const [showAutoFixPreview, setShowAutoFixPreview] = useState(false);
  const [preFixPalette, setPreFixPalette] = useState<DarkPalette | null>(null);

  const validation = useMemo(() => {
    if (!darkPalette) return null;
    return validateAccessibility(darkPalette, accessibilityLevel);
  }, [darkPalette, accessibilityLevel]);

  const fixedPreview = useMemo(() => {
    if (!darkPalette || !palette || accessibilityLevel === 'none') return null;
    return autoFixPalette(darkPalette, accessibilityLevel, palette);
  }, [darkPalette, palette, accessibilityLevel]);

  if (!darkPalette || !palette) return null;

  const handleLevelChange = (level: AccessibilityLevel) => {
    setAccessibilityLevel(level);
    setShowAutoFixPreview(false);
    setPreFixPalette(null);
  };

  const handleAutoFix = () => {
    setPreFixPalette(darkPalette);
    setShowAutoFixPreview(true);
  };

  const handleApplyFix = () => {
    applyAutoFix();
    setShowAutoFixPreview(false);
    setPreFixPalette(null);
  };

  const handleCancelFix = () => {
    setShowAutoFixPreview(false);
    setPreFixPalette(null);
  };

  const currentPreset = ACCESSIBILITY_PRESETS.find(p => p.id === accessibilityLevel);

  return (
    <div className="space-y-4">
      {/* Accessibility Level Dropdown */}
      <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-dark-200">Accessibility Level</h3>
            <p className="text-xs text-dark-500 mt-0.5">{currentPreset?.description}</p>
          </div>
          <div className="relative">
            <select
              value={accessibilityLevel}
              onChange={(e) => handleLevelChange(e.target.value as AccessibilityLevel)}
              className="appearance-none bg-dark-900 border border-dark-600 text-dark-200 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              {ACCESSIBILITY_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Validation Badge */}
      {accessibilityLevel !== 'none' && validation && (
        <div
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            validation.passes
              ? 'bg-success/5 border-success/30'
              : 'bg-danger/5 border-danger/30'
          }`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {validation.passes ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-sm font-medium text-success">
                    Passes {currentPreset?.name}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-danger/20 flex items-center justify-center">
                    <X size={14} className="text-danger" />
                  </div>
                  <span className="text-sm font-medium text-danger">
                    Fails {currentPreset?.name} ({validation.issues.length} color{validation.issues.length !== 1 ? 's' : ''} need adjustment)
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500">
                {validation.passCount}/{validation.totalChecked} passing
              </span>
              <ChevronDown
                size={14}
                className={`text-dark-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Detailed Issues */}
          {showDetails && validation.issues.length > 0 && (
            <div className="mt-4 space-y-2">
              {validation.issues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-900/80 border border-dark-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-dark-800"
                        style={{ backgroundColor: issue.colorHex }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-dark-800"
                        style={{ backgroundColor: issue.bgHex }}
                      />
                    </div>
                    <span className="text-sm text-dark-300">{issue.colorName}</span>
                  </div>
                  <div className="text-right">
                    {accessibilityLevel === 'apca-optimized' ? (
                      <span className="text-xs text-danger font-mono">
                        Lc {issue.apcaValue}, needs {issue.apcaRequired}+
                      </span>
                    ) : (
                      <span className="text-xs text-danger font-mono">
                        {issue.wcagRatio}:1, needs {issue.wcagRequired}:1
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto-Fix Button */}
      {accessibilityLevel !== 'none' && validation && !validation.passes && !showAutoFixPreview && (
        <Button
          variant="primary"
          onClick={handleAutoFix}
          icon={<Wand2 size={16} />}
          className="w-full"
        >
          Auto-Fix to Pass {currentPreset?.name}
        </Button>
      )}

      {/* Auto-Fix Preview (Before/After) */}
      {showAutoFixPreview && preFixPalette && fixedPreview && (
        <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700 space-y-4">
          <h3 className="text-sm font-semibold text-dark-200 flex items-center gap-2">
            <Eye size={14} />
            Auto-Fix Preview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <span className="text-xs text-dark-500 uppercase tracking-wider block mb-2">Before</span>
              <div className="space-y-1.5">
                {preFixPalette.colors
                  .filter(c => c.role !== 'background')
                  .map((color, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-dark-600"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-dark-400 font-mono truncate">{color.hex}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* After */}
            <div>
              <span className="text-xs text-dark-500 uppercase tracking-wider block mb-2">After</span>
              <div className="space-y-1.5">
                {fixedPreview.colors
                  .filter(c => c.role !== 'background')
                  .map((color, i) => {
                    const beforeColor = preFixPalette.colors.find(c => c.name === color.name);
                    const changed = beforeColor && beforeColor.hex !== color.hex;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border ${changed ? 'border-success/50 ring-1 ring-success/30' : 'border-dark-600'}`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-xs font-mono truncate ${changed ? 'text-success' : 'text-dark-400'}`}>
                          {color.hex}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="primary" onClick={handleApplyFix} icon={<Check size={14} />} className="flex-1">
              Apply
            </Button>
            <Button variant="ghost" onClick={handleCancelFix} icon={<RotateCcw size={14} />} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
