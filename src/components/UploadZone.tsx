import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, Loader2, Image } from 'lucide-react';
import { Button } from './Button';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UploadZone({ onFileUpload, onUrlSubmit, isLoading }: UploadZoneProps) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      onFileUpload(accepted[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUrlSubmit = () => {
    try {
      new URL(url);
      setUrlError('');
      onUrlSubmit(url);
    } catch {
      setUrlError('Please enter a valid URL');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
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

      {activeTab === 'file' ? (
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
              </div>
              <Button variant="secondary" size="sm" type="button">
                Browse Files
              </Button>
            </div>
          )}
        </div>
      ) : (
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
