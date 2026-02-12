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
      </div>
    </div>
  );
}
