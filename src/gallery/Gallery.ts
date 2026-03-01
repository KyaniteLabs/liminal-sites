/**
 * Gallery - Save/load iteration functionality
 *
 * Manages persistent storage of code iterations with date-based directory structure.
 * Each project gets a directory named YYYY-MM-DD--project/ containing version files.
 *
 * Key behavior:
 * - saveIteration(project, version, code) saves code to gallery/YYYY-MM-DD--project/v{version}.js
 * - loadHistory(project) loads all iterations sorted by version number
 */

import fs from 'fs/promises';
import path from 'path';

export interface Iteration {
  version: number;
  code: string;
  timestamp: string;
}

export class Gallery {
  private readonly galleryDir: string;

  constructor(galleryDir: string = 'gallery') {
    this.galleryDir = galleryDir;
  }

  /**
   * Save an iteration to the gallery
   * @param project - Project name (must be non-empty string)
   * @param version - Version number (must be positive integer)
   * @param code - Code to save (must be non-empty string)
   * @throws Error if validation fails or file system error occurs
   */
  async saveIteration(project: string, version: number, code: string): Promise<void> {
    // Validate project name
    if (!project || typeof project !== 'string' || project.trim() === '') {
      throw new Error('Project name is required and must be a non-empty string');
    }

    // Validate version
    if (!version || typeof version !== 'number' || version <= 0 || !Number.isInteger(version)) {
      throw new Error('Version must be a positive integer');
    }

    // Validate code
    if (!code || typeof code !== 'string' || code.trim() === '') {
      throw new Error('Code is required and must be a non-empty string');
    }

    // Create date-based directory name
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const projectDirName = `${dateStr}--${project}`;
    const projectDir = path.join(this.galleryDir, projectDirName);

    // Create directory if it doesn't exist
    try {
      await fs.mkdir(projectDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create project directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Save code to version file
    const filename = `v${version}.js`;
    const filepath = path.join(projectDir, filename);

    try {
      await fs.writeFile(filepath, code, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save iteration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load iteration history for a project
   * @param project - Project name (must be non-empty string)
   * @returns Array of iterations sorted by version number
   * @throws Error if validation fails
   */
  async loadHistory(project: string): Promise<Iteration[]> {
    // Validate project name
    if (!project || typeof project !== 'string' || project.trim() === '') {
      throw new Error('Project name is required and must be a non-empty string');
    }

    // Try to find the project directory
    // We need to find the most recent date-based directory for this project
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const projectDirName = `${dateStr}--${project}`;
    const projectDir = path.join(this.galleryDir, projectDirName);

    try {
      // Check if directory exists
      await fs.access(projectDir);
    } catch {
      // Directory doesn't exist, return empty history
      return [];
    }

    try {
      // Read all files in the project directory
      const files = await fs.readdir(projectDir);

      // Filter and parse version files
      const iterations: Iteration[] = [];

      for (const file of files) {
        // Match version files (v1.js, v2.js, etc.)
        const match = file.match(/^v(\d+)\.js$/);
        if (!match) continue;

        const version = parseInt(match[1], 10);

        try {
          // Read file content
          const filepath = path.join(projectDir, file);
          const code = await fs.readFile(filepath, 'utf-8');

          // Skip empty files
          if (!code || code.trim() === '') continue;

          iterations.push({
            version,
            code,
            timestamp: date.toISOString()
          });
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }

      // Sort by version number
      iterations.sort((a, b) => a.version - b.version);

      return iterations;
    } catch (error) {
      // If we can't read the directory, return empty history
      return [];
    }
  }

  /**
   * Get the full path to a project's gallery directory
   * @param project - Project name
   * @returns Full path to the project directory
   */
  getProjectPath(project: string): string {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.galleryDir, `${dateStr}--${project}`);
  }

  /**
   * Check if a project has any saved iterations
   * @param project - Project name
   * @returns True if project has saved iterations
   */
  async hasIterations(project: string): Promise<boolean> {
    const history = await this.loadHistory(project);
    return history.length > 0;
  }

  /**
   * Get the latest version number for a project
   * @param project - Project name
   * @returns Latest version number or 0 if no iterations exist
   */
  async getLatestVersion(project: string): Promise<number> {
    const history = await this.loadHistory(project);
    if (history.length === 0) {
      return 0;
    }
    return Math.max(...history.map(iter => iter.version));
  }
}