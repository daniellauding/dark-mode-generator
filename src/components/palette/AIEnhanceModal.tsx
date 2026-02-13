import { useState, useEffect } from 'react';
import { X, Loader2, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../Button';
import { ColorSwatch } from '../ColorSwatch';
import { enhancePalette, applyEnhancement, type EnhanceResult } from '../../utils/aiEnhance';
import type { DarkPalette } from '../../types';

interface AIEnhanceModalProps {
  darkPalette: DarkPalette;
  issues: string[];
  onApply: (enhanced: DarkPalette) => void;
  onClose: () => void;
}

export function AIEnhanceModal({ darkPalette, issues, onApply, onClose }: AIEnhanceModalProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    loadEnhancement();
  }, []);

  const loadEnhancement = async () => {
    setLoading(true);
    setError(null);
    const { result, error } = await enhancePalette(darkPalette, issues);
    if (error) {
      setError(error);
    } else {
      setResult(result);
    }
    setLoading(false);
  };

  const handleApply = () => {
    if (!result) return;
    const enhanced = applyEnhancement(darkPalette, result);
    onApply(enhanced);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-dark-800 rounded-2xl border border-dark-600 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Enhancement</h2>
              <p className="text-sm text-dark-400">Fixing {issues.length} contrast issues</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
              <p className="text-dark-300">Analyzing palette with AI...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <p className="text-sm text-primary-300">{result.summary}</p>
              </div>

              {/* Color Fixes */}
              <div>
                <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">
                  Color Fixes ({result.fixed.colors.length})
                </h3>
                <div className="space-y-3">
                  {result.fixed.colors.map((fix, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg bg-dark-900/50 border border-dark-700"
                    >
                      {/* Original */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg border border-dark-600"
                          style={{ backgroundColor: fix.original }}
                        />
                        <span className="text-xs text-dark-500 font-mono">{fix.original}</span>
                      </div>

                      <ArrowRight size={16} className="text-dark-600" />

                      {/* Fixed */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg border border-dark-600"
                          style={{ backgroundColor: fix.fixed }}
                        />
                        <span className="text-xs text-dark-300 font-mono">{fix.fixed}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 ml-4">
                        <p className="text-sm text-dark-200 font-medium">{fix.name}</p>
                        <p className="text-xs text-dark-500 mt-1">{fix.reasoning}</p>
                        <div className="flex gap-3 mt-1 text-xs">
                          <span className="text-green-400">WCAG: {fix.contrast.wcag.toFixed(1)}:1</span>
                          <span className="text-blue-400">APCA: Lc {fix.contrast.apca.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                        <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chat Toggle */}
              <div className="pt-4 border-t border-dark-700">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-200 transition-colors"
                >
                  <MessageCircle size={14} />
                  {showChat ? 'Hide chat' : 'Ask AI for more help'}
                </button>

                {showChat && (
                  <div className="mt-4 p-4 rounded-lg bg-dark-900/50 border border-dark-700">
                    <p className="text-xs text-dark-500 mb-3">
                      Ask questions about the changes or request specific adjustments
                    </p>
                    <textarea
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      placeholder="e.g., Can you make the accent color more vibrant?"
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 text-sm placeholder:text-dark-600 focus:outline-none focus:border-primary-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" disabled>
                        Send (coming soon)
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div className="flex items-center justify-between p-6 border-t border-dark-700">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={loadEnhancement}>
                Regenerate
              </Button>
              <Button onClick={handleApply}>
                Apply Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
