import { describe, it, expect } from 'vitest';
import { calcAPCA } from '../../src/utils/apca';

describe('APCA Utilities', () => {
  it('calculates APCA Lc for common dark mode colors', () => {
    const bgColor = '#121212';
    const textColor = '#e4e4e4';
    
    const lc = calcAPCA(textColor, bgColor);
    
    // Should have decent contrast (> 0.5)
    expect(Math.abs(lc)).toBeGreaterThan(0.5);
    expect(Math.abs(lc)).toBeLessThan(2);
  });

  it('returns 0 for same colors', () => {
    const lc = calcAPCA('#ffffff', '#ffffff');
    expect(lc).toBe(0);
  });

  it('handles pure black and white', () => {
    const lc = calcAPCA('#ffffff', '#000000');
    // High contrast, but still < 2
    expect(Math.abs(lc)).toBeGreaterThan(0.8);
  });
});
