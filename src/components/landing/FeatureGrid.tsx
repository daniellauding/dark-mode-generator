import { Palette, Eye, Shield, Zap, Sparkles, Download } from 'lucide-react';
import type { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
  glowColor: string;
}

const features: Feature[] = [
  {
    icon: <Palette size={22} />,
    title: 'Smart Color Extraction',
    description: 'Automatically identifies background, text, accent, and border colors from any uploaded design.',
    accent: 'text-primary-400',
    glowColor: 'from-primary-500/10',
  },
  {
    icon: <Eye size={22} />,
    title: 'Live Preview',
    description: 'See your dark mode conversion in real-time with a synchronized side-by-side comparison view.',
    accent: 'text-accent-400',
    glowColor: 'from-accent-500/10',
  },
  {
    icon: <Shield size={22} />,
    title: 'APCA Contrast Check',
    description: 'Every color pair validated against WCAG 3.0 APCA standards. No guesswork — just accessibility.',
    accent: 'text-success',
    glowColor: 'from-success/10',
  },
  {
    icon: <Zap size={22} />,
    title: '3 Built-in Presets',
    description: 'Midnight, Dimmed, and AMOLED black — switch between curated dark mode styles in one click.',
    accent: 'text-warning',
    glowColor: 'from-warning/10',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Fine-tune Controls',
    description: 'Precision sliders for background darkness, text lightness, and accent saturation. Total control.',
    accent: 'text-primary-300',
    glowColor: 'from-primary-300/10',
  },
  {
    icon: <Download size={22} />,
    title: 'Export Anywhere',
    description: 'Download as CSS variables, JSON tokens, Tailwind config, or a shareable palette image.',
    accent: 'text-accent-400',
    glowColor: 'from-accent-400/10',
  },
];

export function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary-400 uppercase tracking-wider mb-3">Features</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Everything you need for{' '}
          <span className="gradient-text">perfect dark mode</span>
        </h2>
        <p className="text-dark-400 max-w-2xl mx-auto">
          From automatic color extraction to accessibility validation — a complete toolkit
          for creating production-ready dark color palettes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(feature => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative p-6 rounded-2xl bg-dark-800/40 border border-dark-700/60 hover:border-dark-600 transition-all duration-300 hover:-translate-y-0.5">
      {/* Subtle gradient glow on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        <div className={`w-11 h-11 rounded-xl bg-dark-700/60 flex items-center justify-center ${feature.accent} mb-5 group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </div>
        <h3 className="font-semibold text-dark-100 mb-2 text-[15px]">{feature.title}</h3>
        <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}
