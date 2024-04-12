import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();
const port = process.env.PORT || 4000;
// Modifica esto en función de la opción `base` de tu archivo astro.config.mjs.
// Deben coincidir. El valor predeterminado es "/".
const base = '/'
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.julian-dev.dev',
      changeOrigin: true,
    }),
  );

app.listen(port);