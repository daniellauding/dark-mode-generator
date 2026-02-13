import { Heart, MoreHorizontal, Send, Bell, Search, ChevronRight } from 'lucide-react';
import { APCAScore } from './APCAScore';

export interface ThemeColors {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  accent: string;
  border: string;
  navBar: string;
  tabBar: string;
  pill: string;
}

interface UIPreviewProps {
  colors: ThemeColors;
  mode: 'light' | 'dark';
}

export function UIPreview({ colors, mode }: UIPreviewProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/5" style={{ backgroundColor: colors.background }}>
      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: colors.navBar, borderColor: colors.border }}
      >
        <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          MyApp
        </span>
        <div className="flex items-center gap-3">
          <Search size={16} style={{ color: colors.textSecondary }} />
          <Bell size={16} style={{ color: colors.textSecondary }} />
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b"
        style={{ backgroundColor: colors.tabBar, borderColor: colors.border }}
      >
        {['Feed', 'Popular', 'Saved'].map((tab, i) => (
          <button
            key={tab}
            className="flex-1 py-2 text-xs font-medium text-center transition-colors border-b-2"
            style={{
              color: i === 0 ? colors.accent : colors.textSecondary,
              borderBottomColor: i === 0 ? colors.accent : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Card */}
        <div
          className="rounded-lg border p-3"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.accent }} />
              <div>
                <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>Jane Cooper</p>
                <p className="text-[10px]" style={{ color: colors.textDisabled }}>2 hours ago</p>
              </div>
            </div>
            <MoreHorizontal size={14} style={{ color: colors.textDisabled }} />
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: colors.textSecondary }}>
            Just shipped our new dark mode! Check out these contrast ratios.
          </p>

          {/* Pills/Chips */}
          <div className="flex gap-1.5 mb-3">
            {['Design', 'A11y'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: colors.pill, color: colors.accent }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Card actions */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                <Heart size={13} />
                <span className="text-[10px]">24</span>
              </button>
              <button className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                <Send size={13} />
                <span className="text-[10px]">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* List item */}
        <div
          className="flex items-center justify-between rounded-lg border p-3"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.accent + '22' }}>
              <div className="w-full h-full flex items-center justify-center">
                <Bell size={12} style={{ color: colors.accent }} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>Notifications</p>
              <p className="text-[10px]" style={{ color: colors.textDisabled }}>3 unread</p>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: colors.textDisabled }} />
        </div>

        {/* Buttons row */}
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 rounded-lg py-2 text-xs font-medium transition-colors"
            style={{ backgroundColor: colors.accent, color: '#ffffff' }}
          >
            Primary
          </button>
          <button
            className="flex-1 rounded-lg py-2 text-xs font-medium border transition-colors"
            style={{ borderColor: colors.border, color: colors.textPrimary, backgroundColor: 'transparent' }}
          >
            Secondary
          </button>
          <button
            className="flex-1 rounded-lg py-2 text-xs font-medium transition-colors"
            style={{ color: colors.accent, backgroundColor: 'transparent' }}
          >
            Ghost
          </button>
        </div>
      </div>

      {/* Contrast scores footer */}
      <div className="px-4 py-3 border-t space-y-1.5" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: colors.textDisabled }}>
          APCA Scores ({mode})
        </p>
        <APCAScore textColor={colors.textPrimary} bgColor={colors.background} label="Primary on bg" textSize="body" />
        <APCAScore textColor={colors.textSecondary} bgColor={colors.background} label="Secondary on bg" textSize="body" />
        <APCAScore textColor={colors.textPrimary} bgColor={colors.surface} label="Primary on surface" textSize="body" />
      </div>
    </div>
  );
}
