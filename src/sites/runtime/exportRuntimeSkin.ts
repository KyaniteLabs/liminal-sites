import fs from 'fs/promises';
import path from 'path';
import type { RuntimeSkinExport, SkinSpec } from '../types.js';
import { buildRuntimeSkinFiles } from './runtimeSkinTemplate.js';

export async function exportRuntimeSkin(spec: SkinSpec, outputDir: string): Promise<RuntimeSkinExport> {
  const resolvedOutputDir = path.resolve(outputDir);
  if (resolvedOutputDir === path.parse(resolvedOutputDir).root) {
    throw new Error('Refusing to export a runtime skin into the filesystem root');
  }
  const files = buildRuntimeSkinFiles(spec);
  const cssPath = path.join(resolvedOutputDir, 'liminal-skin.css');
  const jsPath = path.join(resolvedOutputDir, 'liminal-skin.js');
  const manifestPath = path.join(resolvedOutputDir, 'liminal-site-manifest.json');
  await fs.mkdir(resolvedOutputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(cssPath, files.css, 'utf-8'),
    fs.writeFile(jsPath, files.js, 'utf-8'),
    fs.writeFile(manifestPath, `${files.manifest}\n`, 'utf-8'),
  ]);
  return {
    outputDir: resolvedOutputDir,
    cssPath,
    jsPath,
    manifestPath,
    files,
  };
}
