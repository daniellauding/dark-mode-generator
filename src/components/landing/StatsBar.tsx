import { Palette, Shield, Users, Zap } from 'lucide-react';

const stats = [
  { icon: <Palette size={18} />, value: '12,400+', label: 'Palettes generated' },
  { icon: <Shield size={18} />, value: '98.7%', label: 'APCA pass rate' },
  { icon: <Users size={18} />, value: '3,200+', label: 'Designers' },
  { icon: <Zap size={18} />, value: '<30s', label: 'Avg. conversion time' },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-dark-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dark-800/50 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <div className="text-primary-400 mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-dark-100">{stat.value}</div>
              <div className="text-sm text-dark-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
