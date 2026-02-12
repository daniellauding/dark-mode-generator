import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Palette, Eye, Download, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { useDesignStore } from '../stores/designStore';

const features = [
  {
    icon: <Palette size={20} />,
    title: 'Smart Color Extraction',
    description: 'Automatically identifies background, text, accent, and border colors from your design.',
  },
  {
    icon: <Eye size={20} />,
    title: 'Live Preview',
    description: 'See your dark mode conversion in real-time with synchronized side-by-side view.',
  },
  {
    icon: <Shield size={20} />,
    title: 'APCA Contrast Check',
    description: 'Validates every color pair against WCAG 3.0 APCA standards for accessibility.',
  },
  {
    icon: <Zap size={20} />,
    title: '3 Built-in Presets',
    description: 'Midnight, Dimmed, and AMOLED black — one click to switch between styles.',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Fine-tune Controls',
    description: 'Adjust background darkness, text lightness, and accent saturation with precision sliders.',
  },
  {
    icon: <Download size={20} />,
    title: 'Export Anywhere',
    description: 'Download as CSS Variables, JSON tokens, Tailwind config, or a palette PNG.',
  },
];

const examplePairs = [
  { light: '#ffffff', dark: '#0b0f19', label: 'Background' },
  { light: '#f8fafc', dark: '#111827', label: 'Surface' },
  { light: '#1e293b', dark: '#f3f4f6', label: 'Text' },
  { light: '#3b82f6', dark: '#60a5fa', label: 'Primary' },
  { light: '#e2e8f0', dark: '#1f2937', label: 'Border' },
];

export function Landing() {
  const navigate = useNavigate();
  const loadSample = useDesignStore(s => s.loadSample);

  const handleTrySample = () => {
    loadSample();
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8">
            <Moon size={14} />
            Dark Mode in 30 seconds
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Transform any design to{' '}
            <span className="gradient-text">dark mode</span>
          </h1>

          <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your light mode design and get an APCA-validated dark color palette
            with real-time preview, customization controls, and one-click export.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/upload')} icon={<ArrowRight size={18} />}>
              Get Started
            </Button>
            <Button size="lg" variant="secondary" onClick={handleTrySample}>
              Try Sample Design
            </Button>
          </div>
        </div>
      </section>

      {/* Example Gallery */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">See the transformation</h2>
          <p className="text-dark-400">Light to dark, automatically mapped</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {examplePairs.map(pair => (
            <div key={pair.label} className="flex flex-col items-center gap-2">
              <div className="flex rounded-xl overflow-hidden border border-dark-700">
                <div className="w-16 h-20 sm:w-20 sm:h-24" style={{ backgroundColor: pair.light }} />
                <div className="w-16 h-20 sm:w-20 sm:h-24" style={{ backgroundColor: pair.dark }} />
              </div>
              <span className="text-xs text-dark-500">{pair.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="p-6 rounded-2xl bg-dark-800/50 border border-dark-700 hover:border-dark-600 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-dark-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-dark-500 text-sm">
            <Moon size={14} />
            Dark Mode Generator
          </div>
          <p className="text-dark-600 text-sm">APCA-validated contrast</p>
        </div>
      </footer>
    </div>
  );
}
