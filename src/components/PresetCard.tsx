import { Check } from 'lucide-react';
import type { Preset } from '../types';

interface PresetCardProps {
  preset: Preset;
  isActive: boolean;
  onClick: () => void;
}

export function PresetCard({ preset, isActive, onClick }: PresetCardProps) {
  const bgShade = `hsl(220, 20%, ${Math.max(3, 15 * (1 - preset.bgDarkness / 100)) * 100}%)`;

  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border transition-all text-left cursor-pointer w-full ${
        isActive
          ? 'border-primary-500/50 bg-primary-500/5 glow-primary'
          : 'border-dark-600 bg-dark-800 hover:border-dark-500'
      }`}
    >
      {isActive && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg border border-dark-600 overflow-hidden flex">
          <div className="w-1/2 h-full" style={{ backgroundColor: bgShade }} />
          <div className="w-1/2 h-full bg-dark-100" />
        </div>
        <span className="font-medium text-sm text-dark-100">{preset.name}</span>
      </div>
      <p className="text-xs text-dark-400">{preset.description}</p>
    </button>
  );
}
