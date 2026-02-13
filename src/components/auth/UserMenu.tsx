import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Palette, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User as FirebaseUser } from 'firebase/auth';

interface UserMenuProps {
  user: FirebaseUser;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  const initial = user.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-semibold text-white">
          {initial}
        </div>
        <ChevronDown size={14} className={`text-dark-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-800 border border-dark-600 shadow-2xl py-1 animate-scale-in origin-top-right"
          role="menu"
        >
          <div className="px-3 py-2.5 border-b border-dark-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-dark-200 font-medium truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => { setOpen(false); navigate('/library'); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700 transition-colors cursor-pointer"
              role="menuitem"
            >
              <Palette size={15} />
              My Library
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/settings'); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700 transition-colors cursor-pointer"
              role="menuitem"
            >
              <Settings size={15} />
              Settings
            </button>
          </div>
          <div className="border-t border-dark-700 py-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700 transition-colors cursor-pointer"
              role="menuitem"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
