# AI-Powered Color Extraction (BYOK)

## Concept

**Users bring their own API key** to unlock AI-powered features:
- Gemini Pro Vision (Google)
- Claude 3 Vision (Anthropic)
- GPT-4 Vision (OpenAI)

**Why BYOK?**
- ✅ No API costs for us
- ✅ Users choose their preferred AI
- ✅ Privacy (keys stored in browser, never sent to our server)
- ✅ Better results than Canvas pixel analysis

---

## UX Flow

### Settings Page

```
/settings
┌─────────────────────────────────────────┐
│ AI Color Extraction (Optional)          │
├─────────────────────────────────────────┤
│                                          │
│ ☐ Enable AI-powered color analysis      │
│                                          │
│ Provider: [Gemini Pro Vision ▼]         │
│                                          │
│ API Key: [••••••••••••••••••] [Edit]    │
│                                          │
│ ℹ️  Your API key is stored locally      │
│    and never sent to our servers.       │
│                                          │
│ 💡 Get API keys:                         │
│    • Gemini: https://aistudio.google... │
│    • Claude: https://console.anthropic..│
│    • OpenAI: https://platform.openai...  │
│                                          │
│ [Save Settings]                          │
└─────────────────────────────────────────┘
```

### Upload Flow (with AI)

**Before:**
```
Upload → Canvas pixel analysis → 7 colors
```

**After (with API key):**
```
Upload → AI vision analysis → Semantic colors + roles + recommendations

Example AI response:
{
  "colors": [
    { hex: "#ffffff", role: "background", semantic: "page background" },
    { hex: "#d32f2f", role: "accent", semantic: "brand red, CTA buttons" },
    { hex: "#212121", role: "text", semantic: "headings and body text" },
    { hex: "#f5f5f5", role: "surface", semantic: "card backgrounds" }
  ],
  "recommendation": "Use midnight preset with high contrast for readability",
  "warnings": ["Red accent may need desaturation in dark mode"]
}
```

---

## Implementation

### 1. Settings Page

**Create `src/pages/Settings.tsx`:**

```tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export function Settings() {
  const { user } = useAuth();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'claude' | 'openai'>('gemini');
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // Store in localStorage (encrypted)
    localStorage.setItem('ai-provider', provider);
    localStorage.setItem('ai-api-key', btoa(apiKey)); // Basic encoding (use crypto.subtle in prod)
    
    // Show toast
    alert('API key saved!');
  };

  if (!user) {
    return <div>Please log in to access settings.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-dark-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">AI Color Extraction (Optional)</h2>
        
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={(e) => setAiEnabled(e.target.checked)}
            className="mr-2"
          />
          Enable AI-powered color analysis
        </label>

        {aiEnabled && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full bg-dark-700 rounded px-3 py-2"
              >
                <option value="gemini">Gemini Pro Vision (Google)</option>
                <option value="claude">Claude 3 Vision (Anthropic)</option>
                <option value="openai">GPT-4 Vision (OpenAI)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-dark-700 rounded px-3 py-2"
              />
            </div>

            <div className="text-sm text-dark-400 mb-4">
              ℹ️ Your API key is stored locally in your browser and never sent to our servers.
            </div>

            <div className="text-sm mb-4">
              <p className="font-semibold mb-2">Get API keys:</p>
              <ul className="list-disc list-inside space-y-1 text-dark-300">
                <li>Gemini: <a href="https://aistudio.google.com/apikey" target="_blank" className="text-blue-400">aistudio.google.com</a></li>
                <li>Claude: <a href="https://console.anthropic.com/settings/keys" target="_blank" className="text-blue-400">console.anthropic.com</a></li>
                <li>OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-400">platform.openai.com</a></li>
              </ul>
            </div>
          </>
        )}

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
```

### 2. AI Color Extraction Utility

**Create `src/utils/aiColorExtraction.ts`:**

```typescript
import type { DesignPalette } from '../types';

interface AIColorResponse {
  colors: Array<{
    hex: string;
    role: string;
    semantic: string;
  }>;
  recommendation?: string;
  warnings?: string[];
}

export async function extractWithAI(
  imageDataUrl: string,
  provider: 'gemini' | 'claude' | 'openai',
  apiKey: string
): Promise<DesignPalette> {
  
  const prompt = `Analyze this design image and extract the color palette with semantic meaning.

Return a JSON object with:
{
  "colors": [
    { "hex": "#ffffff", "role": "background", "semantic": "page background" },
    { "hex": "#d32f2f", "role": "accent", "semantic": "brand red, CTA buttons" }
  ],
  "recommendation": "Suggested dark mode approach",
  "warnings": ["Potential issues for dark mode"]
}

Identify 5-7 dominant colors and classify by role:
- background (lightest, most used)
- surface (cards, panels)
- text (darkest, readable)
- accent (brand colors, CTAs)
- border (subtle dividers)

Be specific about semantic meaning (e.g., "primary navigation background" not just "background").`;

  let response: AIColorResponse;

  switch (provider) {
    case 'gemini': {
      const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: imageDataUrl.split(',')[1] } }
            ]
          }]
        })
      });
      const data = await res.json();
      response = JSON.parse(data.candidates[0].content.parts[0].text);
      break;
    }

    case 'claude': {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageDataUrl.split(',')[1] } },
              { type: 'text', text: prompt }
            ]
          }]
        })
      });
      const data = await res.json();
      response = JSON.parse(data.content[0].text);
      break;
    }

    case 'openai': {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ]
          }],
          max_tokens: 500
        })
      });
      const data = await res.json();
      response = JSON.parse(data.choices[0].message.content);
      break;
    }
  }

  // Convert AI response to DesignPalette
  return {
    colors: response.colors.map((c, i) => ({
      hex: c.hex,
      name: c.semantic,
      area: 100 / response.colors.length,
      role: c.role as any,
    })),
    dominantColor: response.colors[0].hex,
    backgroundColor: response.colors.find(c => c.role === 'background')?.hex || '#ffffff',
    textColor: response.colors.find(c => c.role === 'text')?.hex || '#000000',
  };
}
```

### 3. Update useColorExtraction Hook

```typescript
const extractFromImage = useCallback(async (imageUrl: string): Promise<DesignPalette> => {
  const aiEnabled = localStorage.getItem('ai-enabled') === 'true';
  const provider = localStorage.getItem('ai-provider') as 'gemini' | 'claude' | 'openai';
  const apiKey = atob(localStorage.getItem('ai-api-key') || '');

  if (aiEnabled && apiKey) {
    try {
      return await extractWithAI(imageUrl, provider, apiKey);
    } catch (error) {
      console.warn('AI extraction failed, falling back to Canvas:', error);
    }
  }

  // Fallback to Canvas API
  return extractColorsFromImage(imageUrl);
}, []);
```

---

## Features

### Free Tier (No API Key)
- ✅ Canvas pixel analysis (current)
- ✅ 7 dominant colors
- ✅ Basic role classification

### AI-Powered (with API Key)
- ✨ Semantic color understanding ("brand red", "CTA button", etc.)
- ✨ Smarter role classification
- ✨ Dark mode recommendations
- ✨ Warnings (e.g., "red accent may need desaturation")
- ✨ Better website screenshot analysis

---

## Security

**API keys stored in localStorage:**
- Base64 encoded (basic obfuscation)
- Never sent to our servers
- Only used client-side for AI API calls

**Production improvement:**
- Use `crypto.subtle.encrypt()` with user's password
- Store encrypted key in IndexedDB
- Decrypt only when needed

---

## Pricing (User Pays)

**Gemini Pro Vision:**
- Free tier: 60 requests/minute
- Paid: $0.00025/image

**Claude 3 Sonnet:**
- $0.003/image

**GPT-4 Vision:**
- $0.01/image

**User controls cost** - they can disable AI anytime.

---

## MVP Scope

**Phase 1 (Tonight?):**
- ✅ Settings page (API key input)
- ✅ localStorage storage (basic encoding)
- ✅ Gemini Pro Vision integration (easiest, has free tier)
- ✅ Fallback to Canvas if no key

**Phase 2 (Tomorrow):**
- Claude 3 Vision
- GPT-4 Vision
- Encrypted storage (crypto.subtle)
- Toast notifications (AI results vs Canvas)

---

**Build this now?** 🚀

Takes ~1-2 hours (Settings page + Gemini integration).
