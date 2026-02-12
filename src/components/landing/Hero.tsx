import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Check, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { useDesignStore } from '../../stores/designStore';

export function Hero() {
  const navigate = useNavigate();
  const loadSample = useDesignStore(s => s.loadSample);

  const handleTrySample = () => {
    loadSample();
    navigate('/analysis');
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-accent-500/6 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8 animate-fade-up">
              <Sparkles size={14} />
              APCA-validated dark mode
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight mb-6 leading-[1.1] animate-fade-up-delay-1">
              Transform any design to{' '}
              <span className="gradient-text">dark mode</span>{' '}
              in 30 seconds
            </h1>

            <p className="text-lg text-dark-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-up-delay-2">
              Upload your light mode design. Get an accessibility-perfect dark palette
              with APCA contrast validation, real-time preview, and one-click export.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10 animate-fade-up-delay-3">
              <Button size="lg" onClick={() => navigate('/upload')} icon={<ArrowRight size={18} />}>
                Get Started Free
              </Button>
              <Button size="lg" variant="secondary" onClick={handleTrySample}>
                Try Sample Design
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-dark-400 animate-fade-up-delay-3">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-success" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-success" />
                WCAG 3.0 compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-success" />
                Export anywhere
              </span>
            </div>
          </div>

          {/* Right: Visual mockup */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="animate-float">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-transparent rounded-3xl blur-2xl" />

      {/* Main card - light mode to dark mode transformation */}
      <div className="relative rounded-2xl border border-dark-700/80 overflow-hidden bg-dark-800/90 backdrop-blur-sm shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-dark-900/80 border-b border-dark-700/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-dark-800 text-dark-500 text-xs">
              darkmode.design
            </div>
          </div>
        </div>

        {/* Split view: Light → Dark */}
        <div className="grid grid-cols-2">
          {/* Light side */}
          <div className="p-5 bg-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-blue-500" />
                <div className="h-2.5 w-16 rounded-full bg-gray-800" />
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200" />
              <div className="h-2 w-3/4 rounded-full bg-gray-200" />
              <div className="h-2 w-5/6 rounded-full bg-gray-200" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-14 rounded-lg bg-gray-100 border border-gray-200" />
                <div className="h-14 rounded-lg bg-gray-100 border border-gray-200" />
              </div>
              <div className="h-8 rounded-md bg-blue-500" />
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Light</span>
            </div>
          </div>

          {/* Dark side */}
          <div className="p-5 bg-dark-900">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-primary-400" />
                <div className="h-2.5 w-16 rounded-full bg-dark-100" />
              </div>
              <div className="h-2 w-full rounded-full bg-dark-700" />
              <div className="h-2 w-3/4 rounded-full bg-dark-700" />
              <div className="h-2 w-5/6 rounded-full bg-dark-700" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-14 rounded-lg bg-dark-800 border border-dark-700" />
                <div className="h-14 rounded-lg bg-dark-800 border border-dark-700" />
              </div>
              <div className="h-8 rounded-md bg-primary-500" />
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] font-medium text-dark-500 uppercase tracking-wider">Dark</span>
            </div>
          </div>
        </div>

        {/* APCA badge overlay */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 border border-success/30 text-success text-xs font-medium backdrop-blur-sm">
          <Check size={12} />
          APCA Lc 78.2 — Pass
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 shadow-lg text-xs">
        <span className="text-dark-400">Contrast:</span>{' '}
        <span className="text-success font-semibold">AAA</span>
      </div>

      <div className="absolute -bottom-2 -left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 shadow-lg text-xs">
        <Moon size={12} className="text-accent-400" />
        <span className="text-dark-300">3 presets</span>
      </div>
    </div>
  );
}
