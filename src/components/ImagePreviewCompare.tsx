import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider';
import { Moon, Sun } from 'lucide-react';
import type { DarkPalette } from '../types';

interface ImagePreviewCompareProps {
  imageUrl: string;
  darkPalette: DarkPalette;
}

export function ImagePreviewCompare({ imageUrl, darkPalette }: ImagePreviewCompareProps) {
  // Create CSS filter approximation from dark palette
  const bgColor = darkPalette.backgroundColor;
  
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-dark-600 bg-dark-900 relative">
      <ReactCompareSlider
        itemOne={
          <div className="w-full h-full relative bg-white">
            <img
              src={imageUrl}
              alt="Original design"
              className="w-full h-full object-contain"
            />
          </div>
        }
        itemTwo={
          <div className="w-full h-full relative" style={{ backgroundColor: bgColor }}>
            <img
              src={imageUrl}
              alt="Dark mode simulation"
              className="w-full h-full object-contain"
              style={{
                filter: 'invert(0.95) hue-rotate(180deg) brightness(1.1) saturate(0.8)',
                mixBlendMode: 'normal',
              }}
            />
          </div>
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
      
      {/* Labels outside - pointer-events-none so they don't block dragging */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center gap-2 pointer-events-none shadow-lg">
        <Sun size={14} className="text-yellow-600" />
        <span className="text-xs font-medium text-gray-900">Original</span>
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-dark-600 flex items-center gap-2 pointer-events-none shadow-lg">
        <Moon size={14} className="text-primary-400" />
        <span className="text-xs font-medium text-dark-200">Dark Mode</span>
      </div>
      
      {/* Info banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-dark-600 pointer-events-none">
        <p className="text-xs text-dark-300">
          ⚡ Live simulation - drag slider to compare
        </p>
      </div>
    </div>
  );
}
