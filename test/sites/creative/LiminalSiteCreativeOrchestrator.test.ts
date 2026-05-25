import { describe, expect, it } from 'vitest';
import {
  FULL_LIMINAL_SITE_DOMAINS,
  buildLiminalCapabilityMatrix,
} from '../../../src/sites/creative/LiminalCapabilityMatrix.js';
import { composeFullLiminalCreativeSite } from '../../../src/sites/creative/LiminalSiteCreativeOrchestrator.js';
import type { SiteCreativeDomain, SiteProfile, SkinSpec } from '../../../src/sites/types.js';

const profile: SiteProfile = {
  siteId: 'full-liminal-site',
  name: 'Full Liminal Site',
  sourceUrl: 'https://example.com',
  brandBrief: 'A living website that should use the whole Liminal engine with receipts.',
  constraints: ['No silent generator fallback.'],
  allowedModes: ['runtime-skin'],
  stackHints: ['static-html'],
  createdAt: '2026-05-07T00:00:00.000Z',
  updatedAt: '2026-05-07T00:00:00.000Z',
};

const skin: SkinSpec = {
  siteId: profile.siteId,
  skinId: 'full-liminal-site-skin-abcdef12-1',
  name: 'Full Liminal Site direction 1',
  prompt: 'Make the site alive.',
  createdAt: '2026-05-07T00:00:00.000Z',
  tokens: {
    palette: {
      background: 'hsl(220 30% 8%)',
      surface: 'hsl(220 26% 13%)',
      text: 'hsl(220 22% 94%)',
      mutedText: 'hsl(220 13% 67%)',
      accent: 'hsl(38 86% 62%)',
      accent2: 'hsl(174 76% 58%)',
      line: 'hsl(220 22% 24%)',
    },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      headingScale: 1.2,
      bodyScale: 1,
    },
    motion: {
      intensity: 0.78,
      rhythm: 'kinetic',
    },
    shape: {
      radius: 12,
      density: 'balanced',
    },
  },
  runtime: {
    css: ':root { --liminal-sites-accent: hsl(38 86% 62%); }',
    js: "document.body.classList.add('liminal-sites-active');",
  },
  provenance: {
    engine: 'liminal-sites',
    mode: 'runtime-skin',
    seed: 'abcdef12seed',
    source: 'evolution',
  },
  quality: {
    score: 0.88,
    notes: ['Evolved from preference memory.'],
  },
};

const fixtureCode: Record<SiteCreativeDomain, string> = {
  p5: 'function setup(){createCanvas(320,180);noStroke();} function draw(){background(5,10,25);fill(240,180,90);circle(width/2,height/2,70+sin(frameCount*.05)*20);}',
  three: 'const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 100); camera.position.z = 3; const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); document.body.appendChild(renderer.domElement); const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1,2), new THREE.MeshStandardMaterial({ color: 0x66e0ff, roughness: .35 })); scene.add(mesh); scene.add(new THREE.DirectionalLight(0xffffff, 2)); function animate(){ mesh.rotation.x += .01; mesh.rotation.y += .013; renderer.render(scene,camera); requestAnimationFrame(animate); } animate();',
  shader: 'precision mediump float; uniform float u_time; uniform vec2 u_resolution; float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);} void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy; float n=hash(floor((uv+u_time*.02)*18.)); vec3 c=mix(vec3(.02,.04,.12),vec3(.9,.42,.18),n); gl_FragColor=vec4(c,1.);}',
  hydra: 'osc(7,0.12,1.1).color(0.95,0.42,0.22).add(noise(3,0.2).color(0.2,0.8,1.0),0.35).kaleid(5).out(o0)',
  tone: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tone</title><script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script></head><body><button id="start">Start</button><script>document.getElementById("start").addEventListener("click",async()=>{await Tone.start();Tone.Transport.bpm.value=84;const synth=new Tone.Synth().toDestination();new Tone.Loop(t=>synth.triggerAttackRelease("C4","8n",t), "4n").start(0);Tone.Transport.start();});</script></body></html>',
  strudel: '$: s("bd*2 [~ sd] hh*4").gain(.75).room(.25)',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><rect width="400" height="240" fill="#07111f"/><circle cx="200" cy="120" r="72" fill="#f59e0b"/><path d="M80 190 C150 80 260 80 320 190" stroke="#67e8f9" stroke-width="18" fill="none"/></svg>',
  html: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Living Layer</title></head><body><main><h1>Living Layer</h1><p>Generated HTML surface.</p></main></body></html>',
  textgen: 'threshold\n  remembers\n    the visitor\n      and opens',
  kinetic: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kinetic</title><style>@keyframes drift{to{transform:translateX(30px)}} body{animation:drift 2s infinite alternate;background:#06111f;color:white}</style></head><body><h1>Liminal Motion</h1></body></html>',
  ascii: '/\\\\ threshold /\\\\\n||  SITE  ||\n\\\\/ signal \\\\/',
  revideo: 'import {makeScene2D, Txt} from "@revideo/2d"; import {createRef, waitFor} from "@revideo/core"; export default makeScene2D("Scene", function* (view) { const title=createRef<Txt>(); view.add(<Txt ref={title} text="Living Site" />); yield* waitFor(1); });',
  hyperframes: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>HyperFrames</title><script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script></head><body><div data-composition-id="living"><div class="clip">Living site</div></div><script>window.__timelines=window.__timelines||{};window.__timelines.living=gsap.timeline().from(".clip",{opacity:0,duration:1});</script></body></html>',
};

describe('Liminal full-site creative orchestration', () => {
  it('inventories every site-compatible Liminal capability with operator-facing status fields', async () => {
    const matrix = await buildLiminalCapabilityMatrix();

    expect(FULL_LIMINAL_SITE_DOMAINS).toEqual([
      'p5',
      'three',
      'shader',
      'hydra',
      'tone',
      'strudel',
      'svg',
      'html',
      'textgen',
      'kinetic',
      'ascii',
      'revideo',
      'hyperframes',
    ]);
    expect(matrix.domains.map((capability) => capability.domain)).toEqual(FULL_LIMINAL_SITE_DOMAINS);
    expect(matrix.domains.every((capability) => ['used', 'available-not-selected', 'blocked', 'failed'].includes(capability.status))).toBe(true);
    expect(matrix.domains.every((capability) => capability.generator.name && capability.validator.name)).toBe(true);
    expect(matrix.summary.total).toBe(FULL_LIMINAL_SITE_DOMAINS.length);
  });

  it('composes a full-liminal receipt from generated candidates without deterministic fallback', async () => {
    const generated: SiteCreativeDomain[] = [];
    const composition = await composeFullLiminalCreativeSite({
      profile,
      skin,
      prompt: 'Use every Liminal domain that can become a website layer.',
      request: {
        strategy: 'full-liminal',
        domainMode: 'all',
        candidatesPerDomain: 1,
        maxIterations: 1,
        includeAudio: true,
        includeVideoAssets: true,
      },
      generatorBridge: {
        generate: async (domain) => {
          generated.push(domain);
          if (domain === 'p5') {
            return { code: 'not a p5 sketch', model: 'fixture-generator' };
          }
          return { code: fixtureCode[domain], model: 'fixture-generator' };
        },
      },
      renderAndScore: async (candidate) => ({
        success: true,
        score: candidate.domain === 'tone' || candidate.domain === 'strudel' ? 0.66 : 0.81,
        domain: candidate.domain === 'shader' ? 'glsl' : candidate.domain,
        warnings: candidate.domain === 'tone' ? ['audio waits for user gesture'] : undefined,
        duration: 12,
      }),
    });

    expect(generated).toEqual(FULL_LIMINAL_SITE_DOMAINS);
    expect(composition.provenance.source).toBe('full-liminal-orchestrator');
    expect(composition.domains).toEqual(expect.arrayContaining(['three', 'shader', 'hydra', 'tone', 'strudel', 'svg', 'html', 'textgen', 'kinetic', 'ascii', 'revideo', 'hyperframes']));
    expect(composition.domains).not.toContain('p5');
    expect(composition.rejectedCandidates).toEqual(expect.arrayContaining([
      expect.objectContaining({ domain: 'p5', stage: 'validation', status: 'failed' }),
    ]));
    expect(composition.capabilityMatrix.domains.find((capability) => capability.domain === 'p5')).toMatchObject({
      status: 'failed',
    });
    expect(composition.capabilityMatrix.fullRunSatisfied).toBe(true);
    expect(composition.layers.find((layer) => layer.domain === 'tone')).toMatchObject({
      runtimeStatus: { status: 'audio-gated' },
    });
    expect(composition.runtime.manifest.capabilityMatrix.summary.used).toBeGreaterThan(8);
    expect(composition.runtime.js).toContain('capabilityMatrix');
    expect(composition.runtime.js).toContain('audioGate');
    expect(composition.runtime.js).toContain('rejectedCandidates');
  });
});
