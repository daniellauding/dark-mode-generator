import { Moon } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { StatsBar } from '../components/landing/StatsBar';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ExampleGallery } from '../components/landing/ExampleGallery';
import { Testimonials } from '../components/landing/Testimonials';
import { CTASection } from '../components/landing/CTASection';

export function Landing() {
  return (
    <div className="min-h-screen pt-16">
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <HowItWorks />
      <ExampleGallery />
      <Testimonials />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-dark-500 text-sm">
            <Moon size={14} />
            Dark Mode Generator
          </div>
          <div className="flex items-center gap-6 text-dark-600 text-sm">
            <span>APCA-validated contrast</span>
            <span className="hidden sm:inline">|</span>
            <span>Built for designers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
