import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Proxy Route to bypass CORS
  app.use(express.json());
  app.post('/api/proxy', async (req, res) => {
    const targetUrl = req.body.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL field is required in request body' });
    }

    try {
      console.log(`Proxying request to: ${targetUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); 

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': new URL(targetUrl).origin,
        },
        redirect: 'follow',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Target URL returned status: ${response.status} ${response.statusText}`);
        
        let errorMessage = `Failed to fetch from target URL: ${response.statusText || 'Unknown Error'} (${response.status})`;
        if (response.status === 520 || response.status === 503) {
          errorMessage = "O servidor de origem (Wikia/Fandom) bloqueou a requisição automática. Isso é comum em sites com proteção anti-bot. Por favor, baixe a imagem e faça o upload manual.";
        } else if (response.status === 403) {
          errorMessage = "Acesso Negado (403). O site de origem não permite o acesso direto a este arquivo. Tente baixar o arquivo e fazer o upload.";
        }

        return res.status(response.status).json({ error: errorMessage });
      }

      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }

      // Stream the response back to the client
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`Successfully fetched ${buffer.length} bytes from ${targetUrl}`);
      res.send(buffer);
    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: `Proxy error: ${error.message}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false, // Explicitly disable HMR
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
