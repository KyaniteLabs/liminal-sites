# Liminal Sites

[Public landing page](https://kyanitelabs.github.io/liminal-sites/) | [Forgejo source](https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites) | [AI discovery file](llms.txt)

> Living website evolution for people who want a site that can keep learning after launch.

Liminal Sites helps an operator ingest a real site or brand brief, generate reviewable design directions, preview before-and-after states, remember taste decisions, and export either a runtime skin or a repo-native patch plan.

This is the official public KyaniteLabs repository for Liminal Sites. The canonical remote is:

```text
https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites.git
```

The standalone creative-coding studio surface is **Sinter**, published at [s1ntr.com](https://s1ntr.com/). Liminal Sites points to Sinter for creative-domain demos and keeps website-design work here.

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

## Website Design Path

The primary operator path is website-specific:

```bash
pnpm proof:living-sites-operator
pnpm proof:living-sites-full-liminal
pnpm proof:living-sites-reliability
pnpm proof:living-sites-sweep
```

Use these commands to prove that profiles, variants, runtime skins, receipts, and repo-native patch planning still work. Use [Sinter](https://s1ntr.com/) for standalone creative-code domain demos.

## Relationship To Sinter

Sinter is the creative-coding product at [s1ntr.com](https://s1ntr.com/). Liminal Sites is the website-design product: profiles, visual directions, runtime skins, operator workflows, preference memory, preview receipts, and repo-native site evolution.

Some inherited engine code remains while the repository is being narrowed. New work should pass the website-design pertinence gate in [docs/BACKPORT_POLICY.md](docs/BACKPORT_POLICY.md): adapt only what affects a website flow, and link to Sinter for standalone creative-code surfaces.

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

Some inherited CLI aliases remain for compatibility while this product repo specializes around websites. New work should enter through `src/sites/*`, the `proof:living-sites-*` commands, or `liminal-sites-mcp`.

Current verification starts with:

```bash
pnpm check:doc-links
pnpm typecheck
pnpm proof:living-sites-operator
```

---

## Part of KyaniteLabs

More from [KyaniteLabs](https://kyanitelabs.tech). Related projects:

- **[Sinter](https://s1ntr.com/)** — AI creative-coding studio (p5.js, SVG, GLSL, Three.js, Hydra, Strudel, Tone.js, Revideo, Kinetic, ASCII, TextGen)
- **[Elixis](https://github.com/KyaniteLabs/Elixis)** — local-first AI pattern-synthesis engine for ideas
- **[Innerscape](https://github.com/KyaniteLabs/Innerscape)** — personal-growth OS: journaling & reflection

→ More at **[kyanitelabs.tech](https://kyanitelabs.tech)**
