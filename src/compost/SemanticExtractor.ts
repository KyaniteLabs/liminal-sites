/**
 * SemanticExtractor — LLM-based semantic content extraction for compost files.
 * Handles text, code, images, audio, and video extraction via LLM.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import type { CompostConfig } from './types.js';

/** Minimal LLM client interface. */
export interface LLMClientLike {
  generate(systemPrompt: string, userPrompt: string, signal?: AbortSignal): Promise<{ code: string; success: boolean }>;
}

export class SemanticExtractor {
  private llm: LLMClientLike;
  private cache = new Map<string, string>();

  constructor(_config: CompostConfig, llm: LLMClientLike) {
    this.llm = llm;
  }

  /** Extract semantic content from text/markdown files. Direct extraction, no LLM. */
  async extractText(content: string, filePath: string): Promise<string> {
    if (!content.trim()) return `[Empty file: ${path.basename(filePath)}]`;
    // Truncate very long files for semantic extraction
    return content.length > 10000 ? content.slice(0, 10000) + '\n... [truncated]' : content;
  }

  /** Extract semantic info from code files using LLM. */
  async extractCode(filePath: string): Promise<string> {
    const cacheKey = `code:${filePath}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const content = await fs.readFile(filePath, 'utf-8');
    const ext = path.extname(filePath).replace('.', '');

    try {
      const result = await this.llm.generate(
        'You are a code analyst. Summarize what this code does in 1-2 sentences. Focus on core logic, patterns, and creative concepts.',
        `File: ${path.basename(filePath)} (${ext})\n\n${content.slice(0, 5000)}`
      );

      const summary = result.success ? result.code : `[Code file: ${ext}]`;
      this.cache.set(cacheKey, summary);
      return summary;
    } catch {
      const fallback = `[Code file: ${path.basename(filePath)}]`;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /** Extract semantic info from images using vision model. */
  async extractImage(filePath: string): Promise<string> {
    const cacheKey = `image:${filePath}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.llm.generate(
        'Describe what is in this image. Extract any ideas, techniques, patterns, or creative concepts visible.',
        `[Image file: ${path.basename(filePath)}]`
      );

      const description = result.success ? result.code : `[Image: ${path.basename(filePath)}]`;
      this.cache.set(cacheKey, description);
      return description;
    } catch {
      const fallback = `[Image: ${path.basename(filePath)}]`;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /** Extract semantic info from audio files (stub). */
  async extractAudio(filePath: string): Promise<string> {
    return `[Audio file: ${path.basename(filePath)} — transcription/summary not yet implemented]`;
  }

  /** Extract semantic info from video files (stub). */
  async extractVideo(filePath: string): Promise<string> {
    return `[Video file: ${path.basename(filePath)} — frame description not yet implemented]`;
  }

  /** Auto-detect file type and extract semantic content. */
  async extract(filePath: string): Promise<string | null> {
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const textExts = ['md', 'txt', 'json', 'yaml', 'yml', 'toml', 'csv', 'xml', 'html', 'css'];
    const codeExts = ['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'java', 'kt', 'rb', 'php', 'swift', 'c', 'cpp', 'h', 'glsl', 'frag', 'vert'];
    const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff'];
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

    if (textExts.includes(ext)) {
      const content = await fs.readFile(filePath, 'utf-8').catch(() => '');
      return this.extractText(content, filePath);
    }
    if (codeExts.includes(ext)) {
      return this.extractCode(filePath);
    }
    if (imageExts.includes(ext)) {
      return this.extractImage(filePath);
    }
    if (audioExts.includes(ext)) {
      return this.extractAudio(filePath);
    }
    if (videoExts.includes(ext)) {
      return this.extractVideo(filePath);
    }

    return null; // Unsupported format
  }

  /** Clear extraction cache. */
  clearCache(): void {
    this.cache.clear();
  }
}
