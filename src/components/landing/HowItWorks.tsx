import { Upload, Sliders, Download, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface Step {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  visual: ReactNode;
}

const steps: Step[] = [
  {
    number: '01',
    icon: <Upload size={20} />,
    title: 'Upload your design',
    description: 'Drag and drop a screenshot, paste a URL, or try our sample design. Colors are extracted instantly.',
    visual: <UploadVisual />,
  },
  {
    number: '02',
    icon: <Sliders size={20} />,
    title: 'Customize colors',
    description: 'Pick a preset or fine-tune darkness, lightness, and saturation. Live APCA validation on every change.',
    visual: <CustomizeVisual />,
  },
  {
    number: '03',
    icon: <Download size={20} />,
    title: 'Export & use',
    description: 'Download as CSS variables, JSON tokens, Tailwind config, or a palette image. Ready for production.',
    visual: <ExportVisual />,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800/30 via-dark-800/50 to-dark-800/30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary-400 uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three steps to dark mode
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            No design expertise required. Upload, tweak, export — it's that simple.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector arrow (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-24 -right-4 z-10 w-8 items-center justify-center text-dark-600">
                  <ArrowRight size={20} />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step visual */}
                <div className="w-full mb-6 rounded-xl border border-dark-700/60 bg-dark-800/60 overflow-hidden">
                  {step.visual}
                </div>

                {/* Step number + icon */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary-500/60 tracking-widest">{step.number}</span>
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-dark-100 mb-2">{step.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UploadVisual() {
  return (
    <div className="p-6 h-40 flex items-center justify-center">
      <div className="w-full max-w-[180px] rounded-lg border-2 border-dashed border-dark-600 bg-dark-900/50 p-4 flex flex-col items-center gap-2">
        <Upload size={24} className="text-dark-500" />
        <span className="text-xs text-dark-500">Drop image here</span>
        <div className="h-1.5 w-24 rounded-full bg-dark-700 overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-primary-500" />
        </div>
      </div>
    </div>
  );
}

function CustomizeVisual() {
  return (
    <div className="p-6 h-40 flex items-center justify-center">
      <div className="w-full max-w-[200px] space-y-3">
        <SliderMock label="Darkness" value={85} color="bg-primary-500" />
        <SliderMock label="Lightness" value={92} color="bg-accent-400" />
        <SliderMock label="Saturation" value={70} color="bg-success" />
      </div>
    </div>
  );
}

function SliderMock({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-dark-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-dark-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ExportVisual() {
  return (
    <div className="p-6 h-40 flex items-center justify-center">
      <div className="w-full max-w-[200px] space-y-2">
        <div className="rounded-md bg-dark-900/80 p-2.5 font-mono text-[10px] text-dark-300 leading-relaxed">
          <div className="text-dark-500">{'/* dark-palette.css */'}</div>
          <div><span className="text-accent-400">--bg</span>: <span className="text-primary-300">#0b0f19</span>;</div>
          <div><span className="text-accent-400">--text</span>: <span className="text-primary-300">#f3f4f6</span>;</div>
          <div><span className="text-accent-400">--accent</span>: <span className="text-primary-300">#60a5fa</span>;</div>
        </div>
        <div className="flex gap-1.5 justify-center">
          {['CSS', 'JSON', 'TW'].map(fmt => (
            <span key={fmt} className="px-2 py-0.5 rounded text-[9px] font-medium bg-dark-700 text-dark-400">
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
