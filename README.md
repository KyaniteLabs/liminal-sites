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
- `origin`: `https://github.com/Pushing-Squares/liminal-sites.git`
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

## Development

The inherited commands still work while the product is carved out. The canonical visible surfaces remain Studio for the GUI cockpit and Bubble Tea for the operator cockpit:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm gui
pnpm tui
pnpm proof:living-sites-operator
pnpm proof:living-sites-full-liminal
pnpm proof:living-sites-reliability
pnpm proof:living-sites-sweep
```

The inherited CLI entrypoint remains available as `liminal`; this package also exposes `liminal-sites` and `lsites` while the user-facing command shape is finalized.

## Living Site Operator Path

The first product slice is executable now:

```bash
pnpm build
pnpm gui
liminal-sites-mcp
```

Studio includes a Living Site tab for profile creation, real website ingestion, screenshot-backed design receipts, runtime-skin generation, aesthetic comparison, preference memory, evolution, Full Liminal creative composition, preview mounting, export, installable deployment packages, saved-site dashboard history, rollback receipts, operator runbooks with readiness and recovery checks, and repo-patch planning. The MCP server exposes the same operator path through tools and resources for external agents and local MCP clients.

The full vertical-slice handoff is documented in [docs/LIVING_SITES_VERTICAL_SLICES.md](docs/LIVING_SITES_VERTICAL_SLICES.md). Start collaborators with [docs/COLLABORATOR_QUICKSTART.md](docs/COLLABORATOR_QUICKSTART.md) for usage instructions, capabilities, and current development state, then use [docs/LIVING_SITES_DEMO_GALLERY.md](docs/LIVING_SITES_DEMO_GALLERY.md) for the curated demo talk track. Run `pnpm proof:living-sites-full-liminal` for the strict before/after website dogfood proof, `pnpm proof:living-sites-reliability` for a multi-scenario reliability gallery, and `pnpm proof:living-sites-sweep` for the local visual, MCP, docs, and handoff receipt before calling the product journey complete.

## Ready-to-show market path

Liminal Sites inherits the broader Liminal launch surface while specializing it for websites. A human can still show the base creative engine with:

```bash
liminal "a luminous blue-green particle garden"
pnpm run proof:live-provider-smoke -- --provider=glm --timeout-ms=120000
pnpm exec tsx scripts/proof/creative-copilot-proof.ts --provider=glm --all --timeout-ms=120000 --max-tokens=4096 --out=.omx/proof/market-all-domain-sweep
liminal market status
```

Launch creative domains remain: p5.js, SVG, GLSL, Three.js, Hydra, Strudel, Tone.js, Revideo, HyperFrames, ASCII, Kinetic, TextGen.

Market shorthand: p5, SVG, GLSL, Three.js, Hydra, Strudel, Tone.js, Revideo, HyperFrames, ASCII, Kinetic, and TextGen.

HyperFrames saves HTML/GSAP composition artifacts, and Revideo code artifacts are generated; native rendered video/still capture is a separate follow-up.

Creative review language stays distinct: CreativeBoard critique means the 3-agent board (Minimalist / Expressionist / Technician). Runtime swarm language means 5 default runtime personas (Kai / Nova / Rex / Sam / Max). Five default personas (Kai, Nova, Rex, Sam, Max) generate in parallel.
