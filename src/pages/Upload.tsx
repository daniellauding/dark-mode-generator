import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../components/UploadZone';
import { useDesignStore } from '../stores/designStore';
import { useColorExtraction } from '../hooks/useColorExtraction';

export function Upload() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setImage } = useDesignStore();
  const { extractFromImage, extractFromUrl } = useColorExtraction();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl, file.name);
      await extractFromImage(dataUrl);
      setIsLoading(false);
      navigate('/analysis');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setImage(url, url);
    await extractFromUrl(url);
    setIsLoading(false);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen pt-16 flex items-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Upload your design</h1>
          <p className="text-dark-400 max-w-md mx-auto mb-2">
            Upload a screenshot to analyze colors and generate dark mode.
          </p>
          <p className="text-dark-600 text-sm max-w-md mx-auto">
            🚧 Live website preview coming soon! (Currently shows sample colors)
          </p>
        </div>

        <UploadZone
          onFileUpload={handleFileUpload}
          onUrlSubmit={handleUrlSubmit}
          isLoading={isLoading}
        />

        <div className="mt-8 text-center">
          <p className="text-dark-600 text-sm">
            Your design is processed locally. Nothing is uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
