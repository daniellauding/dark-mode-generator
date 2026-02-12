import { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Button } from './Button';
import type { DarkPalette } from '../types';
import { EXPORT_FORMATS, generateCSS, generateJSON, generateTailwind, downloadFile } from '../utils/exportFormats';

interface ExportModalProps {
  palette: DarkPalette;
  onClose: () => void;
}

export function ExportModal({ palette, onClose }: ExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<'css' | 'json' | 'tailwind' | 'png'>('css');
  const [copied, setCopied] = useState(false);

  const getContent = () => {
    switch (activeFormat) {
      case 'css': return generateCSS(palette);
      case 'json': return generateJSON(palette);
      case 'tailwind': return generateTailwind(palette);
      case 'png': return '// PNG export will download a palette image';
    }
  };

  const content = getContent();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const format = EXPORT_FORMATS.find(f => f.id === activeFormat)!;
    const mimeTypes: Record<string, string> = {
      css: 'text/css',
      json: 'application/json',
      tailwind: 'text/javascript',
    };
    downloadFile(content, `dark-mode-palette${format.extension}`, mimeTypes[activeFormat] || 'text/plain');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-100">Export Dark Mode Palette</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-4">
            {EXPORT_FORMATS.map(format => (
              <button
                key={format.id}
                onClick={() => setActiveFormat(format.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeFormat === format.id
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-700 text-dark-400 hover:text-dark-200 border border-transparent'
                }`}
              >
                {format.name}
              </button>
            ))}
          </div>

          <div className="relative rounded-xl bg-dark-900 border border-dark-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700">
              <span className="text-xs text-dark-500 font-mono">
                dark-mode-palette{EXPORT_FORMATS.find(f => f.id === activeFormat)?.extension}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <pre className="p-4 text-sm text-dark-300 font-mono overflow-x-auto max-h-64">
              <code>{content}</code>
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-700">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="ghost" onClick={handleCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />}>
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button onClick={handleDownload} icon={<Download size={16} />}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
