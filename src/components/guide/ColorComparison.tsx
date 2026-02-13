import { useState } from 'react';
import { Sun, Moon, RotateCcw } from 'lucide-react';
import { ColorInput } from './ColorInput';
import { UIPreview, type ThemeColors } from './UIPreview';

const defaultLight: ThemeColors = {
  background: '#ffffff',
  surface: '#f8fafc',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textDisabled: '#94a3b8',
  accent: '#3b82f6',
  border: '#e2e8f0',
  navBar: '#ffffff',
  tabBar: '#ffffff',
  pill: '#eff6ff',
};

const defaultDark: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  textPrimary: '#e4e4e4',
  textSecondary: '#a3a3a3',
  textDisabled: '#6b6b6b',
  accent: '#60a5fa',
  border: '#2a2a2a',
  navBar: '#1a1a1a',
  tabBar: '#1a1a1a',
  pill: '#1e3a5f',
};

type ColorKey = keyof ThemeColors;

const colorGroups: { title: string; keys: { key: ColorKey; label: string }[] }[] = [
  {
    title: 'Backgrounds',
    keys: [
      { key: 'background', label: 'Background' },
      { key: 'surface', label: 'Surface' },
      { key: 'navBar', label: 'Nav bar' },
      { key: 'tabBar', label: 'Tab bar' },
    ],
  },
  {
    title: 'Text',
    keys: [
      { key: 'textPrimary', label: 'Primary' },
      { key: 'textSecondary', label: 'Secondary' },
      { key: 'textDisabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Accents & Borders',
    keys: [
      { key: 'accent', label: 'Accent' },
      { key: 'border', label: 'Border' },
      { key: 'pill', label: 'Pill / Chip' },
    ],
  },
];

export function ColorComparison() {
  const [lightColors, setLightColors] = useState<ThemeColors>({ ...defaultLight });
  const [darkColors, setDarkColors] = useState<ThemeColors>({ ...defaultDark });
  const [editingSide, setEditingSide] = useState<'light' | 'dark'>('dark');

  const activeColors = editingSide === 'light' ? lightColors : darkColors;
  const setActiveColors = editingSide === 'light' ? setLightColors : setDarkColors;

  function updateColor(key: ColorKey, hex: string) {
    setActiveColors((prev) => ({ ...prev, [key]: hex }));
  }

  function resetColors() {
    setLightColors({ ...defaultLight });
    setDarkColors({ ...defaultDark });
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark-100">Interactive Examples</h2>
          <p className="text-sm text-dark-400 mt-1">
            Adjust colors and see live APCA contrast scores
          </p>
        </div>
        <button
          onClick={resetColors}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:text-dark-200 border border-dark-700 hover:border-dark-600 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Side toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-800 border border-dark-700 w-fit mb-6">
        <button
          onClick={() => setEditingSide('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            editingSide === 'light'
              ? 'bg-dark-700 text-dark-100'
              : 'text-dark-400 hover:text-dark-300'
          }`}
        >
          <Sun size={13} />
          Edit Light
        </button>
        <button
          onClick={() => setEditingSide('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            editingSide === 'dark'
              ? 'bg-dark-700 text-dark-100'
              : 'text-dark-400 hover:text-dark-300'
          }`}
        >
          <Moon size={13} />
          Edit Dark
        </button>
      </div>

      {/* Color inputs */}
      <div className="sticky top-16 z-30 rounded-xl bg-dark-900/95 backdrop-blur-sm border border-dark-700 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {colorGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] uppercase tracking-wider text-dark-500 font-semibold mb-2">
                {group.title}
              </p>
              <div className="space-y-2">
                {group.keys.map(({ key, label }) => (
                  <ColorInput
                    key={key}
                    label={label}
                    value={activeColors[key]}
                    onChange={(hex) => updateColor(key, hex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun size={14} className="text-dark-400" />
            <span className="text-xs font-medium text-dark-300">Light Mode</span>
          </div>
          <UIPreview colors={lightColors} mode="light" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Moon size={14} className="text-dark-400" />
            <span className="text-xs font-medium text-dark-300">Dark Mode</span>
          </div>
          <UIPreview colors={darkColors} mode="dark" />
        </div>
      </div>
    </section>
  );
}
