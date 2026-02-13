import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { ColorSwatch } from '../components/ColorSwatch';
import { Slider } from '../components/Slider';
import { PresetCard } from '../components/PresetCard';
import { ContrastBadge } from '../components/ContrastBadge';
import { useDesignStore } from '../stores/designStore';
import { useContrastValidation } from '../hooks/useContrastValidation';
import { PRESETS } from '../utils/colorConversion';

export function Analysis() {
  const navigate = useNavigate();
  const {
    palette,
    darkPalette,
    activePreset,
    bgDarkness,
    textLightness,
    accentSaturation,
    setPreset,
    setBgDarkness,
    setTextLightness,
    setAccentSaturation,
    imageName,
    extractionData,
  } = useDesignStore();

  const { issues, passCount, totalChecked } = useContrastValidation(darkPalette);

  if (!palette || !darkPalette) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Color Analysis</h1>
            <p className="text-dark-400 text-sm mt-1">
              {imageName ? `Analyzing: ${imageName}` : 'Extracted palette'} — {palette.colors.length} colors found
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/upload')} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button onClick={() => navigate('/preview')} icon={<ArrowRight size={16} />}>
              Preview
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Original Palette */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
              <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                Original Palette
              </h2>
              <div className="space-y-4">
                {palette.colors.map((color, i) => (
                  <ColorSwatch key={i} hex={color.hex} name={color.name} role={color.role} size="md" />
                ))}
              </div>
            </div>
          </div>

          {/* Center: Dark Palette */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
              <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                Dark Mode Palette
              </h2>
              <div className="space-y-4">
                {darkPalette.colors.map((color, i) => (
                  <ColorSwatch
                    key={i}
                    hex={color.hex}
                    name={color.name}
                    role={color.role}
                    originalHex={color.originalHex}
                    apcaValue={color.apcaValue}
                    showContrast
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Contrast Summary */}
            <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-dark-200">APCA Contrast Check</h3>
                <span className={`text-xs font-medium ${issues.length === 0 ? 'text-success' : 'text-warning'}`}>
                  {passCount}/{totalChecked} passing
                </span>
              </div>

              {issues.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check size={16} />
                  All color pairs pass APCA requirements
                </div>
              ) : (
                <div className="space-y-2">
                  {issues.map((issue, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full border border-dark-600" style={{ backgroundColor: issue.foreground }} />
                          <div className="w-4 h-4 rounded-full border border-dark-600" style={{ backgroundColor: issue.background }} />
                        </div>
                        <span className="text-xs text-dark-400">{issue.element}</span>
                      </div>
                      <ContrastBadge apcaValue={issue.apcaValue} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Customization Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
              <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                Presets
              </h2>
              <div className="space-y-3">
                {PRESETS.map(preset => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    isActive={activePreset === preset.id}
                    onClick={() => setPreset(preset.id)}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
              <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                Fine-tune
              </h2>
              <div className="space-y-5">
                <Slider
                  label="Background Darkness"
                  value={bgDarkness}
                  onChange={setBgDarkness}
                />
                <Slider
                  label="Text Lightness"
                  value={textLightness}
                  onChange={setTextLightness}
                />
                <Slider
                  label="Accent Saturation"
                  value={accentSaturation}
                  onChange={setAccentSaturation}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Extraction Data (if available) */}
        {extractionData && (
          <div className="mt-8 p-6 rounded-2xl bg-dark-800/50 border border-dark-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span>
              <h2 className="text-lg font-semibold text-dark-100">AI Extraction Results</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CSS Variables */}
              {extractionData.cssVariables && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">CSS Variables</h3>
                  <pre className="p-4 rounded-lg bg-dark-900 text-dark-200 text-xs overflow-x-auto border border-dark-700">
                    {extractionData.cssVariables}
                  </pre>
                </div>
              )}

              {/* Tailwind Config */}
              {extractionData.tailwindConfig && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Tailwind Config</h3>
                  <pre className="p-4 rounded-lg bg-dark-900 text-dark-200 text-xs overflow-x-auto border border-dark-700">
                    {extractionData.tailwindConfig}
                  </pre>
                </div>
              )}

              {/* Design System */}
              {extractionData.designSystem && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Design System</h3>
                  <div className="p-4 rounded-lg bg-dark-900 border border-dark-700 space-y-2 text-sm">
                    {extractionData.designSystem.grid && (
                      <div>
                        <span className="text-dark-500">Grid:</span>{' '}
                        <span className="text-dark-200">{extractionData.designSystem.grid}</span>
                      </div>
                    )}
                    {extractionData.designSystem.typography && (
                      <div>
                        <span className="text-dark-500">Typography:</span>{' '}
                        <span className="text-dark-200">{extractionData.designSystem.typography.join(', ')}</span>
                      </div>
                    )}
                    {extractionData.designSystem.spacing && (
                      <div>
                        <span className="text-dark-500">Spacing:</span>{' '}
                        <span className="text-dark-200">{extractionData.designSystem.spacing.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WCAG Compliance */}
              {extractionData.wcag && (
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">WCAG Compliance</h3>
                  <div className="p-4 rounded-lg bg-dark-900 border border-dark-700">
                    <div className="flex items-center gap-2 mb-2">
                      {extractionData.wcag.compliant ? (
                        <>
                          <Check size={16} className="text-green-500" />
                          <span className="text-sm text-green-400">Compliant</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="text-yellow-500" />
                          <span className="text-sm text-yellow-400">Issues Found</span>
                        </>
                      )}
                    </div>
                    {extractionData.wcag.issues && extractionData.wcag.issues.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {extractionData.wcag.issues.map((issue, i) => (
                          <li key={i} className="text-xs text-dark-400">• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Implementation Notes */}
              {extractionData.implementationNotes && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Implementation Notes</h3>
                  <div className="p-4 rounded-lg bg-dark-900 text-dark-200 text-sm border border-dark-700">
                    {extractionData.implementationNotes}
                  </div>
                </div>
              )}

              {/* Best Practices */}
              {extractionData.bestPractices && extractionData.bestPractices.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Best Practices Used</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {extractionData.bestPractices.map((practice, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                        <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
