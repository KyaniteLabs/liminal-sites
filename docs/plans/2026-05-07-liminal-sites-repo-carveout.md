# Liminal Sites Repository Carveout Implementation Plan

**Goal:** Turn the full-history Liminal clone into a dedicated Liminal Sites product repository for living website evolution.

**Architecture:** Preserve the inherited Liminal engine and add a website-specific layer around profiles, aesthetic variants, runtime skins, and repo-native PR workflows. Keep upstream Liminal configured as `upstream` so shared engine fixes can be backported cleanly.

**Tech Stack:** TypeScript, pnpm, existing Liminal Studio/preview/render stack, GitHub PR workflows, future `@modelcontextprotocol/sdk`.

---

## Task 1: Repository Identity

**Files:**
- Modify: `package.json`
- Replace: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/agents/issue-tracker.md`
- Create: `docs/BACKPORT_POLICY.md`

**Steps:**
1. Rename the package to `liminal-sites`.
2. Point package metadata to `KyaniteLabs/liminal-sites`.
3. Preserve inherited CLI compatibility while adding `liminal-sites` and `lsites` bin aliases.
4. Replace the README with Liminal Sites product framing and seed provenance.
5. Add the backport policy for shared Liminal fixes.
6. Verify with `pnpm typecheck`.
7. Commit with Lore trailers and `Backport-to: none`.

## Task 2: Website Evolution Domain

**Files:**
- Create: `src/sites/SiteProfile.ts`
- Create: `src/sites/SkinSpec.ts`
- Create: `src/sites/WebsiteEvolutionEngine.ts`
- Test: `test/sites/WebsiteEvolutionEngine.test.ts`

**Behavior:**
1. Define `SiteProfile` with source URL or local path, brand brief, constraints, allowed mode, and stack hints.
2. Define `SkinSpec` with design tokens, generated CSS, optional JS layer, provenance, and safety metadata.
3. Implement `generateVariants(profile, prompt, count)` using the inherited generation engine.
4. Implement `recordPreference(siteId, event)` for favorite/reject/more-like-this signals.
5. Implement `evolve(siteId)` using prior preferences and existing taste/evolution hooks.

## Task 3: Runtime Skin MVP

**Files:**
- Create: `src/sites/runtime/exportRuntimeSkin.ts`
- Create: `src/sites/runtime/runtimeSkinTemplate.ts`
- Test: `test/sites/runtime/exportRuntimeSkin.test.ts`

**Behavior:**
1. Export `liminal-skin.css` and `liminal-skin.js`.
2. Use CSS custom properties for palette, typography, spacing, radius, density, and motion.
3. Keep DOM mutation minimal and reversible.
4. Reject unsafe output paths.
5. Verify exported skin can be loaded by a static HTML fixture.

## Task 4: MCP Surface

**Files:**
- Create: `src/mcp/server.ts`
- Create: `src/mcp/siteTools.ts`
- Modify: `package.json`
- Test: `test/mcp/server.test.ts`

**Behavior:**
1. Add `@modelcontextprotocol/sdk`.
2. Register stdio server bin `liminal-sites-mcp`.
3. Expose tools for profile creation, variant generation, preference recording, evolution, preview, export, and repo-patch planning.
4. Expose resources for site profiles, variants, receipts, and selected skins.
5. Verify with a stdio handshake and `list_tools`.

## Task 5: Repo-Native PR Mode

**Files:**
- Create: `src/sites/repo/SiteRepoInspector.ts`
- Create: `src/sites/repo/SitePatchPlanner.ts`
- Create: `src/sites/repo/SitePullRequestWorkflow.ts`
- Test: `test/sites/repo/SitePatchPlanner.test.ts`

**Behavior:**
1. Inspect website repos for framework, routes, styling system, package manager, and verification commands.
2. Generate a patch plan before writing source files.
3. Apply changes in an isolated branch or worktree only.
4. Run build/typecheck/visual smoke before proposing a PR.
5. Classify shared Liminal engine fixes for upstream backport.

## Task 6: Studio Product Surface

**Files:**
- Modify: `gui/src/gui/workbenchState.ts`
- Add site-specific GUI modules under `gui/src/gui/sites/`
- Test: targeted GUI state and telemetry tests

**Behavior:**
1. Add a Living Site workflow without exposing proof/harness language.
2. Show site preview, generated variants, taste controls, and export/publish actions.
3. Keep Runtime Skin Mode as the default MVP path.
4. Gate Repo-Native PR Mode behind review.

## Verification

Run in order:

```bash
pnpm install
pnpm typecheck
pnpm test -- --runInBand
pnpm gui:build
```

For MCP work, also run a direct stdio handshake and assert the expected tools are listed.
