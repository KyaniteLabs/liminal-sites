# Liminal Master Plan

## Philosophy

> "The code evolves. You curate."

Temporary phase: Dogfood testing to verify robustness.
Permanent system: Intent → Creative Brief → RalphLoop → Gallery

---

## Phase 1: Verify Robustness (TEMPORARY)

**Goal**: Confirm agents follow instructions, system is stable.
**Trigger for completion**: "I'm satisfied" from user.

### Current Status
- [x] Feature test matrix (7 models × 6 creative domains)
- [x] Parallel execution across providers
- [x] Live telemetry collection
- [ ] Complete full matrix run
- [ ] Document failure modes per model

### Deliverables
- `dogfood-qa-live/results.json` - All test results
- `landing-assets/live-evaluation-results.json` - Live-updating gallery data
- Model personality profiles (emergent from test data)

---

## Phase 2: Creative Validation (PERMANENT)

**Goal**: Measure if outputs are actually *good*, not just valid.

### Components

#### 2.1 Creative Genome Database
- Store ALL iterations (not just final)
- Parent → child lineage tracking
- Mutation operator effectiveness scoring
- Query: "What mutations improve p5.js fireworks?"

#### 2.2 Visual Diff Testing
- Screenshot every iteration
- Measure: pixel variance, edge detection, motion entropy
- Fail if iteration N identical to N-1 (stagnation detection)

#### 2.3 Model Personality Profiles
Auto-generated after sufficient tests:
```
MiniMax-M2.7:
  Strengths: [shaders, complex math, visual effects]
  Weaknesses: [audio, strudel syntax, minimal code]
  Typical iterations: 4-6
  Sweet spot: Iteration 3-4 for most domains
```

---

## Phase 3: Seed Ideation System (APPROVED - IN PLAN)

**Inspiration**: SEED by Christopher Kahler
**Goal**: Vague intent → Structured creative brief

### Workflow
```
"Something like Kid A"
    ↓
SeedIdeator.ideate()
    ↓
CreativeBrief:
  - extractedThemes: ["anxiety", "glitch", "organic-mechanical"]
  - emotionalTone: "paranoid warmth"
  - suggestedDomains: ["strudel", "hydra", "p5"]
  - concretePrompts: [
      { domain: "strudel", prompt: "Glitch techno beats" },
      { domain: "hydra", prompt: "Feedback loop paranoia" }
    ]
    ↓
User selects OR run all
    ↓
RalphLoop executes selected domains
    ↓
Gallery with full lineage
```

### Enhanced Workflow with Research Step (NEW)

```
"Something like Kid A"
    ↓
SeedIdeator.ideate()
    ├─ Step 1: RESEARCH (NEW)
    │   ├─ Search: "Kid A album Radiohead 2000"
    │   ├─ Find: glitch art, Warp Records, post-rock
    │   ├─ Current knowledge cutoff: 2026-03-31
    │   └─ Build reference corpus
    ├─ Step 2: Intent Extraction
    ├─ Step 3: Domain Matching
    └─ Step 4: Brief Generation
        └─ concretePrompts WITH citations
```

**Research Requirements:**
- Web search for named references
- Knowledge date awareness
- Reference provenance tracking
- Future: Karpathy-style autoresearch

### Creative Domain Types
See: `docs/CREATIVE_DOMAIN_TYPES.md`

Current: 6 domains (p5, GLSL, Three, Strudel, Hydra, Remotion)
Proposed: 15+ domains (SVG, Canvas, Tone.js, WebXR, ASCII, etc.)

---

## Phase 4: Full Pipeline (FUTURE)

### Components
- **Interface**: GUI/CLI for the RalphLoop
- **Curation Tools**: Select, fork, evolve favorites
- **Physical Output**: Plotter, CNC integrations
- **Multi-domain Fusion**: Single prompt → interacting domains
- **Networked Sessions**: Collaborative creative

---

## Integration Points

### SEED → Liminal
```typescript
// SEED produces PLANNING.md for PAUL
// Liminal adaptation:
const brief = await seedIdeator.ideate("Kid A vibes");
// Produces CREATIVE_BRIEF.md for RalphLoop
```

### RalphLoop ↔ Creative Genome
- Every iteration saved to genome
- Query genome for mutation suggestions
- "What worked for similar prompts?"

### Gallery → Seed
- Previous works as reference points
- "Like my previous fireworks but more ambient"

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Testing is temporary | Verify robustness, then focus on creative system |
| 2026-03-31 | SeedIdeator approved | Intent extraction critical for user experience |
| 2026-03-31 | Expand domain types | 15+ domains for full creative coverage |
| 2026-03-31 | Creative Genome permanent | Lineage tracking is core differentiator |

---

## Next Actions

1. **Complete Phase 1** (current)
   - Finish orchestrated test run
   - Populate landing page with live results

2. **Start Phase 2** (parallel)
   - Build Creative Genome schema
   - Implement visual diff testing

3. **Design Phase 3** (pending Phase 1 completion)
   - SeedIdeator implementation
   - Domain expansion planning

---

## Key Metrics

- **Robustness**: 95%+ feature tests passing
- **Creative Quality**: 0.7+ average CreativeEvaluator score
- **Iteration Efficiency**: < 5 iterations to quality threshold
- **Intent Alignment**: User recognizes intent in output
