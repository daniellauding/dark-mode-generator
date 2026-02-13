import { useState, useEffect } from 'react';
import {
  aiClient,
  loadAIConfig,
  saveAIConfig,
  clearAIConfig,
  getAIUsage,
} from '../../utils/aiClient';

export default function AISettings() {
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [usage, setUsage] = useState(0);

  // Load config on mount
  useEffect(() => {
    const config = loadAIConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
    }
    setUsage(getAIUsage());
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      clearAIConfig();
      setTestResult({ success: false, message: 'API key cleared' });
      return;
    }

    saveAIConfig({ provider, apiKey: apiKey.trim() });
    setTestResult({ success: true, message: 'Settings saved!' });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    // Temporarily init client with current settings
    aiClient.init({ provider, apiKey: apiKey.trim() });

    const result = await aiClient.testConnection();

    if (result.success) {
      setTestResult({ success: true, message: '✅ Connection successful!' });
    } else {
      setTestResult({ success: false, message: `❌ ${result.error}` });
    }

    setTesting(false);
  };

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.slice(0, 7) + '•'.repeat(Math.min(key.length - 7, 30));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🤖 AI Features
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI features are optional. Add your API key to unlock advanced analysis, color
            harmonies, and CSS extraction.
          </p>
        </div>
      </div>

      {/* Info callout */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Why use your own API key?</strong>
          <br />
          ✓ You control the cost (~$0.02 per request)
          <br />
          ✓ Your data never leaves your control
          <br />✓ No rate limits, use as much as you need
        </p>
      </div>

      {/* Provider selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Provider
        </label>
        <select
          value={provider}
          onChange={e => setProvider(e.target.value as 'openai' | 'anthropic' | 'google')}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="openai">OpenAI (GPT-4o)</option>
          <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
          <option value="google">Google AI (Gemini 2.0 Flash)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {provider === 'openai' && (
            <>
              Get your API key at{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </>
          )}
          {provider === 'anthropic' && (
            <>
              Get your API key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                console.anthropic.com
              </a>
            </>
          )}
          {provider === 'google' && (
            <>
              Get your API key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                aistudio.google.com/app/apikey
              </a>
            </>
          )}
        </p>
      </div>

      {/* API Key input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          API Key
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={provider === 'openai' ? 'sk-proj-...' : 'sk-ant-...'}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            onClick={handleTest}
            disabled={testing || !apiKey.trim()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? 'Testing...' : 'Test'}
          </button>
        </div>
        {testResult && (
          <p
            className={`mt-2 text-sm ${
              testResult.success
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {testResult.message}
          </p>
        )}
      </div>

      {/* Usage stats */}
      {apiKey && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usage Today
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{usage}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">requests</span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Estimated cost: ${(usage * 0.02).toFixed(2)}
          </p>
        </div>
      )}

      {/* Save button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Save Settings
        </button>
        {apiKey && (
          <button
            onClick={() => {
              setApiKey('');
              clearAIConfig();
              setTestResult({ success: true, message: 'API key cleared' });
              setTimeout(() => setTestResult(null), 3000);
            }}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Features list */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          AI Features Available
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Color Harmonies:</strong> Generate complementary, triadic, and analogous
              color schemes
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>AI Enhance:</strong> Analyze palettes and suggest contrast improvements
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>URL Extract:</strong> Import dark mode CSS and design tokens from any website
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Brand Colors:</strong> Generate professional palettes from brand descriptions
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
