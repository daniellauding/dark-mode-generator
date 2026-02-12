import { ArrowRight } from 'lucide-react';

interface Example {
  title: string;
  type: string;
  lightColors: { bg: string; surface: string; text: string; accent: string; border: string };
  darkColors: { bg: string; surface: string; text: string; accent: string; border: string };
}

const examples: Example[] = [
  {
    title: 'Analytics Dashboard',
    type: 'Dashboard',
    lightColors: { bg: '#ffffff', surface: '#f8fafc', text: '#1e293b', accent: '#3b82f6', border: '#e2e8f0' },
    darkColors: { bg: '#0b0f19', surface: '#111827', text: '#f1f5f9', accent: '#60a5fa', border: '#1f2937' },
  },
  {
    title: 'SaaS Landing Page',
    type: 'Landing Page',
    lightColors: { bg: '#fafafa', surface: '#ffffff', text: '#18181b', accent: '#8b5cf6', border: '#e4e4e7' },
    darkColors: { bg: '#09090b', surface: '#18181b', text: '#f4f4f5', accent: '#a78bfa', border: '#27272a' },
  },
  {
    title: 'Mobile Banking',
    type: 'Mobile App',
    lightColors: { bg: '#ffffff', surface: '#f0fdf4', text: '#14532d', accent: '#16a34a', border: '#dcfce7' },
    darkColors: { bg: '#0a0f0d', surface: '#0f1a14', text: '#dcfce7', accent: '#4ade80', border: '#1a2e23' },
  },
  {
    title: 'E-commerce Store',
    type: 'Web App',
    lightColors: { bg: '#fffbeb', surface: '#ffffff', text: '#451a03', accent: '#d97706', border: '#fde68a' },
    darkColors: { bg: '#0f0c07', surface: '#1a1508', text: '#fef3c7', accent: '#fbbf24', border: '#2d2410' },
  },
];

export function ExampleGallery() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary-400 uppercase tracking-wider mb-3">Examples</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          See the transformation
        </h2>
        <p className="text-dark-400 max-w-xl mx-auto">
          Hover over any card to reveal the dark mode conversion. Every palette is APCA-validated.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {examples.map(example => (
          <BeforeAfterCard key={example.title} example={example} />
        ))}
      </div>
    </section>
  );
}

function BeforeAfterCard({ example }: { example: Example }) {
  const { lightColors, darkColors } = example;

  return (
    <div className="before-after-card group relative rounded-2xl border border-dark-700/60 overflow-hidden cursor-pointer">
      {/* Light mode (before) */}
      <div className="p-5" style={{ backgroundColor: lightColors.bg }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md" style={{ backgroundColor: lightColors.accent }} />
            <div className="h-2 w-20 rounded-full" style={{ backgroundColor: lightColors.text, opacity: 0.8 }} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: lightColors.text, opacity: 0.4 }}>
            Light
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: lightColors.border }} />
          <div className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: lightColors.border }} />
          <div className="h-1.5 w-3/5 rounded-full" style={{ backgroundColor: lightColors.border }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="h-10 rounded-lg" style={{ backgroundColor: lightColors.surface, border: `1px solid ${lightColors.border}` }} />
          <div className="h-10 rounded-lg" style={{ backgroundColor: lightColors.surface, border: `1px solid ${lightColors.border}` }} />
          <div className="h-10 rounded-lg" style={{ backgroundColor: lightColors.accent, opacity: 0.15 }} />
        </div>

        <div className="h-7 rounded-md" style={{ backgroundColor: lightColors.accent }} />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: lightColors.text }}>{example.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: lightColors.surface, color: lightColors.text, opacity: 0.6, border: `1px solid ${lightColors.border}` }}>
            {example.type}
          </span>
        </div>
      </div>

      {/* Dark mode (after) — overlaid on hover */}
      <div className="after-overlay absolute inset-0 p-5" style={{ backgroundColor: darkColors.bg }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md" style={{ backgroundColor: darkColors.accent }} />
            <div className="h-2 w-20 rounded-full" style={{ backgroundColor: darkColors.text, opacity: 0.8 }} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: darkColors.text, opacity: 0.4 }}>
            Dark
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: darkColors.border }} />
          <div className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: darkColors.border }} />
          <div className="h-1.5 w-3/5 rounded-full" style={{ backgroundColor: darkColors.border }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="h-10 rounded-lg" style={{ backgroundColor: darkColors.surface, border: `1px solid ${darkColors.border}` }} />
          <div className="h-10 rounded-lg" style={{ backgroundColor: darkColors.surface, border: `1px solid ${darkColors.border}` }} />
          <div className="h-10 rounded-lg" style={{ backgroundColor: darkColors.accent, opacity: 0.15 }} />
        </div>

        <div className="h-7 rounded-md" style={{ backgroundColor: darkColors.accent }} />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: darkColors.text }}>{example.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: darkColors.surface, color: darkColors.text, opacity: 0.6, border: `1px solid ${darkColors.border}` }}>
            {example.type}
          </span>
        </div>

        {/* Reveal label */}
        <div className="reveal-label absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900/80 border border-dark-700 backdrop-blur-sm text-xs font-medium text-dark-200">
            <ArrowRight size={12} />
            Dark Mode
          </div>
        </div>
      </div>
    </div>
  );
}
