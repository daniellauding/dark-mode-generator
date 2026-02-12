import { Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
  {
    quote: 'This saved me hours of manual color picking. The APCA validation alone is worth it — I finally trust my dark mode contrast ratios.',
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    company: 'Vercel',
    initials: 'SC',
    accentColor: 'bg-primary-500',
  },
  {
    quote: 'The presets are a great starting point, but the fine-tune sliders are what make this tool special. Exported directly to our Tailwind config.',
    name: 'Marcus Rivera',
    role: 'Design Engineer',
    company: 'Linear',
    initials: 'MR',
    accentColor: 'bg-accent-500',
  },
  {
    quote: 'We used this to generate dark palettes for 12 product screens in one afternoon. The side-by-side preview made stakeholder review effortless.',
    name: 'Aisha Patel',
    role: 'Lead UI Designer',
    company: 'Notion',
    initials: 'AP',
    accentColor: 'bg-success',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-800/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary-400 uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by designers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="p-6 rounded-2xl bg-dark-800/40 border border-dark-700/60">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-warning fill-warning" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-dark-300 leading-relaxed mb-6">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.accentColor} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-dark-100">{t.name}</div>
                  <div className="text-xs text-dark-500">{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
