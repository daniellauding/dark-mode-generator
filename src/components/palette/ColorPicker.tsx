import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X, Check } from 'lucide-react';
import { Button } from '../Button';

interface ColorPickerProps {
  color: string;
  name: string;
  onClose: () => void;
  onSave: (newColor: string) => void;
}

export function ColorPicker({ color, name, onClose, onSave }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color);

  const handleSave = () => {
    onSave(selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-dark-800 rounded-2xl border border-dark-600 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit Color</h3>
            <p className="text-sm text-dark-400">{name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Color Picker */}
        <div className="p-6 space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl border-2 border-dark-600"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1">
              <input
                type="text"
                value={selectedColor.toUpperCase()}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-dark-200 font-mono text-sm focus:outline-none focus:border-primary-500"
                placeholder="#RRGGBB"
              />
            </div>
          </div>

          {/* Picker */}
          <HexColorPicker color={selectedColor} onChange={setSelectedColor} />

          {/* Preset colors */}
          <div>
            <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Quick colors</p>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#000000',
                '#121212',
                '#1a1a1a',
                '#2a2a2a',
                '#e4e4e4',
                '#f5f5f5',
                '#8b5cf6',
                '#06b6d4',
              ].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-lg border-2 border-dark-600 hover:border-primary-500 transition-colors"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-dark-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} icon={<Check size={16} />}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
