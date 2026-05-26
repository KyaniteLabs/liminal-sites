# Liminal Sites Collaborator Quickstart

This is the shortest path for a collaborator to see the product, verify the current claims, and know where to contribute.

## What This Is

Liminal Sites turns an existing website into a living website: it ingests the current surface, generates reviewable design directions, records taste memory, composes cross-domain creative layers, previews the result safely, and packages reversible runtime assets or repo patches.

The repo is collaborator-ready for technical review and dogfooding. It is not yet a polished hosted public demo.

## Current Development State

As of May 8, 2026, the local product path is usable for collaborators who are comfortable running a Node/TypeScript repo.

Ready now:

- local Studio dogfooding
- MCP and HTTP API experimentation
- source website ingestion from URL or local path
- screenshot-backed design receipts
- runtime-skin generation and browser preview
- preference memory, evolution, and aesthetic comparison
- Full Liminal creative composition with capability receipts
- deployment packages, rollback receipts, operator runbooks, and repo patch planning
- proof-driven review through generated receipts, screenshots, and galleries

Still not done:

- polished public hosted demo
- paid team accounts, auth, permissions, billing, and support flows
- production deployment hosting for customer sites
- broad long-run soak testing across many real websites and providers
- merged upstream backport for shared base-Liminal fixes
- remote CI as the only source of truth when commits intentionally use `[skip ci]`

The practical sharing rule is: use this with technical collaborators now, but do not sell it as a no-touch public SaaS yet.

## Install And Run

```bash
pnpm install
pnpm build
pnpm gui
```

Studio starts two local services by default:

| Surface | Default URL | Purpose |
| --- | --- | --- |
| Studio GUI | `http://localhost:5173` | Human operator cockpit. |
| Studio API | `http://localhost:5174` | HTTP API used by Studio and tests. |

Use `LIMINAL_STUDIO_GUI_PORT` or `LIMINAL_STUDIO_API_PORT` when those ports are occupied.

Use `LIMINAL_SITES_ROOT` to isolate state for a demo:

```bash
LIMINAL_SITES_ROOT=/tmp/liminal-sites-demo pnpm gui
```

## Studio Operator Journey

1. Start Studio with `pnpm gui`.
2. Open `http://localhost:5173`.
3. Open **More**.
4. Select **Living Site**.
5. Create a site profile with a name, source URL or local source path, and brand brief.
6. Click **Ingest** to capture the source site and design receipt.
7. Click **Generate** to create runtime-skin variants.
8. Favorite or reject a direction so taste memory has signal.
9. Click **Evolve** to generate from the recorded preference.
10. Click **Compare** to rank candidates against the source and taste signals.
11. Choose **Full Liminal** for creative composition.
12. Click **Compose creative** and inspect the capability matrix, rejected candidates, layer receipts, audio gate, and preview status.
13. Preview the result.
14. Create a deployment package.
15. Create a rollback receipt.
16. Create an operator runbook.
17. Use repo patch planning only against a disposable checkout until the patch is reviewed.

## MCP Usage

Build first, then point an MCP client at the stdio binary:

```bash
pnpm build
LIMINAL_SITES_ROOT=/tmp/liminal-sites-mcp ./bin/liminal-sites-mcp
```

Canonical MCP tool order:

1. `liminal_site_profile_create`
2. `liminal_site_ingest_source`
3. `liminal_site_generate_variants`
4. `liminal_site_record_preference`
5. `liminal_site_evolve`
6. `liminal_site_compare_aesthetics`
7. `liminal_site_compose_creative`
8. `liminal_site_create_deployment_package`
9. `liminal_site_rollback_to_skin`
10. `liminal_site_create_operator_runbook`
11. `liminal_site_plan_repo_patch`

Useful MCP resources:

| Resource | What It Returns |
| --- | --- |
| `liminal://sites/projects` | Saved project dashboard with counts and latest receipts. |
| `liminal://sites/{siteId}/profile` | Source-of-truth living-site profile. |
| `liminal://sites/{siteId}/ingestions` | Captured source receipts and screenshots. |
| `liminal://sites/{siteId}/variants` | Generated runtime skins. |
| `liminal://sites/{siteId}/aesthetic-assessments` | Ranking and taste comparison receipts. |
| `liminal://sites/{siteId}/creative-compositions` | Balanced and Full Liminal composition receipts. |
| `liminal://sites/{siteId}/capabilities` | Capability matrix for site-compatible Liminal domains. |
| `liminal://sites/{siteId}/deployments` | Deployment packages and install snippets. |
| `liminal://sites/{siteId}/rollbacks` | Recovery receipts. |
| `liminal://sites/{siteId}/operator-runbooks` | Readiness checks and recovery paths. |

## HTTP API Usage

Start Studio, then call the API on `http://localhost:5174` unless you changed `LIMINAL_STUDIO_API_PORT`.

Minimal API flow:

```bash
curl -s -X POST http://localhost:5174/api/living-sites/profile \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo Site","sourceUrl":"https://example.com","brandBrief":"A calm product site that should feel alive."}'
```

Use the returned `siteId` for the rest of the journey:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/living-sites/{siteId}/ingest` | Capture source URL/path and optional screenshot. |
| `GET` | `/api/living-sites/{siteId}/ingestions` | List ingestion receipts. |
| `POST` | `/api/living-sites/{siteId}/variants` | Generate runtime-skin directions. |
| `POST` | `/api/living-sites/{siteId}/preferences` | Record favorite/reject/more-like-this signals. |
| `POST` | `/api/living-sites/{siteId}/evolve` | Generate from taste memory. |
| `POST` | `/api/living-sites/{siteId}/aesthetic-assessment` | Rank candidates. |
| `POST` | `/api/living-sites/{siteId}/creative-composition` | Compose balanced or Full Liminal creative layers. |
| `GET` | `/api/living-sites/{siteId}/capabilities` | Inspect capability matrix. |
| `POST` | `/api/living-sites/{siteId}/preview` | Mount a local preview. |
| `POST` | `/api/living-sites/{siteId}/export` | Export runtime skin assets. |
| `POST` | `/api/living-sites/{siteId}/export-creative` | Export creative composition assets. |
| `POST` | `/api/living-sites/{siteId}/deployment-package` | Create install snippets and package files. |
| `POST` | `/api/living-sites/{siteId}/rollback` | Create a rollback receipt. |
| `POST` | `/api/living-sites/{siteId}/operator-runbook` | Create readiness/recovery runbook. |
| `POST` | `/api/living-sites/{siteId}/plan-patch` | Plan repo-native install patches. |
| `GET` | `/api/living-sites/projects` | List saved living-site projects. |

Full Liminal composition request:

```json
{
  "strategy": "full-liminal",
  "domainMode": "all",
  "candidatesPerDomain": 1,
  "maxIterations": 2,
  "includeAudio": true,
  "includeVideoAssets": true
}
```

## Capability Map

| Capability | Current Status |
| --- | --- |
| Profile and project dashboard | Implemented in Studio, API, MCP, and receipts. |
| Real website ingestion | Implemented for URL and local path with optional screenshot capture. |
| Runtime-skin generation | Implemented as reviewable CSS/JS/manifest variants. |
| Preference memory | Implemented through favorite, reject, more-like-this, less-like-this, and publish signals. |
| Evolution | Implemented from recorded preference memory. |
| Aesthetic assessment | Implemented with ranked candidates and stored assessment receipts. |
| Full Liminal creative composition | Implemented with selected/all domain modes and capability receipts. |
| Site-compatible domains | `p5`, `three`, `shader`, `hydra`, `tone`, `strudel`, `svg`, `html`, `textgen`, `kinetic`, `ascii`, `revideo`, `hyperframes`. |
| Audio domains | Generated, validated, packaged, and user-gesture gated. |
| Video domains | Packaged when renderer support is available; otherwise blocked with receipt evidence. |
| Runtime observability | `window.__liminalSitesCreative`, DOM dataset state, frame counts, audio gate state, errors, selected domains, rejected domains, and capability matrix. |
| Deployment package | Implemented with install snippets, runtime assets, creative assets, and manifest files. |
| Rollback receipt | Implemented with selected skin and recovery checklist. |
| Operator runbook | Implemented with readiness checks, journey steps, and recovery paths. |
| Repo patch planner | Implemented for reviewable runtime and creative asset installation into website repos. |
| Proof harness | Implemented for Studio/MCP/API/dogfood/reliability visual checks. |

## Proof Commands

Run these before telling someone the product path is healthy:

```bash
pnpm proof:living-sites-sweep
pnpm proof:living-sites-full-liminal
pnpm proof:living-sites-reliability
```

Use the narrower command while iterating on the reliability gallery:

```bash
pnpm proof:living-sites-reliability -- --list-scenarios
pnpm proof:living-sites-reliability -- --scenario=operator-launch
```

## Proof Receipts

After the proof commands, inspect:

| Artifact | What It Proves |
| --- | --- |
| `.omx/proof/living-sites-operator-sweep/receipt.json` | Studio journey, MCP tool surface, docs linkage, preview, deployment, rollback, dashboard, runbook. |
| `.omx/proof/living-sites-operator-smoke/studio-living-site.png` | Browser-visible Studio operator path. |
| `.omx/proof/living-sites-dogfood/receipt.json` | Strict before/after dogfood site mutation. |
| `.omx/proof/living-sites-dogfood/source-site.png` | Created website before mutation. |
| `.omx/proof/living-sites-dogfood/mutated-site.png` | Website after runtime skin plus Full Liminal creative composition. |
| `.omx/proof/domain-gauntlet-live.json` | Live provider proof for all creative domains when `proof:live-creative-domains` is run. |
| `.omx/proof/living-sites-reliability-sweep/receipt.json` | Multi-scenario reliability receipt. |
| `.omx/proof/living-sites-reliability-sweep/gallery.html` | Local before/after gallery for collaborator review. |

## Good First Collaborator Tasks

- Run the proof commands and report anything confusing in setup.
- Add one new reliability scenario to `scripts/proof/living-sites-reliability-sweep.ts`.
- Improve Studio copy or layout where the operator journey feels unclear.
- Add a curated real website target for a manual dogfood run.
- Review the generated repo patch plan against a framework you know well.

## Sharing Boundaries

Use it for:

- local collaborator review
- technical dogfooding
- visual proof inspection
- MCP tool experimentation
- repo patch planning on disposable repos

Do not use it yet for:

- paid customers
- unattended mutation of production customer sites
- claiming remote CI green when the current branch used `[skip ci]`
- promising hosted deployment, billing, team admin, or support workflows
