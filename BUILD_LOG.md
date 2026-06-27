# BUILD_LOG.md — n8n-nodes-bangla

## Phase 0 — API Research ✅
**Decision:** Used the official n8n starter template structure as reference
(github.com/n8n-io/n8n-nodes-starter). Scaffold command is `npm create @n8n/node`
but since it is interactive, we built manually with identical structure.
- Build tool: plain `tsc` + `@types/node` (the starter uses `@n8n/node-cli` wrapper,
  but for a no-credentials pure-text node, tsc directly is simpler and avoids the
  starter CLI's additional scaffolding questions).
- Package manager: **npm** (starter uses npm, not pnpm).
- n8n node API version: `n8nNodesApiVersion: 1` (current as of 2026).
- Local dev install path: `~/.n8n/custom/node_modules/` via `npm link`.
- Status: research complete, decisions recorded.

## Phase 1 — Scaffold ✅
Files created:
- `package.json` — name `n8n-nodes-bangla`, MIT, keywords include bangla/bengali/n8n-community-node-package
- `tsconfig.json` — target ES2020, commonjs output to `dist/`
- `vitest.config.ts` — test runner with `.js`→`.ts` alias resolution
- `nodes/Bangla/bangla.svg` — SVG icon (green/red, Bengali letter ক)
- Directory structure: `nodes/Bangla/helpers/transliterate/`
- Status: scaffolded.

## Phase 2 — Node + Operations ✅
Helper modules (all pure, independently testable):
- `helpers/digitConvert.ts` — bidirectional ০-৯ ↔ 0-9 char map
- `helpers/numberToWords.ts` — South Asian system (কোটি/লক্ষ/হাজার), 0–999,99,99,999
- `helpers/normalize.ts` — NFC, strips ZWSP/BOM/soft-hyphen/control chars; **preserves ZWJ+ZWNJ by default** (`keepJoiners=true`)
- `helpers/dateFormat.ts` — Bangla month names, optional Bengali digit output
- `helpers/transliterate/ruleBased.ts` — word dictionary + Avro-style phonetic mapper for common Banglish
- `helpers/transliterate/ollamaEngine.ts` — Ollama HTTP call with 10s timeout; graceful fallback to rule-based on any error
- `nodes/Bangla/Bangla.node.ts` — INodeType class wiring all 5 operations
- Status: all operations implemented.

## Phase 3 — Tests ✅
Test files:
- `test/digitConvert.test.ts` — 8 tests (both directions, round-trip, empty string)
- `test/numberToWords.test.ts` — 14 tests (zero, singles, hundreds, thousands, exact lakh, exact crore, mixed, error cases)
- `test/normalize.test.ts` — 13 tests (NFC, ZWSP strip, BOM strip, ZWJ/ZWNJ preserved by default, strips when keepJoiners=false, space collapse, trim, control chars, newline preservation)
- `test/dateFormat.test.ts` — 7 tests (months, bangla digits, Date object, invalid date, custom format)
- `test/transliterate.test.ts` — 8 tests (common phrases, case-insensitive, punctuation preserved, non-Latin passthrough)

**Bug found and fixed:** test had wrong expected value for `numberToWords(250_000)` — 250,000 in South Asian system is "দুই লক্ষ পঞ্চাশ হাজার" (2 lakh 50 thousand), not "পঁচিশ লক্ষ". Fixed test expected value.

**Result: 49/49 tests passing. Zero failures.**

## Phase 4 — Build + Local Wiring ✅
- `npm run build` → TypeScript compiled to `dist/` with no errors
- Fix applied: changed `Record<string, unknown>` to `IDataObject` for n8n-workflow type compatibility
- `n8n-workflow` installed as devDependency to satisfy TS compilation
- SVG icon copied to `dist/nodes/Bangla/bangla.svg`
- `npm link` run in project root → package registered globally
- `npm link n8n-nodes-bangla` run in `~/.n8n/custom/` → symlink created at `~/.n8n/custom/node_modules/n8n-nodes-bangla`
- `sample-workflow.json` generated with one node per operation and example inputs
- Status: build clean, wired for local n8n pickup.

## Phase 5 — Docs ✅
- `README.md` written with install table, operations table, examples, Ollama mention
- `NEXT_STEPS.md` written with exact manual steps checklist
- `BUILD_LOG.md` (this file) finalized

## Final Summary
**Status: COMPLETE**
- 5 operations implemented, each as a pure testable helper function
- 49 unit tests, all passing
- TypeScript build clean (zero errors)
- Package npm-linked into `~/.n8n/custom/` — ready to activate on next n8n restart
- `sample-workflow.json` ready to import for visual verification
- No npm publish attempted; no credentials required
