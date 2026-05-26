# Living Site Creative Composer Implementation Plan

**Goal:** Build a first-class Living Sites creative-composition path that installs a cross-domain generative layer on top of a selected runtime skin.

**Update:** This plan describes the original balanced shader/textgen composer. The full utilization expansion is tracked in [2026-05-07-full-liminal-utilization.md](2026-05-07-full-liminal-utilization.md).

**Architecture:** Keep runtime skins as the reversible base layer, then add a persisted creative-composition receipt with shader and textgen layers, installable CSS/JS/manifest assets, API/MCP access, repo patch support, and visual dogfood gates. The first implementation is deterministic and local so proofs do not depend on live LLM credentials, while still using Liminal creative-domain validation and browser execution.

**Tech Stack:** TypeScript, Vitest, Playwright, Express, MCP SDK, Liminal GLSL validation, static runtime CSS/JS assets.

---

### Task 1: Red Tests

**Files:**
- Create: `test/sites/creative/CreativeSiteComposer.test.ts`
- Modify: `test/sites/WebsiteEvolutionEngine.test.ts`
- Modify: `test/sites/repo/SitePatchPlanner.test.ts`
- Modify: `test/integration/living-sites-api.test.js`

**Steps:**
- Add tests that require a shader/textgen composition with valid GLSL, runtime assets, and no swallowed validation errors.
- Add engine persistence and project-summary tests.
- Add repo patch and API tests for installable creative assets.
- Run focused tests and confirm they fail because the composer/API does not exist.

### Task 2: Creative Composer Core

**Files:**
- Create: `src/sites/creative/CreativeSiteComposer.ts`
- Create: `src/sites/creative/index.ts`
- Modify: `src/sites/types.ts`
- Modify: `src/sites/SiteStore.ts`
- Modify: `src/sites/WebsiteEvolutionEngine.ts`
- Modify: `src/sites/index.ts`

**Steps:**
- Define `SiteCreativeComposition` and input/export types.
- Generate validated shader code and a textgen/kinetic typography layer from profile, skin, ingestion, and preference memory.
- Build self-contained browser runtime CSS/JS that injects a WebGL canvas, text treatments, layer badges, and `window.__liminalSitesCreative` receipts.
- Persist, list, export, and summarize compositions.

### Task 3: Operator Surfaces

**Files:**
- Modify: `src/sites/deploy/RuntimeDeploymentPackage.ts`
- Modify: `src/sites/repo/SitePatchPlanner.ts`
- Modify: `gui/server.js`
- Modify: `src/mcp/stdio.ts`

**Steps:**
- Add optional creative composition packaging to deployment packages.
- Add repo patch planning for `liminal-creative.css`, `liminal-creative.js`, and `liminal-creative-manifest.json`.
- Add API routes for create/list/asset/preview composition flows.
- Add MCP tool and resource surfaces for creative composition.

### Task 4: Dogfood Proof

**Files:**
- Modify: `scripts/proof/living-sites-dogfood.ts`

**Steps:**
- Compose a creative site after selecting an evolved skin.
- Inject skin and creative runtime in Playwright.
- Assert at least two creative domains, valid shader receipt, active canvas, nonblank animated pixels, runtime receipts, and strict component deltas.
- Save before/after screenshots and receipt JSON.

### Task 5: Verification And PR

**Commands:**
- `pnpm exec vitest run test/sites/creative/CreativeSiteComposer.test.ts test/sites/WebsiteEvolutionEngine.test.ts test/sites/repo/SitePatchPlanner.test.ts --coverage=false`
- `pnpm exec vitest run test/integration/living-sites-api.test.js --coverage=false`
- `pnpm build`
- `pnpm proof:living-sites-dogfood`

**Steps:**
- Fix failures until green.
- Inspect generated screenshots and receipt.
- Commit with Lore trailers using `[skip ci]`.
- Open a PR without unnecessary Actions churn.
