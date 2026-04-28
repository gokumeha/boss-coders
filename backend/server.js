import cors from 'cors';
import express from 'express';

import legalRoutes from './routes/legal.routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api', legalRoutes);

app.use((request, response) => {
  response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
});

app.use((error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (isDev) {
    console.error('[api:error]', error);
  }

  response.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`[server] NyayaSaathi API listening on http://localhost:${PORT}`);
});

