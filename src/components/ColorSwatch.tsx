import { getContrastColor, formatHex } from '../utils/colorConversion';
import { getContrastLevel } from '../utils/apca';
import { AlertTriangle, Check } from 'lucide-react';

interface ColorSwatchProps {
  hex: string;
  name: string;
  role: string;
  originalHex?: string;
  apcaValue?: number;
  showContrast?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ColorSwatch({
  hex,
  name,
  role,
  originalHex,
  apcaValue,
  showContrast = false,
  size = 'md',
}: ColorSwatchProps) {
  const textColor = getContrastColor(hex);
  const level = apcaValue !== undefined ? getContrastLevel(apcaValue) : null;

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-md',
    md: 'w-16 h-16 rounded-lg',
    lg: 'w-24 h-24 rounded-xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border border-white/10 transition-transform hover:scale-105`}
          style={{ backgroundColor: hex }}
        >
          {showContrast && level && (
            <div className="absolute -top-1 -right-1">
              {level === 'pass' ? (
                <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              ) : (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${level === 'fail' ? 'bg-danger' : 'bg-warning'}`}>
                  <AlertTriangle size={10} className="text-white" />
                </div>
              )}
            </div>
          )}
        </div>
        {originalHex && (
          <div
            className="absolute -bottom-1 -left-1 w-5 h-5 rounded border border-dark-600"
            style={{ backgroundColor: originalHex }}
            title={`Original: ${formatHex(originalHex)}`}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-dark-100 truncate">{name}</p>
        <p className="text-xs text-dark-400 font-mono">{formatHex(hex)}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] uppercase tracking-wider text-dark-500">{role}</span>
          {showContrast && apcaValue !== undefined && (
            <span className={`text-[10px] font-mono ${level === 'pass' ? 'text-success' : level === 'warning' ? 'text-warning' : 'text-danger'}`}>
              Lc {Math.abs(apcaValue).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
