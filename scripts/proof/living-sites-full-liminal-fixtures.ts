import { FULL_LIMINAL_SITE_DOMAINS } from '../../src/sites/creative/LiminalCapabilityMatrix.js';
import type {
  LiminalGeneratedCandidate,
  LiminalSiteGeneratorBridge,
  LiminalSiteRenderAndScore,
} from '../../src/sites/creative/LiminalSiteCreativeOrchestrator.js';
import type { SiteCreativeDomain } from '../../src/sites/types.js';

export const FULL_LIMINAL_PROOF_DOMAINS = [...FULL_LIMINAL_SITE_DOMAINS];

const proofCode: Record<SiteCreativeDomain, string> = {
  p5: 'function setup(){createCanvas(480,270);noStroke();} function draw(){background(5,10,24,220);fill(242,178,82);circle(width/2+sin(frameCount*.025)*80,height/2,78+sin(frameCount*.05)*22);fill(94,234,212,150);rect(42,42,120,18+sin(frameCount*.04)*10);}',
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

export function createFullLiminalProofGeneratorBridge(): LiminalSiteGeneratorBridge {
  return {
    async generate(domain): Promise<LiminalGeneratedCandidate> {
      return {
        code: proofCode[domain],
        generator: `proof-${domain}-generator`,
        model: 'local-proof-fixture',
        warnings: domain === 'tone' || domain === 'strudel' ? ['Audio is packaged behind a user gesture.'] : undefined,
      };
    },
  };
}

export function createFullLiminalProofRenderAndScore(): LiminalSiteRenderAndScore {
  return async (candidate) => ({
    success: true,
    score: candidate.domain === 'tone' || candidate.domain === 'strudel' ? 0.68 : 0.84,
    domain: candidate.domain === 'shader' ? 'glsl' : candidate.domain,
    warnings: candidate.domain === 'tone' || candidate.domain === 'strudel' ? ['audio-gated'] : undefined,
    duration: 8,
  });
}
