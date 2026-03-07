# Research: Computational Life, Emergent Garden, and Relevance to Atelier

**Date:** 2026-03-07  
**Purpose:** Grounding for Atelier's "the code evolves" and emergent generative art, with citations.

---

## 1. Computational Life (2024)

### 1.1 Bibliographic details

| Field | Value |
|-------|--------|
| **Full title** | *Computational Life: How Well-formed, Self-replicating Programs Emerge from Simple Interaction* |
| **Authors** | Blaise Agüera y Arcas, Jyrki Alakuijala, James Evans, Ben Laurie, Alexander Mordvintsev, Eyvind Niklasson, Ettore Randazzo, Luca Versari |
| **arXiv** | [arXiv:2406.19108](https://arxiv.org/abs/2406.19108) (cs.NE; submitted 27 Jun 2024, revised 2 Aug 2024) |
| **Google Research** | [research.google/pubs/computational-life-how-well-formed-self-replicating-programs-emerge-from-simple-interaction](https://research.google/pubs/computational-life-how-well-formed-self-replicating-programs-emerge-from-simple-interaction/) |
| **License** | CC BY 4.0 |

### 1.2 Main thesis

The paper asks how **self-replicators** arise on **computational substrates** (environments where interactions follow logical, mathematical, or programming rules). It links **Origin of Life** and **Artificial Life**: in both, a central event is the appearance of self-replication and the resulting shift in dynamics. The authors argue we know very little about the general dynamics, computational principles, and necessary conditions for self-replicators to emerge, especially when there is **no explicit fitness landscape**.

**Core claim:** When **random, non–self-replicating programs** are placed in an environment **without any explicit fitness function**, **self-replicators tend to arise**. This happens through:

- **Random interactions** and **self-modification** of code
- With or without **background random mutations**
- After self-replicators appear, **increasingly complex dynamics** (competition, collaboration, evolution-like behavior) continue to emerge

They also give a **counterexample**: a minimalistic programming language in which self-replicators are theoretically possible but have not been observed to arise, showing that emergence depends on substrate design.

**Relevance to origin of life and artificial life:** The work suggests that life-like behavior (self-replication, then complexity) can appear without pre-existing optimization or fitness; the "fitness" is implicit in what persists and interacts, not written in as an objective.

*Sources: [arXiv:2406.19108](https://arxiv.org/abs/2406.19108) abstract; [Google Research pub](https://research.google/pubs/computational-life-how-well-formed-self-replicating-programs-emerge-from-simple-interaction/); [Emergent Mind summary](https://www.emergentmind.com/papers/2406.19108); [DeepCast episode with Randazzo & Versari](https://deepcast.fm/episode/computational-life-how-self-replicators-arise-from-randomness-with-googles-ettore-randazzo-and-luca-versari).*

### 1.3 How "well-formed, self-replicating programs emerge from simple interaction" can inform a creative coding agent

- **No explicit fitness:** The paper shows that **persistent, self-like structure** can emerge from **simple rules of interaction** (e.g., how programs read/write/execute in a minimal language) **without** a hand-coded fitness or reward. For a creative coding agent that iterates on its own output, this suggests:
  - **Lightweight "fitness":** Instead of a single global objective, the agent can rely on **local, contextual feedback** (e.g., "previous code + evaluation + issues") and **repeated interaction** with its own outputs. The "fitness" is implicit in what gets carried forward and improved, not a fixed loss function.
  - **Substrate design:** The **environment** (prompt structure, context injection, evaluation, termination) acts like the computational substrate. Designing it so that "simple interaction" (e.g., same prompt + changing context) can yield improving code parallels the paper's idea that the right substrate enables emergence.

- **Self-modification and context:** In Computational Life, self-replication arises from **programs reading/writing/executing** in a shared space. In an agent loop:
  - **Same prompt, changing context** (previous code, scores, issues) is analogous: the "program" (prompt + model) repeatedly **modifies** the artifact (code) by reacting to its own prior output.
  - **Well-formedness** in the paper (programs that replicate correctly) maps to **well-formedness of generated code** (syntax, structure, behavior). The agent can be guided by simple rules (e.g., quality gates, promise detection) rather than a single explicit "creativity" objective.

- **Iteration as "simple interaction":** The paper emphasizes **simple interaction** (e.g., random concatenation, execution, mutation). A creative coding agent that:
  - Keeps the **same** high-level prompt,
  - Injects **accumulated context** (last code, evaluation, trend),
  - Generates **next** code,
  - Then evaluates and repeats,

is implementing a form of **repeated, structured interaction** between the agent and its outputs. Improvement can then be seen as **emergent** from this loop, not only from an explicit "improve score" objective.

- **Open-endedness:** The finding that **increasingly complex dynamics** arise after self-replication suggests that, once a minimal "improving" loop exists, **further structure** (e.g., richer sketches, more coherent style) can emerge from the same mechanism. That supports designing for **open-ended iteration** (e.g., max iterations, termination on "promise" or stability) rather than a fixed target.

*Sources: Computational Life paper and abstract; [Emergent Mind – self-modification loop](https://www.emergentmind.com/topics/self-modification-loop); [open-ended evolution / minimal criterion literature](https://direct.mit.edu/artl/article/25/2/198/2923/Open-Endedness-for-the-Sake-of-Open-Endedness).*

---

## 2. Emergent Garden

### 2.1 What "Emergent Garden" refers to

The name **Emergent Garden** appears in two distinct but thematically related contexts:

**A. Emergent Garden (emergentgarden.io) – creator/brand**

- **What it is:** A **personal brand and hub** (website, social, Patreon/Ko-fi) run by **Max**, an independent software engineer.
- **Focus:** "Emergent complexity" through code: artificial life, AI, simulations, games, generative/creative coding. The tagline is that **simple things combine to make complex things**, and coding is a way to explore that.
- **Connection to generative/creative coding:** Max explicitly frames the site as dedicated to **exploring emergence through coding**—aligning with creative coding, Alife, and "weird" or experimental programs.
- **Link:** [emergentgarden.io](https://emergentgarden.io/) ("hello_world", community, support).

**B. Emergent Garden (GitHub / gyanantaran) – particle simulation**

- **What it is:** A **Python + Pygame particle simulation** in which many particles move and interact under a small set of rules (forces, boundaries, global "heat"). The goal is to show that **even with very few rules, behavior looks chaotic but "oddly organised."**
- **Features:** Configurable parameters (particle count, forces, boundaries, heat); particles attract/repel by distance, lose energy, interact with walls; no explicit fitness—structure emerges from physics-like interaction.
- **Overlap with Lenia / CA / evolution sims:**  
  - **Conceptually:** Same theme as Lenia and CA: **local rules → global emergence**. It is not Lenia (no continuous CA kernel or energy-based Lenia formulation) but shares the idea of "simple rules, complex behavior."  
  - **Particle Lenia / Mordvintsev:** Alexander Mordvintsev (Google) has worked on **Particle Lenia** (particle-based, energy-driven) and **Lenia** (continuous CA). The GitHub "emergent-garden" is an independent particle sim; the **thematic** overlap is emergence from local interaction, not a direct code or authorship link.  
  - **Evolution sims:** Emergent Garden (the sim) is not an evolution simulator (no selection/reproduction), but it sits in the same **cultural space** as Alife and evolution sims (exploring how complexity arises from simple dynamics).
- **Links:** [gyanantaran.github.io/emergent-garden](https://gyanantaran.github.io/emergent-garden/), [GitHub (e.g. gyanantaran/emergent-garden, vishalpaudel/emergent-garden)](https://github.com/gyanantaran/emergent-garden).

**Summary:** "Emergent Garden" is (1) **Max's brand** for emergent complexity and creative coding, and (2) a **particle sim project** (by other authors) demonstrating emergence from simple interaction. Neither is by Blaise Agüera y Arcas or Google; the **connection** to Computational Life is **thematic** (emergence, simple rules, no explicit fitness, generative/creative coding and Alife).

*Sources: [emergentgarden.io](https://emergentgarden.io/); [gyanantaran.github.io/emergent-garden](https://gyanantaran.github.io/emergent-garden); [znah.net – Mordvintsev / Lenia](https://znah.net/); [Google self-organising-systems – Particle Lenia](https://google-research.github.io/self-organising-systems/particle-lenia/).*

### 2.2 Overlap with Lenia, CA, and evolution sims

| Theme | Lenia / CA | Emergent Garden (sim) | Computational Life |
|-------|-------------|------------------------|---------------------|
| Simple local rules | Yes (kernel, neighborhood) | Yes (particle forces, boundaries) | Yes (instruction set, execution) |
| No explicit fitness | Yes (dynamics only) | Yes (physics only) | Yes (no fitness landscape) |
| Emergent structure | Patterns, "species" | Organized-looking chaos | Self-replicators, then complexity |
| Substrate | Continuous grid / particles | Particles in 2D | Programs in minimal languages |

So: **Emergent Garden** (particle sim) and **Computational Life** both illustrate **emergence without a global objective**, on different substrates (physics vs. code). Lenia/CA share the "simple rules → complex behavior" and "weird programs" / Alife angle that Max's Emergent Garden brand also promotes.

---

## 3. Relevance to Atelier

### 3.1 What Atelier does

From the codebase and PRD:

- **Self-recursive iteration:** Atelier runs a **Ralph-Wiggum Loop** ([PRD](../PRD.md), [README](../README.md)): the **same prompt** is used every iteration, while **context** (previous code, evaluation, history) **changes** each time. The agent generates code → evaluates it → saves context → injects that context into the next prompt → repeats. So the agent **iterates on its own output**.
- **Core phrase:** *"The code evolves. You curate."* ([README](../README.md), [PRD](../PRD.md)) — the code is the evolving artifact; the user curates (prompt, project, gallery).
- **Mechanism:** `RalphLoop` uses `PromptStore` (same prompt), `ContextAccumulation` (history of iterations with code and `CreativeEvaluator` scores), and `buildContextForInjection()` to pass "previous code (first 500 chars)", quality score, issues, and trend into the next prompt. Termination is by **PromiseDetector** or **max iterations** ([RalphLoop.ts](../src/core/RalphLoop.ts)).

So Atelier already implements **repeated, context-dependent self-modification of code** without a single explicit "fitness function" for "good art"; quality and termination are simple, local rules (score, issues, promise).

### 3.2 How Computational Life provides philosophical and technical grounding

- **Philosophical**
  - **Emergence without global fitness:** Computational Life shows that **self-replicating, structured behavior** can arise from **simple interaction** and **self-modification** in a **fitness-free** environment. Atelier's "the code evolves" can be read the same way: **improvement emerges** from the loop (prompt + context + evaluation + next generation), not from a single hand-coded "optimize art" function. The "fitness" is implicit in what gets retained and refined (e.g., higher score, fewer issues, promise detected).
  - **Origin-of-life / pre-life analogy:** The paper's "pre-life" dynamics that later exhibit self-replication parallel **early iterations** (random or weak code) that only later stabilize into "well-formed" or satisfying outputs. Atelier's **max iterations** and **termination conditions** are like boundaries of the "substrate" in which this evolution runs.

- **Technical**
  - **Substrate design:** Computational Life stresses that **which substrate** you use (language, instruction set, interaction rules) determines whether self-replicators emerge. In Atelier, the "substrate" is **prompt + context shape + evaluation + termination**. Designing them so that "simple interaction" (same prompt + last code + score + issues) tends to yield better or more coherent code is analogous to designing a computational substrate so that self-replication can appear.
  - **Self-modification:** The paper's self-replication is **programs modifying/copying themselves**. Atelier's loop is **model + context producing new code** that replaces or refines the previous one. So the **artifact** (code) is "self-modifying" in the sense that each version is produced by taking the previous one as input—a form of **iterated self-modification** guided by simple rules.

*Sources: Computational Life (arXiv:2406.19108, Google Research pub); Atelier [RalphLoop.ts](../src/core/RalphLoop.ts), [ContextAccumulation.ts](../src/core/ContextAccumulation.ts), [PromptStore.ts](../src/core/PromptStore.ts); [PRD](../PRD.md), [README](../README.md).*

### 3.3 How Emergent Garden provides grounding

- **Philosophical**
  - **"Simple rules → complex outcome":** Emergent Garden (both the brand and the particle sim) reinforces that **emergent generative art** is plausible: you don't need to script every detail; you set up **simple, local rules** (in Atelier: same prompt, inject context, evaluate, terminate) and let **complexity** (richer, more coherent sketches) arise from repetition and feedback.
  - **Coding as exploration of emergence:** Max's framing—coding as a way to explore emergence—aligns with Atelier's identity as a **creative coding agent**: the "weird" or generative outcome is discovered by the system, not fully specified in advance.

- **Technical / cultural**
  - **Particle sim vs. code loop:** The Emergent Garden particle sim is a different substrate (physics) than Atelier (LLM + context + code), but both avoid a single global objective and rely on **local interaction** (particle forces vs. "previous code + evaluation"). That supports the idea that **emergent generative art** can be implemented in many substrates, including an iterative agent loop.
  - **Lenia / CA / "weird programs":** Mordvintsev's work (Lenia, Particle Lenia, and co-authorship of Computational Life) and the Emergent Garden brand both sit in **generative/creative coding and Alife**. Atelier's use of **CellularAutomata** and **ParticleSystem** in its generators ([SYSTEM_AUDIT_REPORT](../SYSTEM_AUDIT_REPORT.md)) is a direct link: the same **cultural and technical** tradition (CA, particles, emergence) that Emergent Garden and Lenia inhabit.

*Sources: [emergentgarden.io](https://emergentgarden.io/); [gyanantaran.github.io/emergent-garden](https://gyanantaran.github.io/emergent-garden); [znah.net](https://znah.net/); Atelier [SYSTEM_AUDIT_REPORT](../SYSTEM_AUDIT_REPORT.md), [PRD](../PRD.md).*

### 3.4 Summary table

| Concept | Computational Life | Emergent Garden | Atelier |
|--------|--------------------|-----------------|---------|
| **Emergence without explicit fitness** | Self-replicators arise without fitness landscape | Particle behavior from physics only; no objective | Improvement from prompt + context + evaluation; no single "art quality" loss |
| **Simple interaction** | Programs read/write/execute in minimal languages | Particle forces, boundaries, heat | Same prompt + previous code + score + issues |
| **Self-modification / iteration** | Programs copy or modify themselves | N/A (particles don't rewrite rules) | Each iteration rewrites the code artifact using last version as context |
| **"The code evolves"** | Code (programs) evolves on a substrate | N/A (particles evolve in a sim) | Code (p5/JS) evolves across RalphLoop iterations |
| **Emergent generative art** | Not directly about art | Yes (generative coding, Alife, "weird programs") | Yes (emergent generative art via self-recursive iteration) |

---

## 4. Citations (condensed)

- **Computational Life paper:** Agüera y Arcas, B., Alakuijala, J., Evans, J., Laurie, B., Mordvintsev, A., Niklasson, E., Randazzo, E., Versari, L. (2024). *Computational Life: How Well-formed, Self-replicating Programs Emerge from Simple Interaction.* arXiv:2406.19108. [arXiv](https://arxiv.org/abs/2406.19108) | [Google Research](https://research.google/pubs/computational-life-how-well-formed-self-replicating-programs-emerge-from-simple-interaction/)
- **Emergent Mind (summary + self-modification):** [Computational Life summary](https://www.emergentmind.com/papers/2406.19108); [Self-Modification Loop](https://www.emergentmind.com/topics/self-modification-loop)
- **Podcast:** DeepCast – [Computational Life with Ettore Randazzo and Luca Versari](https://deepcast.fm/episode/computational-life-how-self-replicators-arise-from-randomness-with-googles-ettore-randazzo-and-luca-versari)
- **Mordvintsev / Lenia:** [znah.net](https://znah.net/); [Particle Lenia (Google)](https://google-research.github.io/self-organising-systems/particle-lenia/)
- **Emergent Garden:** [emergentgarden.io](https://emergentgarden.io/); [gyanantaran.github.io/emergent-garden](https://gyanantaran.github.io/emergent-garden)
- **Open-ended evolution:** *Open-Endedness for the Sake of Open-Endedness*, Artificial Life 25(2), 198–212
- **Atelier:** PRD.md, README.md, src/core/RalphLoop.ts, ContextAccumulation.ts, PromptStore.ts, SYSTEM_AUDIT_REPORT.md

---

*End of research document.*
