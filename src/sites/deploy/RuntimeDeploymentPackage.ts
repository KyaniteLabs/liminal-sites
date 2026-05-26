import fs from 'fs/promises';
import path from 'path';
import { createRunId } from '../siteIds.js';
import type { SiteCreativeComposition, SiteDeploymentPackage, SiteProfile, SkinSpec } from '../types.js';

export interface CreateRuntimeDeploymentPackageInput {
  profile: SiteProfile;
  spec: SkinSpec;
  composition?: SiteCreativeComposition;
  publicBaseUrl?: string;
  artifactPath: (deploymentId: string, fileName: string) => string;
}

export async function createRuntimeDeploymentPackage(input: CreateRuntimeDeploymentPackageInput): Promise<SiteDeploymentPackage> {
  const deploymentId = createRunId('deploy');
  const createdAt = new Date().toISOString();
  const assetBaseUrl = buildAssetBaseUrl(input.publicBaseUrl, input.profile.siteId, deploymentId);
  const cssPath = input.artifactPath(deploymentId, 'liminal-skin.css');
  const jsPath = input.artifactPath(deploymentId, 'liminal-skin.js');
  const manifestPath = input.artifactPath(deploymentId, 'manifest.json');
  const creativeCssPath = input.composition ? input.artifactPath(deploymentId, 'liminal-creative.css') : undefined;
  const creativeJsPath = input.composition ? input.artifactPath(deploymentId, 'liminal-creative.js') : undefined;
  const creativeManifestPath = input.composition ? input.artifactPath(deploymentId, 'liminal-creative-manifest.json') : undefined;
  const installHtmlPath = input.artifactPath(deploymentId, 'install.html');
  const readmePath = input.artifactPath(deploymentId, 'README.md');
  const outputDir = path.dirname(cssPath);
  const cssUrl = `${assetBaseUrl}/liminal-skin.css`;
  const jsUrl = `${assetBaseUrl}/liminal-skin.js`;
  const creativeCssUrl = input.composition ? `${assetBaseUrl}/liminal-creative.css` : undefined;
  const creativeJsUrl = input.composition ? `${assetBaseUrl}/liminal-creative.js` : undefined;
  const creativeManifestUrl = input.composition ? `${assetBaseUrl}/liminal-creative-manifest.json` : undefined;
  const installHtmlUrl = `${assetBaseUrl}/install.html`;
  const head = `<link rel="stylesheet" href="${cssUrl}" data-liminal-sites="${input.spec.skinId}">`;
  const bodyEnd = `<script defer src="${jsUrl}" data-liminal-sites="${input.spec.skinId}"></script>`;
  const creativeHead = input.composition && creativeCssUrl
    ? `<link rel="stylesheet" href="${creativeCssUrl}" data-liminal-sites-creative="${input.composition.compositionId}">`
    : undefined;
  const creativeBodyEnd = input.composition && creativeJsUrl
    ? `<script defer src="${creativeJsUrl}" data-liminal-sites-creative="${input.composition.compositionId}"></script>`
    : undefined;
  const installSnippets = {
    head,
    bodyEnd,
    creativeHead,
    creativeBodyEnd,
    combined: [head, creativeHead, bodyEnd, creativeBodyEnd].filter(Boolean).join('\n'),
  };
  const manifest: SiteDeploymentPackage['manifest'] = {
    deploymentId,
    siteId: input.profile.siteId,
    skinId: input.spec.skinId,
    mode: 'runtime-snippet',
    assets: {
      css: cssUrl,
      js: jsUrl,
      creativeCss: creativeCssUrl,
      creativeJs: creativeJsUrl,
      creativeManifest: creativeManifestUrl,
      installHtml: installHtmlUrl,
    },
  };
  const verificationChecklist = [
    'Paste the stylesheet link in the target site head.',
    'Paste the deferred script before the closing body tag.',
    'Open the page and confirm document.body has the liminal-sites-active class.',
    ...(input.composition ? [
      'Confirm document.documentElement has a data-liminal-sites-composition value.',
      'Confirm window.__liminalSitesCreative.compileOk is true and frameCount increases.',
    ] : []),
    'Check the first viewport at desktop and mobile widths.',
    'Keep the runtime skin behind review until the owner approves the visual direction.',
  ];
  const operatorNotes = [
    `Deployment package created for ${input.profile.name}.`,
    `Skin ${input.spec.skinId} remains reviewable and removable by deleting the two snippet tags.`,
    ...(input.composition ? [`Creative composition ${input.composition.compositionId} adds ${input.composition.domains.join(' + ')} layers.`] : []),
    `Install preview: ${installHtmlUrl}.`,
  ];
  const deployment: SiteDeploymentPackage = {
    deploymentId,
    siteId: input.profile.siteId,
    skinId: input.spec.skinId,
    creativeCompositionId: input.composition?.compositionId,
    createdAt,
    mode: 'runtime-snippet',
    assetBaseUrl,
    outputDir,
    files: {
      cssPath,
      jsPath,
      manifestPath,
      creativeCssPath,
      creativeJsPath,
      creativeManifestPath,
      installHtmlPath,
      readmePath,
    },
    installSnippets,
    manifest,
    verificationChecklist,
    operatorNotes,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(cssPath, input.spec.runtime.css, 'utf8');
  await fs.writeFile(jsPath, input.spec.runtime.js, 'utf8');
  if (input.composition && creativeCssPath && creativeJsPath && creativeManifestPath) {
    await fs.writeFile(creativeCssPath, input.composition.runtime.css, 'utf8');
    await fs.writeFile(creativeJsPath, input.composition.runtime.js, 'utf8');
    await fs.writeFile(creativeManifestPath, `${JSON.stringify(input.composition.runtime.manifest, null, 2)}\n`, 'utf8');
  }
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(installHtmlPath, renderInstallHtml(input.profile, input.spec, deployment), 'utf8');
  await fs.writeFile(readmePath, renderReadme(input.profile, input.spec, deployment), 'utf8');
  return deployment;
}

function buildAssetBaseUrl(publicBaseUrl: string | undefined, siteId: string, deploymentId: string): string {
  const base = publicBaseUrl?.replace(/\/+$/, '') || '';
  const pathPart = `/api/living-sites/${encodeURIComponent(siteId)}/deployments/${encodeURIComponent(deploymentId)}/assets`;
  return base ? `${base}${pathPart}` : pathPart;
}

function renderInstallHtml(profile: SiteProfile, spec: SkinSpec, deployment: SiteDeploymentPackage): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(profile.name)} runtime-skin install</title>
  ${deployment.installSnippets.head}
  ${deployment.installSnippets.creativeHead ?? ''}
  <style>
    body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { min-height: 100vh; display: grid; align-content: center; gap: 18px; padding: 72px; }
    h1 { max-width: 820px; margin: 0; font-size: clamp(42px, 7vw, 92px); line-height: 0.95; }
    p { max-width: 680px; font-size: 20px; line-height: 1.55; }
  </style>
</head>
<body>
  <main>
    <span>${escapeHtml(spec.provenance.source)}</span>
    <h1>${escapeHtml(profile.name)} install preview</h1>
    <p>This page loads the exact stylesheet and script snippets from deployment ${escapeHtml(deployment.deploymentId)}.</p>
  </main>
  ${deployment.installSnippets.bodyEnd}
  ${deployment.installSnippets.creativeBodyEnd ?? ''}
</body>
</html>`;
}

function renderReadme(profile: SiteProfile, spec: SkinSpec, deployment: SiteDeploymentPackage): string {
  return `# ${profile.name} Liminal Sites Deployment

Skin: ${spec.skinId}
Deployment: ${deployment.deploymentId}

## Install

\`\`\`html
${deployment.installSnippets.combined}
\`\`\`

## Verify

${deployment.verificationChecklist.map((item) => `- ${item}`).join('\n')}
`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
