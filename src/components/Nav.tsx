import { useState, useEffect } from 'react';
import { Moon, RotateCcw, BookOpen, LogIn, FolderOpen } from 'lucide-react';
import { useDesignStore } from '../stores/designStore';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './auth/UserMenu';
import { Toast } from './Toast';

export function Nav() {
  const { step, reset } = useDesignStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error, actionLoading, login, signup, logout, clearError } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [welcomeToast, setWelcomeToast] = useState(false);

  // Handle ?signup=1 query param (from "Sign up to save" toast)
  useEffect(() => {
    if (searchParams.get('signup') === '1' && !user) {
      setAuthModal('signup');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, user, setSearchParams]);

  const handleReset = () => {
    reset();
    navigate('/');
  };

  const handleAuthSuccess = (mode: 'login' | 'signup') => {
    setAuthModal(null);
    if (mode === 'signup') {
      setWelcomeToast(true);
    }
    navigate('/library');
  };

  const steps = [
    { id: 'upload', label: 'Upload', path: '/upload' },
    { id: 'analysis', label: 'Analyze', path: '/analysis' },
    { id: 'preview', label: 'Preview', path: '/preview' },
  ];

  const isLanding = location.pathname === '/';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-dark-100 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Moon size={16} className="text-white" />
              </div>
              <span className="font-semibold text-sm hidden sm:inline">Dark Mode Generator</span>
            </button>

            {!isLanding && (
              <div className="flex items-center gap-1">
                {steps.map((s, i) => {
                  const isActive = location.pathname === s.path;
                  const stepIndex = steps.findIndex(st => st.path === location.pathname);
                  const isPast = i < stepIndex;

                  return (
                    <div key={s.id} className="flex items-center">
                      {i > 0 && (
                        <div className={`w-8 h-px mx-1 ${isPast ? 'bg-primary-500' : 'bg-dark-600'}`} />
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                            : isPast
                              ? 'text-primary-400'
                              : 'text-dark-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isLanding && (
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
                  title="Start over"
                >
                  <RotateCcw size={18} />
                </button>
              )}

              {isLanding && (
                <Link
                  to="/guide"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-dark-400 hover:text-dark-200 hover:bg-dark-700 transition-colors"
                >
                  <BookOpen size={15} />
                  <span className="hidden sm:inline">Guide</span>
                </Link>
              )}

              {user && (
                <Link
                  to="/projects"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    location.pathname.startsWith('/projects')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
                  }`}
                >
                  <FolderOpen size={15} />
                  <span className="hidden sm:inline">Projects</span>
                </Link>
              )}

              {!loading && (
                user ? (
                  <UserMenu user={user} onLogout={logout} />
                ) : (
                  <button
                    onClick={() => setAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-300 hover:text-dark-100 hover:bg-dark-700 transition-colors cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span className="hidden sm:inline">Log in</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onLogin={login}
          onSignup={signup}
          onSuccess={handleAuthSuccess}
          error={error}
          actionLoading={actionLoading}
          clearError={clearError}
        />
      )}

      {welcomeToast && (
        <Toast
          message="Welcome! Your account is ready."
          onDismiss={() => setWelcomeToast(false)}
          duration={4000}
        />
      )}
    </>
  );
}
