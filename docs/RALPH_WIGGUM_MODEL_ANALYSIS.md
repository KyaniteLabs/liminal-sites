# Ralph Wiggum Technique - Model Requirements Analysis

**Research Date:** 2026-04-03
**Source:** Geoffrey Huntley's Ralph Wiggum Technique

## What the Ralph Wiggum Technique Actually Is

**Creator:** Geoffrey Huntley  
**Core Philosophy:** *"Ralph is a Bash loop"*

```bash
while :; do cat PROMPT.md | claude ; done
```

### The Key Insight: Fresh Context Every Iteration

Unlike traditional agent workflows, Ralph loops do NOT carry conversation history. Instead:

1. **Each iteration is a fresh start** - new process, empty context
2. **State lives on disk** - the model reads current state from files/git
3. **Self-referential via git history** - previous work visible in commits, not chat
4. **Avoids "Context Rot"** - the degradation of long conversations

> *"Deterministically bad in an undeterministic world"*  
> - Failures are predictable and fixable by adding "signs" (guardrails) to the prompt

### Core Loop Mechanics

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATION N                                                │
│  1. Fresh context (no history)                              │
│  2. Read PROMPT.md                                          │
│  3. Read current files/git state                            │
│  4. Execute one task                                        │
│  5. Run tests/validation                                    │
│  6. Git commit changes                                      │
│  7. Output completion signal (or not)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ITERATION N+1 (FRESH START)                                │
│  1. Fresh context (no history)                              │
│  2. Read PROMPT.md (same prompt)                            │
│  3. Read updated files/git state                            │
│  4. See previous work in git history                        │
│  5. Continue/fix/improve                                    │
└─────────────────────────────────────────────────────────────┘
```

## Critical Model Requirements for Ralph Loops

### 1. Instruction Following Precision (CRITICAL)

Since there's no conversation history to "remind" the model, it must:
- Respect the system prompt completely on every iteration
- Follow output formats consistently (deterministically)
- Not hallucinate new requirements or drift from the spec
- Execute the exact same way every time given the same prompt

**Why it matters:** The model sees the same PROMPT.md every iteration. If it interprets it differently each time, the loop fails.

### 2. Self-Referential Awareness

The model must understand to:
- Read git history to see what it previously did
- Analyze its own code from disk (not memory)
- Identify what's broken from test output
- Plan fixes based on current state, not context memory

**Why it matters:** Each iteration is stateless. The model must reconstruct context from files.

### 3. Statelessness Tolerance

The model must work with:
- Only what's in the prompt (PROMPT.md)
- Only what's in the files (git history, current code)
- No memory of "we tried this already" or "the user said"

**Why it matters:** Context window doesn't accumulate. The model must be functional with minimal context.

### 4. Deterministic Output Format

Must consistently output completion signals:
- `<promise>COMPLETE</promise>`
- Or other exact-match strings
- So the stop hook can detect completion reliably

**Why it matters:** The loop termination depends on exact string matching.

### 5. Error Recovery & Debugging

When tests fail, the model must:
- Read error output (stderr, test logs)
- Map errors to specific code locations
- Generate targeted fixes
- Not get stuck in infinite fix loops

**Why it matters:** The loop continues until success or max iterations. Poor error recovery wastes iterations.

### 6. Cost Efficiency (IMPORTANT)

Since Ralph loops run many iterations (potentially dozens or hundreds overnight):
- Small models = cheap per iteration
- Fast inference = quick iteration cycles
- Not resource-heavy = can run parallel loops

**Why it matters:** You're paying per token across many iterations.

## What Does NOT Matter for Ralph Loops

| Feature | Why It's NOT Important |
|---------|------------------------|
| **Large context window** | Each iteration starts fresh with minimal context |
| **Multimodal (vision/audio)** | Ralph loops are text/code focused |
| **Native tool calling** | Uses bash commands, not structured tool use |
| **Long-context retention** | Explicitly avoided via fresh starts |
| **Reasoning/thinking modes** | Not needed for straightforward iteration |
| **MoE efficiency** | Per-iteration cost matters more than throughput |

## Model Suitability Ranking

| Model | Params | Ralph Suitability | Why |
|-------|--------|-------------------|-----|
| **LFM 2.5 1.2B** | 1.2B | ✅ **OPTIMAL** | Fast, cheap, good instruction following, proven in tests |
| **Qwen 3.5 0.8B** | 0.8B | ✅ **GOOD** | Tested proven, reliable, very cheap per iteration |
| **Qwen 3.5 4B** | 4B | ✅ **GOOD** | Smallest multimodal Qwen 3.5, good balance |
| **Gemma 4 26B A4B** | 26B (3.8B active) | ⚠️ **OVERKILL** | Too expensive per iteration, unnecessary capabilities |
| **Qwen 3.5 27B** | 27B | ❌ **WRONG TOOL** | Dense model, expensive, overkill for Ralph loops |
| **Gemma 4 31B** | 31B | ❌ **WRONG TOOL** | Maximum overkill, wrong use case |

## Verdict

**For Ralph Wiggum loops, smaller is better.**

The ideal Ralph model is:
- ✅ **Small** (1-4B params) - cheap per iteration
- ✅ **Fast** - quick iteration cycles
- ✅ **Reliable instruction following** - deterministic output
- ✅ **Proven** - we know it works

**Recommendation:**
- **Primary:** LFM 2.5 1.2B (proven 8/10 generators, fast, cheap)
- **Fallback:** Qwen 3.5 0.8B (tested, even cheaper)

**Gemma 4 26B is the WRONG tool for Ralph loops** - it's designed for harness agents with tool calling and multimodal, not cost-effective iteration.

---

## Key Insight

**Ralph Wiggum loops ≠ Harness agents**

| Aspect | Ralph Loop | Harness Agent |
|--------|------------|---------------|
| Context | Fresh each iteration | Accumulated/persistent |
| Size preference | Small, cheap | Large, capable |
| Tool use | Bash commands | Native function calling |
| Multimodal | Not needed | Critical |
| Cost focus | Minimize per iteration | Quality over cost |
| Loop type | Stateless restart | Stateful continuation |

**Use the right tool for the right job.**
