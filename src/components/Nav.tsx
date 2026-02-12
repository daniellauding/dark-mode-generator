import { Moon, RotateCcw, BookOpen } from 'lucide-react';
import { useDesignStore } from '../stores/designStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export function Nav() {
  const { step, reset } = useDesignStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    reset();
    navigate('/');
  };

  const steps = [
    { id: 'upload', label: 'Upload', path: '/upload' },
    { id: 'analysis', label: 'Analyze', path: '/analysis' },
    { id: 'preview', label: 'Preview', path: '/preview' },
  ];

  const isLanding = location.pathname === '/';

  return (
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
        </div>
      </div>
    </nav>
  );
}
