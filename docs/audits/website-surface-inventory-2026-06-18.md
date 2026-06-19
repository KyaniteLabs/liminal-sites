# Website Surface Inventory - 2026-06-18

## Verdict

Liminal Sites still contains inherited Liminal/Sinter engine code, historical
audits, and internal planning docs, but the active public website surface is now
narrowed to the website-design product boundary from `docs/BACKPORT_POLICY.md`.

The cleanup was staged across small PRs instead of one broad source deletion:
first the copied `landing-live/` gallery, then executable dogfood gallery
scripts, then public docs and committed generated artifacts.

## Remediated In This PR

| Surface | Previous state | New state |
| --- | --- | --- |
| `landing-live/` | 198 tracked generated gallery files across p5, GLSL, Hydra, Strudel, Tone, Revideo, ASCII, HTML, provider/model variants, and recovered dogfood archives. | One small `index.html` bridge that points website demos to `docs/LIVING_SITES_DEMO_GALLERY.md` and standalone creative-code demos to Sinter. |
| `test/unit/landing-live-gallery.test.ts` | Locked gallery-card behavior for the copied creative-code gallery. | Removed. The public metadata test now locks `landing-live/` to a single bridge page with no iframe/gallery data payload. |

## Remediated In Dogfood Script Cleanup

| Surface | Previous state | New state |
| --- | --- | --- |
| `scripts/dogfood*`, `scripts/dogfood/*`, and old landing gallery builders | Provider/domain dogfood scripts generated standalone creative-code gallery HTML into `landing-live/`. | Removed from the website repo. Sinter owns standalone creative-code demo generation. |
| Old `scripts/analysis/*` and `scripts/testing/*` gallery helpers | Internal helper scripts still wrote Agent A/B or local model outputs to `landing-live/`. | Removed where their only public artifact target was the deleted gallery surface. |
| `dogfood:report` package command and dogfood-script tests | Public npm metadata still advertised/report-tested the inherited gallery dogfood flow. | Removed. `proof:living-sites-*` remains the website-design dogfood path. |
| Package keyword `creative-coding` | Published package metadata still framed Liminal Sites as a creative-coding repo. | Replaced with `website-design`. |
| `docs/internal/DOGFOOD_READINESS_AUDIT_REPORT.md` | Live internal docs still described deleted dogfood scripts as production-ready tooling. | Moved to `docs/archive/internal-audits/` as historical provenance. |

## Remediated In Public Docs And Artifact Cleanup

| Surface | Previous state | New state |
| --- | --- | --- |
| `docs/features.html`, `docs/architecture.html`, `docs/cli-reference.html`, `docs/io-catalog.html`, `docs/soul-system.html` | Active docs root still exposed old Liminal/Sinter creative product pages. | Moved to `docs/archive/liminal-product-pages/`. |
| `docs/CREATIVE_DOMAIN_TYPES.md`, `docs/FINISH_LINE.md`, generator/model research docs, and old textgen docs | Active docs root still described creative-domain lock status, model experiments, and Sinter generator contracts as current Liminal Sites docs. | Moved to `docs/archive/sinter-lineage/` with historical provenance preserved. |
| `docs/marketing/*` | Active docs root retained old launch-thread and content-calendar drafts for Liminal/Sinter creative-coding launch copy. | Moved to `docs/archive/sinter-lineage/marketing/`. |
| `artifacts/` | Repository tracked generated dogfood galleries, screenshots, archives, and local result payloads. | Removed from tracked source. Current proof receipts are local under `.omx/proof/`. |
| `docs/README.md` and `docs/launch/feature-claim-ledger-2026-05-06.md` | Linked and audited the archived `docs/features.html` creative-domain surface. | Updated to the website-design public surface, `docs/index.html`, and living-sites proof paths. |
| Public docs regression tests | Locked old market/creative launch copy and the archived feature page. | Replaced with website-boundary assertions for active docs. |

## Remediated In Plugin And Example Surface Cleanup

| Surface | Previous state | New state |
| --- | --- | --- |
| `plugins/*` root generator stubs | Checked-in creative-domain plugin folders made the repo look like a standalone creative-code plugin host. The active generator registry already has built-in static entries and falls back cleanly when the root plugin directory is absent. | Removed from the active repo surface. Plugin loader unit fixtures remain under `test/fixtures/plugins/` for loader behavior coverage. |
| `docs/dynamic-domain-registration.md` | Active docs root described dynamic creative-domain plugin registration as current product guidance. | Moved to `docs/archive/sinter-lineage/` as historical Liminal/Sinter plugin-system provenance. |
| Generated creative examples under `examples/batches`, `examples/results`, `examples/p5`, `examples/glsl`, `examples/three`, `examples/generated-fireworks.js`, and `examples/parallel-results.json` | Tracked generated or standalone creative-code examples that were not website-design operator examples. | Removed from tracked source and ignored for future local generation outputs. Maintained example coverage now stays on the two composition API examples used by `pnpm check:examples`. |

## Keep For Now

| Surface | Reason |
| --- | --- |
| `src/sites/*` | Canonical website-design product code. |
| `docs/LIVING_SITES_*` | Website-specific operator/demo documentation. |
| `proof:living-sites-*` scripts | Current verification path for profiles, variants, runtime skins, receipts, and repo-native site evolution. |
| Inherited engine code on active site paths | May still be needed by site generation, preview, persistence, or MCP workflows until extraction is planned. |

## Needs Follow-Up Classification

| Surface | Likely action | Notes |
| --- | --- | --- |
| Remaining historical audit logs and internal docs | Keep archived or move under clearer archive/Sinter labels as ownership gets clearer. | They are no longer linked as current public website docs, but they still contain old paths for provenance. |
| Remaining source-level creative engine modules | Keep until call-path tracing proves they are not needed by living-site generation, preview, MCP, or proof paths. | `src/sites/creative/LiminalCapabilityMatrix.ts` and living-sites proof fixtures still use the generator registry and composition adapters. |
| `src/generators/*`, `src/core/*`, `src/gallery/*`, `src/composition/*` | Trace active site call paths before deleting. | These are too broad to remove in a public-surface cleanup PR without breaking inherited site workflows. |

## Boundary Rule

New public examples in this repo should demonstrate website profiles, design
directions, runtime skins, preview receipts, rollback, or repo-native patch
planning. Standalone creative-code domain demos should live in Sinter and be
linked from Liminal Sites only when useful.
