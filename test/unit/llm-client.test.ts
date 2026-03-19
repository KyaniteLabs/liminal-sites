/**
 * LLMClient tests - OpenAI-compatible API support
 *
 * Tests for LM Studio, Ollama Cloud, OpenAI, and Anthropic
 */

import { LLMClient } from '../../src/llm/LLMClient.js';

function createFetchStub(response: any) {
  let lastUrl: string = '';
  let lastOpts: RequestInit = {};
  const stub = (url: string, opts?: RequestInit) => {
    lastUrl = url;
    lastOpts = opts || {};
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    } as Response);
  };
  return { stub, getLastUrl: () => lastUrl, getLastOpts: () => lastOpts };
}

describe('LLMClient Configuration', () => {
  afterEach(() => {
    delete process.env.ATELIER_LLM_API_KEY;
    delete process.env.INCEPTION_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
  });

  test('should create client with LM Studio config (no API key)', () => {
    const client = new LLMClient({
      provider: 'inception',
      baseUrl: 'http://100.66.225.85:1234/v1',
      model: 'llama-3.2-3b',
      // apiKey intentionally omitted for LM Studio
    });

    // Client should be created successfully
    expect(client).toBeDefined();
  });

  test('should create client with Ollama Cloud config (with API key)', () => {
    const client = new LLMClient({
      provider: 'inception',
      baseUrl: 'https://api.ollama.com/v1',
      model: 'llama3.2',
      apiKey: 'ollama-cloud-key-123',
    });

    expect(client).toBeDefined();
  });

  test('isConfigured returns true when INCEPTION_API_KEY is set', () => {
    process.env.INCEPTION_API_KEY = 'sk-test-key';
    expect(LLMClient.isConfigured()).toBe(true);
  });

  test('isConfigured returns false when no API keys are set', () => {
    delete process.env.INCEPTION_API_KEY;
    delete process.env.ATELIER_LLM_API_KEY;
    expect(LLMClient.isConfigured()).toBe(false);
  });

  test('isConfigured returns true when OPENAI_API_KEY is set', () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    expect(LLMClient.isConfigured()).toBe(true);
    delete process.env.OPENAI_API_KEY;
  });

  test('isConfigured returns true when ANTHROPIC_API_KEY is set', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    expect(LLMClient.isConfigured()).toBe(true);
    delete process.env.ANTHROPIC_API_KEY;
  });
});

describe('LLMClient OpenAI (W0-L)', () => {
  const openAIResponse = {
    choices: [{ message: { content: 'function setup() { createCanvas(400,400); }\nfunction draw() {}' } }],
  };

  it('calls OpenAI URL with correct body/headers and parses response to code', async () => {
    const { stub, getLastUrl, getLastOpts } = createFetchStub(openAIResponse);
    global.fetch = stub as any;

    const client = new LLMClient({
      provider: 'openai',
      apiKey: 'sk-test-key',
      model: 'gpt-4o-mini',
    });

    const result = await client.generateP5Sketch('a circle');

    expect(result.success).toBe(true);
    expect(result.code).toContain('createCanvas');
    expect(getLastUrl()).toMatch(/openai\.com.*chat\/completions|.*\/v1\/chat\/completions/);
    const opts = getLastOpts();
    expect(opts?.method).toBe('POST');
    expect((opts?.headers as Record<string, string>)?.['Authorization']).toBe('Bearer sk-test-key');
    expect((opts?.headers as Record<string, string>)?.['Content-Type']).toBe('application/json');
    const body = JSON.parse((opts?.body as string) ?? '{}');
    expect(body.model).toBe('gpt-4o-mini');
    expect(body.messages).toBeDefined();
    expect(Array.isArray(body.messages)).toBe(true);
  });
});

describe('LLMClient Anthropic (W0-A)', () => {
  const anthropicResponse = {
    content: [{ type: 'text', text: 'function setup() { createCanvas(400,400); }' }],
  };

  it('calls Anthropic API with correct shape and parses response to code', async () => {
    const { stub, getLastUrl, getLastOpts } = createFetchStub(anthropicResponse);
    global.fetch = stub as any;

    const client = new LLMClient({
      provider: 'anthropic',
      apiKey: 'sk-ant-test',
      model: 'claude-3-5-haiku-20241022',
    });

    const result = await client.generateP5Sketch('a circle');

    expect(result.success).toBe(true);
    expect(result.code).toContain('createCanvas');
    expect(getLastUrl()).toMatch(/anthropic\.com.*messages|.*\/v1\/messages/);
    const body = JSON.parse((getLastOpts().body as string) ?? '{}');
    expect(body.model).toBeDefined();
    expect(body.messages).toBeDefined();
  });
});
