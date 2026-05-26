# Full Liminal Utilization For Living Sites

## Goal

Living Sites must evolve websites through the real Liminal creative engine, not only through a deterministic shader/textgen skin. A full-liminal composition run inventories every site-compatible domain, generates candidates through the generator registry, validates them, renders/scores where supported, composes selected layers into installable runtime assets, and writes explicit receipts for every used, blocked, or failed capability.

## Product Contract

- `balanced` mode remains the small shader/textgen path for fast local runs.
- `full-liminal` mode routes through `LiminalSiteCreativeOrchestrator`.
- Full mode supports `p5`, `three`, `shader`, `hydra`, `tone`, `strudel`, `svg`, `html`, `textgen`, `kinetic`, `ascii`, `revideo`, and `hyperframes`.
- Product code does not substitute deterministic templates when a generator fails.
- Proof and tests may inject bounded fixture generators so runtime, receipts, UI, API, MCP, and patch paths can be verified without live model credentials.
- Every composition persists a capability matrix, rejected candidates, render/scoring receipts, runtime status, and CompositionEngine project summary.

## Implementation Map

1. Capability matrix:
   `src/sites/creative/LiminalCapabilityMatrix.ts`

2. Full orchestration:
   `src/sites/creative/LiminalSiteCreativeOrchestrator.ts`

3. Public engine:
   `WebsiteEvolutionEngine.composeCreativeSite(..., { strategy: 'full-liminal' })`

4. Operator surfaces:
   API `/api/living-sites/:siteId/creative-composition`
   API `/api/living-sites/:siteId/capabilities`
   MCP `liminal_site_compose_creative`
   MCP resource `liminal://sites/{siteId}/capabilities`
   Studio Full Liminal mode and capability receipt panel

5. Proof:
   `pnpm proof:living-sites-full-liminal`
   `pnpm proof:living-sites-dogfood`

## Verification Standard

The run is not accepted unless:

- `capabilityMatrix.fullRunSatisfied` is true for all-domain full proof.
- all used layers have validation receipts.
- failed or blocked domains appear in `rejectedCandidates` with reasons.
- browser runtime exposes `window.__liminalSitesCreative`.
- audio domains are user-gesture gated.
- generated assets include `liminal-creative.css`, `liminal-creative.js`, and `liminal-creative-manifest.json`.
- dogfood before/after screenshots show changes across body, hero, button, link, card, and layout.
