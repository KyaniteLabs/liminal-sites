> Historical note (2026-05-26): This intake was captured before the KyaniteLabs consolidation. The canonical public repository is now `KyaniteLabs/liminal-sites`; old `Pushing-Squares/liminal-sites` references below are historical evidence, not current routing.

        # Factory intake for issue #23: Show visible progress for long-running local generation

        Repository: `Pushing-Squares/liminal-sites`
        Category: `llm_fix`
        Source issue: `#23`

        ## User request

        ## Context

Liminal PR https://github.com/KyaniteLabs/liminal/pull/523 captured a transferable UX rule for long-running local/model-backed generation. When generation is slow or backed by a local model/provider, the main user-visible surface needs to prove that the app is still alive.

## Transferable learning

Long-running local/model-backed generation should show, in the main operator-facing UI rather than only in logs:

- A human-visible “still working” state
- Elapsed time
- Provider/model or backend truth
- Attempt and timeout budget
- A nearby cancel/stop recourse

## Scope note

This is not a mobile-runtime claim. The learning is about desktop/resizable UI operator UX: when the surface can be resized or the user is waiting at a desktop app/page, the visible state should stay honest, inspectable, and stoppable.

## Why it matters

Without this, a slow generation can look frozen even when the backend is doing real work. Logs may help developers, but the person operating the UI needs the same core truth close to the place where they are waiting.

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
