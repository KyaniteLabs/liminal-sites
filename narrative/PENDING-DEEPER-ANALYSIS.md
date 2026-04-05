# Deeper YouTube Analysis Plans and other general data mining notes

> The agent will read this after integrating current findings into the deliverables.
> Add your ideas below — they won't be forgotten.

## Your Notes

<!-- Write your plans here. The agent will pick them up after the current integration work is complete. -->

1) **COMPLETED** — Jake Van Cleef marked as key person in MEMORY.md. ICM recognized as the methodology that enabled the transition from iteration to shipping.

2) **COMPLETED** — Quiet period investigated. 13 commits to 5 other repos (CEO_Agents, puenteworks-site, mcp-video, site-to-stitch, DialectOS). No additional Liminal commits found.

3) **COMPLETED** — YouTube AI video deep-dive not possible. No transcripts accessible. Original video content was not preserved in session logs. Topic themes noted in archaeology deliverable where possible.

4) **COMPLETED** — External data sources explored. Lunar phase data integrated. GitHub public API insufficient for global commit data. Google Takeout data declined by user. See data/external-data.md for Takeout-3 integration.

5) **COMPLETED** — Era 10 defined ("The Cleanup") and expanded. Originally 8 main commits. Now 35+ commits across Apr 2-3: config audit cascade (catalog → classify → fix → deep audit), documentation remediation, cross-agent tooling audit, and 4-agent parallel worktree development. Era confirmed as significant.

6) **COMPLETED** — Archaeology workflow formalized. See narrative/liminal-archaeology branch and pattern established. Templates and data pipeline documented in memory/archaeology-session-summary.md.

7) **COMPLETED** — Blog/video outlines deferred to post-archaeology phase. Content exists in deliverable but not yet extracted into separate blog posts or video scripts.

8) **PENDING** — Repo organization agent waiting in separate worktree (agent-kimi-20260402 branch). BLOCKED — must merge last after all other agents finish. Has merge playbook, monitoring scripts, and pre-launch checklist ready. 3,700+ files reorganized.

9) **COMPLETED** — Forensic audit done Apr 2, 2026. See AUDIT-REPORT.md. Overall rating B+; 1 critical, 8 moderate, 8 minor issues. No fabricated data.

10) **COMPLETED** — Feasibility assessed. Google Takeout declined. Global GitHub commits not available via public API. External supplementary data limited to lunar phases and cross-repo activity. Takeout-3 data integrated where possible.

11) **COMPLETED** — Gap findings relayed to archaeology agent. Input provided via ~/.kimi/prompts/archeology-gap-findings.md. Analysis incorporated into deliverable.

## New items discovered during work

12) **IN PROGRESS** — Era 10 has grown significantly. 25+ new commits on main (Apr 2-3): config audit cascade (catalog → classify → fix → deep audit). 4 concurrent AI agents now active in separate worktrees. Era renamed from tentative to confirmed.

13) **PENDING** — Blog and video content extraction. Archaeology deliverable has rich narrative material suitable for blog posts and video scripts. Full drafts exist for posts 4, 5 and video 1. Posts 1-3 and videos 2-3 have outlines only.

14) **COMPLETED** — YouTube engagement enrichment. Added heuristic distinction between active watching (intentional learning) and passive autoplay (learning by osmosis). See youtube-engagement-heuristics.json. Active ~35-40%, passive ~60-65%. User validated the distinction applies.

15) **PENDING** — Multi-agent coordination tracking. Four agents running in parallel worktrees:
    - **Archaeology** (this branch): Narrative forensics, updating with latest commits
    - **Foamy** (worktree-foamy-kindling-crane): Cross-agent AI tooling audit — STILL WORKING, expanding roadmap
    - **Kimi** (agent-kimi-20260402): Structural repo reorg — BLOCKED, waiting for other agents to finish
    - **Main branch agent**: Config audit cascade — STILL WORKING, may produce more commits
    Merge order: foamy → archaeology → kimi (structural reorg must go last)

16) **PENDING** — User validation of YouTube engagement heuristics. The engagement model needs spot-checking against actual experience. Which videos were actively watched vs autoplayed? See youtube-engagement-heuristics.json for initial estimates.

## Era 11-13 items (Apr 3-4, 2026 update)

17) **IN PROGRESS** — Archaeology system update for 319 new commits. Database updated to 675 commits, 3 new eras classified (11-13), 6 analysis agents launched. Deliverables being updated.

18) **RESOLVED** — The 0.68 Dead Zone is FIXED. `scoreReliable()` wired into `RalphLoop.ts:448` (was dead code from commit 576819b until wiring fix). Coverage gate active: <6 dimensions triggers LLM fallback. Misleading `score()` JSDoc corrected. Note: `CompostSoup.ts:88` uses `FragmentScorer` (separate pipeline, not affected by 0.68 issue).

19) **COMPLETED** — Model-agnostic architecture built. 6 provider adapters (OpenAI, Anthropic, Ollama, Google, OpenRouter, LM Studio), ProviderFactory, CapabilityRegistry, ThinkingNormalizer, role-based config (Generator/Evaluator/Harness). Zero hardcoded model names in src/. Era 11.

20) **COMPLETED** — Composition system built. 17 commits: LayerManager, CompositionEngine, LayerSequencer, KeyframeAnimation, LayerMask, blend modes, 6 generator adapters, ProjectSerializer v2.0. Era 11.

21) **COMPLETED** — Dogfood campaign completed. 12 models tested, 324 runs, 64.5% overall success. MiniMax 81.5%, Ollama cloud 61.7%. Campaign dashboard HTML with 6 charts. Era 11.

22) **COMPLETED** — Swarm intelligence emerged. Agora protocol for inter-agent communication, Thompson Sampling model router, SymbolicCreativeLanguage wired into swarm loop, creative notation schema with certification tests, vocabulary optimization via soup loop, prompt compression (31% reduction). Era 12.

23) **COMPLETED** — Code quality improvements. ESLint errors 11→0, console.log→Logger in production code, 10 @ts-expect-error suppressions replaced with proper Window types, dead modules removed (PromptEnhancer, 2 superseded modules), orphaned archives deleted. Era 13.

24) **PENDING** — Verify write-only archives issue (MAP-Elites/NoveltyArchive). Original #1 recommended fix (~80 lines). May have been partially addressed by composition system's LayerSequencer retrieving from archives.
