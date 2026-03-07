# Atelier Workspace — Full System Audit Report

**Date:** 2026-03-07  
**Scope:** Index with jcodemunch + full system audit (no gaps, no blindspots)  
**Method:** jcodemunch `index_folder` + 6 subagents (entry points, config, source modules, tests, security, scripts/tooling).

---

## 1. Jcodemunch index result

- **Tool:** `user-jcodemunch` → `index_folder`
- **Path:** `/Users/simongonzalezdecruz/atelier-workspace`
- **Options:** `extra_ignore_patterns`: gallery, node_modules, dist, test-output, benchmark-output; `use_ai_summaries`: false; `incremental`: false
- **Result:** Success. Repo id: `local/atelier-workspace`. Indexed **39 files**, **249 symbols**, **38 file summaries**. Languages: JS 11, TS 24, TSX 4.
- **Discovery skip counts:** skip_pattern 17263, gitignore 87, extra_ignore 1306, wrong_extension 31; no path_traversal/symlink/secret issues.
- **No-symbols files (23):** All under `test/` (unit + integration + generators) plus `jest.config.js` — test files are not parsed for symbols by design.

---

## 2. Entry points and control flow

| Entry point | File | Invocation | Config source | Call graph |
|-------------|------|------------|---------------|------------|
| **CLI** | `bin/atelier` | `atelier` (npm bin) or `node bin/atelier` | ConfigLoader → `~/.atelier/config.json` + env; bin sets `process.env.ATELIER_LLM_*`; flags override | dotenv → initializeConfig → getEffectiveConfig → set env; generate → `run(prompt, opts)`; serve → PreviewServer; list → read ~/.atelier/output; configure → saveConfig; interactive → InteractiveMode.run() → run(); completions → generateCompletions(shell) |
| **run / Atelier** | `src/index.ts` | Programmatic only | In-code `defaultConfig` + options; no ConfigLoader; LLM from process.env when LLMClient is created | run() → RalphLoop.run() → P5GeneratorLLM → LLMClient(env); run() → Exporter (HTML/JS/ZIP), Gallery.loadHistory(); Atelier.run() → same run() with merged config |
| **TUI** | `src/tui/index.tsx` | `npm run tui` → `node --import tsx src/tui/index.tsx` | Env only (dotenv); no ConfigLoader; run options hardcoded in handleGenerate | main() → loadGallery() → render(App); handleGenerate → import(dist/index.js) → run(prompt, { maxIterations: 10, ... }) |
| **Benchmark** | `scripts/benchmark.js` | `npm run benchmark` → `node scripts/benchmark.js` | Env only; no dotenv, no ConfigLoader | runBenchmarks() → benchmarkIteration(prompt) → run(prompt, { output: './benchmark-output', project: benchmark-${Date.now()} }) |

**Note:** Benchmark imports `run` from `../src/index.js`; with plain `node scripts/benchmark.js` this requires either a build (dist) or resolution that serves `src/index.ts` (e.g. tsx).

---

## 3. Config and environment

### 3.1 Config source → reader

| Config source | Read by (file : function) |
|---------------|---------------------------|
| `~/.atelier/config.json` | `src/config/ConfigLoader.ts` : loadConfig(), getEffectiveConfig() |
| Env: ATELIER_LLM_PROVIDER | ConfigLoader.getEffectiveConfig(); LLMClient constructor |
| Env: ATELIER_LLM_BASE_URL | ConfigLoader.getEffectiveConfig(); LLMClient constructor, isConfigured() |
| Env: ATELIER_LLM_MODEL | ConfigLoader.getEffectiveConfig(); LLMClient constructor |
| Env: ATELIER_LLM_API_KEY | ConfigLoader.getEffectiveConfig(); LLMClient constructor, isConfigured() |
| Env: INCEPTION_API_KEY | ConfigLoader.getEffectiveConfig() (apiKey fallback); LLMClient constructor, isConfigured() |
| Env: HOME | bin/atelier (output dir, serve search dirs, list) — fallback `/tmp` |

### 3.2 Is `config/atelier.json` loaded?

**No.** The repo file `config/atelier.json` is **never loaded**.

- README (and PRD) say to create `config/atelier.json` for project-wide settings.
- ConfigLoader only uses `DEFAULT_CONFIG_PATH` = `path.join(os.homedir(), '.atelier', 'config.json')`.
- bin/atelier calls getEffectiveConfig() with no arguments → only user config is used.
- **Gap:** Documentation describes project-wide config (loop, creative, gallery, renderer, llm), but the app uses in-memory defaults in `src/index.ts` (defaultConfig) and user config from `~/.atelier/config.json`. ConfigLoader’s shape (defaultProvider, providers) differs from the project config shape.

### 3.3 Two config systems

1. **LLM config:** ~/.atelier/config.json + env (ConfigLoader). Used only by **bin/atelier**; it merges and sets process.env so LLMClient sees it. TUI and benchmark do not call ConfigLoader — they rely on env (and TUI on dotenv).
2. **Loop/creative/gallery/renderer:** In-code defaults in `src/index.ts` (defaultConfig) + options passed to run() / Atelier. No file or env for these keys.

---

## 4. Source modules and dependencies

### 4.1 src/ tree

| Directory | Files |
|-----------|--------|
| core/ | ContextAccumulation.ts, CreativeEvaluator.ts, PromiseDetector.ts, PromptStore.ts, RalphLoop.ts |
| generators/p5/ | P5Generator.ts, P5GeneratorLLM.ts, ParticleSystem.ts, CellularAutomata.ts |
| render/ | Renderer.ts, PreviewServer.ts |
| gallery/ | Gallery.ts, SeedArchive.ts |
| export/ | Exporter.ts |
| config/ | ConfigLoader.ts, PromptHistory.ts |
| cli/ | Completions.ts |
| tui/ | index.tsx, InteractiveMode.ts, types.ts; components: VoiceInput.tsx, PlayerPiano.tsx, XRayPanel.tsx |
| llm/ | LLMClient.ts |
| (root) | index.ts |

### 4.2 Public API (src/index.ts)

- **Defined in index.ts:** ATELIER_VERSION, AtelierConfig, defaultConfig, run, runFromArgs, Atelier, default export.
- **Re-exports:** RalphLoop, CreativeEvaluator, PromiseDetector, PromptStore, ContextAccumulation; P5Generator, ParticleSystem, CellularAutomata, P5GeneratorLLM; Renderer, PreviewServer; Exporter, Project; Gallery, Iteration; SeedArchive, SeedMetadata.

### 4.3 Internal dependency graph (high level)

- **index.ts** → core/*, generators/p5/*, render/*, export/Exporter, gallery/Gallery, gallery/SeedArchive.
- **RalphLoop** → PromptStore, ContextAccumulation, CreativeEvaluator, PromiseDetector; P5GeneratorLLM; Gallery.
- **P5GeneratorLLM** → LLMClient.
- **tui/index.tsx** → tui/components (PlayerPiano, XRayPanel, VoiceInput).
- **InteractiveMode** → config/PromptHistory.
- No internal src imports: CreativeEvaluator, PromiseDetector, PromptStore, ContextAccumulation, P5Generator, ParticleSystem, CellularAutomata, Renderer, PreviewServer, Exporter, Gallery, SeedArchive, ConfigLoader, PromptHistory, Completions, LLMClient, VoiceInput, types.

---

## 5. Tests and coverage

### 5.1 Test files (28 total)

- **Unit (18):** context-accumulation, completions, config-loader, creative-evaluator, exporter, gallery, index, interactive-mode, llm-client, player-piano, promise-detector, prompt-history, prompt-store, seed-archive, tui-integration, voice-input, xray-panel.
- **Integration (7):** cli, evaluator-gallery, full-loop, generator-renderer, interactive-mode, preview-server, ralph-loop, renderer.
- **Generators (3):** cellular-automata, p5-generator, particle-system.

### 5.2 Coverage config (jest.config.js)

- **collectCoverageFrom:** `dist/**/*.js` (excludes *.test.js, *.d.ts). Coverage is collected from **dist**, not src.
- **coverageThreshold (global):** 80% statements, branches, functions, lines.

### 5.3 Gaps

- **P5GeneratorLLM:** No dedicated test file; only indirect coverage via integration tests (full-loop, ralph-loop).
- **TUI:** `tui/index.tsx` and React components (PlayerPiano, XRayPanel, VoiceInput) are not imported in any test; only logic/layout tests (player-piano.test.ts, xray-panel.test.ts, voice-input.test.ts, tui-integration.test.ts) with mock data.
- **Interactive mode:** Covered by unit and integration tests (interactive-mode.test.ts).

---

## 6. Security and secrets

### 6.1 Secret usage

| Variable / location | Read/Write | Source |
|---------------------|------------|--------|
| ATELIER_LLM_API_KEY (env) | Set by bin from config; read by ConfigLoader, LLMClient | ~/.atelier/config.json or env |
| INCEPTION_API_KEY (env) | Read only | User-set env |
| ATELIER_LLM_BASE_URL, ATELIER_LLM_MODEL | Set by bin; read by ConfigLoader, LLMClient | File + env |
| config.apiKey / config.baseUrl (file) | Read via getEffectiveConfig; bin copies to env | ~/.atelier/config.json |
| LLMClient Authorization header | Read apiKey from config/env | Bearer token |

- **Persistence:** saveConfig() can write full AtelierConfig (including providers[*].apiKey/baseUrl) to ~/.atelier/config.json. CLI `--configure` writes only baseUrl and model (no apiKey). So apiKey is not written by the CLI but could be in a user-edited config file.

### 6.2 Path injection / traversal

| Location | Risk |
|----------|------|
| **--output / output option** | User-controlled; used for mkdir and run(); arbitrary path write / traversal. |
| **project option** | Used in path.join(output, `${project}-final.html`) and gallery paths; if project is user-controlled (e.g. `../../etc`), path traversal. CLI currently hardcodes project `cli-project`. |
| **bin/atelier serve, findLatestSketch** | path.join(dir, f) with f from readdirSync; if dir contains entries with `..` or symlinks, path can escape. |
| **tui/index.tsx loadGallery** | path.join(galleryDir, entry.name); same risk if gallery dir is untrusted. |
| **SeedArchive** | path.join(archiveDir, `${seed}.json`); risk if seed is user-controlled; seeds are normally from generateSeed() (internal). |
| **ConfigLoader** | Default config path is fixed (os.homedir()); no CLI path override in production. |
| **Exporter** | Receives output paths from callers; no unsanitized path construction inside Exporter. |

---

## 7. Scripts, build, and tooling

### 7.1 scripts/benchmark.js

- Runs benchmarks for iteration time and memory.
- Imports `run` from `../src/index.js` (note: may require build or tsx for .ts).
- Calls run(prompt, { output: './benchmark-output', project: `benchmark-${Date.now()}` }) per prompt; writes report to ./benchmark-output/report.json; exit 0/1 by pass/fail.

### 7.2 package.json scripts

| Script | Command |
|--------|---------|
| build | tsc |
| test | NODE_OPTIONS='--experimental-vm-modules' jest |
| test:watch | jest --watch |
| test:coverage | jest --coverage |
| lint | eslint src/ |
| typecheck | tsc --noEmit |
| docs | typedoc --out docs src/ |
| benchmark | node scripts/benchmark.js |
| tui | node --import tsx src/tui/index.tsx |

### 7.3 ESLint

- **No** .eslintrc* or eslint.config.* in repo. ESLint would use parent-directory config or defaults. ESLint is not listed in package.json dependencies; `npm run lint` may rely on global or workspace install.

### 7.4 tsconfig.json

- include: src/**/*; exclude: node_modules, dist, test. outDir: dist; rootDir: src. Strict, ES2022, declaration/sourceMap; noUnusedLocals/Parameters; ts-node ESM for running TS.

---

## 8. Gaps and blindspots (explicit)

1. **config/atelier.json unused** — README/PRD document project-wide config; no code loads it. File: config/atelier.json; readers: none.
2. **Coverage from dist not src** — jest collectCoverageFrom is dist/**/*.js; coverage reflects built output, not source. File: jest.config.js.
3. **ESLint config location** — package.json has "lint": "eslint src/" but no repo-level eslint config; config may come from parent or defaults.
4. **P5GeneratorLLM** — No direct unit test; only indirect via integration tests. File: src/generators/p5/P5GeneratorLLM.ts.
5. **TUI entry and components** — tui/index.tsx and PlayerPiano/XRayPanel/VoiceInput are not imported in tests; only logic/layout tests. Files: src/tui/index.tsx, src/tui/components/*.tsx.
6. **Path traversal** — output, project, readdir+path.join in serve/TUI, and SeedArchive seed parameter can lead to path escape if inputs are untrusted; CLI currently limits exposure (e.g. fixed project for generate).
7. **Benchmark import** — scripts/benchmark.js imports from ../src/index.js; with .ts sources this may require build or tsx. File: scripts/benchmark.js.

---

## 9. Summary

- **Index:** Workspace indexed with jcodemunch (39 files, 249 symbols); optional future runs can use incremental: true.
- **Entry points:** Four (bin/atelier, src/index.ts, src/tui/index.tsx, scripts/benchmark.js); config flow differs (only CLI uses ConfigLoader).
- **Config:** Two systems (LLM from file+env; loop/creative/gallery/renderer from in-code defaults); config/atelier.json is documented but never loaded.
- **Source:** Clear src tree and public API; dependency graph centered on index.ts and RalphLoop → P5GeneratorLLM → LLMClient, plus TUI branch.
- **Tests:** 28 files; coverage from dist at 80% thresholds; P5GeneratorLLM and TUI entry/components lack direct or component-level tests.
- **Security:** Secrets from env and ~/.atelier/config.json; apiKey not written by CLI; path traversal risks on output, project, and readdir-based paths when inputs are untrusted.
- **Tooling:** Benchmark, lint, typecheck, docs, tui scripts documented; eslint config absent in repo.

End of report.
