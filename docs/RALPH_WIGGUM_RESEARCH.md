# Ralph-Wiggum Loop: Research Report for Atelier

**Date:** 2026-03-07  
**Purpose:** Thorough research on the Ralph-Wiggum Loop and its relevance to the Atelier creative coding agent (same-prompt iteration, COMPLETE promise detection, quality gates).

---

## 1. Geoffrey Huntley's Ralph-Wiggum Loop

### 1.1 Original Concept and "Pure Form"

The Ralph-Wiggum technique was introduced by **Geoffrey Huntley** and is documented on his site and in the GitHub repo **how-to-ralph-wiggum**.

**Definition:** Ralph is a technique for AI-assisted coding. In its purest form it is a Bash loop:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

**Source (direct quote):**  
> "Ralph is a technique. In its purest form, Ralph is a Bash loop."  
> — Geoffrey Huntley, [ghuntley.com/ralph](https://ghuntley.com/ralph/) (Ralph Wiggum as a "software engineer")

**Characterisation:**  
> "That's the beauty of Ralph - the technique is **deterministically bad in an undeterministic world**."  
> — Huntley, [ghuntley.com/ralph](https://ghuntley.com/ralph/)

Ralph can be used with any tool that does not cap tool calls. It can replace much outsourcing for greenfield projects; defects are "identifiable and resolvable through various styles of prompts" (Huntley, ghuntley.com/ralph).

---

### 1.2 "Sit on the Loop, Not in It"

The idea **"sit on the loop, not in it"** means the human **designs and observes the loop** instead of being inside each iteration.

- **Design:** Define validation criteria, specs, and backpressure (tests, linters, build) up front.  
- **Observe:** Watch for failure patterns and "put on your engineering hat" so the same failure does not recur.  
- **Tune:** When Ralph misbehaves, add "signs" (prompt/instructions) so future loops behave correctly.

**Source (direct quote):**  
> "It's important to **watch the loop** as that is where your personal development and learning will come from. When you see a failure domain – put on your engineering hat and resolve the problem so it never happens again."  
> — Huntley, [ghuntley.com/loop](https://ghuntley.com/loop/) ("everything is a ralph loop")

**Interpretation (secondary):**  
> "**Sit on the loop, not in it**—meaning design validation criteria upfront and let the agent handle iteration, rather than micromanaging each step."  
> — AI Hero / AlteredCraft summary, cited in [alteredcraft.com – The Ralph Wiggum Agent Loop Is Really About Engineering Discipline](https://alteredcraft.com/p/the-ralph-wiggum-agent-loop-is-really) (Sam Keen, Jan 22, 2026)

So: you sit *on* the loop (orchestrating, specifying, tuning), not *in* it (step-by-step prompting).

---

### 1.3 Ralph vs Multi-Agent Systems

Huntley explicitly contrasts Ralph with **multi-agent / agent-to-agent** setups.

**Source (direct quote):**  
> "While I was in SFO, everyone seemed to be trying to crack on **multi-agent, agent-to-agent communication and multiplexing**. At this stage, **it's not needed**. Consider microservices and all the complexities that come with them. Now, consider what microservices would look like if the microservices (agents) themselves are **non-deterministic—a red hot mess**.  
> What's the opposite of microservices? **A monolithic application**. A single operating system process that scales vertically. **Ralph is monolithic**. Ralph works autonomously in a **single repository as a single process** that performs **one task per loop**."  
> — Huntley, [ghuntley.com/ralph](https://ghuntley.com/ralph/)

Ralph is therefore:

- **Single process**, one task per loop.  
- **Monolithic** in the sense of one coherent process, not many coordinating agents.  
- **Not** multi-agent communication/multiplexing; that is explicitly deferred.

(Note: Huntley does use "subagents" *within* a loop for search/file work and to keep the main context as a scheduler; that is an internal optimisation, not a multi-agent architecture in the SFO sense.)

---

### 1.4 Persistence (Files, Git) vs Context Window

Ralph's "memory" lives in **the world** (filesystem, git, markdown), not in the model's context window.

**Mechanism:**

- Each loop iteration can use a **fresh context window** (e.g. new `claude-code` process).  
- State persists via: **files** (PROMPT.md, specs, fix_plan.md, AGENT.md), **git** (commits, history), and **codebase**.  
- The agent reads current code, test results, and plan files at the start of each iteration.

**Why:** Long conversations cause **context rot** / compaction; the model loses information. Fresh context per iteration avoids that.

**Source (direct quote):**  
> "Each iteration spawns a **fresh context window**. Memory persists only through the **filesystem**: git commits, markdown files, the codebase itself."  
> — Sam Keen, [alteredcraft.com](https://alteredcraft.com/p/the-ralph-wiggum-agent-loop-is-really), citing "The Real Ralph Wiggum Loop" and how-to-ralph-wiggum.

**Source (Huntley):**  
> "The way that agentic loops work is by executing a tool and then evaluating the result of that tool. The evaluation results in an allocation being added to your context window."  
> "Ralph requires a mindset of **not allocating to the primary context window**. Instead, what you should do is **spawn subagents**. Your primary context window should operate as a **scheduler**."  
> — Huntley, [ghuntley.com/ralph](https://ghuntley.com/ralph/)

So: **persistence = files + git (+ optional subagents for heavy work)**; **context window** is kept lean and often fresh per iteration.

---

### 1.5 Additional Primary Sources

| Source | URL | Content |
|--------|-----|---------|
| **ghuntley.com/ralph** | https://ghuntley.com/ralph/ | Full post: "Ralph Wiggum as a software engineer" – pure loop, monolithic vs multi-agent, specs, backpressure, CURSED prompts. |
| **ghuntley.com/loop** | https://ghuntley.com/loop/ | "everything is a ralph loop" – mindset, "watch the loop," Ralph as orchestrator, software as clay. |
| **how-to-ralph-wiggum** | https://github.com/ghuntley/how-to-ralph-wiggum | Repo subtitle: "The Ralph Wiggum Technique—the AI development methodology that reduces software costs to less than a fast food worker's wage." |
| **ralph.md / Ralph Playbook** | https://ralph.md/ (redirects to repo) | Community playbook: three phases, two prompts, one loop; context discipline; BUILDING vs PLANNING. |
| **Dev Interrupted** | devinterrupted.substack.com, podcast #256, Jan 2026 | "Inventing the Ralph Wiggum Loop" with Geoffrey Huntley – persistence vs single genius, context management, Gas Town. |
| **VentureBeat** | venturebeat.com | "How Ralph Wiggum went from 'The Simpsons' to the biggest name in AI right now." |

---

## 2. Claude Code Ralph-Wiggum Plugin

### 2.1 Existence and Location

An **official Ralph Wiggum plugin** exists for **Claude Code**:

- **Repository:** `anthropics/claude-code`  
- **Path:** `plugins/ralph-wiggum`  
- **URL:** https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum

### 2.2 What It Does

The plugin implements Ralph via a **stop-hook** inside the **same** Claude Code session:

- You run **once:** e.g. `/ralph-loop "Your task" --completion-promise "DONE"`.  
- Claude works, then tries to exit.  
- A **stop hook** blocks exit and re-feeds the **same** prompt.  
- Loop continues until a **completion promise** string is found or **max-iterations** is reached.

**From the plugin README (anthropics/claude-code):**

- "Implementation of the Ralph Wiggum technique for iterative, self-referential AI development loops in Claude Code."  
- "Ralph is a Bash loop … This plugin implements Ralph using a **Stop hook** that intercepts Claude's exit attempts."  
- "The loop happens **inside your current session** - you don't need external bash loops."  
- Completion: `--completion-promise "<text>"` (exact string match).  
- Safety: `--max-iterations` recommended to avoid infinite loops.

**Example from README:**

```bash
/ralph-loop "Build a REST API for todos. ... Output <promise>COMPLETE</promise> when done." --completion-promise "COMPLETE" --max-iterations 50
```

So: **same prompt every iteration**, **completion promise** to stop, **max-iterations** as safety net.

### 2.3 Relation to Huntley's "Fresh Context" Principle

A known limitation of the **official plugin** is that it keeps **one session** and **one context**:

- **Original Ralph:** New process per iteration → **fresh context** each time; persistence in files/git.  
- **Official plugin:** Same session, stop-hook re-prompting → **same context** accumulates across iterations.

**Source:**  
> "The plugin **misses the key point of Ralph** which is not 'run forever' but **'carve off small bits of work into independent context windows.'** The official plugin runs everything in a **single context window** rather than spawning fresh context per iteration."  
> — [A Brief History of Ralph](https://www.humanlayer.dev/blog/brief-history-of-ralph), cited in [alteredcraft.com](https://alteredcraft.com/p/the-ralph-wiggum-agent-loop-is-really)

So: the plugin is a **convenient in-session Ralph-like loop** with completion promise and max-iterations, but it does **not** implement the "fresh context per iteration" design that Huntley and the playbook emphasise.

### 2.4 Relation to Atelier

- **Atelier** runs a **programmatic** Ralph-style loop in **application code** (e.g. `RalphLoop.run()`), with a **new LLM call per iteration** and **context built from ContextAccumulation + injected prompt** (same prompt, changing "world").  
- **Claude Code plugin** runs inside the **Claude Code** UI with a stop-hook and same session.  
- **Shared ideas:** Same prompt each iteration; completion signal (Atelier: `<promise>COMPLETE</promise>` in output; plugin: `--completion-promise`); max-iterations; persistence of "world" (Atelier: gallery + context accumulation; plugin: files in workspace).  
- **Difference:** Atelier can be seen as closer to "fresh context" in that each iteration is a new `generate()` call with updated context, whereas the plugin keeps one long session.

So: Atelier is a **creative-coding-specific** implementation of the same-prompt, completion-signal, iterative loop; the Claude plugin is a **general-purpose** in-editor implementation with a different context model.

---

## 3. Relevance to Atelier

### 3.1 Atelier's Design (Summary)

From the codebase and PRD:

- **Same prompt every iteration**, with **context that changes** (previous iterations, scores, issues, code snippets).  
- **Termination:** `PromiseDetector` looks for exact string `<promise>COMPLETE</promise>` in generated code; plus **max-iterations**, **timeout**, and **quality gates** (CreativeEvaluator, minQualityScore).  
- **Persistence:** ContextAccumulation, Gallery (per-iteration saves), optional project naming.  
- **Single agent:** One generator (e.g. P5GeneratorLLM) in one process; no multi-agent coordination.  
- **Domain:** Creative coding (e.g. P5 sketches), not general greenfield dev.

### 3.2 How Ralph-Wiggum Research Supports Atelier

| Ralph principle | Atelier implementation | Citation / source |
|-----------------|------------------------|-------------------|
| **Same prompt, world changes** | `PromptStore.load(prompt)` every iteration; `buildContextForInjection(iteration)` supplies iteration, history, scores, issues, trend. | PRD §2.2: "The prompt never changes, but the world does." Huntley: one task per loop, same PROMPT.md; state in files. |
| **Completion signal** | `PromiseDetector.detect(currentCode)` for `<promise>COMPLETE</promise>`; loop breaks on detection. | PRD §2.3; Claude plugin `--completion-promise`; Huntley/playbook: "when tests pass", "explicit completion marker". |
| **Safety nets** | `maxIterations`, `timeoutMinutes`, `minQualityScore`, `tolerateErrors`. | Huntley: "backpressure" (tests, build); playbook & plugin: max-iterations; AlteredCraft: "iteration limit is a financial circuit breaker". |
| **Persistence outside context** | ContextAccumulation + Gallery; next iteration gets summaries/snippets, not full raw history in one giant context. | Huntley: memory in filesystem/git; "don't allocate to primary context"; fresh context per iteration. |
| **Single agent, one loop** | Single RalphLoop, single P5GeneratorLLM, no multi-agent handoffs. | Huntley: "Ralph is monolithic … single process … one task per loop." |
| **Engineering discipline** | Quality gates, optional tolerance, structured loop options. | AlteredCraft: "Sit on the loop, not in it"; specs and validation upfront; Ralph as "meta-harness". |

So the research **directly supports** Atelier's design: same-prompt iteration, explicit completion token, safety limits, and state-in-the-world rather than unbounded context.

### 3.3 Contrasts and Caveats

| Aspect | Ralph (Huntley / playbook) | Atelier |
|--------|----------------------------|---------|
| **Fresh context** | New process per iteration (bash loop); true context reset. | New `generate()` per iteration with **injected** context (history, scores); not a new process, but bounded, structured context. |
| **Backpressure** | Tests, build, linters, type checkers; "wheel has to turn". | CreativeEvaluator (quality score, issues); no mandatory test-run or build in the loop. |
| **Domain** | General greenfield (APIs, compilers, etc.). | Creative coding (e.g. P5); "creative" quality, not "tests pass". |
| **Completion** | Often "tests pass" + git tag + sometimes explicit marker. | **Only** explicit `<promise>COMPLETE</promise>` in output (no automatic test/build gate). |
| **Where you "sit"** | Human watches loop, tunes prompts/specs, fixes failure domains. | Human sets prompt, options, and quality threshold; loop runs until promise or limits. |

So: Atelier is **aligned** with Ralph on loop structure and completion signalling, but **narrower** in domain (creative coding) and **different** in backpressure (creative quality vs tests/build). It does not implement full "fresh process per iteration" but does keep each iteration's context feed bounded and structured.

### 3.4 Summary Table

| Topic | Finding | Key source(s) |
|-------|--------|----------------|
| **Original concept** | Ralph = Bash loop `while :; do cat PROMPT.md \| claude-code ; done`; "deterministically bad in an undeterministic world". | Huntley, ghuntley.com/ralph |
| **"Sit on the loop"** | Design validation and observe the loop; tune when failures recur; don't micromanage inside the loop. | Huntley, ghuntley.com/loop; AlteredCraft (Sam Keen, 2026) |
| **vs multi-agent** | Ralph is monolithic, single process, one task per loop; multi-agent/multiplexing "not needed" at this stage. | Huntley, ghuntley.com/ralph |
| **Persistence vs context** | Memory in files/git; fresh context per iteration to avoid context rot; main context as scheduler. | Huntley, ghuntley.com/ralph; AlteredCraft; how-to-ralph-wiggum playbook |
| **Claude Code plugin** | Official plugin uses stop-hook, same session; `--completion-promise` and `--max-iterations`; does *not* give fresh context per iteration. | anthropics/claude-code, plugins/ralph-wiggum/README.md; Human Layer / AlteredCraft |
| **Atelier alignment** | Same-prompt iteration, COMPLETE promise, quality gates, and persistence align with Ralph; Atelier is a creative-coding instance with quality-based backpressure rather than test/build. | PRD, RalphLoop.ts, PromiseDetector.ts, SYSTEM_AUDIT_REPORT.md |

---

## References (consolidated)

- **Huntley, G.** – "Ralph Wiggum as a software engineer". https://ghuntley.com/ralph/
- **Huntley, G.** – "everything is a ralph loop". https://ghuntley.com/loop/
- **GitHub** – ghuntley/how-to-ralph-wiggum. https://github.com/ghuntley/how-to-ralph-wiggum
- **Anthropic** – Claude Code, plugins/ralph-wiggum. https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum (README.md)
- **Keen, S.** (2026) – "The Ralph Wiggum Agent Loop Is Really About Engineering Discipline". AlteredCraft. https://alteredcraft.com/p/the-ralph-wiggum-agent-loop-is-really
- **Dev Interrupted** – "Inventing the Ralph Wiggum Loop | Creator Geoffrey Huntley" (podcast #256, Jan 2026). devinterrupted.substack.com
- **Ralph Playbook** (ralph.md / how-to-ralph-wiggum) – Three phases, two prompts, one loop; context discipline.
- **Human Layer** – "A Brief History of Ralph" (cited re: plugin vs fresh context). humanlayer.dev/blog/brief-history-of-ralph
- **Atelier** – PRD.md, src/core/RalphLoop.ts, src/core/PromiseDetector.ts, SYSTEM_AUDIT_REPORT.md (this workspace).
