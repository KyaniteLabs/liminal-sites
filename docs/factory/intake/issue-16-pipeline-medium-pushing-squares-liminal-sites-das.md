        # Factory intake for issue #16: [pipeline][MEDIUM] [Pushing-Squares/liminal-sites] Dashboard cannot fully read repository status

        Repository: `Pushing-Squares/liminal-sites`
        Category: `llm_fix`
        Source issue: `#16`

        ## User request

        ## Pipeline issue-surfacing finding

This issue was created or refreshed automatically by the pipeline issue surfacing worker. It is designed to be picked up later by a fixer/triage agent without rediscovering the failure from scratch.

### Signal
- **Repo:** `Pushing-Squares/liminal-sites`
- **Kind:** `dashboard_repo_error`
- **Severity:** `MEDIUM`
- **Source:** `repos/status`
- **Fingerprint:** `issue-surfacing:b907c9022296a937ec4e`
- **Generated at:** 2026-05-10T15:14:29Z

### Root cause hypothesis
Dashboard repo status collection produced errors for this repository.

### Recommended fix
Inspect dashboard GitHub API calls/auth/repo existence and make the status collector produce a deterministic available/unavailable state.

### Acceptance criteria
- Dashboard refresh reports no errors for the repository.

### Evidence
```json
{
  "dashboard_row": {
    "ci_conclusion": "success",
    "ci_name": "CI",
    "ci_status": "completed",
    "ci_timestamp": "2026-05-10T05:21:37Z",
    "errors": [
      "runners: gh: Not Found (HTTP 404)"
    ],
    "open_prs": 0,
    "recent_commits": [
      {
        "date": "2026-05-10T05:21:35Z",
        "message": "Merge pull request #25 from Pushing-Squares/feat/shitty-prompts-mode",
        "sha": "07db53e"
      },
      {
        "date": "2026-05-10T05:21:31Z",
        "message": "Merge pull request #26 from Pushing-Squares/fix/issue-23-show-visible-progress-for-long",
        "sha": "f2aa7d9"
      },
      {
        "date": "2026-05-10T05:21:27Z",
        "message": "Merge pull request #27 from Pushing-Squares/fix/issue-20-validate-the-exact-deployed-si",
        "sha": "2e6bbc8"
      },
      {
        "date": "2026-05-10T05:21:23Z",
        "message": "Merge pull request #28 from Pushing-Squares/fix/issue-18-add-no-artifact-recovery-for-e",
        "sha": "1dc062d"
      },
      {
        "date": "2026-05-10T05:21:20Z",
        "message": "Merge pull request #29 from Pushing-Squares/fix/issue-17-backprop-compose-operator-abor",
        "sha": "423deec"
      }
    ],
    "repo": "Pushing-Squares/liminal-sites",
    "runner_count": 0,
    "runner_status": "none"
  }
}
```

### Self-hosted inference
Self-hosted self-hosted inference provider `lmstudio_nuc` model `repo-pipeline-qwen35-q8-prod` was used to summarize deterministic evidence.

_(🤖 Pipeline Issues)_

<!-- issue-surfacing:b907c9022296a937ec4e -->

### Fallback routing
Target repository issue creation failed, so this finding was written to `Pushing-Squares/the-factory` instead of `Pushing-Squares/liminal-sites`.

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
