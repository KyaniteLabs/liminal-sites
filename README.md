# Liminal Sites

Liminal Sites is the dedicated repository for turning Liminal into a living website evolution product.

The product goal is simple:

> A website should not stay frozen after launch. Liminal Sites learns the owner's taste, generates visual directions, previews them safely, and turns the chosen direction into either a runtime skin or a reviewed source-code patch.

## Current State

This repo is a full-history clone of `KyaniteLabs/liminal`, seeded at:

```text
cd3084799f2f3a7ef286e644ac3a890eef029bf6
```

That history is intentional. Base Liminal is still evolving, and shared fixes discovered here should be propagated back upstream instead of trapped in this product fork.

## Repository Relationship

- `upstream`: `https://github.com/KyaniteLabs/liminal.git`
- future `origin`: `https://github.com/KyaniteLabs/liminal-sites.git`
- source lineage: full Git history is preserved, not snapshotted
- product boundary: this repo specializes the Liminal engine for living websites

## First Product Shape

Liminal Sites has two delivery modes:

1. **Runtime Skin Mode**
   Generate a reviewable CSS/JS skin that can be injected into an existing site without editing the source repo.

2. **Repo-Native PR Mode**
   Let Liminal inspect a website repo, evolve the design system, create a branch, run verification, and propose a PR with real code changes.

Runtime Skin Mode is the safer MVP. Repo-Native PR Mode is the deeper product.

## Backport Rule

If a change fixes shared Liminal foundations, such as generation routing, preview rendering, provider truth, evaluation, filesystem persistence, or workbench reliability, it should be considered for upstream Liminal.

See [docs/BACKPORT_POLICY.md](docs/BACKPORT_POLICY.md).

## Immediate Implementation Plan

See [docs/plans/2026-05-07-liminal-sites-repo-carveout.md](docs/plans/2026-05-07-liminal-sites-repo-carveout.md).

## Inherited Liminal Engine

While Liminal Sites carves out its product surface, the inherited Liminal engine retains its launch-verified capabilities:

- **12 creative domains** — p5.js, SVG, GLSL, Three.js, Hydra, Strudel, Tone.js, Revideo, HyperFrames, ASCII, Kinetic, TextGen
- **CreativeBoard critique** — 3-agent board (Minimalist / Expressionist / Technician) deliberates on output
- **Swarm generation** — 5 default runtime personas (Kai / Nova / Rex / Sam / Max) generate in parallel and vote on best

| Mode | Flag | Description |
|------|------|-------------|
| **Swarm** | `--use-swarm` | Five default personas (Kai, Nova, Rex, Sam, Max) generate in parallel and vote on best |

## Development

The inherited commands still work while the product is carved out:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm gui:dev
```

The inherited CLI entrypoint remains available as `liminal`; this package also exposes `liminal-sites` and `lsites` while the user-facing command shape is finalized.
