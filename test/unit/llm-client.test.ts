/**
 * LLMClient tests - OpenAI-compatible API support
 *
 * Tests for LM Studio and Ollama Cloud compatibility
 */

import { LLMClient } from '../../src/llm/LLMClient.js';

describe('LLMClient Configuration', () => {
  afterEach(() => {
    delete process.env.ATELIER_LLM_API_KEY;
    delete process.env.INCEPTION_API_KEY;
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
});
