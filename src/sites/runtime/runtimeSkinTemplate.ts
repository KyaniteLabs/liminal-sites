import type { SkinSpec } from '../types.js';

export interface RuntimeSkinFiles {
  css: string;
  js: string;
  manifest: string;
}

export function buildRuntimeSkinFiles(spec: SkinSpec): RuntimeSkinFiles {
  return {
    css: buildRuntimeCss(spec),
    js: buildRuntimeJs(spec),
    manifest: JSON.stringify({
      name: spec.name,
      skinId: spec.skinId,
      siteId: spec.siteId,
      createdAt: spec.createdAt,
      quality: spec.quality,
      provenance: spec.provenance,
      files: {
        css: 'liminal-skin.css',
        js: 'liminal-skin.js',
      },
    }, null, 2),
  };
}

function buildRuntimeCss(spec: SkinSpec): string {
  const { palette, typography, motion, shape } = spec.tokens;
  const density = shape.density === 'spare' ? 0.82 : shape.density === 'dense' ? 1.12 : 1;
  const cardPadding = shape.density === 'spare' ? 30 : shape.density === 'dense' ? 18 : 24;
  const layoutGap = shape.density === 'spare' ? 34 : shape.density === 'dense' ? 18 : 26;
  const actionLift = Math.max(1, Math.round(2 + motion.intensity * 4));
  const buttonShadowY = Math.max(6, Math.round(8 + motion.intensity * 10));
  const buttonShadowBlur = Math.max(14, Math.round(18 + motion.intensity * 18));
  const cardShadowY = Math.max(14, Math.round(20 + motion.intensity * 18));
  const cardShadowBlur = Math.max(28, Math.round(34 + motion.intensity * 26));
  return `:root {
  --liminal-sites-bg: ${palette.background};
  --liminal-sites-surface: ${palette.surface};
  --liminal-sites-text: ${palette.text};
  --liminal-sites-muted: ${palette.mutedText};
  --liminal-sites-accent: ${palette.accent};
  --liminal-sites-accent-2: ${palette.accent2};
  --liminal-sites-line: ${palette.line};
  --liminal-sites-radius: ${shape.radius}px;
  --liminal-sites-heading-scale: ${typography.headingScale};
  --liminal-sites-body-scale: ${typography.bodyScale};
  --liminal-sites-motion-intensity: ${motion.intensity};
  --liminal-sites-density: ${density};
  --liminal-sites-layout-gap: ${layoutGap}px;
  --liminal-sites-card-bg: color-mix(in srgb, var(--liminal-sites-surface) 88%, var(--liminal-sites-accent) 12%);
  --liminal-sites-card-border: color-mix(in srgb, var(--liminal-sites-line) 72%, var(--liminal-sites-accent) 28%);
  --liminal-sites-card-shadow: 0 ${cardShadowY}px ${cardShadowBlur}px color-mix(in srgb, var(--liminal-sites-bg) 70%, black 30%), inset 0 1px 0 color-mix(in srgb, white 12%, transparent);
  --liminal-sites-card-padding: ${cardPadding}px;
  --liminal-sites-button-bg: linear-gradient(135deg, var(--liminal-sites-accent), color-mix(in srgb, var(--liminal-sites-accent-2) 82%, var(--liminal-sites-accent) 18%));
  --liminal-sites-button-text: var(--liminal-sites-bg);
  --liminal-sites-button-border: color-mix(in srgb, var(--liminal-sites-accent) 72%, white 28%);
  --liminal-sites-button-shadow: 0 ${buttonShadowY}px ${buttonShadowBlur}px color-mix(in srgb, var(--liminal-sites-accent) 24%, transparent);
  --liminal-sites-action-lift: ${actionLift}px;
}

body.liminal-sites-active {
  color: var(--liminal-sites-text);
  font-size: calc(1rem * var(--liminal-sites-body-scale));
  background:
    radial-gradient(circle at 18% 14%, color-mix(in srgb, var(--liminal-sites-accent) 20%, transparent), transparent 30rem),
    radial-gradient(circle at 86% 24%, color-mix(in srgb, var(--liminal-sites-accent-2) 16%, transparent), transparent 28rem),
    var(--liminal-sites-bg);
}

body.liminal-sites-active :is(main, [data-liminal-layout]) {
  gap: var(--liminal-sites-layout-gap);
}

body.liminal-sites-active :is(h1, h2, h3, .hero, [data-liminal-heading]) {
  font-family: ${typography.fontFamily};
  letter-spacing: 0;
  color: var(--liminal-sites-text);
  transform-origin: left top;
}

body.liminal-sites-active :is(h1, .hero, [data-liminal-heading="hero"]) {
  transform: scale(var(--liminal-sites-heading-scale));
}

body.liminal-sites-active :is(button, a, input, textarea, select, .card, [data-liminal-card]) {
  border-radius: var(--liminal-sites-radius);
}

body.liminal-sites-active :is(button, a, [role="button"]) {
  color: var(--liminal-sites-button-text);
  background: var(--liminal-sites-button-bg);
  border-color: var(--liminal-sites-button-border);
  box-shadow: var(--liminal-sites-button-shadow);
  transform: translateY(0);
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

body.liminal-sites-active :is(.card, section, article, [data-liminal-card]) {
  padding: var(--liminal-sites-card-padding);
  color: var(--liminal-sites-text);
  background: var(--liminal-sites-card-bg);
  border-color: var(--liminal-sites-card-border);
  box-shadow: var(--liminal-sites-card-shadow);
  transform: translateY(0);
  transition:
    background-color 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 220ms ease;
}

body.liminal-sites-active :is(.card, section, article, [data-liminal-card]) :is(p, li, small) {
  color: var(--liminal-sites-muted);
}

#liminal-sites-atmosphere {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: screen;
  opacity: calc(0.22 + var(--liminal-sites-motion-intensity) * 0.22);
}

#liminal-sites-atmosphere span {
  position: absolute;
  width: 34vmin;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--liminal-sites-accent) 64%, transparent);
  border-radius: 999px;
  transform: translate(-50%, -50%);
  animation: liminal-sites-drift calc(28s - var(--liminal-sites-motion-intensity) * 10s) ease-in-out infinite alternate;
}

#liminal-sites-atmosphere span:nth-child(1) { left: 16%; top: 24%; }
#liminal-sites-atmosphere span:nth-child(2) { left: 78%; top: 18%; animation-delay: -7s; border-color: color-mix(in srgb, var(--liminal-sites-accent-2) 64%, transparent); }
#liminal-sites-atmosphere span:nth-child(3) { left: 62%; top: 74%; animation-delay: -13s; width: 26vmin; }

@keyframes liminal-sites-drift {
  from { transform: translate(-50%, -50%) rotate(0deg) scale(0.92); }
  to { transform: translate(-48%, -54%) rotate(22deg) scale(1.14); }
}

@media (prefers-reduced-motion: reduce) {
  #liminal-sites-atmosphere span { animation: none; }
  body.liminal-sites-active :is(button, a, [role="button"], .card, section, article, [data-liminal-card]) { transition: none; }
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  body.liminal-sites-active :is(button, a, [role="button"]):hover {
    transform: translateY(calc(var(--liminal-sites-action-lift) * -1));
  }

  body.liminal-sites-active :is(.card, section, article, [data-liminal-card]):hover {
    transform: translateY(calc(var(--liminal-sites-action-lift) * -0.5));
  }
}`;
}

function buildRuntimeJs(spec: SkinSpec): string {
  return `(() => {
  const skinId = ${JSON.stringify(spec.skinId)};
  const existing = document.getElementById('liminal-sites-atmosphere');
  if (existing) existing.remove();
  document.documentElement.dataset.liminalSitesSkin = skinId;
  document.body.classList.add('liminal-sites-active');
  const layer = document.createElement('div');
  layer.id = 'liminal-sites-atmosphere';
  layer.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 3; index += 1) {
    layer.appendChild(document.createElement('span'));
  }
  document.body.prepend(layer);
})();`;
}
