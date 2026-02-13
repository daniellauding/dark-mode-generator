import { useState, useEffect, useRef, type FormEvent } from 'react';
import { X, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../Button';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string) => Promise<boolean>;
  onSuccess: (mode: AuthMode) => void;
  error: string | null;
  actionLoading: boolean;
  clearError: () => void;
}

export function AuthModal({ mode: initialMode, onClose, onLogin, onSignup, onSuccess, error, actionLoading, clearError }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [mode, clearError]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
    }

    const fn = mode === 'login' ? onLogin : onSignup;
    const success = await fn(email, password);
    if (success) {
      onSuccess(mode);
      handleClose();
    }
  };

  const displayError = localError ?? error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Log in' : 'Create account'}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full sm:max-w-md sm:rounded-2xl rounded-none bg-dark-800 border border-dark-600 shadow-2xl transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        } max-sm:fixed max-sm:inset-0 max-sm:border-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="text-lg font-semibold text-dark-100">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-dark-400 mt-0.5">
              {mode === 'login' ? 'Log in to access your library' : 'Sign up to save your palettes'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {displayError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger" role="alert">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-dark-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                ref={emailRef}
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 text-sm placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={actionLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-dark-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 text-sm placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={actionLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-confirm" className="block text-sm font-medium text-dark-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="auth-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 text-sm placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={actionLoading}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={actionLoading}
            icon={actionLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
          >
            {actionLoading
              ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
              : (mode === 'login' ? 'Log in' : 'Create account')
            }
          </Button>
        </form>

        {/* Footer toggle */}
        <div className="px-6 pb-6 text-center">
          <span className="text-sm text-dark-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={toggleMode}
            className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors cursor-pointer"
            disabled={actionLoading}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
