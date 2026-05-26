> Historical note (2026-05-26): This intake was captured before the KyaniteLabs consolidation. The canonical public repository is now `KyaniteLabs/liminal-sites`; old `Pushing-Squares/liminal-sites` references below are historical evidence, not current routing.

        # Factory intake for issue #17: Backprop: compose operator abort signals with provider timeouts

        Repository: `Pushing-Squares/liminal-sites`
        Category: `llm_fix`
        Source issue: `#17`

        ## User request

        ## Backprop from Liminal

While landing KyaniteLabs/liminal#513, a Codex review exposed an important cancellation pattern: racing a generation promise, or choosing `req.signal || AbortSignal.timeout(...)`, is not enough. Operator cancellation and provider timeout need to be composed into the actual transport `signal` so neither path disables the other.

## Why it matters

If a caller supplies an `AbortSignal`, provider code like `req.signal || AbortSignal.timeout(...)` skips the provider timeout entirely. If the wrapper returns early but the fetch/SDK request does not receive the abort signal, the operator sees `Generation stopped` while the model request can keep consuming capacity in the background.

## Current Liminal Sites surfaces to check

Read-only scan of `Pushing-Squares/liminal-sites` found this pattern in provider transports:

- `src/llm/providers/OllamaProvider.ts`
- `src/llm/providers/OpenRouterProvider.ts`
- `src/llm/providers/OpenAIProvider.ts`
- `src/llm/providers/AnthropicProvider.ts`
- `src/llm/providers/GoogleProvider.ts`
- `src/llm/providers/MiniMaxProvider.ts`

The service layer is already doing some good work: `test/tui-bridge/tui-bridge-no-chat-lane.test.ts` proves draft timeout aborts the observed generation signal. The missing broader contract is provider-level: every model transport should receive a signal that aborts when either the operator cancels or the provider timeout expires.

## Suggested fix

Introduce or reuse a tiny helper equivalent to Liminal's `combineAbortSignals(parentSignal, AbortSignal.timeout(timeoutMs))`, then replace provider `req.signal || AbortSignal.timeout(...)` choices with composed signals. Keep `AbortSignal.any` when available, with a small fallback for runtimes that lack it.

## Regression proof

Add a provider-level test that observes the `fetch`/SDK request signal and proves both paths abort it:

1. caller aborts the parent signal -> transport signal becomes aborted;
2. timeout fires -> same transport signal becomes aborted;
3. an in-flight request is not only raced at a wrapper layer.

Liminal-side evidence: KyaniteLabs/liminal#513, commit `c3d250a4`, merged as `d98c4b21015f857cff8d4c1b7e9aee864a0bc075`.

        ## Factory interpretation

        This issue was picked up by `issue-closer`, but no safe code edit was
        produced by the configured agent providers. The Factory is therefore
        converting the issue into an implementation contract instead of silently
        skipping it.

        ## Acceptance contract

        - Confirm the desired behavior from the issue title and body.
        - Identify the smallest implementation slice that can ship independently.
        - Add or update tests/proofs for that slice before merging implementation.
        - Keep credentials, local machine paths, and deployment secrets out of the repo.
        - Close or update the source issue when the implementation PR lands.

        ## Next Factory action

        Dispatch a repo worker against this contract. If the request is too broad,
        split it into smaller `agent-ready` issues with concrete acceptance checks.
