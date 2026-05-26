import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

const LOCAL_P5_SCRIPTS = {
  p5: ['p5', 'lib/p5.min.js'],
} as const;

type LocalP5ScriptKey = keyof typeof LOCAL_P5_SCRIPTS | 'p5Sound';

const LOCAL_P5_SOUND_SHIM = `/*! p5.sound offline fallback shim.
 * p5 2.x no longer ships lib/addons/p5.sound.min.js. This shim keeps local
 * renderer QA offline-safe for generated sketches that reference p5.sound CDN
 * APIs while production/customer exports continue to use the real CDN URL.
 */
(function (global) {
  var p5 = global.p5;
  if (!p5) return;
  function chainable() { return this; }
  function NoopSound() {}
  NoopSound.prototype.start = chainable;
  NoopSound.prototype.stop = chainable;
  NoopSound.prototype.play = chainable;
  NoopSound.prototype.pause = chainable;
  NoopSound.prototype.loop = chainable;
  NoopSound.prototype.amp = chainable;
  NoopSound.prototype.freq = chainable;
  NoopSound.prototype.pan = chainable;
  NoopSound.prototype.connect = chainable;
  NoopSound.prototype.disconnect = chainable;
  NoopSound.prototype.setInput = chainable;
  NoopSound.prototype.analyze = function () { return []; };
  NoopSound.prototype.getLevel = function () { return 0; };
  p5.Oscillator = p5.Oscillator || NoopSound;
  p5.Envelope = p5.Envelope || NoopSound;
  p5.SoundFile = p5.SoundFile || NoopSound;
  p5.FFT = p5.FFT || NoopSound;
  p5.AudioIn = p5.AudioIn || NoopSound;
  p5.Gain = p5.Gain || NoopSound;
  p5.prototype.loadSound = p5.prototype.loadSound || function () { return new p5.SoundFile(); };
  p5.prototype.userStartAudio = p5.prototype.userStartAudio || function () { return Promise.resolve(); };
  global.p5sound = global.p5sound || { version: 'offline-fallback' };
})(globalThis);
// p5.sound`;

const cachedScripts = new Map<LocalP5ScriptKey, Promise<string>>();
const packageRootCache = new Map<string, string>();

function packageRootFor(packageName: string): string {
  const cached = packageRootCache.get(packageName);
  if (cached) return cached;

  let directory = dirname(require.resolve(packageName));
  while (directory !== dirname(directory)) {
    if (existsSync(join(directory, 'package.json'))) {
      packageRootCache.set(packageName, directory);
      return directory;
    }
    directory = dirname(directory);
  }

  throw new Error(`Could not locate package root for ${packageName}`);
}

function localScriptPathFor(key: LocalP5ScriptKey): string {
  if (key === 'p5Sound') throw new Error('p5Sound is fulfilled from an inline offline shim');
  const [packageName, scriptPath] = LOCAL_P5_SCRIPTS[key];
  return join(packageRootFor(packageName), scriptPath);
}

function localP5ScriptKeyForUrl(rawUrl: string): LocalP5ScriptKey | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== 'cdnjs.cloudflare.com') return null;

    const pathname = url.pathname.toLowerCase();
    if (!pathname.includes('/p5.js/')) return null;

    // cdnjs has published p5.sound both at the version root and under
    // /addons; keep both forms offline-safe for generated sketches.
    if (
      pathname.endsWith('/p5.sound.min.js')
      || pathname.endsWith('/p5.sound.js')
      || pathname.endsWith('/addons/p5.sound.min.js')
      || pathname.endsWith('/addons/p5.sound.js')
    ) {
      return 'p5Sound';
    }
    if (pathname.endsWith('/p5.min.js') || pathname.endsWith('/p5.js')) {
      return 'p5';
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Browser renderers use CDN URLs in generated HTML for customer portability.
 * In local QA, fulfill those same p5 URLs from the installed package so render
 * proof does not silently depend on external network availability.
 */
export async function getLocalP5ScriptForUrl(rawUrl: string): Promise<string | null> {
  const key = localP5ScriptKeyForUrl(rawUrl);
  if (!key) return null;

  let script = cachedScripts.get(key);
  if (!script) {
    script = key === 'p5Sound' ? Promise.resolve(LOCAL_P5_SOUND_SHIM) : readFile(localScriptPathFor(key), 'utf8');
    cachedScripts.set(key, script);
  }

  return script;
}
