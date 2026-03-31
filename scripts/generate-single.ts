#!/usr/bin/env tsx
/**
 * Single Example Generator - Forces LLM usage (bypasses template generators)
 * Usage: tsx generate-single.ts <provider> <model> <domain>
 */

import { P5GeneratorLLM } from '../src/generators/p5/P5GeneratorLLM.js';
import { ShaderGenerator } from '../src/generators/glsl/ShaderGenerator.js';
import { ThreeGenerator } from '../src/generators/three/ThreeGenerator.js';
import { StrudelGenerator } from '../src/generators/strudel/StrudelGenerator.js';
import { mkdirSync, writeFileSync } from 'fs';
import { LLMClient } from '../src/llm/LLMClient.js';

const PROMPTS: Record<string, string> = {
  p5: `Create an animated p5.js sketch featuring colorful fireworks exploding in the night sky. Include particle physics, gravity, and fading trails.`,
  
  glsl: `Create a GLSL fragment shader that renders a mesmerizing plasma effect with animated color shifts. Include noise functions and time-based animation.`,
  
  three: `Create a Three.js scene with a rotating wireframe torus knot that changes colors. Include orbit controls and animated lighting.`,
  
  strudel: `Create a Strudel pattern that plays a techno beat with kick, snare, hi-hat, and a bassline. Use pattern functions and effects.`,
  
  hydra: `Create a Hydra video synth patch with feedback effects, color shifting, and geometric patterns. Make it visually striking.`,
  
  remotion: `Create a Remotion video component that animates text typing with a cursor blink, then fades in a subtitle.`
};

const MODEL_CONFIGS: Record<string, { baseUrl: string; apiKeyEnv: string; modelId?: string }> = {
  'MiniMax-M2.7': { baseUrl: 'https://api.minimax.io/v1', apiKeyEnv: 'MINIMAX_API_KEY' },
  'MiniMax-M2.5': { baseUrl: 'https://api.minimax.io/v1', apiKeyEnv: 'MINIMAX_API_KEY' },
  'MiniMax-M2.1': { baseUrl: 'https://api.minimax.io/v1', apiKeyEnv: 'MINIMAX_API_KEY' },
  'Qwen3.5-9B': { baseUrl: 'http://localhost:1234/v1', apiKeyEnv: 'LMSTUDIO_API_KEY', modelId: 'qwen3.5-9b' },
  'Qwen3-Coder-40B': { baseUrl: 'http://localhost:1234/v1', apiKeyEnv: 'LMSTUDIO_API_KEY', modelId: 'qwen3-coder-next-reap-40b-a3b-i1' },
  'Gemma3-4B': { baseUrl: 'http://localhost:11434/v1', apiKeyEnv: 'OLLAMA_API_KEY', modelId: 'gemma3:4b' },
  'Kimi-K2.5': { baseUrl: 'http://localhost:11434/v1', apiKeyEnv: 'OLLAMA_API_KEY', modelId: 'kimi-k2.5:cloud' }
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

async function generateWithLLM(prompt: string, domain: string, llmConfig: { baseUrl: string; apiKey: string; model: string; modelId?: string }): Promise<string> {
  // Create LLM client with explicit config (use modelId if available)
  const llm = new LLMClient({
    baseUrl: llmConfig.baseUrl,
    apiKey: llmConfig.apiKey,
    model: llmConfig.modelId || llmConfig.model,
    temperature: 0.7,
    maxTokens: 4000
  });
  
  // Disable cache to ensure fresh generation per model
  llm.disableCache();
  
  switch (domain) {
    case 'p5': {
      const gen = new P5GeneratorLLM(llm);
      const result = await gen.generate(prompt);
      return result;
    }
    case 'glsl': {
      const gen = new ShaderGenerator();
      // Override the LLM client to use our config
      (gen as any).llm = llm;
      return gen.generate(prompt);
    }
    case 'three': {
      const gen = new ThreeGenerator();
      (gen as any).llm = llm;
      return gen.generate(prompt);
    }
    case 'strudel': {
      const gen = new StrudelGenerator(llm);
      return gen.generate(prompt);
    }
    default:
      // Fallback to P5 for other domains
      const gen = new P5GeneratorLLM(llm);
      const result = await gen.generate(prompt);
      return result;
  }
}

async function main() {
  const [provider, modelName, domain] = process.argv.slice(2);
  
  if (!provider || !modelName || !domain) {
    console.error('Usage: tsx generate-single.ts <provider> <model> <domain>');
    process.exit(1);
  }
  
  const config = MODEL_CONFIGS[modelName];
  if (!config) {
    console.error(`Unknown model: ${modelName}`);
    process.exit(1);
  }
  
  const basePrompt = PROMPTS[domain];
  if (!basePrompt) {
    console.error(`Unknown domain: ${domain}`);
    process.exit(1);
  }
  
  // Add model-specific cache buster
  const prompt = `${basePrompt}\n\n[Model: ${modelName}]`;
  
  const apiKey = process.env[config.apiKeyEnv] || 'dummy-key';
  const outputDir = `examples/generated/${provider}/${sanitizeFilename(modelName)}/${domain}`;
  
  // Set environment variables for LLMClient.isConfigured() check
  process.env.LIMINAL_LLM_BASE_URL = config.baseUrl;
  process.env.LIMINAL_LLM_API_KEY = apiKey;
  process.env.LIMINAL_LLM_MODEL = modelName;
  
  try {
    const startTime = Date.now();
    
    console.error(`Generating ${domain} with ${modelName}...`);
    
    const code = await generateWithLLM(prompt, domain, {
      baseUrl: config.baseUrl,
      apiKey,
      model: modelName,
      modelId: config.modelId
    });
    
    const duration = Date.now() - startTime;
    
    // Save the generated code
    mkdirSync(`${outputDir}/2026-03-31--default`, { recursive: true });
    writeFileSync(`${outputDir}/2026-03-31--default/v1.js`, code);
    
    const output = {
      provider,
      model: modelName,
      domain,
      success: true,
      duration,
      codeLength: code.length,
      outputDir
    };
    
    console.log(`RESULT: ${JSON.stringify(output)}`);
    process.exit(0);
    
  } catch (error) {
    const output = {
      provider,
      model: modelName,
      domain,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
    console.error(`RESULT: ${JSON.stringify(output)}`);
    process.exit(1);
  }
}

main();
