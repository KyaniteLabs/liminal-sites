/**
 * PreviewServer - Express server for live p5.js sketch preview
 */

import express, { Express } from 'express';
import { Server } from 'http';

export class PreviewServer {
  private app: Express;
  private server: Server | null = null;
  private currentSketch: string = '';
  private readonly DEFAULT_PORT = 3456;

  constructor() {
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/', (_req, res) => {
      const html = this.generateHTML(this.currentSketch);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    });
  }

  private generateHTML(sketchCode: string): string {
    // Escape </script> to prevent breaking out of the script tag
    // but keep other code intact for execution
    const safeCode = (sketchCode || '').replace(/\u003c\/script\u003e/gi, '<\\/script>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atelier Preview</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #000; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <script>
    ${safeCode}
  </script>
</body>
</html>`;
  }

  async start(port: number = this.DEFAULT_PORT): Promise<boolean> {
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port number: ${port}`);
    }
    if (this.server) {
      throw new Error('Server is already running');
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port)
        .on('error', (error: any) => {
          this.server = null;
          if (error.code === 'EADDRINUSE') {
            reject(new Error(`Port ${port} is already in use`));
          } else {
            reject(error);
          }
        })
        .on('listening', () => {
          resolve(true);
        });
    });
  }

  async stop(): Promise<boolean> {
    if (!this.server) {
      return false;
    }
    return new Promise((resolve) => {
      this.server!.close(() => {
        this.server = null;
        resolve(true);
      });
    });
  }

  serveSketch(code: string | null): void {
    this.currentSketch = code || '';
  }
}
