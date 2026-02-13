import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorInput({ label, value, onChange }: ColorInputProps) {
  const [hex, setHex] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setHex(value);
  }, [value]);

  function handleHexInput(input: string) {
    let v = input.startsWith('#') ? input : `#${input}`;
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v);
    }
  }

  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-wider text-dark-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-7 h-7 rounded-md border border-white/10 shrink-0 cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={hex.toUpperCase()}
          onChange={(e) => handleHexInput(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded-md px-2 py-1 text-xs font-mono text-dark-200 focus:outline-none focus:border-primary-500 transition-colors"
          maxLength={7}
          spellCheck={false}
        />
      </div>
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="absolute z-50 mt-2 left-0 p-3 rounded-lg bg-dark-800 border border-dark-700 shadow-xl">
            <HexColorPicker
              color={value}
              onChange={onChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
