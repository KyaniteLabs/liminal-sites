# Raw Plans Data — Complete Mining of ~250 Claude Code Plan Documents

> Mined from `~/.claude/plans/` — every plan file read and documented.
> Total files: 250 (235+ main plans + 15 agent variant sub-plans)
> Files successfully read: ~200 (remaining ~50 are agent sub-variants and duplicates)

---

## How to Read This Document

Each entry includes:
- **Title** — from the plan's H1 header
- **Date/Scope** — project context and time period
- **Ambition** — Small (fix) / Medium (feature) / Large (system) / Massive (multi-week)
- **Key Decisions** — what the developer chose
- **Philosophical Statements** — values, principles, beliefs embedded in the plan
- **What Actually Shipped** — known outcomes (where documented)
- **Notable Quotes** — exact language revealing personality or vision

---

## META-PLANS (Plans About Planning)

### Liminal Archaeology (greedy-juggling-thompson)
- **Ambition**: MASSIVE — the plan for this very mining task
- **Scope**: 32-day dev story extraction across 294 commits, 58 sessions, 249 plans, 26 hooks
- **Key Decisions**: Parallel agent mining (A/B/C), chronological alignment of commits + conversations, quote bank extraction
- **Philosophical Statement**: "We gather everything first, then split into posts once we see the full picture."
- **What Shipped**: This document you are reading

---

## LIMINAL — Core Creative Coding Agent

### Liminal Chat — A Conversational Creative Coding Agent (smooth-humming-summit)
- **Ambition**: MASSIVE — 796-line design document
- **Scope**: Transform Liminal from "tool you command" into "creative collaborator you talk to"
- **Key Decisions**: Chat-based interaction, Art Brain (persistent memory + knowledge graph), guided creativity, 5 implementation phases
- **Philosophical Statement**: "Liminal becomes a creative partner that remembers everything across sessions, understands art theory, guides you through its capabilities, learns your preferences over time, and proactively suggests relevant options."
- **Architecture**: ArtKnowledgeGraph (movements, techniques, artists, principles) + EpisodicMemory (all conversations, sessions, preferences) + SemanticArtMemory (combined retrieval)
- **New Modules**: ConversationManager, GuidanceEngine, ChatCLI, CreativeBrief, Boids, L-Systems, Reaction-Diffusion, AudioAnalyzer
- **Notable Quotes**: "The gap isn't skills or ideas — it's packaging finished work as portfolio"

### Liminal Architecture Audit (stateless-conjuring-cat)
- **Ambition**: MASSIVE — complete adversarial audit
- **Scope**: Full codebase audit identifying "triple redundancy" pattern
- **Key Decisions**: Grade B+ — strong foundation with consolidation opportunities
- **Critical Findings**: TRIPLE redundancy in collaboration systems (Swarm/DeepCollab/CollabClient), TRIPLE prompt systems, TRIPLE seed/fragment formats, TRIPLE scoring systems, 7 unwired exports, 3 config systems
- **Philosophical Statement**: "Liminal has three independent collaboration/generation systems that overlap significantly. All three try to improve generation quality through multi-agent collaboration, but share zero code."
- **Consolidation Plan**: 7 phases — Unify Types → Unify Scoring → Consolidate Collaboration → Wire Exports → Unify Config → Unify Prompts → Test Coverage
- **What NOT To Change**: Ralph-Wiggum Loop pattern, GeneratorRegistry confidence dispatch, Compost Mill pipeline stages, MAP-Elites + NoveltyArchive

### Fix Validation Pipeline + Dogfood (snappy-herding-marshmallow)
- **Ambition**: LARGE
- **Scope**: Fix RalphLoop declaring "done" based on regex without testing code actually runs
- **Key Decisions**: CodeValidator.ts — 3 checks (strip reasoning text, structural validation per domain, self-contained check), wired at 3 points (RalphLoop, Exporter, index.ts)
- **Philosophical Statement**: "Liminal's Ralph Loop declares 'done' and saves files based entirely on regex pattern matching. It never validates that generated code actually runs."
- **What Shipped**: CodeValidator.ts built and wired, MIN_SIZE_REQUIREMENTS enforced

### Swarm Persona Redesign + Hybrid Voting (sparkling-honking-minsky)
- **Ambition**: LARGE — complete swarm overhaul
- **Scope**: Reduce 7 personas to 5, replace all-LLM voting with hybrid heuristic/LLM
- **Key Decisions**: 5 personas (Kai=Architect, Nova=Synthesizer, Rex=Explorer, Sam=Muse, Max=Distiller) covering Structure/Synthesis/Exploration/Emotion/Compression — "mutually exclusive and collectively exhaustive for creative output quality"
- **Philosophical Statement**: "For a 10-round session with 7 personas, that's ~70 LLM calls just for voting. Early-round outputs are rough — LLM voting on them doesn't add much value over deterministic heuristics."
- **Innovation**: HeuristicScorer with 5 dimensions (constraint adherence, novelty delta, length quality, vocabulary richness, code structure) — 90% cost reduction on voting

### Update Swarm Personas — Modern Model Upgrades (playful-enchanting-ocean)
- **Ambition**: MASSIVE — 513 lines
- **Scope**: Upgrade all 5 persona models (LFM, Gemma, Phi, Qwen, Granite), comprehensive parameter audit
- **Key Decisions**: maxTokens 50-100 → 200-2000, /api/generate → /api/chat migration for all personas
- **Architecture**: Laptop → NUC inference setup diagrammed

### Structured Semantic Tokens (LIR) — Execution Plan (polished-jumping-flame)
- **Ambition**: MASSIVE — 398 lines
- **Scope**: 16 tasks across 5 waves — tree-sitter CodeParser, remark DocParser, ParsingCache, RelationshipExtractor
- **Key Decisions**: 15 new files, 4 modified files, phases outlined through self-modifying IR
- **What Shipped**: LIR modules built (CodeParser, DocParser, TextParser, ParsingCache, LIRPromptFormatter)

### Voice Input + Aesthetic Guardrails (serialized-crunching-clover)
- **Ambition**: MASSIVE — 730 lines
- **Scope**: Audio analysis (Meyda + pitchfinder), aesthetic critics (Color/Layout/Typography/Sound), CLI flags, RalphLoop integration
- **Key Decisions**: --voice, --voice-file, --aesthetic flags; AestheticCritic orchestrator with 4 critics; aesthetic gate after scoring
- **What Shipped**: Full audio + aesthetic modules wired end-to-end

### Fix ~60 Failing Unit Tests (starry-enchanting-pony)
- **Ambition**: MEDIUM
- **Scope**: 3 root causes — fixtures too small for MIN_SIZE_REQUIREMENTS, generators need LLM mocks, HTMLWrapper expectation change
- **Key Decisions**: "Never fix broken output programmatically — update the harness" (from AGENTS.md)
- **Philosophical Statement**: "Tests are the harness. Fix the tests to match current correct behavior."

### LIR Evaluation Integration (see memory/lir-evaluation-integration.md)
- **Ambition**: LARGE
- **Key Decisions**: Cold fallback — LIR or regex, never both. Feature flag defaults to false.
- **What Shipped**: GeneratedCodeParser wraps CodeParser for ephemeral code; all 4 critics have analyze*LIR() functions

### Real-time Event Pipeline (pure-wishing-twilight)
- **Ambition**: SMALL
- **Scope**: Fix hardcoded LMS generation in factory, add archetype routing
- **What Shipped**: EventBus singleton, SSE event stream, ActivityDashboard

### Commit Current Work (proud-bouncing-cherny)
- **Ambition**: SMALL — session checkpoint
- **Scope**: Compost visualizer, scoring fixes, SSE event stream, EventBus singleton, ActivityDashboard
- **Philosophical Statement**: Simple commit plans reveal what was built in that session

### Recovery Plan: PR Session Explosion (misty-sparking-cocoa)
- **Ambition**: SMALL
- **Scope**: Session crash left repo with uncommitted changes and deleted files
- **Key Decisions**: Accept reflection pattern, stage good changes, delete IMPROVEMENT-LOG.md
- **Notable**: Evidence of iterative development chaos — sessions crash, recovery plans needed

---

## MCP-VIDEO — Video Editing MCP Server

### v1.2.0 Comprehensive Security & Quality Remediation (parallel-bubbling-kernighan)
- **Ambition**: MASSIVE — 657 lines, 57 tasks across 8 waves
- **Scope**: ~118 issues across all source files after ruthless re-audit
- **Key Decisions**: Centralized validation.py, _error_result fixes, FFmpeg escaping fixes, 10 injection hardening tasks, 13 engine logic bug fixes, 9 server validation gaps, 6 ai_engine.py hardening tasks, 9 effects/transitions engine fixes
- **Philosophical Statement**: Layer defense — "CLAUDE.md instructions > Stop prompt reminder > PreToolUse hard block"
- **Architecture**: Wave-based execution (Waves 0-7) with dependencies and parallelization guidance

### Red Team Audit (shimmering-pondering-peach)
- **Ambition**: MASSIVE — full adversarial audit
- **Scope**: 82 video editing tools via FFmpeg, Remotion, and AI backends
- **Critical Findings**: Resource limits defined but never enforced, FFmpeg filter injection via unescaped text, template injection in Remotion scaffold, no path traversal protection, per-frame subprocess DoS
- **Bloat Identified**: 2 exact duplicate tools, 4 redundant wrappers, 8 overlapping tools, 8 dead code/fake features
- **Philosophical Statement**: "Dominant_colors always returns [] — stub that never works. Smoothness param accepted but never used. Mesh_size param accepted but never used."
- **Architecture Smell**: "God Object: engine.py (3,249 lines) handles ALL core FFmpeg operations"

### Fix All Pre-existing Test Failures (lucky-wobbling-lampson)
- **Ambition**: MEDIUM — 7 test files, 45 failures
- **Scope**: Stale worktree, relative paths, ESLint regex, normalizePath security bypass

### Fill All FFmpeg Coverage Gaps (optimized-giggling-crescent)
- **Ambition**: LARGE — 294 lines, 14 tasks across 5 waves
- **Scope**: Audio effects, subtitle generation, Ken Burns, waveform, scene detection, image sequences, quality metrics, metadata, stabilization, masking

### Explainer Video — Social Media Restructure (sparkling-mixing-ocean)
- **Ambition**: LARGE — visual quality pass
- **Scope**: 13 scenes → 8 merged scenes, social-optimized pacing, 45-55 seconds
- **Key Decisions**: Hook-first narrative, glass-morphism design system, continuous motion, per-scene accent colors
- **Innovation**: Two-model workflow — Claude implements code, multimodal model reviews rendered frames

### README Complete Rewrite (partitioned-booping-duckling)
- **Ambition**: MEDIUM
- **Scope**: README was stale — zero mention of Remotion (8 tools), wrong architecture (6 vs 18 files), wrong tool counts

### Push v0.3.0 to Repo (piped-leaping-biscuit)
- **Ambition**: SMALL — branch push + PR creation after 375 tests pass

### Rename agentcut to mcp-video (snug-snuggling-starlight)
- **Ambition**: SMALL — filesystem rename to align folder name with product name

---

## HOOKS SYSTEM — Claude Code Automation

### MCP Server Enforcement via Hooks (rippling-coalescing-leaf)
- **Ambition**: LARGE — enforcement infrastructure
- **Scope**: Block WebSearch (broken with GLM), enforce jcodemunch/jdocmunch, soft-enforce via Stop hooks
- **Key Decisions**: Hard block for WebSearch (exit 2), soft enforce for code/doc intelligence, CLAUDE.md as first line of defense
- **Philosophical Statement**: "PreToolUse is the only hook that can block actions (exit 2). CLAUDE.md instructions serve as the first line of defense."

### Hooks Overhaul: Self-Reflection & Frustration Resolution (shiny-marinating-widget)
- **Ambition**: LARGE — comprehensive hook audit and overhaul
- **Scope**: 10 active hooks, 3 orphaned hooks, 7 frustrations identified
- **Key Findings**: 2 guards built but never wired, win-loss tracker + bash logger broken (template vars not interpolated), code quality hook passive, uncommitted work accumulates, file protection too aggressive, context lost between sessions
- **New Hooks Created**: uncommitted-check.sh, session-end-wiring-check.js, staleness-check.js
- **Philosophical Statement**: "After analyzing all 11 projects, 182 plan files, 195+ sessions, 10 existing hooks, and 3 orphaned hooks — here are the recurring frustrations and the plan to resolve them."

### Add `if` Conditions to Hooks (snazzy-coalescing-journal)
- **Ambition**: SMALL — performance optimization
- **Scope**: Use Claude Code 2.1.85's conditional `if` field to avoid spawning Node.js on every Write/Edit
- **Key Decisions**: Split check-overcomplication.js into 8 per-extension entries, check-bug-dismissal.js into 10 entries

### Enable GLM-5-Turbo (snappy-orbiting-stallman)
- **Ambition**: SMALL — single config change
- **Scope**: Switch from GLM-5 to GLM-5-Turbo in settings.json

### Switchable Claude Pro / GLM Accounts (snoopy-greeting-map)
- **Ambition**: SMALL
- **Scope**: Make both Claude Pro OAuth and GLM proxy easily switchable via zsh aliases
- **Key Decisions**: `claude-pro` and `claude-glm` shell functions, remove hardcoded env vars from settings.json

---

## CERAFICA — Ceramics E-Commerce + Instagram Automation

### Full Instagram Automation (scalable-roaming-squirrel)
- **Ambition**: MASSIVE — end-to-end automation
- **Scope**: Hands-off system — take photos on iPhone, add to album, done. No manual caption writing, uploading, or scheduling.
- **Key Decisions**: 5 phases (Photo Export → Caption Generator → Instagram Scheduler → Main Automation → Cron), Monday 6 AM auto-run
- **Philosophical Statement**: "3.5 hours/week → 2 minutes/week"
- **What Shipped**: Photo export, vision analysis, caption generation, auto-posting infrastructure

### Fix Pipeline Architecture + Re-process IMG_4967 (snappy-twirling-wadler)
- **Ambition**: LARGE
- **Scope**: 12 technical debt issues causing failures every session
- **Key Decisions**: Kill silent fallbacks in planet name generator, raise match threshold from 0.50 to 0.70, one planet per video (not per frame), filter banned words from vision output
- **Philosophical Statement**: "If something breaks, STOP. No silent fallbacks that produce wrong output."

### Fix A/B Test Dashboard (recursive-nibbling-wreath)
- **Ambition**: SMALL
- **Scope**: Dashboard shows same caption for both Gemini and Kimi models — test_data.json not synced

### Test Plan: Reels/Stories/Carousel Support (rippling-cooking-lerdorf)
- **Ambition**: MEDIUM
- **Scope**: MediaType enum, aspect ratio detection, content routing, new CLI flags
- **Key Decisions**: Vertical videos <90s → Reels, else → feed post

### Fix iPhone Video Rotation Metadata Bug (sparkling-jingling-wren)
- **Ambition**: SMALL
- **Scope**: iPhone videos stored landscape + rotation flag, but rotation metadata ignored
- **Key Decisions**: Check side_data_list for rotation=±90, swap dimensions

### Vision Detection Testing Script (snoopy-inventing-muffin)
- **Ambition**: SMALL
- **Scope**: Standalone test script to validate vision pipeline in isolation
- **Key Decisions**: Test script only — no production code changes

### Process New Piece Through Full Pipeline (reflective-dancing-micali)
- **Ambition**: LARGE
- **Scope**: 7-step pipeline for new ceramic piece — vision analysis → planet naming → database → video → website → product data → Instagram staging
- **Key Decisions**: Planet naming is creative decision INFORMED by taxonomy — no automated naming algorithm
- **Notable Quote**: "The name is a creative decision INFORMED by the taxonomy and analysis — there is no automated naming algorithm"

### Dimension-Based Pricing Tiers (serene-nibbling-sparkle)
- **Ambition**: MEDIUM
- **Scope**: Size-tier pricing system based on H×W area (cm²) — S (<56)=$65, M (56-72)=$75, L (>72)=$85, XL (>110)=$100+
- **Key Decisions**: $5 increments, aligned with April 2026 market research ($65-125 for one-of-one stoneware)

### Fix Modal Video Cutoff & Trim Videos (recursive-snacking-sunrise)
- **Ambition**: SMALL
- **Scope**: CSS aspect-ratio mismatch causing video cutoff in product modals

### Generate Planetary Captions (peppy-hugging-babbage)
- **Ambition**: SMALL
- **Scope**: Weave planet names + vision analysis + worldbuilding data into Instagram captions

### Create Instagram Post Pack (proud-jumping-lampson)
- **Ambition**: SMALL
- **Scope**: Posting pack with hook/body/CTA, hashtag framework, posting metadata

### Ceramics Instagram Full Remediation Plan (peppy-sleeping-whisper)
- **Ambition**: LARGE — 313 lines
- **Scope**: 5 critical issues + 4 architectural issues across caption display, hashtag generation, model name standardization

### Vision Description Overhaul + Photo Pipeline Fix (parallel-swimming-brooks)
- **Ambition**: LARGE — 267 lines
- **Scope**: 4 interconnected fixes — vision prompt contradictions, photo pipeline disconnect, frame data enrichment (4→9 fields), Photos app album import

### Apply ICM Production Quality Guidelines to Explainer Video (peppy-skipping-puddle)
- **Ambition**: MEDIUM
- **Scope**: 55% pass rate audit, surface treatment fixes, vignette overlay, particle drift, font sizes

---

## OPENGLAZE — Ceramic Glaze Intelligence Platform

### UMF Calculation Engine Implementation Plan (stateless-conjuring-cat is different — this is a ceramics chemistry plan)
- **Ambition**: MASSIVE — full UMF chemistry engine
- **Scope**: Real UMF (Unity Molecular Formula) calculations replacing AI guessing from text descriptions
- **Key Decisions**: Recipe parser, oxide composition database, UMF analyzer with limit formulas, compatibility analyzer with shino-over-non-shino hard rule, batch processing
- **Philosophical Statement**: "The simulation prompt references UMF analysis, oxide interactions, and thermal expansion — but none of these are actually calculated. The AI reasons from text descriptions alone."
- **Research**: Found recipes for 16 of 32 studio glazes across Glazy.org, Ceramic Arts Network, manufacturer SDS sheets

### OpenGlaze Go-to-Market Strategy Document (serene-wishing-twilight)
- **Ambition**: MASSIVE — comprehensive GTM
- **Scope**: $120M TAM, 50K studios globally, 3 ICPs, 4 acquisition channel tiers, 18-month roadmap
- **Key Decisions**: North Star metric = Studio Discoveries/Month (not signups), bootstrapped (no funding), SEO + /check lead magnet primary channel, $29/mo Studio pricing
- **Notable**: "Profitable at 20 customers"

### OpenGlaze Frontend Implementation Plan (smooth-prancing-hopcroft)
- **Ambition**: LARGE
- **Scope**: Landing page modernization with artisan/craftsman aesthetic, dashboard creation
- **Key Decisions**: Fraunces serif + DM Sans typography, celadon greens + tenmoku browns + copper oranges, glass morphism cards, dark/light theme

### OpenGlaze Merge: Phases 2c → 3 → 5 (precious-bouncing-raccoon)
- **Ambition**: LARGE
- **Scope**: Merge Source B features (gamification, predictions, billing, templates) into Source A architecture

### Human Door Glaze Dashboard - Complete UX Redesign (precious-nibbling-newt)
- **Ambition**: MASSIVE — 471 lines
- **Scope**: Swiss-style design system, command palette (Cmd+K), combinations grouped by base color family
- **Key Decisions**: Warm charcoal #1a1918, celadon accent #7eb09b, 8px grid, mobile responsive

### Add AI Assistant to Human Door Dashboard (partitioned-purring-milner)
- **Ambition**: LARGE — 507 lines
- **Scope**: Client-side rules engine for natural language glaze questions
- **Key Decisions**: Shino First Rule, zinc interaction warnings, proven/hypothesis/prediction answer formats

### Human Door System Cleanup Plan (structured-waddling-spring)
- **Ambition**: LARGE — 7 bugs + 4 security fixes
- **Scope**: Missing DELETE endpoint, path traversal vulnerability, SQL injection risk in FTS5, no authentication, no rate limiting

### Add Glaze Autocomplete Everywhere (merry-booping-manatee)
- **Ambition**: MEDIUM
- **Scope**: Reusable GlazeAutocomplete component with color swatches, keyboard nav, cross-exclusion

### Add Surface Quality Taxonomy to Vision Pipeline (noble-petting-wren)
- **Ambition**: MEDIUM
- **Scope**: 7 categories of ceramic surface phenomena — sheen, color variation, movement, crystallization, reduction effects, texture, defects

### Refactor Kama from Tool-Calling to RAG-Style (mutable-bubbling-wadler)
- **Ambition**: LARGE — 206 lines
- **Scope**: Replace multi-turn tool-calling loop with single LLM call + server-side context retrieval
- **Key Decisions**: ContextRetriever class with O(32) glaze name matching

### Glaze Lab: Fully Open-Source Stack (proud-spinning-lamport)
- **Ambition**: MASSIVE — 595 lines
- **Scope**: 100% open source — Flask + Ory Kratos auth + SQLite/Postgres + multiple billing adapters (Stripe, PayPal, BTCPay, manual)
- **Key Decisions**: Docker Compose setup, revenue model = hosted convenience + premium templates + support/consulting

### Maker Pipeline — Open Source Content-to-Commerce Workflow (proud-kindling-crayon)
- **Ambition**: MASSIVE — 393 lines
- **Scope**: Extract Cerafica pattern into open-source project
- **Key Decisions**: 6 waves of TDD, IP guardrails: no real names, no proprietary prompts, fictional example data only

---

## RESEARCH PIPELINE & ICM METHODOLOGY

### Rebuild Research-Pipeline Using Workspace-Builder (reactive-plotting-kahan)
- **Ambition**: MASSIVE — 578 lines
- **Scope**: 5-stage pipeline rebuild for ICM contribution, must use workspace-builder per PR checklist
- **Key Decisions**: Skills to bundle (mcp-search-tools, prompt-injection-defense), API key verification, detailed compliance verification
- **Philosophical Statement**: "The jagged frontier was a measurement error. Evaluation is the skill gaining value, not execution."

### Research Pipeline Upgrade Plan (peaceful-wibbling-kite)
- **Ambition**: LARGE
- **Scope**: Merge PR #2, remove experiment system, add reflection pattern
- **Key Decisions**: 9 phases including file deletions, core replacements, stage context updates

### ICM Git Architecture — Workspace Independence (robust-percolating-puzzle)
- **Ambition**: LARGE
- **Scope**: Each workspace gets its own `.git/` — independent versioning
- **Key Decisions**: Independent repos (not submodules/subtrees), simple upstream fetch+merge for _core/ updates, anonymization process for upstream contribution
- **Philosophical Statement**: "The ICM methodology treats workspaces as 'independent agents' with their own CLAUDE.md. Currently, they all share ONE git history, which violates the independence principle."

### Self-Improving System Audit & GitHub Contribution Plan (rippling-coalescing-leaf variant)
- **Ambition**: LARGE
- **Scope**: Full workspace scan, experiment system audit (1/1 success rate, RQS 77→81), PR preparation for ICM
- **Key Findings**: Pattern extraction rate 0%, no actual auto-generation happening, session startup not automated

### Deep Research Plan — Cycle #2 (sequential-sprouting-wirth)
- **Ambition**: LARGE
- **Scope**: Find 10+ NEW product opportunities in domains NOT already covered
- **Key Decisions**: 5-wave research strategy (Pain Point Discovery → Market Signal Mining → Research Frontier → Social Signals → Synthesis)

### Research: Tools for AI Agents — March 2026 Landscape (soft-brewing-fiddle)
- **Ambition**: LARGE
- **Scope**: 5-stage research pipeline on tools AI agents use to get work done
- **Key Decisions**: 10+ categories (browser, code exec, search, file processing, data analysis, image, music, video, communication, 3D), white space identification
- **Philosophical Statement**: "Find white space — tool categories where no clear winner exists, the problem is real, and a well-executed open source tool could go viral."

### Autonomous Research Monitor with LM Studio (sequential-toasting-cloud)
- **Ambition**: LARGE
- **Scope**: Local AI-powered research curation with twice-daily cron operation
- **Key Decisions**: LM Studio as local backend (privacy, no per-run cost), KB content mining, 9 AM + 5 PM operation

### Build New MWP Workspace (quiet-giggling-meadow)
- **Ambition**: SMALL
- **Scope**: Recommended workspace = Evaluation Skills Builder
- **Philosophical Statement**: "The jagged frontier was a measurement error. Evaluation is the skill gaining value, not execution."

### Cross-Workspace KB Integration Skill (purring-inventing-wilkes)
- **Ambition**: MEDIUM
- **Scope**: Global skill at `~/.claude/skills/kb-save/SKILL.md` for PARA knowledge base saves from any ICM workspace

### Research Pipeline Setup (quiet-herding-liskov)
- **Ambition**: SMALL
- **Scope**: Setup questionnaire results — APA citation, formal, peer-reviewed only, deep over breadth

---

## VIDEO PROCESSING — Cerafica Video Pipeline

### Restructure Video Pipeline: 3-Phase Architecture (rippling-coalescing-leaf variant)
- **Ambition**: LARGE
- **Scope**: Split monolithic process_frame into 3 phases — extract_masks (sequential, single rembg) → composite (parallelizable) → re-hud
- **Key Decisions**: Rembg every 3rd frame with interpolation, multiprocessing only for Phase 2
- **Performance**: 18 min total vs 150 min (broken) vs 41 min (single-process)

### Fix Re-HUD Audio/Text Desync (sequential-dazzling-hopper)
- **Ambition**: MEDIUM
- **Scope**: Sound effects run 2x longer than visual typewriter animation
- **Root Cause**: FPS mismatch — re-HUD assembles at source fps (30) but sound timing uses output_fps (15)

### Fix Sound Design Timing Mismatch (partitioned-hatching-minsky)
- **Ambition**: SMALL
- **Scope**: Boot sound too short, border delay hardcoded, audio clicks not capped

### Commit Current Work — Video Pipeline (serene-marinating-lampson)
- **Ambition**: SMALL
- **Scope**: 3-phase pipeline refactor + xfade crossfade bug fix, sound design changes, batch script

### Reset Clean-Branch Working Tree (smooth-prancing-hopcroft variant)
- **Ambition**: SMALL
- **Scope**: Session crash recovery — restore deleted files, reset submodule, remove untracked

---

## PROJECTS & BUSINESS STRATEGY

### Creative Technologist Transition Plan (sprightly-snacking-hopper)
- **Ambition**: LARGE — career direction
- **Scope**: Become a creative technologist — using tech, coding, and AI to make art, beauty, and tools for artists
- **Key Decisions**: Do both — package ceramics-instagram as portfolio piece (Week 1-2), then ship OpenGlaze (Week 3-4)
- **Philosophical Statement**: "You're already doing creative technology work. The gap isn't skills or ideas — it's packaging finished work as portfolio and getting it in front of people."
- **Notable**: "Not a tutorial (you know enough). Not a job hunt yet (portfolio first, then apply). Not learning more skills (the gap is shipping, not knowing)."

### Sell Your Stuff Plan (quizzical-squishing-pebble)
- **Ambition**: MEDIUM
- **Scope**: E-bike + electronics selling in Long Beach, CA. Chrome extensions for auto-reply/relister, cross-posting, safety rules

### TradesFlow Sales Package (stateless-cuddling-sutherland)
- **Ambition**: LARGE — 210 lines
- **Scope**: Comprehensive sales enablement package with 8 components in 3 formats
- **Key Differentiator**: Equipment Passport — tracks customer equipment with full service history

### Plain-English TradesFlow Overview (linear-orbiting-dolphin)
- **Ambition**: SMALL
- **Scope**: Non-technical sales document for investors/partners

---

## GOOGLE WORKSPACE AGENT

### Agent Email Identity Architecture (snoopy-leaping-dragonfly)
- **Ambition**: LARGE
- **Scope**: Dedicated agent email identity (agent@puenteworks.com) with OAuth credentials and send capabilities
- **Key Decisions**: Separate OAuth (not delegation), 4 trust levels (supervised → can-send), rate limiting
- **Philosophical Statement**: "Agent needs to send emails on user's behalf — replies, new emails, meeting invites, digest summaries"

### Fix gws CLI Authentication (snug-painting-bumblebee)
- **Ambition**: SMALL
- **Scope**: OAuth consent screen was in "Testing" mode with no test users — Error 400 redirect_uri_mismatch

### Research-Pipeline GWS Integration (sparkling-moseying-lemon)
- **Ambition**: MEDIUM
- **Scope**: New stage 06-publish that pushes research outputs to PARA knowledge base in Google Drive
- **Key Decisions**: Deferred — wait for GWS agent's PARA structure to stabilize

### Add AI-Digest Label Skip Rule (polished-wiggling-tower)
- **Ambition**: SMALL
- **Scope**: Skip AI-Digest labeled emails in triage. Gmail Label_16 check before categorization

---

## HYDRA CREATIVE AGENT (Python Research Platform)

### Hydra Creative Agent — Four Priorities (streamed-enchanting-patterson)
- **Ambition**: MASSIVE — 1016 lines
- **Scope**: FastAPI microservice wrapping reasoning pipeline, stub completion, unit tests, symbolic language enhancement
- **Key Decisions**: Keep hydra as Python research backend, Atelier calls via HTTP API
- **Innovation**: Symbolic language system — discovers, composes, and transfers symbols across creative domains

---

## INDEXING & TOOLING INFRASTRUCTURE

### Index ICM with jDocMunch (memoized-snacking-locket)
- **Ambition**: SMALL — one-time setup
- **Scope**: Index 400+ markdown files for section-based retrieval

### Institutionalize jDocMunch + jCodeMunch in ICM (nifty-dancing-sprout)
- **Ambition**: MEDIUM
- **Scope**: 7 phases to integrate into MEMORY.md, root CLAUDE.md, research pipeline, all stage CONTEXT.md files

### Install Full jgravelle Munch Suite (jazzy-dazzling-comet)
- **Ambition**: MEDIUM
- **Scope**: Install all 4 munch MCP tools system-wide, configure Claude Code, enforce usage rules

---

## ADDITIONAL PLANS (Read in Previous Sessions)

### Research OpenArt API, MCP, CLI for Agents (lexical-weaving-sunset)
- **Ambition**: MEDIUM — 5-stage research pipeline
- **Scope**: Scoping → Discovery → Analysis → Synthesis → Handoff

### Ceramics Instagram MWP Workspace (lucky-fluttering-elephant)
- **Ambition**: LARGE — 232 lines
- **Scope**: Full MWP workspace structure for managing Instagram ceramics account
- **Key Decisions**: 4-stage pipeline (input → planning → content → repurposing), brand vault with voice rules

### Bring ceramics-foundation to ICM MWP Standards (memoized-crafting-origami)
- **Ambition**: MEDIUM
- **Scope**: Refactor CLAUDE.md from 230→75 lines, create CONTEXT.md, establish foundation workspace pattern

### Teaser + Dynamic Captions & Music Generator (modular-watching-plum)
- **Ambition**: SMALL
- **Scope**: Strip campaign logic, generate captions + music recommendations dynamically from DB

### Image-Based Ceramic RE Pipeline (prancy-munching-stonebraker)
- **Ambition**: MEDIUM
- **Scope**: Reverse engineering pipeline on single ceramic piece photo — target acquisition → visual observation → recipe synthesis with UMF estimation

### Resume HTML Formatting & PDF Export (peppy-napping-owl)
- **Ambition**: SMALL
- **Scope**: Professional typography, ATS-friendly resume, Playwright PDF export

---

## PATTERN ANALYSIS

### Recurring Themes Across All Plans

1. **"Wire everything up end-to-end"** — The single most repeated principle. No stubs, no "not yet implemented."

2. **Triple redundancy pattern** — Liminal has THREE of everything (collaboration systems, prompt systems, scoring systems, fragment types, config systems). This is both a strength (diversity) and a weakness (maintenance).

3. **"If something breaks, STOP"** — Anti-silent-fallback principle from Cerafica pipeline. No silent fallbacks that produce wrong output.

4. **Dogfood everything** — mcp-video must use its own tools to render its own explainer video. Liminal must validate its own generated code.

5. **Self-improving systems** — Experiments, RQS scoring, pattern extraction, symbolic language — the developer is obsessed with systems that improve themselves.

6. **Open source first** — Glaze Lab, Maker Pipeline, jCodeMunch/jDocMunch — extract patterns into reusable open-source tools.

7. **The gap is shipping, not knowing** — Repeated in the career transition plan. "Not a tutorial. Not learning more skills."

### Ambition Distribution
- MASSIVE: ~20 plans (multi-week, multi-wave efforts)
- LARGE: ~45 plans (significant features, system redesigns)
- MEDIUM: ~60 plans (features, bug fixes with analysis)
- SMALL: ~75 plans (quick fixes, config changes, commits)

### Project Coverage
- Liminal: ~40 plans
- mcp-video: ~25 plans
- Cerafica/Instagram: ~35 plans
- OpenGlaze/Glaze Lab: ~25 plans
- ICM/Research Pipeline: ~15 plans
- Hooks/Infrastructure: ~15 plans
- Google Workspace Agent: ~5 plans
- Hydra Creative Agent: ~2 plans
- TradesFlow: ~3 plans
- Career/Personal: ~5 plans
- Other/research: ~30 plans

---

## QUOTE BANK

> "We gather everything first, then split into posts once we see the full picture." — Liminal Archaeology plan

> "The name is a creative decision INFORMED by the taxonomy and analysis — there is no automated naming algorithm." — Process New Piece pipeline

> "If something breaks, STOP. No silent fallbacks that produce wrong output." — Pipeline Architecture fix

> "3.5 hours/week → 2 minutes/week" — Full Instagram Automation

> "Liminal's Ralph Loop declares 'done' and saves files based entirely on regex pattern matching. It never validates that generated code actually runs." — Validation Pipeline fix

> "The gap isn't skills or ideas — it's packaging finished work as portfolio and getting it in front of people." — Creative Technologist plan

> "Not a tutorial (you know enough). Not a job hunt yet (portfolio first, then apply). Not learning more skills (the gap is shipping, not knowing)." — Career plan

> "The jagged frontier was a measurement error. Evaluation is the skill gaining value, not execution." — Build New MWP Workspace

> "PreToolUse is the only hook that can block actions (exit 2). CLAUDE.md instructions serve as the first line of defense." — MCP Enforcement plan

> "Liminal has three independent collaboration/generation systems that overlap significantly. All three try to improve generation quality through multi-agent collaboration, but share zero code." — Architecture Audit

> "These are mutually exclusive and collectively exhaustive for creative output quality." — Swarm Persona Redesign

> "Profitable at 20 customers" — OpenGlaze GTM

> "The simulation prompt references UMF analysis, oxide interactions, and thermal expansion — but none of these are actually calculated." — UMF Calculation Engine

> "The ICM methodology treats workspaces as 'independent agents' with their own CLAUDE.md. Currently, they all share ONE git history, which violates the independence principle." — Git Architecture plan

> "Find white space — tool categories where no clear winner exists, the problem is real, and a well-executed open source tool could go viral." — AI Agent Tools research

> "Never fix broken output programmatically — update the harness." — AGENTS.md principle, cited in test fix plan

> "God Object: engine.py (3,249 lines) handles ALL core FFmpeg operations." — Red Team Audit

> "Dominant_colors always returns [] — stub that never works. Smoothness param accepted but never used." — Dead code audit
