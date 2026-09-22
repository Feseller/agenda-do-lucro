import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3031;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Carregar manipuladores de API Serverless locais
let apiAppointments, apiServices, apiClients, apiHealth;
try {
  apiAppointments = (await import('./api/appointments.js')).default;
  apiServices = (await import('./api/services.js')).default;
  apiClients = (await import('./api/clients.js')).default;
  apiHealth = (await import('./api/health.js')).default;
} catch (e) {
  console.warn('Aviso ao carregar módulos API locais:', e.message);
}

const apiHandlers = {
  '/api/appointments': apiAppointments,
  '/api/services': apiServices,
  '/api/clients': apiClients,
  '/api/health': apiHealth
};

const server = http.createServer(async (req, res) => {
  const [pathname, search] = req.url.split('?');

  // Roteamento de rotas de API (/api/*) simulando ambiente Vercel Serverless
  if (apiHandlers[pathname]) {
    const query = {};
    if (search) {
      const sp = new URLSearchParams(search);
      for (const [k, v] of sp.entries()) query[k] = v;
    }
    req.query = query;

    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        req.body = bodyStr ? JSON.parse(bodyStr) : {};
      } catch {
        req.body = {};
      }

      // Adiciona helpers compatíveis com Vercel Serverless (res.status e res.json)
      res.status = function(code) {
        this.statusCode = code;
        return this;
      };
      res.json = function(obj) {
        if (!this.getHeader('Content-Type')) {
          this.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        this.end(JSON.stringify(obj));
        return this;
      };

      try {
        await apiHandlers[pathname](req, res);
      } catch (err) {
        console.error(`Erro na rota ${pathname}:`, err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: err.message });
        }
      }
    });
    return;
  }

  // Roteamento de arquivos estáticos (Frontend)
  let reqUrl = pathname;
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - Agenda do Lucro');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Agenda do Lucro Server rodando em http://localhost:${PORT}`);
  console.log(`APIs ativas: /api/appointments, /api/services, /api/clients, /api/health`);
});
