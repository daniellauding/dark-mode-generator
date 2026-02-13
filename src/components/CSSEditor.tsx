import { useState, useEffect } from 'react';
import { Code, Copy, Check, RotateCcw, Sparkles, Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from './Button';
import type { DarkPalette } from '../types';

interface CSSEditorProps {
  darkPalette: DarkPalette;
  onCSSChange: (css: string) => void;
  generatedCSS: string;
}

export function CSSEditor({ darkPalette, onCSSChange, generatedCSS }: CSSEditorProps) {
  const [css, setCSS] = useState(generatedCSS);
  const [copied, setCopied] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const [pickerColor, setPickerColor] = useState('#ffffff');

  useEffect(() => {
    setCSS(generatedCSS);
  }, [generatedCSS]);

  const handleChange = (newCSS: string) => {
    setCSS(newCSS);
    setHasEdits(newCSS !== generatedCSS);
    onCSSChange(newCSS);
  };

  const handleReset = () => {
    setCSS(generatedCSS);
    setHasEdits(false);
    onCSSChange(generatedCSS);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleColorPick = (index: number, color: string) => {
    setPickerOpen(index);
    setPickerColor(color);
  };

  const handleColorChange = (newColor: string, index: number) => {
    setPickerColor(newColor);
    // Update CSS with new color
    const colorName = darkPalette.colors[index].name.toLowerCase().replace(/\s+/g, '-');
    const regex = new RegExp(`--color-${colorName}:\\s*#[0-9a-fA-F]{6}`, 'g');
    const newCSS = css.includes(`--color-${colorName}`)
      ? css.replace(regex, `--color-${colorName}: ${newColor}`)
      : css + `\n  --color-${colorName}: ${newColor};`;
    handleChange(newCSS);
  };

  return (
    <div className="h-full flex flex-col bg-dark-900 rounded-lg border border-dark-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-dark-200">CSS Editor</h3>
          {hasEdits && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
              Modified
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasEdits && (
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw size={14} />}>
              Reset
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="p-3 bg-primary-500/10 border-b border-primary-500/20">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-primary-400 mt-0.5 shrink-0" />
          <p className="text-xs text-dark-300">
            <strong className="text-dark-200">Live CSS Playground:</strong> Edit CSS variables
            below and see changes in real-time on the preview above. Works even without API key!
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <textarea
          value={css}
          onChange={e => handleChange(e.target.value)}
          className="w-full h-full p-4 bg-dark-900 text-dark-200 font-mono text-sm resize-none focus:outline-none border-0"
          placeholder=":root {
  --color-bg: #080808;
  --color-surface: #0f0f0f;
  --color-text: #eeeeee;
  /* Add your CSS variables here */
}"
          spellCheck={false}
        />
      </div>

      {/* Quick colors palette */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-dark-500 uppercase tracking-wider">Palette Colors</p>
          <p className="text-xs text-dark-600">Click to edit</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {darkPalette.colors.slice(0, 8).map((color, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => handleColorPick(i, color.hex)}
                className="group relative w-full h-12 rounded-lg border border-dark-600 hover:border-primary-500 transition-all cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} (${color.hex})`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                  <Pipette size={16} className="text-white" />
                </div>
                <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-mono text-white drop-shadow-md">
                  {color.hex}
                </span>
              </button>
              
              {/* Color picker popover */}
              {pickerOpen === i && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setPickerOpen(null)}
                  />
                  {/* Popover */}
                  <div className="absolute bottom-full left-0 mb-2 z-50 p-3 bg-dark-800 rounded-xl border border-dark-600 shadow-2xl">
                    <div className="mb-2">
                      <p className="text-xs text-dark-300 font-medium mb-1">{color.name}</p>
                      <input
                        type="text"
                        value={pickerColor}
                        onChange={e => handleColorChange(e.target.value, i)}
                        className="w-full px-2 py-1 bg-dark-900 border border-dark-600 rounded text-dark-200 font-mono text-xs"
                      />
                    </div>
                    <HexColorPicker 
                      color={pickerColor} 
                      onChange={newColor => handleColorChange(newColor, i)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button 
                        size="sm" 
                        onClick={() => setPickerOpen(null)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
