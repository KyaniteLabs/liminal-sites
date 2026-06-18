# Sinter To Liminal Sites Structural Relevance Audit - 2026-06-18

## Verdict

PR #10 must not make Liminal Sites a second Sinter or Liminal product clone.
Sinter changes transpose into this repo only when they affect website-design or
website-evolution workflows.

Direct creative-domain and generic gallery/core backports are out of scope for
this PR. They belong in Sinter unless a current Liminal Sites website path uses
them.

Comparison refs used for the audit:

- liminal-sites base: `origin/main` at `9483ca04`
- Sinter source: `liminal/main` at `b0682432`
- shared ancestor: `dd4694be67d933fddd15e8f631954c45511b79c9`

## PR #10 Keeps

| Lane | Why it is pertinent | Files |
| --- | --- | --- |
| Public website-design surface | Clarifies that Liminal Sites is the website product and points standalone creative-code demos to Sinter. | `README.md`, `llms.txt`, `docs/index.html`, `docs/llms.txt`, `docs/robots.txt`, `docs/sitemap.xml`, `docs/manifest.json`, `package.json`, metadata tests |
| Boundary policy | Prevents future clone-style backports and gives reviewers a website-design pertinence gate. | `docs/BACKPORT_POLICY.md`, this audit |

## PR #10 Does Not Keep

| Removed lane | Why it was removed |
| --- | --- |
| Strudel before Hydra product detector backport | This is a Sinter creative-domain reliability fix. Liminal Sites should not port it unless a website-design flow is proven to execute Strudel content through the inherited detector. |
| Generic gallery/version validation gate backport | This is a Sinter gallery persistence fix. Liminal Sites should add site artifact validation when website outputs are persisted, not copy a generic creative-gallery gate by default. |
| Sinter dogfood gallery rebrand under `landing-live/` | A copied creative-code dogfood gallery is not website-design product surface. Liminal Sites may link to `s1ntr.com`, but should not maintain the Sinter gallery here. |
| Lockfile churn | Dependency updates are unrelated to the website-design boundary. |

## Relevance Gate For Future Sinter Changes

| Source change | Liminal Sites action |
| --- | --- |
| Provider/config routing truth | Adapt only if `src/sites/*`, site preview, site deploy, or site MCP generation uses the affected provider path. |
| Creative-domain validators and gauntlets | Do not port wholesale. Use Sinter as source of truth. Add only website-preview or embedded-media receipts when a site workflow depends on generated creative media. |
| Generic gallery validation | Do not port by default. Prefer website artifact validation near the `src/sites/*` save/export path. |
| Render washout/blank scoring | Adapt only for website preview screenshots, runtime skins, or deployed site visual receipts. |
| Living-site daemon and PostHog loop | Pertinent, but adapt into `WebsiteEvolutionEngine`, sensorium, and deploy receipts instead of copying a second daemon. |
| Studio, singing, mic, and music surfaces | Out of scope unless redesigned as website-design input modes. |

## Structural Follow-Ups

1. Inventory inherited non-site surfaces and mark each one `keep`, `remove`, or
   `adapt`.
2. Replace inherited/public creative-code gallery surfaces with Liminal
   Sites-specific website examples or links to Sinter.
3. Adapt any useful Sinter living-site loop learnings into `src/sites/*`.
4. Add website-preview validation receipts instead of generic creative-domain
   ratchets.

## Verification Used For This Audit

- `git fetch https://git.kyanitelabs.tech/KyaniteLabs/liminal.git main:refs/remotes/liminal/main`
- `git merge-base origin/main liminal/main`
- `git diff --name-status <base>..liminal/main -- src scripts gui packages bin config test .forgejo .github package.json pnpm-lock.yaml`
- `git show --stat 92381920 aa0b3557 a537c39b 79a7035a 5134deb6 d02faed0 62176f5e 0b948216 a1903fd8 c80dda5e 0b8754c8 ac92bd75 d16cb40d 74eb7b8c 0f14c7f6 6c9f5f17`
