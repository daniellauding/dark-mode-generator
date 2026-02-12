export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Dark Mode Generator API',
    version: '1.0.0',
    description: 'API for screenshot capture, color extraction, dark mode conversion, and APCA contrast validation.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Local development' }],
  paths: {
    '/api/screenshot': {
      post: {
        summary: 'Capture website screenshot',
        tags: ['Screenshot'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string', format: 'uri', example: 'https://example.com' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Screenshot captured successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    imageData: { type: 'string', description: 'Base64-encoded PNG' },
                    dimensions: {
                      type: 'object',
                      properties: {
                        width: { type: 'number' },
                        height: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid URL' },
          '500': { description: 'Screenshot capture failed' },
        },
      },
    },
    '/api/extract-colors': {
      post: {
        summary: 'Extract dominant colors from image',
        tags: ['Colors'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['imageData'],
                properties: {
                  imageData: { type: 'string', description: 'Base64-encoded image' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Colors extracted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    colors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          hex: { type: 'string', example: '#3b82f6' },
                          role: { type: 'string', enum: ['primary', 'secondary', 'accent', 'background', 'text', 'border'] },
                          usage: { type: 'number', example: 35 },
                          rgb: { type: 'object', properties: { r: { type: 'number' }, g: { type: 'number' }, b: { type: 'number' } } },
                          hsl: { type: 'object', properties: { h: { type: 'number' }, s: { type: 'number' }, l: { type: 'number' } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/convert-to-dark': {
      post: {
        summary: 'Convert light colors to dark mode',
        tags: ['Conversion'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['colors'],
                properties: {
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['hex', 'role', 'usage', 'rgb', 'hsl'],
                      properties: {
                        hex: { type: 'string' },
                        role: { type: 'string' },
                        usage: { type: 'number' },
                        rgb: { type: 'object' },
                        hsl: { type: 'object' },
                      },
                    },
                  },
                  preset: { type: 'string', enum: ['default', 'high-contrast', 'amoled'], default: 'default' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Colors converted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    darkColors: { type: 'array', items: { type: 'object' } },
                    issues: { type: 'array', items: { type: 'object' } },
                    preset: { type: 'string' },
                    metadata: {
                      type: 'object',
                      properties: {
                        totalColors: { type: 'number' },
                        issueCount: { type: 'number' },
                        autoFixedCount: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/validate-contrast': {
      post: {
        summary: 'Validate APCA contrast between two colors',
        tags: ['Validation'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fg', 'bg'],
                properties: {
                  fg: { type: 'string', example: '#e2e8f0', description: 'Foreground hex color' },
                  bg: { type: 'string', example: '#0b0f19', description: 'Background hex color' },
                  fontSize: { type: 'number', default: 16, description: 'Font size in px' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Contrast validated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    apcaScore: { type: 'number', example: 89.5 },
                    passes: { type: 'boolean', example: true },
                    threshold: { type: 'number', example: 60 },
                    level: { type: 'string', enum: ['body', 'large', 'small', 'non-text'] },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/validate-contrast/batch': {
      post: {
        summary: 'Batch validate APCA contrast for multiple color pairs',
        tags: ['Validation'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pairs'],
                properties: {
                  pairs: {
                    type: 'array',
                    maxItems: 100,
                    items: {
                      type: 'object',
                      required: ['fg', 'bg'],
                      properties: {
                        fg: { type: 'string' },
                        bg: { type: 'string' },
                        fontSize: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Batch results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/export-image': {
      post: {
        summary: 'Generate side-by-side comparison image',
        tags: ['Export'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['beforeImage', 'afterImage'],
                properties: {
                  beforeImage: { type: 'string', description: 'Base64 PNG of original' },
                  afterImage: { type: 'string', description: 'Base64 PNG of dark mode version' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Comparison image generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    pngData: { type: 'string' },
                    dimensions: {
                      type: 'object',
                      properties: {
                        width: { type: 'number' },
                        height: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
