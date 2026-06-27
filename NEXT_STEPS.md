# NEXT_STEPS.md — What you need to do manually

Everything that could be done autonomously is done. The following steps require you.

---

## Immediate: Activate the node in your local n8n

- [ ] **Restart your local n8n instance** (Ctrl+C and restart, or restart the service/Docker container).
      The node is already linked at `~/.n8n/custom/node_modules/n8n-nodes-bangla`.
      n8n reads that directory on startup and registers any `n8n-community-node-package` it finds.

- [ ] **Verify it loaded**: Open `http://localhost:5678`, create a new workflow,
      search for "Bangla" in the nodes panel — the node should appear.

- [ ] **Import and run the sample workflow**:
      Workflows → Import from file → select `sample-workflow.json` from this directory.
      Execute it and check the output of each of the 5 nodes.

---

## Expected outputs in the sample workflow

| Node | Input | Expected `result` |
|------|-------|-------------------|
| Digit Convert (Bengali→Latin) | `আমার নম্বর ০১৭১২৩৪৫৬৭৮` | `আমার নম্বর 01712345678` |
| Number to Bangla Words | `125` | `একশো পঁচিশ` |
| Normalize & Clean | `বাং​লা  টেক্সট  ` | `বাংলা টেক্সট` |
| Date Format | `2024-03-26` (Bangla digits on) | `২৬ মার্চ ২০২৪` |
| Transliterate (BETA) | `ami valo achi` | `আমি ভালো আছি` |

---

## Optional: Test the Ollama engine

- [ ] Make sure Ollama is running: `ollama serve`
- [ ] Pull a model if needed: `ollama pull llama3.1`
- [ ] In the Transliterate node, change Engine to "Ollama (Local LLM)" and run.
      Check the `engine` field in output — it should say `"ollama"`.
      If Ollama is unreachable the output will say `"rule-based"` with a `note` explaining the fallback.

---

## If the node does NOT appear after restart

Run this check in your terminal:
```powershell
# Confirm the symlink exists
Get-Item "$env:USERPROFILE\.n8n\custom\node_modules\n8n-nodes-bangla"

# If missing, re-run the link command:
cd "$env:USERPROFILE\.n8n\custom"
npm link n8n-nodes-bangla
# Then restart n8n again.
```

Also check that `N8N_CUSTOM_EXTENSIONS` is NOT set to a different path in your environment
(if it is, link the package there instead of `~/.n8n/custom`).

---

## When ready to publish to npm

```bash
cd "d:\MAIN\bangla test toolkit"
npm login               # enter your npm credentials
npm publish --access public
```

After publishing, anyone can install via the n8n GUI:
`Settings → Community Nodes → Install → n8n-nodes-bangla`

---

## Rebuild after code changes

```bash
cd "d:\MAIN\bangla test toolkit"
npm run build
# Copy the SVG icon (tsc doesn't copy assets):
cp nodes/Bangla/bangla.svg dist/nodes/Bangla/bangla.svg
# Restart n8n to pick up the new dist/
```
