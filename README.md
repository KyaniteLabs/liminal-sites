# Atelier — Creative Coding Agent

> "The code evolves. You curate."

A generative art system with an internal Ralph-Wiggum Loop.

## Quick Start

```bash
npm install
npm test
atelier --prompt "Create a calming blue particle system"
```

## Architecture

- **RalphLoop**: Iteration engine
- **PromptStore**: Context injection
- **CreativeEvaluator**: Quality gates (score ≥ 0.7)
- **P5Generator**: p5.js sketches
- **PreviewServer**: Live preview on localhost:3456
- **Gallery**: Save/load iterations

## Testing

```bash
npm test  # 418 tests passing
```

## Live Music Coding

Supports Strudel, Hydra, Sonic Pi, p5.js + Web Audio.

---

Built with TDD — 3,095 lines of TypeScript, production-ready.

