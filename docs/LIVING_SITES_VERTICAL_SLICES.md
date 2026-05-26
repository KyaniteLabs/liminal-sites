# Liminal Sites Vertical Slices

This document is the handoff map for the first usable Liminal Sites app. The branch stack is intentionally vertical: each slice leaves the product more usable by an operator, not merely more plumbed.

## Current PR Stack

| Slice | Name | Branch | Base | Operator outcome |
| --- | --- | --- | --- | --- |
| slice-1 | Executable living-site MVP | `feature/living-sites-mvp` | `main` | Create a living-site profile, generate runtime skins, preview, export, plan repo patches, and expose the MCP server. |
| slice-2 | Real website ingestion | `feature/real-site-ingestion` | `feature/living-sites-mvp` | Ingest a real website URL or path and preserve screenshot-backed design receipts before evolution. |
| slice-3 | Aesthetic intelligence and taste memory | `feature/aesthetic-intelligence-loop` | `feature/real-site-ingestion` | Rank generated directions, record taste memory, and evolve from the strongest direction. |
| slice-4 | Installable deployment path | `feature/deployment-path` | `feature/aesthetic-intelligence-loop` | Package a selected skin into installable CSS and JS snippets with an install preview. |
| slice-5 | Project history and rollback | `feature/project-dashboard` | `feature/deployment-path` | Show saved-site history, publish a recovery target, and preserve rollback receipts. |
| slice-6 | Operator runbook and resilience | `feature/operator-runbook-resilience` | `feature/project-dashboard` | Derive readiness checks and recovery paths from persisted receipts. |
| slice-7 | Full Liminal creative composition | `feature/full-liminal-utilization` | `feature/operator-runbook-resilience` | Compose a selected skin through every site-compatible Liminal domain with used, blocked, and failed capability receipts. |
| slice-8 | Full journey sweep and handoff | `feature/operator-final-sweep` | `feature/full-liminal-utilization` | Prove the complete Studio, MCP, docs, and handoff journey with one local sweep command. |

## Complete Operator Journey

1. Start Studio with `pnpm gui`.
2. Open **Living Site** from the More tools rail.
3. Create or load a profile.
4. Ingest the current website from a URL or local path.
5. Confirm the ingestion receipt includes the screenshot and captured design signals.
6. Generate runtime-skin directions.
7. Mark a direction as Favorite, Publish, or Reject to create taste memory.
8. Evolve again from the recorded taste.
9. Compare directions and inspect the aesthetic ranking.
10. Compose the selected skin in Full Liminal mode and inspect the capability matrix, rejected candidates, and audio/video receipts.
11. Preview the selected skin plus creative composition in the iframe before installing anything.
12. Export the runtime assets when a local artifact is needed.
13. Create a deployment package and inspect the install preview.
14. Record a rollback receipt for the selected recovery target.
15. Open the Project dashboard and confirm the latest receipts are visible.
16. Create the Operator runbook and follow its checks, recovery paths, and exact next actions.
17. Use MCP tools for the same path when an external agent owns orchestration.

## One-Command Local Proof

Run:

```bash
pnpm proof:living-sites-sweep
```

That command performs the final product sweep locally:

- runs the browser-backed Studio operator proof
- verifies ingestion, generation, taste memory, evolution, comparison, full-liminal composition, preview, deployment, rollback, dashboard, and runbook UI paths
- fetches the preview iframe and install preview HTML
- captures a full-page visual screenshot
- starts the MCP server over stdio and validates all living-site tools are present
- checks this handoff document and README linkage
- writes `.omx/proof/living-sites-operator-sweep/receipt.json`
- writes `.omx/proof/living-sites-operator-sweep/handoff.md`

For a smaller product dogfood run that creates a simple static website and lets
Liminal Sites ingest, mutate, visually apply, package, roll back, and runbook it:

```bash
pnpm proof:living-sites-dogfood
```

The same strict dogfood path is also addressable as:

```bash
pnpm proof:living-sites-full-liminal
```

The dogfood proof is intentionally strict: the selected skin must come from the
evolved run, compose with `strategy: full-liminal` and `domainMode: all`, apply
in a real browser, change at least 50,000 screenshot bytes, and record
computed-style changes across body, hero, button, link, card, and layout
categories. A background-only or headline-only mutation is a failure.

For a broader collaborator-facing reliability pass across multiple site archetypes:

```bash
pnpm proof:living-sites-reliability
```

That sweep creates operator launch, B2B control room, creative portfolio, and
venue/menu source sites, then proves ingestion, evolution, full-liminal
composition, browser mutation, deployment receipts, rollback/runbook receipts,
repo patch planning, before/after screenshots, and a generated gallery.

## Proof Artifacts

The proof command writes:

| Artifact | Purpose |
| --- | --- |
| `.omx/proof/living-sites-operator-smoke/metrics.json` | Raw browser and DOM metrics from the visual Studio smoke. |
| `.omx/proof/living-sites-operator-smoke/studio-living-site.png` | Full-page screenshot for visual inspection. |
| `.omx/proof/living-sites-operator-sweep/receipt.json` | Machine-readable pass/fail receipt for the complete journey. |
| `.omx/proof/living-sites-operator-sweep/handoff.md` | Human-readable handoff generated from the verified receipt. |
| `.omx/proof/living-sites-dogfood/receipt.json` | Machine-readable dogfood receipt for the created source website and selected mutation. |
| `.omx/proof/living-sites-dogfood/capability-matrix.json` | Full Liminal capability matrix with used, blocked, and failed domains. |
| `.omx/proof/living-sites-dogfood/composition-manifest.json` | Installable creative manifest, layers, CompositionEngine summary, and receipts. |
| `.omx/proof/living-sites-dogfood/browser-runtime-receipt.json` | Browser-observed `window.__liminalSitesCreative` runtime receipt. |
| `.omx/proof/living-sites-dogfood/render-score-summary.json` | Render, scoring, and runtime-status summary for selected layers. |
| `.omx/proof/living-sites-dogfood/rejected-candidates.json` | Persisted blocked/failed candidate reasons. |
| `.omx/proof/living-sites-dogfood/source-site.png` | Browser screenshot of the created source website before mutation. |
| `.omx/proof/living-sites-dogfood/mutated-site.png` | Browser screenshot after the selected Liminal Sites runtime mutation is applied. |
| `.omx/proof/living-sites-reliability-sweep/receipt.json` | Multi-scenario reliability receipt for collaborator review. |
| `.omx/proof/living-sites-reliability-sweep/gallery.html` | Local before/after demo gallery generated from the reliability sweep. |

## Completion Standard

A slice is only counted as done when all of these are true:

- the operator can use the new path in Studio or MCP
- local typecheck, build, targeted tests, and relevant proof commands pass
- visual output has been inspected when UI changed
- the PR is opened against the previous slice branch
- GitHub Actions are not retriggered unnecessarily

## Backport Notes

The same-millisecond receipt ordering fix in `WebsiteEvolutionEngine` is product-relevant here and may also be useful upstream if base Liminal adopts receipt dashboards. Any shared fixes discovered while hardening Liminal Sites should be evaluated against `docs/BACKPORT_POLICY.md` before landing back in `KyaniteLabs/liminal`.
