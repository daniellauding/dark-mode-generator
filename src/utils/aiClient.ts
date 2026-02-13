/**
 * AI Client - Shared OpenAI/Anthropic API client
 * Handles API calls with user's own API key
 */

interface AIClientConfig {
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  apiKey: string;
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIClient {
  private config: AIClientConfig | null = null;

  /**
   * Initialize client with user's API key
   */
  init(config: AIClientConfig): void {
    this.config = config;
  }

  /**
   * Check if client is configured
   */
  isConfigured(): boolean {
    return this.config !== null && this.config.apiKey.length > 0;
  }

  /**
   * Get current provider
   */
  getProvider(): string | null {
    return this.config?.provider ?? null;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<AIResponse> {
    if (!this.config) {
      return { success: false, error: 'AI client not configured' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are a professional color design expert specializing in dark mode interfaces. Always return valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error?.message ?? 'OpenAI API error',
        };
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      return {
        success: true,
        data: JSON.parse(content),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(prompt: string): Promise<AIResponse> {
    if (!this.config) {
      return { success: false, error: 'AI client not configured' };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          system:
            'You are a professional color design expert specializing in dark mode interfaces. Always return valid JSON.',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error?.message ?? 'Anthropic API error',
        };
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Try to extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      return {
        success: true,
        data: JSON.parse(jsonContent),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Call Google Gemini API
   */
  private async callGoogle(prompt: string): Promise<AIResponse> {
    if (!this.config) {
      return { success: false, error: 'AI client not configured' };
    }

    try {
      const model = this.config.model || 'gemini-1.5-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      'You are a professional color design expert specializing in dark mode interfaces. Always return valid JSON.\n\n' +
                      prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error?.message ?? 'Google AI API error',
        };
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      return {
        success: true,
        data: JSON.parse(content),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Call AI with prompt (routes to configured provider)
   */
  async call(prompt: string): Promise<AIResponse> {
    if (!this.config) {
      return { success: false, error: 'AI client not configured. Add your API key in Settings.' };
    }

    if (this.config.provider === 'openai') {
      return this.callOpenAI(prompt);
    } else if (this.config.provider === 'anthropic') {
      return this.callAnthropic(prompt);
    } else if (this.config.provider === 'google') {
      return this.callGoogle(prompt);
    }

    return { success: false, error: 'Unknown provider' };
  }

  /**
   * Test API key validity
   */
  async testConnection(): Promise<AIResponse> {
    const testPrompt =
      'Return a JSON object with a single field "status" set to "ok": {"status": "ok"}';
    return this.call(testPrompt);
  }
}

// Singleton instance
export const aiClient = new AIClient();

/**
 * Load AI config from localStorage
 */
export function loadAIConfig(): AIClientConfig | null {
  try {
    const stored = localStorage.getItem('darkmode_ai_config');
    if (!stored) return null;

    const config = JSON.parse(stored) as Partial<AIClientConfig>;
    
    // Provide default model if not set (backward compatibility)
    const defaultModels = {
      openai: 'gpt-4o',
      anthropic: 'claude-3-5-sonnet-20241022',
      google: 'gemini-1.5-flash-latest',
    };
    
    // Map old model names to new ones
    const modelMigration: Record<string, string> = {
      'gemini-pro': 'gemini-1.5-flash-latest',
      'gemini-1.5-flash': 'gemini-1.5-flash-latest',
      'gemini-1.5-pro': 'gemini-1.5-pro-latest',
    };
    
    let model = config.model || defaultModels[config.provider || 'openai'];
    
    // Migrate old model names
    if (model && modelMigration[model]) {
      model = modelMigration[model];
    }
    
    const fullConfig: AIClientConfig = {
      provider: config.provider || 'openai',
      model,
      apiKey: config.apiKey || '',
    };
    
    aiClient.init(fullConfig);
    return fullConfig;
  } catch {
    return null;
  }
}

/**
 * Save AI config to localStorage
 */
export function saveAIConfig(config: AIClientConfig): void {
  localStorage.setItem('darkmode_ai_config', JSON.stringify(config));
  aiClient.init(config);
}

/**
 * Clear AI config
 */
export function clearAIConfig(): void {
  localStorage.removeItem('darkmode_ai_config');
  aiClient.init({ provider: 'openai', model: 'gpt-4o', apiKey: '' });
}

/**
 * Track AI usage (simple counter for now)
 */
export function trackAIUsage(): void {
  const today = new Date().toISOString().split('T')[0];
  const key = `darkmode_ai_usage_${today}`;
  const current = parseInt(localStorage.getItem(key) ?? '0', 10);
  localStorage.setItem(key, (current + 1).toString());
}

/**
 * Get today's AI usage count
 */
export function getAIUsage(): number {
  const today = new Date().toISOString().split('T')[0];
  const key = `darkmode_ai_usage_${today}`;
  return parseInt(localStorage.getItem(key) ?? '0', 10);
}
