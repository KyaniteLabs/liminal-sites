> Historical note (2026-05-26): This intake was captured before the KyaniteLabs consolidation. The canonical public repository is now `KyaniteLabs/liminal-sites`; old `Pushing-Squares/liminal-sites` references below are historical evidence, not current routing.

        # Factory intake for issue #18: Add no-artifact recovery for explicit shader generation

        Repository: `Pushing-Squares/liminal-sites`
        Category: `llm_fix`
        Source issue: `#18`

        ## User request

        ## Summary

Liminal PR #522 fixed a Studio GLSL/operator generation failure mode where explicit shader generation could time out or return a provider response with no usable artifact, leaving non-technical users stranded without a preview or clear recourse.

Transferable pattern: when the user explicitly asks for shader generation, retry true empty/no-artifact provider output once with a compact, domain-owned prompt that asks for raw runnable GLSL only. If the provider still returns a true no-artifact response, render a visibly marked local recovery shader so the operator gets a preview and can continue.

## Why this matters for liminal-sites

`liminal-sites` should not strand site operators or visitors in a blank/no-preview state when an explicit visual generation path fails without an artifact. The recovery should preserve momentum while staying honest about upstream failures.

This should be adapted narrowly: do not mask stop/abort intents, provider setup/auth/quota/model errors, or other actionable provider failures. Those should surface clearly so the operator can fix the real problem.

## Suggested adaptation checklist

- Identify explicit shader or visual-generation entrypoints in `liminal-sites` where provider output is expected to become a runnable preview/artifact.
- Detect only true empty/no-artifact signatures. Avoid matching generic wrappers such as `LLM failed before returning code`, because those can hide actionable provider failures.
- Add one compact retry prompt owned by the domain, asking for raw runnable GLSL or the equivalent artifact format only.
- If the retry still produces no artifact, render a visibly marked local recovery preview so users are not left with a dead panel.
- Exclude stop/abort and provider setup/auth/quota/model errors from fallback handling.
- Add regression coverage for: empty provider output retries, second empty output shows marked local recovery, actionable provider failures remain surfaced, and preview UI remains visible.

## References / evidence

- Liminal PR: https://github.com/KyaniteLabs/liminal/pull/522
- PR title: `Recover Studio GLSL when providers return no artifact`
- Merged: 2026-05-08T02:05:43Z
- Evidence after fix: exact Studio GLSL gauntlet passed with inline preview visible, preview panel visible, domain evidence present, no popups, and image output at 960x640.
- CI evidence after rerun: `agent-law`, `Blacksmith Probe`, `build-and-test`, `browser-and-e2e-smoke`, `validate-docs`, and `metadata-summary` all passed on the merged PR.

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
