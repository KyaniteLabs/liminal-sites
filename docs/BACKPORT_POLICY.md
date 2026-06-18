# Website-Design Boundary Policy

Liminal Sites is not a full-history Sinter or Liminal product clone. It is the
website-design and website-evolution product extracted from that lineage.

## Remotes

- `origin`: `https://git.kyanitelabs.tech/KyaniteLabs/liminal-sites.git`
- `upstream`: `https://git.kyanitelabs.tech/KyaniteLabs/liminal.git`

## Product Boundary

Liminal Sites owns:

- website profiles, brand briefs, constraints, and stack hints
- visual directions, design tokens, runtime skins, and preview receipts
- before-and-after review, preference memory, rollback, and saved site runs
- repo-native website patch planning
- website operator Studio, CLI, proof scripts, and MCP tools
- website-specific taste learning, deploy receipts, and sensorium loops

Sinter owns:

- standalone creative-coding Studio and public demos
- creative domain gauntlets and domain lock work
- p5, SVG, GLSL, Three, Hydra, Strudel, Tone, Revideo, HTML, ASCII, Kinetic, and TextGen domain reliability
- singing, mic, and music surfaces unless they become a website-design input mode

Shared engine code may remain here only while it is actively used by
website-design flows. Do not bulk-port upstream creative-code fixes into this
repo just because they landed in Sinter or Liminal.

## Pertinence Gate

Before changing inherited code, answer yes to at least one:

1. Does this change affect `src/sites/*`, site preview/export/deploy, site MCP,
   website docs, or website SEO/GEO?
2. Does a current Liminal Sites proof command fail without this change?
3. Is the inherited code on the active path for generating, validating, saving,
   or previewing a website-design artifact?

If not, do not port it here. Link to Sinter or upstream Liminal instead.

## Adaptation Flow

When a Sinter or Liminal change is relevant:

1. Start from the website workflow that needs it.
2. Adapt through the Liminal Sites interface instead of copying product surfaces.
3. Add or update tests around the site workflow, not generic creative-domain coverage.
4. Keep public docs focused on website design and link to `s1ntr.com` for creative-code demos.

Use this trailer only when it helps review:

```text
Sites-boundary: website-design
```
