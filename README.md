# Liminal Sites

[Public landing page](https://kyanitelabs.github.io/liminal-sites/) | [GitHub repository](https://github.com/KyaniteLabs/liminal-sites) | [AI discovery file](llms.txt)

> Living website evolution for people who want a site that can keep learning after launch.

Liminal Sites turns the Liminal creative engine toward websites. It helps an operator ingest a real site or brand brief, generate reviewable design directions, preview before-and-after states, remember taste decisions, and export either a runtime skin or a repo-native patch plan.

This is the official public KyaniteLabs repository for Liminal Sites. The canonical remote is:

```text
https://github.com/KyaniteLabs/liminal-sites.git
```

## What It Does

- Creates site profiles from URLs, local paths, brand briefs, constraints, and stack hints.
- Generates visual directions with design tokens, CSS, optional JavaScript, screenshots, and receipts.
- Lets operators compare variants, save preferences, rollback, and keep a visible decision history.
- Exports runtime skin packages for safer adoption before source-code edits.
- Plans repo-native website patches when the owner wants code changes instead of an injected skin.
- Exposes the operator path through Studio, CLI commands, proof scripts, and the Liminal Sites MCP server.

## Product Modes

| Mode | Best for | Output |
| --- | --- | --- |
| Runtime Skin Mode | Fast, reversible site refreshes | `liminal-skin.css`, optional JS, receipts, install notes |
| Repo-Native PR Mode | Durable design-system evolution | Branch/patch plan, verification checklist, PR-ready handoff |
| Operator Dashboard | Repeated site work | Profiles, variants, preferences, saved runs, rollback receipts |
| MCP Mode | Agent-driven operation | Tools/resources for external agents and local MCP clients |

## Quick Start

```bash
pnpm install
pnpm build
pnpm gui
pnpm tui
```

Then open the Living Site tab in Studio. Use `pnpm tui` for the Bubble Tea operator cockpit. For the MCP surface:

```bash
liminal-sites-mcp
```

Proof commands for the current operator path:

```bash
pnpm proof:living-sites-operator
pnpm proof:living-sites-full-liminal
pnpm proof:living-sites-reliability
pnpm proof:living-sites-sweep
```

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

## Relationship To Liminal Core

Liminal Sites keeps the inherited Liminal engine where it helps: generation routing, provider truth, preview rendering, evaluation, taste learning, filesystem persistence, and workbench telemetry. Website-specific product work stays here. Shared engine fixes should be considered for backport to [KyaniteLabs/liminal](https://github.com/KyaniteLabs/liminal).

See [docs/BACKPORT_POLICY.md](docs/BACKPORT_POLICY.md).

## User-Facing Docs

- [Public landing page](https://kyanitelabs.github.io/liminal-sites/)
- [Collaborator quickstart](docs/COLLABORATOR_QUICKSTART.md)
- [Vertical slices](docs/LIVING_SITES_VERTICAL_SLICES.md)
- [Demo gallery](docs/LIVING_SITES_DEMO_GALLERY.md)
- [Backport policy](docs/BACKPORT_POLICY.md)

## AI Discovery

[`llms.txt`](llms.txt) gives AI assistants and search crawlers a compact summary of the product, public URLs, and best-fit keywords.

Best-fit searches: AI website design agent, living website engine, generative web design, website evolution tool, runtime skin generator, AI design-system patching, MCP website tools, Liminal Sites.

## Development Notes

The inherited `liminal` CLI remains available while this product repo specializes around websites. This package also exposes `liminal-sites`, `lsites`, and `liminal-sites-mcp`.

Current verification starts with:

```bash
pnpm check:doc-links
pnpm typecheck
pnpm proof:living-sites-operator
```

---

## Part of KyaniteLabs

More from [KyaniteLabs](https://kyanitelabs.tech). Related projects:

- **[liminal](https://github.com/KyaniteLabs/liminal)** — AI creative-coding studio (p5.js, GLSL, Three.js)
- **[Elixis](https://github.com/KyaniteLabs/Elixis)** — local-first AI pattern-synthesis engine for ideas
- **[Innerscape](https://github.com/KyaniteLabs/Innerscape)** — personal-growth OS: journaling & reflection

→ More at **[kyanitelabs.tech](https://kyanitelabs.tech)**
