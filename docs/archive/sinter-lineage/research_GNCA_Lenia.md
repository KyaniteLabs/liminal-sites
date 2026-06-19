# Research: Growing Neural Cellular Automata & Lenia — Relevance to Atelier

Structured research on GNCA (Google/Distill 2020) and Lenia (Bert Chan), with citations and implications for Atelier’s cellular automata and generative art.

---

## 1. Growing Neural Cellular Automata (GNCA)

### 1.1 Source and Authors

- **Article:** Mordvintsev, A., Randazzo, E., Niklasson, E., & Levin, M. (2020). *Growing Neural Cellular Automata*. **Distill**.  
  - **URL:** https://distill.pub/2020/growing-ca/  
  - **Google Research:** https://research.google/pubs/growing-neural-cellular-automata/  
  - **Code:** [google-research/self-organising-systems](https://github.com/google-research/self-organising-systems) (notebook: `notebooks/growing_ca.ipynb`), [distillpub/post--growing-ca](https://github.com/distillpub/post--growing-ca).

### 1.2 Key Ideas

- **Differentiable CA:** Cell states are continuous vectors (e.g. 16 channels: RGB, alpha, hidden). The update rule is differentiable, so it can be trained with gradient-based optimization (backpropagation-through-time) to achieve target patterns [Distill 2020].
- **Morphogenesis:** The model is a toy analogue of organism development: a single seed cell grows into a predefined multicellular pattern. “Cells … communicate with their neighbors to decide the shape of organs and body plans, where to grow each organ, how to interconnect them, and when to eventually stop” [Distill 2020].
- **Single cell → complex form:** Grid is initialised with one “living” cell (α > 0.1); the same local rule is applied everywhere. Hidden channels act like chemical signalling; only local (3×3) perception is used [Distill 2020].
- **Grow vs persist vs regenerate:**  
  - *Growing:* trained to reach a target pattern; often unstable (explode/decay).  
  - *Persistent:* trained with a sample pool so the target is an attractor; often gain regeneration without being trained for it.  
  - *Regenerating:* trained with damage (e.g. erasing circles); strong repair from various injuries [Distill 2020].

### 1.3 How “Cells Communicate with Neighbors” Relates to Generative Art and Creative Coding

- **Local perception:** Each cell gets a 48-d perception vector: own state + Sobel gradients in x and y (simulating gradient sensing). No global input; complexity comes from repeated local updates [Distill 2020].
- **Emergence from local rules:** One small MLP (≈8k parameters) defines the rule. Patterns, symmetries, and regeneration emerge from this local communication, which is the same idea as “simple rules → rich behavior” in creative coding (e.g. CA, reaction–diffusion, particle systems) [Distill 2020].
- **Generative art implications:**  
  - **Trainable morphogenesis:** You can optimize for a target image (or aesthetic loss), so one system can grow many designs from a seed.  
  - **Conditional NCAs:** Extensions (e.g. StampCA, c-NCA) use a conditioning vector in the seed to grow different patterns from one model—directly useful for “one model, many outputs” in generative art.  
  - **Regeneration as interaction:** The demo lets users erase parts and watch repair; that’s a natural fit for interactive/participatory generative art.  
  - **Decentralized aesthetics:** No global blueprint; the “design” is in the shared local rule. That aligns with process-based and systems-based generative art.

So “cells communicate with neighbors” is the mechanism that makes GNCA both biologically plausible and artistically interesting: local, differentiable, and capable of growing and repairing complex forms from a single cell.

---

## 2. Lenia (Bert Wang-Chak Chan)

### 2.1 Source and Links

- **Author:** Bert Wang-Chak Chan (Bert Chan).  
- **Main page:** https://chakazul.github.io/lenia.html  
- **GitHub:** https://github.com/Chakazul/Lenia (Python, R, Jupyter, Matlab, JavaScript).  
- **Papers:**  
  - Chan, B.W. (2019). *Lenia: Biology of Artificial Life*. Complex Systems, 28(3), 251–286. arXiv:1812.05433.  
  - Chan, B.W. (2020). *Lenia and Expanded Universe*. Artificial Life Conference Proceedings, (32), 221–229. arXiv:2005.03742.

### 2.2 Key Ideas

- **Continuous CA (vs discrete Game of Life):**  
  - **Continuous state:** cell values in [0, 1], not just on/off.  
  - **Continuous time:** updates use a growth term and small Δt (e.g. 0.1), so dynamics are smooth.  
  - **Continuous space:** neighborhoods are large circular regions with a kernel K; interaction is via convolution K∗A, not a fixed 3×3 count [Chan 2019; chakazul.github.io].

- **Update equation:**  
  **A(t + Δt) = [A(t) + Δt · G(K ∗ A(t))]₀¹**  
  - K∗A: convolution of state field with kernel K.  
  - G: growth mapping (e.g. unimodal in μ, σ).  
  - [·]₀¹: clip to [0,1].  
  So growth is driven by local “density” (K∗A), modulated by G [Chan 2019; Wikipedia; ar5iv 2005.03742].

- **Kernels:** Radially symmetric kernels (e.g. ring, Gaussian) over a radius R define how each cell sees its neighborhood. Different K and G produce different “species” [chakazul.github.io].

- **Orbium and 400+ species:** Orbium is a continuous glider (discovered 2015); later work catalogued 400+ species with lifelike behavior: self-organization, self-repair, symmetry, locomotion, and in extensions: self-replication, emission, polymorphism, colonies [chakazul.github.io; Chan 2019, 2020].

- **Evolutionary search:** Quality-diversity (e.g. MAP-Elites, AURORA) and other algorithms (e.g. IMGEP, HOLMES) are used to discover new self-organizing patterns and self-replicators [LeniaBreeder; Inria automated-discovery].

### 2.3 Why Lenia Is Cited in the Atelier PRD

In **PRD.md**, Phase 1 creative techniques specify:

- **Section 4.1 — Cellular Automata:** “**Lenia-style continuous CA** — Smooth rules (not just on/off), organic-looking patterns, growth, movement, reproduction.”
- **Section 12.2 — Related Work:** “Lenia continuous CA framework.”

So Lenia is the named reference for what “continuous, organic” CA means in Atelier: smooth state and time, kernel-based neighborhoods, and emergence of growth/movement/reproduction rather than discrete Life-like rules. Phase 2 also mentions “Neural CA (train on aesthetic preferences),” which aligns with the GNCA direction (differentiable, trainable CA).

---

## 3. Relevance to Atelier

### 3.1 Atelier’s Current CA Stack

- **Specialized generator:** `src/generators/p5/CellularAutomata.ts` — “Lenia-style continuous CA with smooth rules,” organic patterns, multiple neighborhoods, convolution/kernels, multi-species, options for activation, smoothing, interpolation [CellularAutomata.ts].
- **P5Generator fallback:** `generateCellularAutomata()` in `P5Generator.ts` produces a classic discrete Game of Life (binary grid, count neighbors, birth/death rules). So Atelier already distinguishes “Lenia-style” (continuous, organic) from “classic” CA.

### 3.2 How GNCA and Lenia Inform Continuous/Organic CA for Generative Art

| Aspect | Lenia | GNCA | Design implication for Atelier |
|--------|--------|------|----------------------------------|
| **Smooth rules** | State in [0,1]; G(K∗A) continuous; Δt small | Continuous state vector; differentiable update | Prefer continuous state + smooth activation (e.g. sigmoid) and small time steps; avoid hard thresholds where not needed. |
| **Neighborhood** | Large, kernel-based (K∗A) | Small (3×3) but gradient-based perception | Support both: kernel/radius for “Lenia-like” density, and optional gradient/perception for “GNCA-like” local structure. |
| **Emergence** | 400+ species from same formalism; Orbium, gliders, self-replication | Single seed → target pattern; regeneration from damage | Emphasize exploration (parameter sweeps, evolution) and single-seed/organic init (e.g. center blob, symmetric) for emergence. |
| **Evolution** | Evolutionary search, QD, IMGEP for new patterns | Training by gradient to a target (or aesthetic loss) | Phase 1: parameter mutation/GA (as in PRD); Phase 2: “Neural CA” trained on aesthetic preferences (GNCA-style). |

### 3.3 Design Choices Suggested by GNCA and Lenia

1. **Smooth, continuous rules:** Prefer continuous state and smooth growth (Lenia’s G, GNCA’s differentiable updates). In Atelier this is already reflected in `type: 'lenia'`, `continuous: true`, `smoothing: true`, and activation choices (e.g. sigmoid).
2. **Kernels and radius:** Lenia’s kernel (ring, radial) and radius R are core. Atelier’s `kernel`, `radius`, and `neighborhood: 'circular'` match this; keeping kernel configurable supports both classic and organic behaviors.
3. **Emergence over hand-authored rules:** Both systems get complexity from few parameters (Lenia: K, G, μ, σ; GNCA: one small network). Atelier can favor “few knobs, many behaviors” and document discovery workflows (e.g. center/symmetric init, mutation, multi-species).
4. **Evolution and discovery:** Lenia’s use of evolutionary search and QD suggests: expose parameters (kernel shape, μ, σ, timeStep, radius) to genetic/quality-diversity pipelines and “generate 5 variations, user selects” (as in PRD Section 4.1).
5. **Trainable morphogenesis (future):** GNCA shows that differentiable CA can be trained to grow/regenerate targets. That supports PRD Phase 2 “Neural CA (train on aesthetic preferences)” as a natural extension of the current Lenia-style CA generator.

---

## 4. Summary Table

| Topic | Main idea | Link |
|-------|-----------|------|
| **GNCA** | Differentiable CA; morphogenesis from one cell; local communication (Sobel gradients + MLP); grow/persist/regenerate; trainable to target or aesthetic | [Distill 2020](https://distill.pub/2020/growing-ca/), [Google Research](https://research.google/pubs/growing-neural-cellular-automata/) |
| **Lenia** | Continuous CA (state, time, space); A + Δt·G(K∗A); kernels; 400+ species; Orbium; self-replication; evolutionary search | [chakazul.github.io](https://chakazul.github.io/lenia.html), [Chakazul/Lenia](https://github.com/Chakazul/Lenia) |
| **Atelier PRD** | Phase 1: “Lenia-style continuous CA” — smooth rules, organic patterns, growth/movement/reproduction; Phase 2: Neural CA | PRD.md §4.1, §12.2 |
| **Atelier code** | `CellularAutomata.ts`: Lenia-style type, kernels, radius, continuous/smoothing; P5Generator: discrete Life fallback | `src/generators/p5/CellularAutomata.ts`, `P5Generator.ts` |

---

## References

- Distill 2020 — Mordvintsev et al., *Growing Neural Cellular Automata*, https://distill.pub/2020/growing-ca/
- Google Research — Growing Neural Cellular Automata, https://research.google/pubs/growing-neural-cellular-automata/
- Chan 2019 — B.W. Chan, *Lenia: Biology of Artificial Life*, Complex Systems 28(3), 251–286, arXiv:1812.05433
- Chan 2020 — B.W. Chan, *Lenia and Expanded Universe*, ALIFE 2020, arXiv:2005.03742
- chakazul.github.io — Lenia (Bert Chan), https://chakazul.github.io/lenia.html
- GitHub Chakazul/Lenia — https://github.com/Chakazul/Lenia
- PRD.md — Atelier Product Requirements (§4.1 Creative Techniques, §12 Appendices)
- CellularAutomata.ts — `src/generators/p5/CellularAutomata.ts`
- P5Generator.ts — `src/generators/p5/P5Generator.ts`
