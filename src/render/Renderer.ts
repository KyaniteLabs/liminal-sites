/**
 * Renderer - Screenshot capture for p5.js sketches
 *
 * Provides functionality to render p5.js sketches using a headless browser
 * and capture screenshots of the canvas output.
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export class Renderer {
  private browser: Browser | null = null;
  private readonly RENDER_TIMEOUT = 30000; // 30 seconds (increased from 10s for CDN reliability)
  private readonly DEFAULT_WIDTH = 800;
  private readonly DEFAULT_HEIGHT = 600;

  /**
   * Render a p5.js sketch and capture screenshot
   * @param code - p5.js sketch code
   * @param outputPath - Path where screenshot will be saved
   * @throws Error if rendering fails or output path is invalid
   */
  async render(code: string, outputPath: string): Promise<void> {
    // Validate inputs
    if (!code || typeof code !== 'string') {
      throw new Error('Sketch code is required and must be a non-empty string');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('Output path is required and must be a string');
    }

    // Validate output directory exists
    const outputDir = path.dirname(outputPath);
    try {
      await fs.access(outputDir);
    } catch {
      throw new Error(`Output directory does not exist: ${outputDir}`);
    }

    // Validate file extension
    const ext = path.extname(outputPath).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      throw new Error(`Unsupported file format: ${ext}. Only .png, .jpg, .jpeg are supported.`);
    }

    let browser = null;
    let page = null;

    try {
      // Launch headless browser
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      page = await browser.newPage();

      // Set viewport size
      await page.setViewport({
        width: this.DEFAULT_WIDTH,
        height: this.DEFAULT_HEIGHT
      });

      // Generate HTML with p5.js sketch
      const html = this.generateHTML(code);

      // Load the sketch - use 'load' instead of 'networkidle0' for CDN resilience
      // 'load' waits for DOM + resources, but not all network activity to cease
      await page.setContent(html, {
        waitUntil: 'load',
        timeout: this.RENDER_TIMEOUT
      });

      // Wait for p5.js to initialize
      await this.waitForP5Initialization(page);

      // Wait a bit for the sketch to render
      await this.delay(1000);

      // Get the canvas element
      const canvas = await page.$('canvas');

      if (!canvas) {
        throw new Error('No canvas element found. The sketch may have failed to initialize.');
      }

      // Take screenshot of the canvas
      await canvas.screenshot({
        path: outputPath,
        type: ext === '.png' ? 'png' : 'jpeg'
      });

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to render sketch: ${error.message}`);
      }
      throw new Error('Failed to render sketch: Unknown error');
    } finally {
      // Clean up
      if (page) {
        await page.close().catch(() => {});
      }
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }

  private generateHTML(code: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atelier Renderer</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #000; }
    canvas { display: block; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
</head>
<body>
  <script>${code}</script>
</body>
</html>`;
  }

  private async waitForP5Initialization(page: Page): Promise<void> {
    try {
      await page.waitForSelector('canvas', { timeout: 10000 });
    } catch (error) {
      await this.delay(500);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }
}
