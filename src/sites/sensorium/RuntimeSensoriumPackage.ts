import fs from 'fs/promises';
import path from 'path';
import { createRunId } from '../siteIds.js';
import type { SiteProfile, SiteSensoriumConfig, SiteSensoriumDeploymentPackage } from '../types.js';

export interface CreateRuntimeSensoriumPackageInput {
  profile: SiteProfile;
  config: SiteSensoriumConfig;
  publicBaseUrl?: string;
  artifactPath: (deploymentId: string, fileName: string) => string;
}

export async function createRuntimeSensoriumPackage(input: CreateRuntimeSensoriumPackageInput): Promise<SiteSensoriumDeploymentPackage> {
  const deploymentId = createRunId('sensorium-deploy');
  const createdAt = new Date().toISOString();
  const assetBaseUrl = buildSensoriumAssetBaseUrl(input.publicBaseUrl, input.profile.siteId, deploymentId);
  const cssPath = input.artifactPath(deploymentId, 'liminal-sensorium.css');
  const jsPath = input.artifactPath(deploymentId, 'liminal-sensorium.js');
  const configPath = input.artifactPath(deploymentId, 'liminal-sensorium-config.json');
  const manifestPath = input.artifactPath(deploymentId, 'liminal-sensorium-manifest.json');
  const installHtmlPath = input.artifactPath(deploymentId, 'install.html');
  const readmePath = input.artifactPath(deploymentId, 'README.md');
  const outputDir = path.dirname(cssPath);
  const cssUrl = `${assetBaseUrl}/liminal-sensorium.css`;
  const jsUrl = `${assetBaseUrl}/liminal-sensorium.js`;
  const configUrl = `${assetBaseUrl}/liminal-sensorium-config.json`;
  const manifestUrl = `${assetBaseUrl}/liminal-sensorium-manifest.json`;
  const installHtmlUrl = `${assetBaseUrl}/install.html`;
  const head = `<link rel="stylesheet" href="${cssUrl}" data-liminal-sites-sensorium="${input.config.configId}">`;
  const bodyEnd = `<script defer src="${jsUrl}" data-liminal-sites-sensorium="${input.config.configId}" data-config-url="${configUrl}"></script>`;
  const manifest: SiteSensoriumDeploymentPackage['manifest'] = {
    deploymentId,
    siteId: input.profile.siteId,
    configId: input.config.configId,
    mode: 'sensorium-runtime-snippet',
    assets: {
      css: cssUrl,
      js: jsUrl,
      config: configUrl,
      manifest: manifestUrl,
      installHtml: installHtmlUrl,
    },
  };
  const deployment: SiteSensoriumDeploymentPackage = {
    deploymentId,
    siteId: input.profile.siteId,
    configId: input.config.configId,
    createdAt,
    mode: 'sensorium-runtime-snippet',
    assetBaseUrl,
    outputDir,
    files: {
      cssPath,
      jsPath,
      configPath,
      manifestPath,
      installHtmlPath,
      readmePath,
    },
    installSnippets: {
      head,
      bodyEnd,
      combined: `${head}\n${bodyEnd}`,
    },
    manifest,
    verificationChecklist: [
      'Install the stylesheet in the target site head.',
      'Install the deferred sensorium script before the closing body tag.',
      'Confirm window.__liminalSitesSensorium.ready is true after page load.',
      'Confirm #liminal-sites-sensorium-layer exists and has pointer-events:none.',
      'Confirm existing PostHog analytics still loads through the target site path.',
      'Confirm the homepage copy, navigation, forms, CTA hrefs, metadata, and layout remain unchanged.',
    ],
    operatorNotes: [
      `Sensorium deployment package created for ${input.profile.name}.`,
      `Config ${input.config.configId} is fixture-first and PostHog-shaped; live API polling is intentionally not embedded.`,
      'The runtime layer is removable by deleting the two snippet tags.',
    ],
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(cssPath, renderSensoriumCss(input.config), 'utf8');
  await fs.writeFile(jsPath, renderSensoriumJs(), 'utf8');
  await fs.writeFile(configPath, `${JSON.stringify(input.config, null, 2)}\n`, 'utf8');
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(installHtmlPath, renderSensoriumInstallHtml(input.profile, deployment), 'utf8');
  await fs.writeFile(readmePath, renderSensoriumReadme(input.profile, deployment), 'utf8');
  return deployment;
}

export function renderSensoriumCss(config: SiteSensoriumConfig): string {
  const variables = Object.entries(config.layerConfig.cssVariables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `:root {
${variables}
}

#liminal-sites-sensorium-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  opacity: calc(0.42 + (var(--liminal-sensorium-density, 0.2) * 0.55));
  mix-blend-mode: screen;
}

#liminal-sites-sensorium-layer::before,
#liminal-sites-sensorium-layer::after {
  content: "";
  position: absolute;
  inset: -18%;
  background:
    radial-gradient(circle at 20% 20%, var(--liminal-sensorium-warm), transparent 34%),
    radial-gradient(circle at 78% 18%, var(--liminal-sensorium-cool), transparent 32%),
    radial-gradient(circle at 50% 88%, rgba(255, 255, 255, 0.035), transparent 28%);
  filter: blur(calc(18px + (var(--liminal-sensorium-texture, 0.12) * 42px)));
  transform: translate3d(0, 0, 0);
}

#liminal-sites-sensorium-layer::after {
  opacity: calc(0.14 + (var(--liminal-sensorium-texture, 0.1) * 1.2));
  background-image: linear-gradient(120deg, rgba(255,255,255,0.11), transparent 48%, rgba(255,255,255,0.07));
  mix-blend-mode: overlay;
}

body.liminal-sites-sensorium-active > :not(#liminal-sites-sensorium-layer):not(.skip-link) {
  position: relative;
  z-index: 1;
}

@media (prefers-reduced-motion: no-preference) {
  #liminal-sites-sensorium-layer[data-motion="on"]::before {
    animation: liminal-sites-sensorium-drift var(--liminal-sensorium-duration, 22s) ease-in-out infinite alternate;
  }
}

@media (prefers-reduced-motion: reduce) {
  #liminal-sites-sensorium-layer::before {
    animation: none !important;
  }
}

@keyframes liminal-sites-sensorium-drift {
  from { transform: translate3d(-1.5%, -1%, 0) scale(1); }
  to { transform: translate3d(1.5%, 1%, 0) scale(1.025); }
}
`;
}

export function renderSensoriumJs(): string {
  return `(function () {
  var receipt = { ready: false, source: 'liminal-sites-sensorium', error: null };
  window.__liminalSitesSensorium = receipt;

  function markError(error) {
    receipt.error = error && error.message ? error.message : String(error || 'unknown error');
    window.__liminalSitesSensorium = receipt;
    window.dispatchEvent(new CustomEvent('liminal-sites-sensorium-error', { detail: receipt }));
  }

  function currentScript() {
    return document.currentScript || document.querySelector('script[data-liminal-sites-sensorium]');
  }

  function configUrl(script) {
    if (script && script.getAttribute('data-config-url')) return script.getAttribute('data-config-url');
    if (script && script.src) return new URL('liminal-sensorium-config.json', script.src).href;
    return '/static/liminal-sites/liminal-sensorium-config.json';
  }

  function applyConfig(config) {
    if (!config || !config.layerConfig || !config.layerConfig.runtimeFlags || config.layerConfig.runtimeFlags.protectContent !== true) {
      throw new Error('Invalid sensorium config');
    }
    var reducedMotion = config.layerConfig.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Object.keys(config.layerConfig.cssVariables || {}).forEach(function (name) {
      document.documentElement.style.setProperty(name, config.layerConfig.cssVariables[name]);
    });
    var layer = document.getElementById('liminal-sites-sensorium-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'liminal-sites-sensorium-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.prepend(layer);
    }
    layer.style.pointerEvents = 'none';
    layer.dataset.motion = reducedMotion || config.layerConfig.motionIntensity <= 0.01 ? 'off' : 'on';
    document.documentElement.dataset.liminalSitesSensorium = config.configId;
    document.body.classList.add('liminal-sites-sensorium-active');
    receipt = {
      ready: true,
      source: 'liminal-sites-sensorium',
      configId: config.configId,
      siteId: config.siteId,
      confidence: config.signalVector && config.signalVector.confidence,
      protectedSurfaces: config.guardrails && config.guardrails.protectedSurfaces,
      reducedMotion: reducedMotion,
      error: null
    };
    window.__liminalSitesSensorium = receipt;
    window.dispatchEvent(new CustomEvent('liminal-sites-sensorium-ready', { detail: receipt }));
  }

  function boot() {
    var script = currentScript();
    fetch(configUrl(script), { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Sensorium config failed with status ' + response.status);
        return response.json();
      })
      .then(applyConfig)
      .catch(markError);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}());
`;
}

function buildSensoriumAssetBaseUrl(publicBaseUrl: string | undefined, siteId: string, deploymentId: string): string {
  const base = publicBaseUrl?.replace(/\/+$/, '') || '';
  const pathPart = `/api/living-sites/${encodeURIComponent(siteId)}/sensorium-deployments/${encodeURIComponent(deploymentId)}/assets`;
  return base ? `${base}${pathPart}` : pathPart;
}

function renderSensoriumInstallHtml(profile: SiteProfile, deployment: SiteSensoriumDeploymentPackage): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(profile.name)} sensorium install</title>
  ${deployment.installSnippets.head}
  <style>
    body { margin: 0; min-height: 100vh; background: #080a0f; color: #f8fafc; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { min-height: 100vh; display: grid; align-content: center; gap: 18px; padding: 72px; }
    h1 { max-width: 780px; margin: 0; font-size: clamp(38px, 7vw, 86px); line-height: 0.98; }
    p { max-width: 660px; font-size: 20px; line-height: 1.55; }
  </style>
</head>
<body>
  <main>
    <span>PostHog sensorium fixture</span>
    <h1>${escapeHtml(profile.name)} ambient install preview</h1>
    <p>This page loads deployment ${escapeHtml(deployment.deploymentId)} without changing content, navigation, forms, SEO, or analytics.</p>
  </main>
  ${deployment.installSnippets.bodyEnd}
</body>
</html>`;
}

function renderSensoriumReadme(profile: SiteProfile, deployment: SiteSensoriumDeploymentPackage): string {
  return `# ${profile.name} Liminal Sites Sensorium Deployment

Config: ${deployment.configId}
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
