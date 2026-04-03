/**
 * ConversationState - Per-provider multi-turn conversation state
 *
 * Handles provider-specific requirements for multi-turn conversations:
 * - Anthropic: Must resend thinking_blocks with each request
 * - OpenAI o-series: Uses previous_response_id for server-side state
 * - Others: Stateless, no special handling
 */

export interface AnthropicThinkingBlock {
  type: 'thinking';
  thinking: string;
  signature?: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  /** Anthropic-specific: thinking blocks from this turn */
  thinkingBlocks?: AnthropicThinkingBlock[];
  /** OpenAI-specific: response ID for server-side multi-turn */
  responseId?: string;
  /** Timestamp of this turn */
  timestamp: number;
}

export class ConversationState {
  private turns: ConversationTurn[] = [];
  private systemPrompt: string | null = null;

  /** Set the system prompt for this conversation */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  /** Add a user message */
  addUserMessage(content: string): void {
    this.turns.push({ role: 'user', content, timestamp: Date.now() });
  }

  /** Add an assistant response with optional provider-specific state */
  addAssistantResponse(content: string, extras?: {
    thinkingBlocks?: AnthropicThinkingBlock[];
    responseId?: string;
  }): void {
    this.turns.push({
      role: 'assistant',
      content,
      thinkingBlocks: extras?.thinkingBlocks,
      responseId: extras?.responseId,
      timestamp: Date.now(),
    });
  }

  /** Get messages formatted for Anthropic API (includes thinking blocks) */
  getAnthropicMessages(): Array<{ role: string; content: unknown }> {
    return this.turns.map(turn => {
      if (turn.role === 'assistant' && turn.thinkingBlocks?.length) {
        // Anthropic requires resending thinking_blocks as content blocks
        const blocks: unknown[] = [
          ...turn.thinkingBlocks.map(b => ({
            type: 'thinking',
            thinking: b.thinking,
            ...(b.signature ? { signature: b.signature } : {}),
          })),
          { type: 'text', text: turn.content },
        ];
        return { role: 'assistant', content: blocks };
      }
      return { role: turn.role, content: turn.content };
    });
  }

  /** Get messages formatted for OpenAI-compatible APIs */
  getOpenAIMessages(): Array<{ role: string; content: string }> {
    return this.turns.map(turn => ({
      role: turn.role,
      content: turn.content,
    }));
  }

  /** Get the OpenAI previous_response_id for o-series models */
  getPreviousResponseId(): string | null {
    // Find the last assistant turn with a responseId
    for (let i = this.turns.length - 1; i >= 0; i--) {
      if (this.turns[i].responseId) {
        return this.turns[i].responseId!;
      }
    }
    return null;
  }

  /** Get messages in generic format */
  getMessages(): Array<{ role: string; content: string }> {
    return this.getOpenAIMessages();
  }

  /** Get the system prompt */
  getSystemPrompt(): string | null {
    return this.systemPrompt;
  }

  /** Get conversation length */
  get length(): number {
    return this.turns.length;
  }

  /** Clear conversation state */
  clear(): void {
    this.turns = [];
    this.systemPrompt = null;
  }

  /** Get total token estimate (rough: chars / 4) */
  get estimatedTokens(): number {
    const totalChars = this.turns.reduce((sum, t) => sum + t.content.length, 0);
    return Math.ceil(totalChars / 4);
  }
}
