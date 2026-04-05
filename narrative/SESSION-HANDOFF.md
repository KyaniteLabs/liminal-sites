# Liminal — Session Handoff

## Who You're Working With
Simon Gonzalez de Cruz. Creative technologist, ex-Capital Group, building at PuenteWorks. Nocturnal, binge-worker, strategy-first systems thinker. Learns by doing at extreme velocity. Has zero patience for agents that build modules without wiring them end-to-end. If you build something, wire it up, test it, verify it actually works.

## Current Branch
`narrative/liminal-archaeology` — a narrative/ archaeology branch where all the session mining happened. The DEV agent also did GuardrailDashboard work here. Main branch is `main`.

## What Liminal Is
A creative coding CLI tool that generates p5.js, GLSL, Three.js, music (Tone.js/Strudel), video (Remotion), HTML, ASCII art through iterative self-improvement (the RalphLoop). Features 18 subsystems including Compost Mill (creative waste → seeds), aesthetic critics (color/layout/typography/sound), LIR (structured code analysis), chat interface, swarm generation, and a 3-phase Deterministic Guardrails Framework.

Liminal is a merger of three projects: Atelier (creative coding scaffold), hydra-creative-agent (multi-model collaborative AI), and an original shell. All converged on March 19, 2026.

**Stats:** 675 commits, 84K src LOC TypeScript (146K total), 397 source files, 308 test files. Built in 35 days (Feb 28 – Apr 4, 2026). 54% of new commits co-authored with Claude Opus 4.6.

## What Was Just Completed

### Archaeology Update (Apr 4, 2026)
Full update of archaeology system for 319 new commits (Apr 2-4):
- **Database**: archaeology.db updated to 675 Liminal commits, 7,440 cross-repo commits
- **3 new eras classified**:
  - Era 11: "The Architecture" (Apr 1-3, 253 commits) — Model-agnostic arch, composition system, dogfood campaign
  - Era 12: "The Swarm" (Apr 4 morning, 62 commits) — Agora protocol, Thompson Sampling, 0.68 fix, creative notation
  - Era 13: "The Pruning" (Apr 4 afternoon, 15 commits) — Dead module removal, ESLint zeroed, Logger migration

### Original Archaeology (Apr 2-3, 2026)
Full narrative archaeology of the project:

**Data files produced (all in `narrative/data/`):**
- `deep-era1.md` through `deep-era7-8.md` — deep analysis of each development era
- `commit-eras.json` — canonical 9-era periodization
- `telemetry-git.json` — git velocity, hourly patterns, hotspots, diffs
- `telemetry-sessions.json` — 1,148 human messages, frustration markers, intent analysis
- `telemetry-agents.json` — Kai vs Cursor vs Claude Code profiles
- `telemetry-codebase.json` — file growth, module emergence, LOC timeline
- `telemetry-cross-repo.json` — what else was happening during each Liminal era
- `telemetry-visualizations.json` — 9 chart-ready datasets
- `telemetry-github-full.json` — full commit history across all 50 repos
- `telemetry-repo-depth.json` — 50 repos classified by relationship to Liminal
- `github-commits.csv` — 7,059 commits across 50 repos
- `github-repos.csv` — 50 repos with metadata
- `human-messages.json` — 1,148 extracted user messages
- Plus raw narrative data (sessions, philosophy, hooks, plans, Remotion research)

**Root-level deliverable:**
- `SYNTHESIS.md` — the single definitive document merging everything (580 lines, ~50KB)

**Key findings from the archaeology:**
- Liminal has 5 ancestry layers: Liam AI persona (PRD author) → Nov 2025 creative labs (code donors) → voice-to-sculpture-app (audio DNA) → Atelier+Hydra+shell merger → concurrent ecosystem
- The "Quiet" (Mar 24-27, zero Liminal commits) had 25 commits across 6 other repos
- 52% of user messages were execution/verification, not creation
- "wire" appears 22 times — the philosophical core of the project
- Developer profile: nocturnal creative, binge worker, converts frustration into automation (26 hooks from 8 frustration categories)
- The Dogfood Gap — "system reports success" != "output actually works" — PARTIALLY RESOLVED (12-model campaign, 64.5% success)
- The 0.68 Dead Zone — RESOLVED (scoreReliable() wired into RalphLoop.ts:448. Coverage gate active.)

## Updated Project Stats
- **675 Liminal commits** (was 393 in original archaeology)
- **397 source files, 308 test files** (was 299/228)
- **84K src LOC, 146K total** (src + test)
- **13 eras** across 35 days (Feb 28 – Apr 4, 2026)
- **Peak daily: 195 commits on Apr 3** — largest single day ever
- **Peak hourly: 50 commits at midnight** (Era 11 marathon)

## Unresolved / Natural Next Steps
- **DONE:** `scoreReliable()` wired into `RalphLoop.ts:448`. Coverage gate now active.
- Landing page never achieved the vision (white squares, fake examples, broken animations)
- Live music coding (PRD Section 4.3) never started
- Remotion-to-blog pipeline researched but never built
- SelfReflectionEngine never integrated into RalphLoop
- CI/CD workflows still absent (removed Mar 19, not restored)
- Prompt content never audited against best practices
- Write-only archives (MAP-Elites/NoveltyArchive) still store but never retrieve for generation context
- Blog posts 1-2 and videos 2-3 remain as outlines only
- Repo organization agent still blocked (merge order: foamy → archaeology → kimi)
- Archaeology branch not merged to main

## Critical Rules
- ALWAYS wire everything end-to-end. No stubs. No "not yet implemented."
- The repo has jcodemunch and jdocmunch indexed — use them for code/doc navigation, not raw Grep/Glob
- Subagents run on glm-5.1 (text-only). Never assign vision tasks to subagents.
- Use firecrawl_search, exa, or brave_web_search — WebSearch is blocked by hook
- Use firecrawl_scrape, web-reader, or ref_read_url — WebFetch is blocked by hook
- Never push without explicit permission
- RalphLoop.ts is the heart of the system (modified 41 times)

## Memory Location
`~/.claude/projects/-Users-simongonzalezdecruz-workspaces-liminal/memory/MEMORY.md`
