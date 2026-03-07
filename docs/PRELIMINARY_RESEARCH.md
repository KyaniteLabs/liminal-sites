# Preliminary Research: Atelier Creative Coding Agent

**Date:** 2026-03-07  
**Status:** Full research (subagent-driven)  
**Purpose:** Deep research using the PRD’s cited sources to ground Atelier’s design—Ralph-Wiggum Loop, emergence and “computational life,” cellular automata (GNCA, Lenia), and the p5.js/evolutionary creative-coding ecosystem.

---

## Executive summary

This document consolidates **preliminary research** that was missing as a standalone artifact. The PRD (Appendix §12) had only brief bullets for “Research Sources” and “Related Work.” We expanded those into four research streams, each executed by dedicated subagents with web search and primary/secondary sources:

1. **Ralph-Wiggum Loop** (Geoffrey Huntley, Claude Code plugin) — The loop pattern (“same prompt, world changes”; completion promise; persistence in files, not context; monolithic single-agent) directly supports Atelier’s `RalphLoop`, `PromiseDetector`, and quality gates. Atelier is a creative-coding instance of Ralph with quality-based backpressure instead of test/build.

2. **Computational Life & Emergent Garden** (Blaise Agüera y Arcas et al. 2024; Emergent Garden) — The finding that self-replicating programs can emerge from simple interaction *without an explicit fitness function* gives philosophical and technical grounding for “the code evolves”: improvement can emerge from the iteration loop (prompt + context + evaluation) without a single hand-coded “optimize art” objective. Emergent Garden (particle sim and brand) reinforces “simple rules → complex outcome” and the same cultural space as Lenia/CA.

3. **Growing Neural CA & Lenia** (Google/Distill 2020; Bert Chan) — Lenia’s continuous CA (smooth state/time/space, kernels, 400+ species) is the named reference in the PRD for “Lenia-style” organic CA. GNCA adds differentiable, trainable morphogenesis from local cell communication. Together they justify Atelier’s `CellularAutomata` design (continuous, kernel-based, smooth rules) and a future “Neural CA” phase.

4. **p5.js & genetic/evolutionary creative coding** — p5.js is the standard target for AI-generated visual code (small API, live preview, p5js.ai, agent workflows). Genetic-js/GeneticsJS and IGA literature support the PRD’s “5 variations → user selects → mutate/crossover” phase; CreativeEvaluator can act as or supplement fitness; parameters of ParticleSystem/CellularAutomata are a natural genotype.

**Synthesis:** Atelier’s design is well grounded in these sources: same-prompt iteration (Ralph), emergence without global fitness (Computational Life, Emergent Garden), continuous/organic CA (Lenia, GNCA), and p5.js + evolutionary art (ecosystem + IGA). The detailed reports are in this repo (see “Location of detailed reports” below).

---

## How this research was done

- **Method:** Four parallel subagent tasks (generalPurpose/explore) with explicit instructions to use web search and return structured, citable sections.
- **Sources:** Primary (Huntley’s posts, arxiv/Google Research papers, Distill, Chan’s Lenia site, GitHub repos) and secondary (AlteredCraft, Emergent Mind, Human Layer, p5js.ai, genetic-js docs, IGA literature).
- **Outputs:** Four long-form reports (see below); this document is the consolidated entry point and synthesis.

---

## 1. Ralph-Wiggum Loop (Geoffrey Huntley, Claude Code plugin)

**Summary:** Ralph is “a technique” whose “purest form” is a Bash loop: `while :; do cat PROMPT.md | claude-code ; done` (Huntley, ghuntley.com/ralph). Key principles: “Sit on the loop, not in it”—design validation and observe the loop; don’t micromanage inside. Ralph is *monolithic* (single process, one task per loop), not multi-agent. Memory lives in the **filesystem** (files, git), not in the model’s context; each iteration can use a **fresh context window**. The official Claude Code plugin (`anthropics/claude-code`, `plugins/ralph-wiggum`) implements a stop-hook with `--completion-promise` and `--max-iterations` but keeps one session (no fresh context per iteration); Atelier does a new `generate()` per iteration with structured context injection, closer to “fresh context” discipline.

**Relevance to Atelier:** Same-prompt iteration, explicit completion token (`<promise>COMPLETE</promise>`), max-iterations and timeouts, persistence via ContextAccumulation + Gallery, single-agent loop—all align with Ralph. Quality gates (CreativeEvaluator) align with “sit on the loop” and backpressure; Atelier’s backpressure is creative quality, not tests/build.

**Detailed report:** [RALPH_WIGGUM_RESEARCH.md](RALPH_WIGGUM_RESEARCH.md) (in this directory).

---

## 2. Computational Life & Emergent Garden

**Summary:** *Computational Life: How Well-formed, Self-replicating Programs Emerge from Simple Interaction* (Agüera y Arcas et al., arXiv:2406.19108, 2024; Google Research) shows that on minimal computational substrates, **self-replicators often arise spontaneously** when random, non–self-replicating programs are placed in an environment **without any explicit fitness function**. Emergence comes from random interaction and self-modification; after that, more complex dynamics appear. For a creative coding agent: (1) No need for a single explicit fitness—local, contextual feedback and repeated interaction can suffice. (2) “Substrate” = prompt + context + evaluation + termination; design it so “simple interaction” tends to yield better code. (3) Same prompt + changing context is analogous to programs reading/writing in a shared space—iterative self-modification of the code artifact.

**Emergent Garden:** Two referents—(A) Max’s brand (emergentgarden.io) for emergent complexity and “weird programs”; (B) a Python+Pygame particle sim (e.g. gyanantaran/emergent-garden) with simple forces and no explicit fitness, thematically overlapping with Lenia/CA. Both support “simple rules → complex outcome” and the same tradition as Atelier’s CellularAutomata and ParticleSystem.

**Relevance to Atelier:** “The code evolves. You curate.” is philosophically grounded: improvement can emerge from the loop without a single “art quality” loss; the substrate (prompt, context shape, evaluation, termination) is what we design; the artifact is iteratively self-modified.

**Detailed report:** [RESEARCH_COMPUTATIONAL_LIFE_EMERGENT_GARDEN.md](RESEARCH_COMPUTATIONAL_LIFE_EMERGENT_GARDEN.md) (in this directory).

---

## 3. Growing Neural Cellular Automata & Lenia

**Summary:** **Growing Neural Cellular Automata** (Mordvintsev et al., Distill 2020; Google Research) is a differentiable CA that grows/regenerates patterns from a single seed; cells “communicate” via local perception (Sobel gradients + small MLP). No global controller—form emerges from the same local rule. **Lenia** (Bert Wang-Chak Chan) is continuous CA: state in [0,1], continuous time (Δt·G), continuous space (convolution with kernel K). Update: A(t+Δt) = [A + Δt·G(K∗A)]₀¹. Over 400 species; Orbium glider; self-replication, movement, colonies; evolutionary search (QD, IMGEP) for new patterns. The PRD explicitly cites “Lenia-style continuous CA” for Phase 1—smooth rules, organic patterns, growth/movement/reproduction.

**Relevance to Atelier:** `CellularAutomata.ts` already targets Lenia-style (continuous, kernels, radius, smoothing). Design implications: smooth rules, kernel/radius support, emergence over hand-authored rules, evolution/discovery (parameter sweeps, GA), and Phase 2 “Neural CA” as differentiable, trainable CA (GNCA-style).

**Detailed report:** [research_GNCA_Lenia.md](research_GNCA_Lenia.md) (in this directory).

---

## 4. p5.js & genetic/evolutionary creative coding

**Summary:** **p5.js** is the main web-friendly creative-coding stack: small API, instant browser preview, same language as Node/TS, and existing “AI + p5.js” tooling (p5js AI Cloud IDE, “Vibe Coding,” Claude Skills algorithmic-art workflow). It fits the “generate → render → evaluate” loop. **Genetic algorithms** in creative coding: genetic-js and GeneticsJS provide `seed`, `fitness`, `mutate`, `crossover` in JS/TS. Aesthetic fitness can be interactive (user selects), automated (symmetry, color, learned models), or many-objective (e.g. GenerativeGI with lexicase). The “generate 5 variations → user selects → mutate/crossover” flow is standard **Interactive Genetic Algorithms (IGA)**; Atelier’s PRD Genetic Algorithms phase matches this; “or auto-fitness” aligns with automated/many-objective work and reduces user fatigue.

**Relevance to Atelier:** P5Generator, ParticleSystem, and CellularAutomata are parameter-rich; those parameters are a natural genotype for the GA phase. IGA and genetic-js/GeneticsJS directly support the planned flow; CreativeEvaluator can act as or complement the fitness function.

**Detailed report:** [RESEARCH_P5_GA_ECOSYSTEM.md](RESEARCH_P5_GA_ECOSYSTEM.md) (in this directory).

---

## Synthesis: how these sources together ground Atelier

| Atelier design choice | Research grounding |
|------------------------|--------------------|
| Same prompt every iteration, world (context) changes | Ralph-Wiggum Loop (Huntley); “prompt never changes, world does” (PRD) |
| Completion signal `<promise>COMPLETE</promise>` | Ralph playbook; Claude Code plugin `--completion-promise` |
| Max-iterations, timeout, quality gates | Ralph backpressure; safety nets (PRD); “sit on the loop” |
| Persistence in Gallery + ContextAccumulation, not unbounded context | Ralph: memory in files/git; fresh context per iteration |
| Single agent, one loop (no multi-agent) | Ralph: “monolithic,” single process, one task per loop |
| Improvement without single explicit “art fitness” | Computational Life: emergence without fitness landscape; substrate design |
| “The code evolves” | Computational Life (self-modification); Emergent Garden (simple rules → complexity) |
| Lenia-style continuous CA (smooth, organic) | Lenia (Chan); PRD §4.1; CellularAutomata.ts |
| Trainable/organic morphogenesis (future) | GNCA (Mordvintsev et al.); Phase 2 “Neural CA” |
| p5.js as first-class target | p5.js ecosystem; p5js.ai; agent workflows |
| 5 variations → user/auto select → mutate/crossover | IGA literature; genetic-js; PRD Genetic Algorithms phase |

---

## Location of detailed reports

All reports live in **`docs/`**:

| Report | Path | Contents |
|--------|------|----------|
| Ralph-Wiggum Loop | `docs/RALPH_WIGGUM_RESEARCH.md` | Huntley’s concept, “sit on the loop,” vs multi-agent, persistence vs context, Claude plugin, relevance table |
| Computational Life & Emergent Garden | `docs/RESEARCH_COMPUTATIONAL_LIFE_EMERGENT_GARDEN.md` | Paper thesis, self-replication without fitness, Emergent Garden (brand + sim), relevance to Atelier |
| GNCA & Lenia | `docs/research_GNCA_Lenia.md` | Distill/Google GNCA, Chan’s Lenia, update equation, kernels, design implications for Atelier CA |
| p5.js & GA ecosystem | `docs/RESEARCH_P5_GA_ECOSYSTEM.md` | p5.js role, AI+p5 tooling, genetic-js/GeneticsJS, IGA, parameter evolution, relevance table |

*(If you opened this from the repo root, the paths above are relative to `docs/`.)*

---

## Consolidated references

### Ralph-Wiggum & agent loop

- Huntley, G. — “Ralph Wiggum as a software engineer”. https://ghuntley.com/ralph/
- Huntley, G. — “everything is a ralph loop”. https://ghuntley.com/loop/
- GitHub — ghuntley/how-to-ralph-wiggum. https://github.com/ghuntley/how-to-ralph-wiggum
- Anthropic — Claude Code, plugins/ralph-wiggum. https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum
- Keen, S. (2026) — “The Ralph Wiggum Agent Loop Is Really About Engineering Discipline”. AlteredCraft. https://alteredcraft.com/p/the-ralph-wiggum-agent-loop-is-really
- Dev Interrupted — “Inventing the Ralph Wiggum Loop | Creator Geoffrey Huntley” (podcast #256, Jan 2026). devinterrupted.substack.com
- Human Layer — “A Brief History of Ralph”. humanlayer.dev/blog/brief-history-of-ralph

### Computational Life & Emergent Garden

- Agüera y Arcas, B., Alakuijala, J., Evans, J., Laurie, B., Mordvintsev, A., Niklasson, E., Randazzo, E., Versari, L. (2024). *Computational Life: How Well-formed, Self-replicating Programs Emerge from Simple Interaction.* arXiv:2406.19108. https://arxiv.org/abs/2406.19108
- Google Research — Computational Life. https://research.google/pubs/computational-life-how-well-formed-self-replicating-programs-emerge-from-simple-interaction/
- Emergent Mind — Computational Life summary. https://www.emergentmind.com/papers/2406.19108
- DeepCast — “Computational Life” with Ettore Randazzo and Luca Versari. https://deepcast.fm/episode/computational-life-how-self-replicators-arise-from-randomness-with-googles-ettore-randazzo-and-luca-versari
- Emergent Garden (brand) — https://emergentgarden.io/
- Emergent Garden (particle sim) — https://gyanantaran.github.io/emergent-garden/ ; GitHub gyanantaran/emergent-garden

### GNCA & Lenia

- Mordvintsev, A., Randazzo, E., Niklasson, E., Levin, M. (2020). *Growing Neural Cellular Automata*. Distill. https://distill.pub/2020/growing-ca/
- Google Research — Growing Neural Cellular Automata. https://research.google/pubs/growing-neural-cellular-automata/
- Chan, B.W. (2019). *Lenia: Biology of Artificial Life*. Complex Systems 28(3), 251–286. arXiv:1812.05433
- Chan, B.W. (2020). *Lenia and Expanded Universe*. ALIFE 2020. arXiv:2005.03742
- Lenia — https://chakazul.github.io/lenia.html
- GitHub — Chakazul/Lenia. https://github.com/Chakazul/Lenia
- Google Research — self-organising-systems (Particle Lenia, etc.). https://github.com/google-research/self-organising-systems

### p5.js & evolutionary creative coding

- p5.js — https://p5js.org/ ; https://p5js.ai/ (AI Cloud IDE)
- p5js AI — https://p5jsai.com/about
- genetic-js (subprotocol) — https://github.com/subprotocol/genetic-js
- GeneticsJS — https://github.com/CristianAbrante/GeneticsJS ; geneticsjs.github.io
- GenerativeGI (Springer) — “GenerativeGI: creating generative art with genetic improvement”
- IGA / Picbreeder / user-as-fitness — Darani IJAI; Collaborative Interactive Evolution (arXiv); Picbreeder (Secretan CHI 08); Takagi; AlteredQualia; genart (automata)
- Claude Skills — Algorithmic Art (agent workflow). claudeskills.org

### Atelier

- PRD.md (this workspace)
- README.md
- src/core/RalphLoop.ts, PromiseDetector.ts, ContextAccumulation.ts, PromptStore.ts
- src/generators/p5/P5Generator.ts, ParticleSystem.ts, CellularAutomata.ts
- SYSTEM_AUDIT_REPORT.md

---

*End of preliminary research. For the PRD’s Appendix §12, this document and the four detailed reports in `docs/` replace the former short bullet list with citable, structured research.*
