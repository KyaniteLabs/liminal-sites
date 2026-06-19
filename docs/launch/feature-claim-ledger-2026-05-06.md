# Feature Claim Ledger - 2026-05-06

This ledger maps public launch claims to current proof. It is intentionally
stricter than implementation status: a feature can be implemented while still
being unsafe to advertise as proven product value.

Launch rule: public copy may use `proven` only when the claim maps to a current
passing command, live receipt, or branch-protection readback. Otherwise use
`implemented`, `experimental`, `caveated`, or `blocked`.

Audited public claim surfaces:

- `docs/index.html`
- `docs/launch/ml-feature-value-matrix.md`
- `docs/launch/test-ci-truth-matrix-2026-05-01.md`
- `docs/SECURITY.md`
- `.github/workflows/ci.yml`
- `.github/workflows/pr-review.yml`

## Claim Ledger

| Claim Surface | Public Claim | Launch Label | Current Proof | Caveat / Next Proof |
| --- | --- | --- | --- | --- |
| `docs/index.html` | Liminal Sites is a living website evolution engine for site profiles, design directions, runtime skins, preference memory, preview receipts, rollback, and repo-native patch planning. | proof-hardened | Public metadata tests cover the website-focused landing page, AI discovery files, source repository, Sinter relationship, and package metadata. `docs/LIVING_SITES_VERTICAL_SLICES.md` records the operator proof commands and receipt paths. | Broad launch claims still require fresh receipts generated on the release commit. |
| `docs/index.html` | Sinter owns the standalone creative-coding studio surface. | boundary documented | `docs/BACKPORT_POLICY.md`, `README.md`, `llms.txt`, and `docs/index.html` identify Sinter as the related creative studio while keeping Liminal Sites focused on website evolution. | Do not reintroduce standalone creative-domain gallery claims into the Liminal Sites public homepage. |
| `docs/index.html` | Website proof receipts are local artifacts rather than committed public gallery payloads. | implemented | `docs/README.md` and `docs/LIVING_SITES_VERTICAL_SLICES.md` document `.omx/proof/` receipt locations; copied `landing-live` gallery payloads and committed `artifacts/` payloads are no longer current public surfaces. | New public examples should show website-design flows and should be generated through the living-sites proof path. |
| `docs/launch/ml-feature-value-matrix.md` | ML features marked proven can be claimed as product value. | proof-hardened | Existing proof commands pass for some unit scopes; FQA-004 receipt validation now requires current commit, freshness, provider/model identity where live providers are involved, artifacts, and case coverage. | Broad launch claims still require fresh receipts generated on the release commit. |
| `docs/launch/test-ci-truth-matrix-2026-05-01.md` | Required checks prove release readiness. | caveated | `build-and-test` includes script-target and route-performance proof; `browser-and-e2e-smoke` runs on PRs; `pnpm verify:integration` and `pnpm test:ci:slow` passed during FQA-033 remediation. | Fast CI still must not be used as proof for live-provider, release-commit, scheduled slow-lane, or broad launch claims. |
| `docs/SECURITY.md` | Security headers are present across PreviewServer and Studio surfaces. | proof-hardened | `test/security/security-headers.test.ts` proves PreviewServer CSP, `X-Frame-Options: DENY`, nosniff, HSTS, and powered-by removal; `test/integration/gui-security-regression.test.js` proves Studio common headers and preview CSP boundaries. | Do not claim every HTTP response has CSP or `X-Frame-Options: DENY`; Studio `/preview` stays same-origin iframe compatible for live preview. |
| `.github/workflows/ci.yml` | PR browser/e2e surface is checked. | smoke-proven | `browser-and-e2e-smoke` runs `pnpm test:e2e` on PRs and passed on PR #497. | Existing e2e suite still has skipped tests; exhaustive slow/browser coverage remains a non-PR lane and must be checked for release-specific browser claims. |
| `.github/workflows/pr-review.yml` | Automated PR review is a release gate. | informational only | Workflow now prints PR metadata and states that it is not an automated review gate. | Real PR review enforcement belongs to Forgejo/GitHub branch protection policy, not this placeholder workflow. |

## Required Before Public Launch

- Fresh release receipts on the release commit: stale, wrong-commit,
  fixture-backed, or narrow receipts are rejected by release-proof validators and
  the final-QA surface gate.
- Branch protection: require PR review and status checks on `main`, verified by
  live source-of-truth readback.
- Browser/e2e truth: keep PR smoke required and classify every skipped e2e test
  against launch risk.
- Integration/slow CI: broad launch-readiness claims require fresh integration
  and slow/browser evidence for the release candidate, not only fast PR checks.
