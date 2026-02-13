import { useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider';
import { Moon, Sun } from 'lucide-react';

interface LivePreviewCompareProps {
  url: string;
  darkCSS: string;
}

export function LivePreviewCompare({ url, darkCSS }: LivePreviewCompareProps) {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-dark-600 bg-dark-900 relative">
      <ReactCompareSlider
        itemOne={
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Original website"
            sandbox="allow-scripts allow-same-origin"
          />
        }
        itemTwo={
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Dark mode website"
            sandbox="allow-scripts allow-same-origin"
          />
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(139, 92, 246, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            linesStyle={{
              backgroundColor: 'rgba(139, 92, 246, 0.5)',
              width: '2px',
            }}
          />
        }
      />
      
      {/* Labels outside iframe - pointer-events-none so they don't block dragging */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center gap-2 pointer-events-none shadow-lg">
        <Sun size={14} className="text-yellow-600" />
        <span className="text-xs font-medium text-gray-900">Original</span>
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-dark-600 flex items-center gap-2 pointer-events-none shadow-lg">
        <Moon size={14} className="text-primary-400" />
        <span className="text-xs font-medium text-dark-200">Dark Mode</span>
      </div>
    </div>
  );
}
