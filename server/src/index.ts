import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import screenshotRouter from './routes/screenshot';
import colorsRouter from './routes/colors';
import convertRouter from './routes/convert';
import validateRouter from './routes/validate';
import exportRouter from './routes/export';
import { openApiSpec } from './openapi';
import { closeBrowser } from './services/puppeteerService';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/screenshot', screenshotRouter);
app.use('/api/extract-colors', colorsRouter);
app.use('/api/convert-to-dark', convertRouter);
app.use('/api/validate-contrast', validateRouter);
app.use('/api/export-image', exportRouter);

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Start server
app.listen(PORT, () => {
  console.log(`Dark Mode Generator API running on http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await closeBrowser();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await closeBrowser();
  process.exit(0);
});

export default app;
