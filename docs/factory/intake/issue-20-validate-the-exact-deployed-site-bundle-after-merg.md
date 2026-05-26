        # Factory intake for issue #20: Validate the exact deployed site bundle after merged fixes

        Repository: `Pushing-Squares/liminal-sites`
        Category: `llm_fix`
        Source issue: `#20`

        ## User request

        ## Summary
After a fix merges, validate the exact user-opened/deployed surface, not only repo tests, CI, or a fresh local checkout. Liminal just hit a stale-installed-bundle case: main was fixed, but the user-facing macOS app shortcut still opened an older bundle that did not contain the merged recovery path.

## Why it matters
A stale deployed/site bundle can keep users on the broken path even when main is green. For liminal-sites, the equivalent risk is a site preview, hosted build, or user-facing URL still serving old assets after the source fix has merged.

## Suggested adaptation/checklist
- After merging a user-visible fix, identify the exact surface users will open: production URL, preview URL, installed artifact, shortcut target, or packaged bundle.
- Verify that surface contains the fix, not just that the branch/CI passed.
- Smoke the real entrypoint end to end through the deployed/static bundle.
- Capture lightweight evidence: URL or artifact path, build/version marker if available, route exercised, expected fixed behavior, and any generated artifacts/screenshots.
- If stale content is found, rebuild/redeploy/replace the user-opened surface and re-smoke it before calling the fix done.

## Liminal evidence/reference
Liminal PR #522 fixed repo-level Studio GLSL no-artifact recovery and was merged. Follow-up local validation found `~/Applications/Liminal Studio.app` was stale, and the Desktop shortcut pointed to that stale bundle. We rebuilt with `pnpm desktop:package:mac`, replaced the installed bundle, verified the installed app contained the fix strings, launched it, checked `/api/health`, Playwright-smoked the UI, and ran a real installed-backend GLSL generation.

Installed-app evidence: session `tui-1778206917246-gkf3n1`; provider `lmstudio`; resolved model `repo-pipeline-qwen35-q8-prod`; GLSL generation completed in about `190963ms`; route selected `glsl`; events included `generation.complete`, `preview.started`, and `preview.content`; HTML artifact and PNG artifact were present; PNG size was `960x640`.

        ## Factory interpretation

        This issue was picked up by `issue-closer`, but no safe code edit was
        produced by the configured agent providers. The Factory is therefore
        converting the issue into an implementation contract instead of silently
        skipping it.

        ## Acceptance contract

        - Confirm the desired behavior from the issue title and body.
        - Identify the smallest implementation slice that can ship independently.
        - Add or update tests/proofs for that slice before merging implementation.
        - Keep credentials, local machine paths, and deployment secrets out of the repo.
        - Close or update the source issue when the implementation PR lands.

        ## Next Factory action

        Dispatch a repo worker against this contract. If the request is too broad,
        split it into smaller `agent-ready` issues with concrete acceptance checks.
