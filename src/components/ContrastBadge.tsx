import { AlertTriangle, Check, X } from 'lucide-react';
import { getContrastLevel } from '../utils/apca';

interface ContrastBadgeProps {
  apcaValue: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export function ContrastBadge({ apcaValue, showValue = true, size = 'md' }: ContrastBadgeProps) {
  const level = getContrastLevel(apcaValue);
  const abs = Math.abs(apcaValue);

  const config = {
    pass: {
      bg: 'bg-success/15',
      border: 'border-success/30',
      text: 'text-success',
      icon: <Check size={size === 'sm' ? 10 : 12} />,
      label: 'Pass',
    },
    warning: {
      bg: 'bg-warning/15',
      border: 'border-warning/30',
      text: 'text-warning',
      icon: <AlertTriangle size={size === 'sm' ? 10 : 12} />,
      label: 'Warning',
    },
    fail: {
      bg: 'bg-danger/15',
      border: 'border-danger/30',
      text: 'text-danger',
      icon: <X size={size === 'sm' ? 10 : 12} />,
      label: 'Fail',
    },
  };

  const c = config[level];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text} ${
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      } font-medium`}
    >
      {c.icon}
      {showValue && <span className="font-mono">Lc {abs.toFixed(1)}</span>}
    </span>
  );
}
