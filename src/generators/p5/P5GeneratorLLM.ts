import { LLMClient, LLMConfig } from '../../llm/LLMClient.js';

export interface P5GeneratorOptions {
  maxIterations?: number;
  temperature?: number;
}

export class P5GeneratorLLM {
  private llm: LLMClient;

  constructor(llmConfig?: Partial<LLMConfig>, _options?: P5GeneratorOptions) {
    this.llm = new LLMClient(llmConfig);
  }

  async generate(prompt: string, _options?: P5GeneratorOptions): Promise<string> {
    // If LLM is not configured, fall back to template-based generation
    if (!LLMClient.isConfigured()) {
      return this.generateTemplate(prompt);
    }

    try {
      // Use LLM to generate creative p5.js code
      const systemPrompt = `You are an expert creative coding assistant specializing in p5.js.
Generate valid, creative p5.js sketch code based on the user's description.

Rules:
1. Return ONLY valid JavaScript code for p5.js (no markdown, no explanations)
2. Include setup() and draw() functions
3. Use creative colors, animations, and effects that match the prompt
4. Add comments explaining key parts
5. Ensure code is self-contained and runnable
6. Canvas size: use createCanvas(800, 600) or appropriate size`;

      const userPrompt = "Create a p5.js sketch: " + prompt;
      const llmResponse = await this.llm.generateP5Sketch(systemPrompt, userPrompt);

      // If LLM returns empty code, fall back to templates
      if (!llmResponse.code || llmResponse.code.trim() === '') {
        return this.generateTemplate(prompt);
      }

      return llmResponse.code;
    } catch (error) {
      // If LLM call fails, fall back to template-based generation
      return this.generateTemplate(prompt);
    }
  }

  private generateTemplate(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('particle')) {
      return this.particleTemplate();
    } else if (lowerPrompt.includes('galax') || lowerPrompt.includes('star') || lowerPrompt.includes('space')) {
      return this.galaxyTemplate();
    } else if (lowerPrompt.includes('cellular') || lowerPrompt.includes('automata')) {
      return this.cellularTemplate();
    } else if (lowerPrompt.includes('fract') || lowerPrompt.includes('fractal')) {
      return this.fractalTemplate();
    } else {
      return this.basicTemplate();
    }
  }

  private particleTemplate(): string {
    return `function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(20);
  const count = 100;
  for (let i = 0; i < count; i++) {
    fill(255, 100 + i * 1.5, 150 + i * 1);
    ellipse(Math.random() * width, Math.random() * height, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
}`;
  }

  private galaxyTemplate(): string {
    return `function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(5, 5, 15);
  translate(width / 2, height / 2);
  const count = 200;
  for (let i = 0; i < count; i++) {
    const angle = i * 0.1;
    const radius = i * 1.5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    fill(255, 255, 200);
    ellipse(x, y, 2, 2);
  }
}`;
  }

  private cellularTemplate(): string {
    return `function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(255);
  const cellSize = 10;
  for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
      if (Math.random() > 0.5) {
        fill(0);
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}`;
  }

  private fractalTemplate(): string {
    return `function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(255);
  drawCircle(width / 2, height / 2, 300);
}

function drawCircle(x, y, radius) {
  ellipse(x, y, radius);
  if (radius > 20) {
    drawCircle(x + radius / 2, y, radius / 2);
    drawCircle(x - radius / 2, y, radius / 2);
  }
}`;
  }

  private basicTemplate(): string {
    return `function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);
  fill(100, 150, 200);
  ellipse(width / 2, height / 2, 100, 100);
}`;
  }
}
