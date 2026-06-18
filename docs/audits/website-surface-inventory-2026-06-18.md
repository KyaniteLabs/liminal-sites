# Website Surface Inventory - 2026-06-18

## Verdict

Liminal Sites still contains inherited Liminal/Sinter product surfaces. The
website-design boundary from `docs/BACKPORT_POLICY.md` is correct, but the repo
needs staged cleanup rather than one large deletion PR.

This pass removes the clearest public mismatch: `landing-live/` was a tracked
creative-code dogfood gallery. That is not a Liminal Sites website-design
surface.

## Remediated In This PR

| Surface | Previous state | New state |
| --- | --- | --- |
| `landing-live/` | 198 tracked generated gallery files across p5, GLSL, Hydra, Strudel, Tone, Revideo, ASCII, HTML, provider/model variants, and recovered dogfood archives. | One small `index.html` bridge that points website demos to `docs/LIVING_SITES_DEMO_GALLERY.md` and standalone creative-code demos to Sinter. |
| `test/unit/landing-live-gallery.test.ts` | Locked gallery-card behavior for the copied creative-code gallery. | Removed. The public metadata test now locks `landing-live/` to a single bridge page with no iframe/gallery data payload. |

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
| `scripts/dogfood*`, `scripts/landing/*`, `scripts/testing/*` references to `landing-live/` | Remove or move behind Sinter/upstream tooling unless a website demo flow still calls them. | This PR avoids editing broad scripts because they may still be referenced by archival/internal docs and old proofs. |
| `docs/architecture.html`, `docs/CREATIVE_DOMAIN_TYPES.md`, `docs/FINISH_LINE.md`, model/domain research docs | Reclassify as archive, Sinter docs, or remove from public docs index. | Many still describe creative-domain lock status instead of website-design operation. |
| `artifacts/dogfood`, `dogfood-campaign*`, `dogfood-telemetry`, `examples/generated`, creative domain plugins | Decide whether any are fixtures for website demos; otherwise move out of the website repo. | Large artifact cleanup should be its own PR with size and test receipts. |
| `src/generators/*`, `src/core/*`, `src/gallery/*`, `src/composition/*` | Trace active site call paths before deleting. | These are too broad to remove in a public-surface cleanup PR without breaking inherited site workflows. |

## Boundary Rule

New public examples in this repo should demonstrate website profiles, design
directions, runtime skins, preview receipts, rollback, or repo-native patch
planning. Standalone creative-code domain demos should live in Sinter and be
linked from Liminal Sites only when useful.
