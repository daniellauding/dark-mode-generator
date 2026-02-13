import { Check, AlertTriangle, X } from 'lucide-react';
import { calcAPCA, getContrastLevel } from '../../utils/apca';

interface APCAScoreProps {
  textColor: string;
  bgColor: string;
  label?: string;
  textSize?: 'body' | 'large' | 'small';
}

const thresholds = {
  large: { min: 45, label: 'Large text (24px+)' },
  body: { min: 60, label: 'Body text (16px)' },
  small: { min: 75, label: 'Small text (<14px)' },
};

export function APCAScore({ textColor, bgColor, label, textSize = 'body' }: APCAScoreProps) {
  let score: number;
  try {
    score = calcAPCA(textColor, bgColor);
  } catch {
    return (
      <div className="flex items-center gap-2 text-xs text-dark-500">
        <span>Invalid color</span>
      </div>
    );
  }

  const absScore = Math.abs(score);
  const level = getContrastLevel(score);
  const { min } = thresholds[textSize];
  const passes = absScore >= min;

  const badgeColors = {
    pass: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    fail: 'bg-danger/15 text-danger border-danger/30',
  };

  const Icon = level === 'pass' ? Check : level === 'warning' ? AlertTriangle : X;

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-mono ${badgeColors[level]}`}>
        <Icon size={11} />
        <span>Lc {absScore.toFixed(1)}</span>
      </div>
      {label && <span className="text-[10px] text-dark-500">{label}</span>}
      {!passes && (
        <span className="text-[10px] text-danger">
          Need {min}+ for {thresholds[textSize].label.toLowerCase()}
        </span>
      )}
    </div>
  );
}
