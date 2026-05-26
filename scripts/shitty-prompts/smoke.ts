import path from 'path';
import { ShittyPromptsStore } from '../../src/sites/shittyPrompts/ShittyPromptsStore.js';
import { ShittyPromptsEngine } from '../../src/sites/shittyPrompts/ShittyPromptsEngine.js';
import { PromptPairGenerator, type LLMClient } from '../../src/sites/shittyPrompts/PromptPairGenerator.js';
import { FrameGenerator } from '../../src/sites/shittyPrompts/FrameGenerator.js';

const args = process.argv.slice(2);
const pairsIdx = args.indexOf('--pairs');
const pairCount = pairsIdx !== -1 ? parseInt(args[pairsIdx + 1], 10) : 6;
const model = args[args.indexOf('--model') + 1] ?? 'gemma3:4b';

const ollamaClient: LLMClient = {
  async complete(prompt: string): Promise<string> {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
    const data = await res.json() as { response: string };
    return data.response;
  },
};

const storeDir = path.resolve(process.env['SHITTY_PROMPTS_STORE'] ?? path.join(process.cwd(), '.liminal-sites/shitty-prompts'));
const store = new ShittyPromptsStore(storeDir);
const engine = new ShittyPromptsEngine({
  store,
  pairGen: new PromptPairGenerator(ollamaClient),
  frameGen: new FrameGenerator(),
});

console.log(`Generating ${pairCount} pairs with model ${model}...`);
const run = await engine.run({ pairCount, provider: 'ollama', model });
console.log(`Run ${run.runId}: ${run.pairCount} pairs, ${run.frameCount} frames generated`);
console.log(`Candidates stored in: ${storeDir}/pairs/`);
