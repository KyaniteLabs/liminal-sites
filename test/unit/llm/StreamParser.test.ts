import { describe, it, expect } from 'vitest';
import {
  parseOpenAIStream,
  parseAnthropicStream,
  parseOllamaStream,
  parseThinkTagStream,
} from '../../../src/llm/StreamParser.js';

// ── Helpers ──

function toStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

/** Collect all events from an async generator into an array. */
async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of gen) {
    items.push(item);
  }
  return items;
}

// ── parseOpenAIStream ──

describe('parseOpenAIStream', () => {
  it('yields content events from SSE delta.content', async () => {
    const sse = 'data: {"choices":[{"delta":{"content":"hello"}}]}\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([{ type: 'content', content: 'hello' }, { type: 'done' }]);
  });

  it('yields done on [DONE] sentinel', async () => {
    const sse = 'data: [DONE]\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([{ type: 'done' }]);
  });

  it('yields thinking from delta.reasoning_content', async () => {
    const sse =
      'data: {"choices":[{"delta":{"reasoning_content":"let me think"}}]}\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([
      { type: 'thinking', content: 'let me think' },
      { type: 'done' },
    ]);
  });

  it('yields thinking from delta.reasoning_details', async () => {
    const sse =
      'data: {"choices":[{"delta":{"reasoning_details":[{"text":"step 1"},{"text":"step 2"}]}}]}\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([
      { type: 'thinking', content: 'step 1' },
      { type: 'thinking', content: 'step 2' },
      { type: 'done' },
    ]);
  });

  it('silently skips malformed JSON lines', async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: {bad json\n\ndata: [DONE]\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([
      { type: 'content', content: 'ok' },
      { type: 'done' },
    ]);
  });

  it('handles multiple tokens in sequence', async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"hel"}}]}\n\ndata: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([
      { type: 'content', content: 'hel' },
      { type: 'content', content: 'lo' },
      { type: 'done' },
    ]);
  });

  it('yields done at end of stream when no [DONE] sentinel', async () => {
    const sse = 'data: {"choices":[{"delta":{"content":"end"}}]}\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    const last = events[events.length - 1];
    expect(last).toEqual({ type: 'done' });
  });

  it('skips lines that do not start with "data: "', async () => {
    const sse = 'event: ping\ndata: {"choices":[{"delta":{"content":"x"}}]}\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    expect(events).toEqual([{ type: 'content', content: 'x' }, { type: 'done' }]);
  });

  it('skips reasoning_details entries with no text', async () => {
    const sse =
      'data: {"choices":[{"delta":{"reasoning_details":[{"type":"summary"}]}}]}\n\ndata: [DONE]\n\n';
    const events = await collect(parseOpenAIStream(toStream(sse)));

    // No thinking event yielded because detail.text is falsy
    expect(events).toEqual([{ type: 'done' }]);
  });
});

// ── parseAnthropicStream ──

describe('parseAnthropicStream', () => {
  it('yields thinking from content_block_delta with thinking block', async () => {
    const sse = [
      'data: {"type":"content_block_start","content_block":{"type":"thinking"}}',
      'data: {"type":"content_block_delta","delta":{"thinking":"reasoning here"}}',
      'data: {"type":"message_stop"}',
    ].join('\n\n') + '\n\n';

    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done, then the final yield at end of stream adds another done
    expect(events).toEqual([
      { type: 'thinking', content: 'reasoning here' },
      { type: 'done' },
      { type: 'done' },
    ]);
  });

  it('yields content from content_block_delta with text block', async () => {
    const sse = [
      'data: {"type":"content_block_start","content_block":{"type":"text"}}',
      'data: {"type":"content_block_delta","delta":{"text":"hello world"}}',
      'data: {"type":"message_stop"}',
    ].join('\n\n') + '\n\n';

    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done, then the final yield at end of stream adds another done
    expect(events).toEqual([
      { type: 'content', content: 'hello world' },
      { type: 'done' },
      { type: 'done' },
    ]);
  });

  it('yields done with usage from message_stop', async () => {
    const sse = [
      'data: {"type":"message_stop","message":{"usage":{"input_tokens":25,"output_tokens":50}}}',
    ].join('\n\n') + '\n\n';

    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done with usage, then the final yield adds another done
    expect(events).toEqual([
      {
        type: 'done',
        usage: { inputTokens: 25, outputTokens: 50 },
      },
      { type: 'done' },
    ]);
  });

  it('yields done without usage when no usage present', async () => {
    const sse = 'data: {"type":"message_stop"}\n\n';
    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done, then the final yield adds another done
    expect(events).toEqual([{ type: 'done' }, { type: 'done' }]);
  });

  it('handles interleaved thinking and text blocks', async () => {
    const sse = [
      'data: {"type":"content_block_start","content_block":{"type":"thinking"}}',
      'data: {"type":"content_block_delta","delta":{"thinking":"hmm"}}',
      'data: {"type":"content_block_start","content_block":{"type":"text"}}',
      'data: {"type":"content_block_delta","delta":{"text":"answer"}}',
      'data: {"type":"message_stop"}',
    ].join('\n\n') + '\n\n';

    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done, then the final yield adds another done
    expect(events).toEqual([
      { type: 'thinking', content: 'hmm' },
      { type: 'content', content: 'answer' },
      { type: 'done' },
      { type: 'done' },
    ]);
  });

  it('ignores thinking delta when currentBlockType is text', async () => {
    const sse = [
      'data: {"type":"content_block_start","content_block":{"type":"text"}}',
      'data: {"type":"content_block_delta","delta":{"thinking":"should be ignored"}}',
      'data: {"type":"content_block_delta","delta":{"text":"actual content"}}',
      'data: {"type":"message_stop"}',
    ].join('\n\n') + '\n\n';

    const events = await collect(parseAnthropicStream(toStream(sse)));

    // message_stop yields done, then the final yield adds another done
    expect(events).toEqual([
      { type: 'content', content: 'actual content' },
      { type: 'done' },
      { type: 'done' },
    ]);
  });

  it('yields done at end of stream when no message_stop', async () => {
    const sse = 'data: {"type":"content_block_delta","delta":{"text":"partial"}}\n\n';
    const events = await collect(parseAnthropicStream(toStream(sse)));

    const last = events[events.length - 1];
    expect(last).toEqual({ type: 'done' });
  });

  it('handles [DONE] sentinel', async () => {
    const sse = 'data: [DONE]\n\n';
    const events = await collect(parseAnthropicStream(toStream(sse)));

    expect(events).toEqual([{ type: 'done' }]);
  });
});

// ── parseOllamaStream ──

describe('parseOllamaStream', () => {
  it('yields content from response field', async () => {
    const line = '{"response":"token","done":false}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([{ type: 'content', content: 'token' }, { type: 'done' }]);
  });

  it('yields thinking from thinking field', async () => {
    const line = '{"thinking":"reasoning","done":false}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([
      { type: 'thinking', content: 'reasoning' },
      { type: 'done' },
    ]);
  });

  it('yields done with usage when done is true', async () => {
    const line = '{"response":"","done":true,"eval_count":50,"prompt_eval_count":10}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([
      {
        type: 'done',
        usage: { inputTokens: 10, outputTokens: 50 },
      },
    ]);
  });

  it('yields done without usage when done is true and no eval_count', async () => {
    const line = '{"response":"","done":true}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([{ type: 'done', usage: undefined }]);
  });

  it('handles multiple tokens before done', async () => {
    const lines =
      '{"response":"hel","done":false}\n{"response":"lo","done":false}\n{"response":"","done":true}\n';
    const events = await collect(parseOllamaStream(toStream(lines)));

    expect(events).toEqual([
      { type: 'content', content: 'hel' },
      { type: 'content', content: 'lo' },
      { type: 'done' },
    ]);
  });

  it('yields thinking before content on same line', async () => {
    const line = '{"thinking":"pondering","response":"answer","done":false}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([
      { type: 'thinking', content: 'pondering' },
      { type: 'content', content: 'answer' },
      { type: 'done' },
    ]);
  });

  it('skips blank lines', async () => {
    const lines = '\n{"response":"x","done":false}\n\n{"response":"","done":true}\n';
    const events = await collect(parseOllamaStream(toStream(lines)));

    expect(events).toEqual([
      { type: 'content', content: 'x' },
      { type: 'done' },
    ]);
  });

  it('defaults prompt_eval_count to 0 when missing', async () => {
    const line = '{"response":"","done":true,"eval_count":30}\n';
    const events = await collect(parseOllamaStream(toStream(line)));

    expect(events).toEqual([
      {
        type: 'done',
        usage: { inputTokens: 0, outputTokens: 30 },
      },
    ]);
  });

  it('silently skips malformed JSON lines', async () => {
    const lines = 'not json\n{"response":"ok","done":false}\n{"response":"","done":true}\n';
    const events = await collect(parseOllamaStream(toStream(lines)));

    expect(events).toEqual([
      { type: 'content', content: 'ok' },
      { type: 'done' },
    ]);
  });
});

// ── parseThinkTagStream ──

describe('parseThinkTagStream', () => {
  it('yields thinking then content from <think/> tags', async () => {
    // Parser looks for <think then > to open, </think then > to close
    // Standard HTML-style tags: <think ...>content</think ...>
    const input = '<think/>reasoning</think/>output';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'thinking', content: 'reasoning' },
      { type: 'content', content: 'output' },
      { type: 'done' },
    ]);
  });

  it('yields only content for text without tags', async () => {
    const input = 'just plain text';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'content', content: 'just plain text' },
      { type: 'done' },
    ]);
  });

  it('properly parses <think/> with standard angle bracket closing', async () => {
    // Parser: <think then > to open, </think then > to close
    const input = '<think >inner thought</think >final output';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'thinking', content: 'inner thought' },
      { type: 'content', content: 'final output' },
      { type: 'done' },
    ]);
  });

  it('flushes remaining buffer as thinking when inThinking is true at end', async () => {
    const input = '<think >unfinished reasoning';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'thinking', content: 'unfinished reasoning' },
      { type: 'done' },
    ]);
  });

  it('flushes remaining buffer as content when not inThinking at end', async () => {
    const input = '<think >reasoned</think >remaining text';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'thinking', content: 'reasoned' },
      { type: 'content', content: 'remaining text' },
      { type: 'done' },
    ]);
  });

  it('handles empty think tags', async () => {
    const input = '<think > </think >after';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'thinking', content: ' ' },
      { type: 'content', content: 'after' },
      { type: 'done' },
    ]);
  });

  it('handles content before think tag', async () => {
    const input = 'prefix<think >thought</think >suffix';
    const events = await collect(parseThinkTagStream(toStream(input)));

    expect(events).toEqual([
      { type: 'content', content: 'prefix' },
      { type: 'thinking', content: 'thought' },
      { type: 'content', content: 'suffix' },
      { type: 'done' },
    ]);
  });
});
