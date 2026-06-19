# Liminal Sites Documentation

This docs root is for the website-design product: profiles, design directions,
runtime skins, preview receipts, rollback, and repo-native website patch
planning. Historical Liminal and Sinter creative-code material is kept under
`docs/archive/` for provenance.

## Start Here

| Document | Purpose |
| --- | --- |
| [index.html](./index.html) | Public Liminal Sites landing page and search/AI discovery surface. |
| [COLLABORATOR_QUICKSTART.md](./COLLABORATOR_QUICKSTART.md) | Operator quickstart for local use and collaboration. |
| [LIVING_SITES_VERTICAL_SLICES.md](./LIVING_SITES_VERTICAL_SLICES.md) | Product journey, proof commands, receipts, and current vertical slices. |
| [LIVING_SITES_DEMO_GALLERY.md](./LIVING_SITES_DEMO_GALLERY.md) | Website demo gallery expectations and artifacts. |
| [BACKPORT_POLICY.md](./BACKPORT_POLICY.md) | Boundary for changes that belong here versus Sinter. |
| [SECURITY.md](./SECURITY.md) | Security model and deployment checklist. |

## Website Proofs

| Command | Purpose |
| --- | --- |
| `pnpm proof:living-sites-sweep` | Complete Studio, MCP, docs, and handoff journey proof. |
| `pnpm proof:living-sites-dogfood` | Strict created-site ingestion, mutation, deployment, rollback, and runbook proof. |
| `pnpm proof:living-sites-reliability` | Multi-scenario reliability sweep across site archetypes. |

Proof artifacts are written under `.omx/proof/` and are intentionally local
receipts, not committed public gallery payloads.

## Archive Boundary

Standalone creative-code domain docs, old launch marketing, and copied dogfood
gallery artifacts belong to Sinter or to historical archives. This repository's
active public docs should demonstrate website profiles, design directions,
runtime skins, preview receipts, rollback, and repo-native patch planning.

## Directory Guide

```text
docs/
├── index.html                         Public website surface
├── COLLABORATOR_QUICKSTART.md         Operator quickstart
├── LIVING_SITES_*.md                  Website product proof and demo docs
├── BACKPORT_POLICY.md                 Liminal Sites vs. Sinter boundary
├── SECURITY.md                        Security model
├── launch/                            Historical launch proof ledgers
├── archive/                           Historical Liminal/Sinter provenance
├── audits/                            Cleanup and verification records
└── styles/                            CSS for public HTML docs
```

See the main [README.md](../README.md) for repository setup and current status.
