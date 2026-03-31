import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LLMClient } from '../../../src/llm/LLMClient.js';

// Mock console.warn to avoid cluttering test output
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});

describe('LLMClient Code Validation', () => {
  let client: LLMClient;

  beforeEach(() => {
    client = new LLMClient({ baseUrl: 'http://localhost:1234/v1', model: 'test-model' });
  });

  describe('parseResponse - code completeness', () => {
    it('parses complete code successfully', () => {
      const data = {
        choices: [{
          message: {
            content: '```javascript\nfunction test() { return 42; }\n```'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.success).toBe(true);
      expect(result.code).toContain('function test()');
    });

    it('warns for code with unclosed brace', () => {
      const data = {
        choices: [{
          message: {
            content: '```javascript\nfunction test() { return 42;\n```'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.isComplete).toBe(false);
    });

    it('warns for code with unclosed parentheses', () => {
      const data = {
        choices: [{
          message: {
            content: '```javascript\nfunction test((\n```'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.isComplete).toBe(false);
    });

    it('handles balanced brackets correctly', () => {
      const data = {
        choices: [{
          message: {
            content: '```javascript\nconst arr = [1, 2, [3, 4]];\n```'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.success).toBe(true);
      expect(result.isComplete).toBe(true);
    });
  });

  describe('parseResponse - edge cases', () => {
    it('handles empty response', () => {
      const data = { choices: [] };
      const result = client['parseResponse'](data);
      expect(result.code).toBe('');
      expect(result.success).toBe(false);
    });

    it('handles response without code block', () => {
      const data = {
        choices: [{
          message: {
            content: 'Just some text without code blocks'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.code).toBe('Just some text without code blocks');
    });

    it('handles response with reasoning content', () => {
      const data = {
        choices: [{
          message: {
            content: '```javascript\nfunction test() { return 42; }\n```',
            reasoning_content: 'Thinking about the code'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.success).toBe(true);
      expect(result.reasoning).toBe('Thinking about the code');
    });

    it('strips <think> tags from content', () => {
      const data = {
        choices: [{
          message: {
            content: '<think>Let me think about this...</think>\n```javascript\nfunction test() { return 42; }\n```'
          }
        }]
      };

      const result = client['parseResponse'](data);
      expect(result.success).toBe(true);
      expect(result.code).not.toContain('<think>');
      expect(result.code).toContain('function test()');
    });

    it('handles Ollama response format', () => {
      const data = {
        response: '```javascript\nfunction test() { return 42; }\n```'
      };

      const result = client['parseResponse'](data);
      expect(result.success).toBe(true);
      expect(result.code).toContain('function test()');
    });
  });
});
