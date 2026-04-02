# Loose Ends Audit - Liminal Repository

**Generated:** 2026-04-02  
**Branch:** narrative/liminal-archaeology  
**Commit:** 20c68ff  

---

## 🔴 Critical (Blocking Production)

### 1. Security Hardening
| Issue | Location | Impact | Fix |
|-------|----------|--------|-----|
| 19 bare catch blocks | `src/llm/`, `src/core/`, `src/tui/`, `src/chat/` | Silent failures, lost errors | Add error logging/handling |
| 195 console.log statements | Throughout `src/` | Potential log injection, noise | Replace with structured logger |
| SSRF validation incomplete | `src/security/UrlValidator.ts` | Could allow internal network access | Harden IP range checks |
| No CSRF protection in dev | `test/security/csrf-protection.test.ts:8` | Test disabled | Implement for production |

### 2. Implementation Stubs
| Issue | Location | Status |
|-------|----------|--------|
| `extractAudio()` - placeholder | `src/compost/SemanticExtractor.ts:87` | @deprecated stub |
| `extractVideo()` - placeholder | `src/compost/SemanticExtractor.ts:95` | @deprecated stub |
| `speculativeDecode()` - unimplemented | `src/compost/ModelRouter.ts:142` | Delegates immediately |
| FFT analysis - synthetic placeholder | `src/musicToVisual/generateMusicToVisual.ts:34` | Sine wave, not real FFT |

---

## 🟡 High (Should Fix Soon)

### 3. Guardrails Gaps (M12-M18 Not Implemented)
| Guardrail | File | Priority | Risk |
|-----------|------|----------|------|
| M12: Privacy Guardrail | `guardrails/PrivacyGuardrail.ts` | High | PII leakage |
| M13: Prompt Injection Defense | `guardrails/InjectionGuardrail.ts` | High | Jailbreak attacks |
| M14: Supply Chain Guardrail | `guardrails/SupplyChainGuardrail.ts` | Medium | Vulnerable deps |
| M15: Audit & Compliance | `guardrails/AuditGuardrail.ts` | Medium | No audit trail |
| M16: Fairness & Bias | `guardrails/FairnessGuardrail.ts` | Low | Bias in outputs |
| M17: Explainability | `guardrails/ExplainabilityGuardrail.ts` | Low | Black box decisions |
| M18: Resilience | `guardrails/ResilienceGuardrail.ts` | Medium | No graceful degradation |

### 4. Type Safety Issues
| Issue | Count | Location |
|-------|-------|----------|
| `@ts-ignore` / `@ts-expect-error` | 10 | Various |
| `any` types | 11 | Various |
| Non-null assertions (`!`) | ~50 | Estimated |

### 5. Test Coverage Gaps
| Issue | Location | Reason |
|-------|----------|--------|
| Sandbox tests skipped in CI | `test/unit/sandbox.test.ts:22` | `describe.skipIf(process.env.CI)` |
| Infinite loop test skipped | `test/unit/sandbox.test.ts:66` | `it.skip` |
| Generator-renderer tests skipped | `test/integration/generator-renderer.test.js:38` | `describe.skipIf(process.env.CI)` |
| Renderer tests skipped | `test/integration/renderer.test.js:16` | `describe.skipIf(process.env.CI)` |
| Dual LLM tests skipped | `test/integration/dual-llm.test.ts:31` | `describe.skipIf(process.env.CI)` |
| E2E guardrail tests skipped | `test/e2e/guardrails-e2e.test.ts:66` | `describe.skipIf(process.env.CI)` |
| E2E sandbox tests skipped | `test/e2e/sandbox-self-improve.e2e.test.ts:34` | `describe.skipIf(process.env.CI)` |
| MiniMax tests skipped | `test/e2e/models/minimax-*.ts` | `describe.skipIf(!process.env.MINIMAX_API_KEY)` |

---

## 🟢 Medium (Nice to Have)

### 6. Deprecated Code
| File | Item | Replacement |
|------|------|-------------|
| `src/core/CreativeEvaluator.ts:61` | `evaluate()` method | `assess()` |
| `src/core/ContextAccumulation.ts:116` | Static methods | Instance methods |
| `src/config/ConfigLoader.ts:123` | Provider field | baseUrl only |
| `src/brain/ArtKnowledgeGraph.ts:498` | `getStyles()` | `getArtisticStyles()` |
| `src/generators/p5/P5Generator.ts:2` | P5Generator | P5GeneratorLLM |
| `src/routing/SmartRouter.ts:8` | SmartRouter class | GeneratorRegistry |
| `src/compost/SeedBank.ts:128` | `formatSeed()` | `formatSeedForPrompt()` |

### 7. Hardware Integration
| Feature | Location | Status |
|---------|----------|--------|
| Hardware MIDI/OSC | Config placeholders only | PRD.md Line 260 |
| Live music output | `generateMusic.ts` | No hardware integration |

### 8. Documentation Debt
| Issue | Location |
|-------|----------|
| Line count outdated (937 vs 1513) | `visual-bible.html:264` |
| Old milestone names in archive | `docs/archive/internal-audits/` |

---

## 🔵 Low (Future Work)

### 9. Code Quality
| Issue | Count | Notes |
|-------|-------|-------|
| Magic numbers | ~20 | Use constants |
| Comments in non-English | 0 | All cleaned up |
| Empty lines at EOF | Variable | Minor formatting |

### 10. Architecture Refinements
| Issue | Impact | Notes |
|-------|--------|-------|
| Plugin API not extracted | Medium | Only internal plugins |
| Community plugin marketplace | Low | Future feature |
| Multi-tenant support | Low | Not designed for |

---

## 📊 Summary Statistics

| Category | Count | Trend |
|----------|-------|-------|
| Critical issues | 4 | Stable |
| High priority | 7+ | +7 (M12-M18 defined) |
| Medium priority | 8 | Stable |
| Low priority | 4 | Stable |
| Test skips | 8 | Stable |
| Console logs | 195 | Needs cleanup |
| Bare catch blocks | 19 | Needs fixing |

---

## 🎯 Recommended Priority Order

### Week 1-2: Security
1. Fix bare catch blocks (19 locations)
2. Reduce console.log statements (195 → ~20)
3. Harden SSRF validation

### Month 1-2: Guardrails
4. Implement M12 (Privacy)
5. Implement M13 (Prompt Injection)
6. Implement M18 (Resilience)

### Month 2-3: Quality
7. Remove deprecated code
8. Fix type safety issues
9. Enable CI tests where possible

### Quarter 2: Features
10. Implement M14-M17
11. Real audio/video extraction
12. Hardware MIDI/OSC

---

## 📝 Notes

- M12-M18 are now **fully specified** in THE_BIBLE.md and visual-bible.html
- DGF (Deterministic Guardrails Framework) is **COMPLETE** with 31 tests passing
- 18 subsystems are operational and documented
- All zombie files have been cleaned up
- The codebase is in the best state it's ever been

**Next Action:** Pick one critical issue and fix it.
