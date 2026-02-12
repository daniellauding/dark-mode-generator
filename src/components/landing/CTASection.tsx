import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '../Button';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] bg-primary-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
          <Shield size={14} />
          APCA-validated accessibility
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to create your{' '}
          <span className="gradient-text">dark mode</span>?
        </h2>

        <p className="text-dark-400 mb-8 max-w-lg mx-auto">
          Join thousands of designers creating accessible, production-ready
          dark color palettes in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button size="lg" onClick={() => navigate('/upload')} icon={<ArrowRight size={18} />}>
            Get Started Free
          </Button>
        </div>

        <p className="text-sm text-dark-600">
          No credit card required. Free forever.
        </p>
      </div>
    </section>
  );
}
