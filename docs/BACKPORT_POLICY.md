# Backport Policy

Liminal Sites is a full-history product clone of Liminal, not a dead-end fork.

## Remotes

- `origin`: `https://github.com/Pushing-Squares/liminal-sites.git`
- `upstream`: `https://github.com/KyaniteLabs/liminal.git`

## Classify Every Non-Trivial Change

Use this split before committing:

- **Liminal Sites only:** website profiles, runtime skins, site adapters, MCP tools, product branding, buyer-facing website workflows, and repo-native website patching.
- **Shared Liminal foundation:** generation orchestration, provider/runtime truth, render/preview stability, evaluation, taste learning, filesystem persistence, workbench telemetry, security gates, or tests that protect the inherited engine.

## Backport Flow

When a shared-foundation fix lands here:

1. Keep the Liminal Sites commit focused and tested.
2. Create or switch to a clean upstream Liminal worktree.
3. Cherry-pick the shared fix with `git cherry-pick -x`.
4. Remove any Liminal Sites-specific branding or product coupling.
5. Run the smallest verification command that proves the upstream claim.
6. Open a PR against `KyaniteLabs/liminal`.

## Commit Trailer

For shared fixes, include:

```text
Backport-to: liminal
```

For product-only changes, include:

```text
Backport-to: none
```

This keeps the fork healthy: product work can diverge, but engine fixes travel home.
