import { useState } from 'react';
import { X, Download, Copy, Check, Share2, Image, Loader2 } from 'lucide-react';
import { Button } from './Button';
import type { DarkPalette } from '../types';
import { EXPORT_FORMATS, generateCSS, generateJSON, generateTailwind, downloadFile } from '../utils/exportFormats';
import { generatePaletteImage, downloadPaletteImage } from '../utils/exportImage';

interface ExportModalProps {
  palette: DarkPalette;
  onClose: () => void;
}

export function ExportModal({ palette, onClose }: ExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<'css' | 'json' | 'tailwind' | 'png'>('css');
  const [copied, setCopied] = useState(false);
  const [pngGenerating, setPngGenerating] = useState(false);
  const [pngPreview, setPngPreview] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'shared' | 'unsupported'>('idle');

  const getContent = () => {
    switch (activeFormat) {
      case 'css': return generateCSS(palette);
      case 'json': return generateJSON(palette);
      case 'tailwind': return generateTailwind(palette);
      case 'png': return '';
    }
  };

  const content = getContent();

  const handleCopy = async () => {
    if (activeFormat === 'png') {
      try {
        const blob = await generatePaletteImage(palette);
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      } catch {
        // Fallback: copy CSS if image clipboard write fails
        await navigator.clipboard.writeText(generateCSS(palette));
      }
    } else {
      await navigator.clipboard.writeText(content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (activeFormat === 'png') {
      setPngGenerating(true);
      try {
        await downloadPaletteImage(palette);
      } finally {
        setPngGenerating(false);
      }
      return;
    }
    const format = EXPORT_FORMATS.find(f => f.id === activeFormat)!;
    const mimeTypes: Record<string, string> = {
      css: 'text/css',
      json: 'application/json',
      tailwind: 'text/javascript',
    };
    downloadFile(content, `dark-mode-palette${format.extension}`, mimeTypes[activeFormat] || 'text/plain');
  };

  const handleShare = async () => {
    if (!navigator.share) {
      setShareStatus('unsupported');
      setTimeout(() => setShareStatus('idle'), 3000);
      return;
    }

    setShareStatus('sharing');
    try {
      const shareData: ShareData = {
        title: 'Dark Mode Palette',
        text: `Dark mode palette with ${palette.colors.length} colors`,
      };

      // Try sharing with image file
      if (activeFormat === 'png') {
        const blob = await generatePaletteImage(palette);
        const file = new File([blob], 'dark-mode-palette.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          shareData.files = [file];
        }
      }

      await navigator.share(shareData);
      setShareStatus('shared');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (err) {
      // User cancelled or error
      if (err instanceof Error && err.name !== 'AbortError') {
        setShareStatus('unsupported');
        setTimeout(() => setShareStatus('idle'), 3000);
      } else {
        setShareStatus('idle');
      }
    }
  };

  const handleGeneratePreview = async () => {
    setPngGenerating(true);
    try {
      const blob = await generatePaletteImage(palette);
      setPngPreview(URL.createObjectURL(blob));
    } finally {
      setPngGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-100">Export Dark Mode Palette</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Format tabs */}
          <div className="flex gap-2 mb-4">
            {EXPORT_FORMATS.map(format => (
              <button
                key={format.id}
                onClick={() => { setActiveFormat(format.id); setPngPreview(null); }}
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

          {/* Code preview (for code formats) */}
          {activeFormat !== 'png' && (
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
          )}

          {/* PNG preview */}
          {activeFormat === 'png' && (
            <div className="rounded-xl bg-dark-900 border border-dark-700 overflow-hidden">
              {pngPreview ? (
                <img src={pngPreview} alt="Palette preview" className="w-full" />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  {pngGenerating ? (
                    <>
                      <Loader2 size={32} className="text-primary-500 animate-spin" />
                      <p className="text-dark-400 text-sm">Generating palette image...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-dark-700 flex items-center justify-center">
                        <Image size={24} className="text-dark-400" />
                      </div>
                      <p className="text-dark-400 text-sm">PNG image with all palette colors and metadata</p>
                      <Button variant="secondary" size="sm" onClick={handleGeneratePreview}>
                        Generate Preview
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dark-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            icon={
              shareStatus === 'sharing' ? <Loader2 size={14} className="animate-spin" /> :
              shareStatus === 'shared' ? <Check size={14} className="text-success" /> :
              <Share2 size={14} />
            }
            disabled={shareStatus === 'sharing'}
          >
            {shareStatus === 'shared' ? 'Shared!' :
             shareStatus === 'unsupported' ? 'Share not available' :
             'Share'}
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            {activeFormat !== 'png' && (
              <Button variant="ghost" onClick={handleCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />}>
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            )}
            <Button
              onClick={handleDownload}
              icon={pngGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              disabled={pngGenerating}
            >
              {activeFormat === 'png' ? 'Download PNG' : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
