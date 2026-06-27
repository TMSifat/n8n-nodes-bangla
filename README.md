# Bangla Text Toolkit for n8n

**`n8n-nodes-bangla`** — The first Bangla text toolkit for n8n.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-bangla.svg)](https://www.npmjs.com/package/n8n-nodes-bangla)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is this?

`n8n-nodes-bangla` is an [n8n](https://n8n.io) community node that adds Bangla-language text-processing operations to your workflows. Before this package, no Bangla-specific node existed in the n8n ecosystem — every team building Bangladesh-market automations had to write custom Code nodes or pre-process text outside n8n entirely.

This node fills that gap. It runs as a single **Bangla** node with an **Operation** dropdown. Every operation is a pure text transform: no credentials, no external API calls, no rate limits.

---

## Why it's useful

### Real-world use cases

- **Clean messy Bangla text from web scraping or user forms** — strip zero-width spaces, BOM characters, stray control characters, and inconsistent Unicode normalization before writing to a database or sending to an API.

- **Convert Bengali digits ↔ Latin digits** — invoices, reports, and most databases expect ASCII numerals (0–9). Flip ০১২৩ to 0123 automatically, or go the other way when generating localized documents.

- **Generate Bangla number-words for invoices and receipts** — display "একশো পঁচিশ টাকা" instead of "125 টাকা" on PDF receipts, WhatsApp notifications, or bank SMS templates.

- **Format dates with Bangla month names** — produce "২৬ মার্চ ২০২৪" for localized notifications, emails, and birthday messages instead of "2024-03-26".

- **Transliterate Banglish user input into Bangla script** — when users type "ami valo achi" into a chatbot, CRM form, or support ticket, automatically convert it to "আমি ভালো আছি" before storing or routing it.

- **Bangladesh automation community** — particularly useful for teams building local-market automations: SMS gateways, local e-commerce, government form processing, or Bangla-language chatbots on top of n8n.

---

## How it works

Add the **Bangla** node to any workflow. Connect it to any node that produces text. Select an **Operation** from the dropdown — the node reads the relevant fields from the incoming item, applies the transform, and passes the result downstream as `{ result, input, operation, ... }`.

Every operation is stateless and pure: given the same input and options, you always get the same output. There are no credentials to configure — the only optional external dependency is a local [Ollama](https://ollama.ai) instance for the Transliterate operation, and that falls back gracefully if unavailable.

---

## Operations

| Operation | What it does | Example input → output |
|-----------|-------------|------------------------|
| **Digit Convert** | Maps Bengali digits (০–৯) to Latin (0–9) or vice versa, character by character. Non-digit characters pass through unchanged. | `"আমার নম্বর ০১২৩"` → `"আমার নম্বর 0123"` (Bengali→Latin) |
| **Number to Bangla Words** | Converts a non-negative integer to Bangla words using the South Asian system (কোটি / লক্ষ / হাজার). Supports 0 through 999,99,99,999. | `125` → `"একশো পঁচিশ"` · `1500` → `"এক হাজার পাঁচশো"` · `100000` → `"এক লক্ষ"` |
| **Normalize & Clean** | NFC-normalizes Unicode; strips zero-width space (U+200B), BOM (U+FEFF), soft hyphen, and stray control characters; collapses repeated spaces; trims. **Preserves ZWJ (U+200D) and ZWNJ (U+200C) by default** — they are meaningful in Bangla conjuncts. | `"বাং​লা  টেক্সট  "` (ZWSP + double space + trailing) → `"বাংলা টেক্সট"` |
| **Date Format** | Formats a date string or ISO date with Bangla month names. Optional `banglaDigits` flag outputs numerals as ০–৯. Format string is configurable (default: `D MMMM YYYY`). | `"2024-03-26"` → `"26 মার্চ 2024"` · with `banglaDigits=true` → `"২৬ মার্চ ২০২৪"` |
| **Transliterate** _(BETA)_ | Converts Banglish (romanised Bangla) to Bangla script using a pluggable engine. Default is a local rule-based phonetic mapper (offline). Optional local Ollama engine for higher quality. | `"ami valo achi"` → `"আমি ভালো আছি"` · `"dhonnobad"` → `"ধন্যবাদ"` |

---

## Installation

### A — Local development (npm link)

Use this if you want to run or modify the node locally without publishing to npm.

```bash
# 1. Clone and build
git clone https://github.com/TMSifat/n8n-nodes-bangla.git
cd n8n-nodes-bangla
npm install
npm run build

# 2. Register the package globally via npm link
npm link

# 3. Wire it into your local n8n's custom nodes directory
cd ~/.n8n/custom          # create this folder if it doesn't exist
npm link n8n-nodes-bangla

# 4. Restart n8n — the Bangla node will appear in the nodes panel
```

### B — Standard install (once published to npm)

```bash
# Option 1: via n8n GUI
# Settings → Community Nodes → Install → search "n8n-nodes-bangla"

# Option 2: via CLI (in your n8n custom folder)
cd ~/.n8n/custom
npm install n8n-nodes-bangla
# Restart n8n
```

---

## Transliteration engines

The Transliterate operation supports a pluggable `engine` option:

### `rule-based` (default)

- Runs entirely offline — no network, no external service, no API key.
- Uses an Avro-style phonetic mapping table plus a word-level dictionary for common Banglish terms (`ami`, `valo`, `dhonnobad`, etc.).
- Reliable for common conversational Banglish; weaker on complex conjuncts, particles, and dialectal variation.

### `ollama` (optional, local LLM)

- Calls a **local** [Ollama](https://ollama.ai) instance at `http://localhost:11434` (configurable).
- Default model: `llama3.1` (configurable per node).
- **Privacy-friendly**: your text never leaves your machine.
- If Ollama is unreachable or returns an error, the node **automatically falls back** to the rule-based engine and adds a `note` field to the output — it never crashes.
- Setup: `ollama pull llama3.1` (one-time download).

> **Note on BETA status:** Transliteration is inherently hard. The rule-based engine is best-effort and will mishandle code-switching, Sylheti/Chittagonian variations, and unusual proper nouns. The Ollama engine is higher quality but depends on the model's training data. Treat outputs as a first pass — review before storing in production.

---

## Running the demo

A sample workflow is included that exercises all five operations in one go:

1. Open n8n at `http://localhost:5678`
2. **Workflows → Import from file** → select `sample-workflow.json` from this repo
3. Open the workflow **"Bangla Node — All Operations Demo"** and click **Execute**
4. Inspect the output of each node — you should see the results from the Operations table above

---

## Development

```bash
npm install          # install dependencies
npm run build        # compile TypeScript → dist/ (also copies SVG icon)
npm test             # run all 49 unit tests via Vitest
npm run build:watch  # watch mode for active development
npm run lint         # ESLint check
npm run lint:fix     # auto-fix lint issues
```

---

## Contributing

Issues and pull requests are welcome. Please open an issue before starting significant work so we can discuss the approach. All new operations should include unit tests.

---

## License

MIT © [Tanvir Mustabi Sifat](https://github.com/TMSifat)
