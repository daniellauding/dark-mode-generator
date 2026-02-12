import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, Loader2, Image, Clipboard, X, Images } from 'lucide-react';
import { Button } from './Button';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onBatchUpload?: (files: File[]) => void;
  isLoading: boolean;
}

function BatchGrid({ files, onRemove }: { files: File[]; onRemove: (index: number) => void }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
      {files.map((file, i) => (
        <div key={`${file.name}-${i}`} className="relative group rounded-lg overflow-hidden border border-dark-600 bg-dark-800">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-20 object-cover"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(i); }}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-dark-900/80 text-dark-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={12} />
          </button>
          <div className="px-1.5 py-1 text-[10px] text-dark-400 truncate">{file.name}</div>
        </div>
      ))}
    </div>
  );
}

export function UploadZone({ onFileUpload, onUrlSubmit, onBatchUpload, isLoading }: UploadZoneProps) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'clipboard'>('file');
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [clipboardReading, setClipboardReading] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  const processSingleFile = useCallback((file: File) => {
    if (batchFiles.length > 0 || onBatchUpload) {
      setBatchFiles(prev => [...prev, file]);
    } else {
      onFileUpload(file);
    }
  }, [batchFiles.length, onBatchUpload, onFileUpload]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 1 && onBatchUpload) {
      setBatchFiles(prev => [...prev, ...accepted]);
    } else if (accepted.length === 1) {
      if (batchFiles.length > 0) {
        setBatchFiles(prev => [...prev, accepted[0]]);
      } else {
        onFileUpload(accepted[0]);
      }
    }
  }, [onFileUpload, onBatchUpload, batchFiles.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxFiles: 20,
    maxSize: 10 * 1024 * 1024,
  });

  const readClipboard = useCallback(async () => {
    setClipboardError(null);
    setClipboardReading(true);

    try {
      if (!navigator.clipboard?.read) {
        setClipboardError('Clipboard API not supported in this browser');
        setClipboardReading(false);
        return;
      }

      const items = await navigator.clipboard.read();
      let found = false;

      for (const item of items) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split('/')[1] || 'png';
          const file = new File([blob], `pasted-image.${ext}`, { type: imageType });
          processSingleFile(file);
          found = true;
          break;
        }
      }

      if (!found) {
        setClipboardError('No image found in clipboard. Copy an image first.');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setClipboardError('Clipboard access denied. Allow clipboard permissions and try again.');
      } else {
        setClipboardError('Could not read clipboard. Try pasting with Cmd+V instead.');
      }
    } finally {
      setClipboardReading(false);
    }
  }, [processSingleFile]);

  // Global Cmd+V / Ctrl+V listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            processSingleFile(file);
            setActiveTab('file');
          }
          return;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [processSingleFile]);

  const handleUrlSubmit = () => {
    try {
      new URL(url);
      setUrlError('');
      onUrlSubmit(url);
    } catch {
      setUrlError('Please enter a valid URL');
    }
  };

  const handleBatchRemove = (index: number) => {
    setBatchFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchProcess = () => {
    if (batchFiles.length === 1) {
      onFileUpload(batchFiles[0]);
      setBatchFiles([]);
    } else if (batchFiles.length > 1 && onBatchUpload) {
      onBatchUpload(batchFiles);
      setBatchFiles([]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Tab bar */}
      <div className="flex rounded-lg overflow-hidden mb-6 bg-dark-800 p-1">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
            activeTab === 'file'
              ? 'bg-dark-700 text-white'
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          <Upload size={16} className="inline mr-2" />
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('clipboard')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
            activeTab === 'clipboard'
              ? 'bg-dark-700 text-white'
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          <Clipboard size={16} className="inline mr-2" />
          Paste Image
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-dark-700 text-white'
              : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          <Link size={16} className="inline mr-2" />
          Paste URL
        </button>
      </div>

      {/* File upload tab */}
      {activeTab === 'file' && (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-500/5 glow-primary'
                : 'border-dark-600 hover:border-dark-400 bg-dark-800/50'
            }`}
          >
            <input {...getInputProps()} />
            {isLoading ? (
              <div className="space-y-4">
                <Loader2 size={48} className="mx-auto text-primary-500 animate-spin" />
                <p className="text-dark-300">Analyzing your design...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-700 flex items-center justify-center">
                  <Image size={28} className="text-dark-400" />
                </div>
                <div>
                  <p className="text-dark-200 font-medium">
                    {isDragActive ? 'Drop your design here' : 'Drag & drop your design'}
                  </p>
                  <p className="text-dark-500 text-sm mt-1">
                    PNG, JPG, WebP, or SVG up to 10MB
                  </p>
                  {onBatchUpload && (
                    <p className="text-dark-600 text-xs mt-1">
                      Drop multiple files for batch processing
                    </p>
                  )}
                </div>
                <Button variant="secondary" size="sm" type="button">
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          {/* Batch preview grid */}
          {batchFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-300 flex items-center gap-1.5">
                  <Images size={14} />
                  {batchFiles.length} {batchFiles.length === 1 ? 'image' : 'images'} selected
                </span>
                <button
                  onClick={() => setBatchFiles([])}
                  className="text-xs text-dark-500 hover:text-dark-300 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <BatchGrid files={batchFiles} onRemove={handleBatchRemove} />
              <Button
                onClick={handleBatchProcess}
                className="w-full mt-4"
                disabled={isLoading}
                icon={batchFiles.length > 1 ? <Images size={16} /> : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : batchFiles.length === 1 ? (
                  'Analyze Design'
                ) : (
                  `Analyze ${batchFiles.length} Designs`
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Clipboard paste tab */}
      {activeTab === 'clipboard' && (
        <div className="space-y-4">
          <div
            onClick={readClipboard}
            className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 border-dark-600 hover:border-primary-500 hover:bg-primary-500/5 bg-dark-800/50"
          >
            {clipboardReading ? (
              <div className="space-y-4">
                <Loader2 size={48} className="mx-auto text-primary-500 animate-spin" />
                <p className="text-dark-300">Reading clipboard...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-700 flex items-center justify-center">
                  <Clipboard size={28} className="text-dark-400" />
                </div>
                <div>
                  <p className="text-dark-200 font-medium">Paste Image from Clipboard</p>
                  <p className="text-dark-500 text-sm mt-1">
                    Click here or press <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-300 text-xs font-mono">Cmd+V</kbd> anywhere
                  </p>
                </div>
                <Button variant="secondary" size="sm" type="button" icon={<Clipboard size={14} />}>
                  Read Clipboard
                </Button>
              </div>
            )}
          </div>
          {clipboardError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {clipboardError}
            </div>
          )}
        </div>
      )}

      {/* URL tab */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setUrlError(''); }}
              placeholder="https://example.com/design.png"
              className="w-full px-4 py-3 pl-10 rounded-xl bg-dark-800 border border-dark-600 text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Link size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
          </div>
          {urlError && <p className="text-danger text-sm">{urlError}</p>}
          <Button onClick={handleUrlSubmit} disabled={!url || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Design'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
