import { useState, useEffect } from 'react';
import { Code, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
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
        <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Quick Insert</p>
        <div className="grid grid-cols-4 gap-2">
          {darkPalette.colors.slice(0, 8).map((color, i) => (
            <button
              key={i}
              onClick={() => {
                const newCSS = css + `\n  --color-${color.role}-${i}: ${color.hex};`;
                handleChange(newCSS);
              }}
              className="group relative px-2 py-1.5 rounded-lg border border-dark-600 hover:border-primary-500 transition-all cursor-pointer"
              style={{ backgroundColor: color.hex }}
              title={`Insert ${color.name} (${color.hex})`}
            >
              <span className="text-[10px] font-mono text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                {color.hex}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
