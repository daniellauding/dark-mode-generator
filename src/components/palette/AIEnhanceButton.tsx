import { Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { aiClient } from '../../utils/aiClient';

interface AIEnhanceButtonProps {
  onClick: () => void;
  disabled?: boolean;
  hasIssues: boolean;
}

export function AIEnhanceButton({ onClick, disabled, hasIssues }: AIEnhanceButtonProps) {
  const isConfigured = aiClient.isConfigured();

  if (!isConfigured) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => window.location.href = '/settings'}
        icon={<Sparkles size={14} />}
      >
        Enable AI (Settings)
      </Button>
    );
  }

  return (
    <Button
      variant={hasIssues ? 'primary' : 'secondary'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      icon={<Sparkles size={14} />}
    >
      {hasIssues ? 'Fix with AI' : 'AI Enhance'}
    </Button>
  );
}
