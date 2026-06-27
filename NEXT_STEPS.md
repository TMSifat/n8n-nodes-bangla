# NEXT_STEPS.md — What's left for you

Everything except the two items below has been done autonomously.

---

## Verify the node in n8n (30 seconds)

- [ ] Open `http://localhost:5678`
- [ ] Find the workflow **"Bangla Node — All Operations Demo"** (already imported)
- [ ] Click **Execute** — check each of the 5 node outputs match the expected results in README

---

## Publish to npm (when you're ready)

```bash
cd "d:\MAIN\bangla test toolkit"
npm login                     # enter your npm account credentials
npm publish --access public
```

After publishing, anyone can install via:
- n8n GUI → Settings → Community Nodes → Install → `n8n-nodes-bangla`
- Or: `npm install n8n-nodes-bangla` in `~/.n8n/custom/`

---

## GitHub repo

Live at: **https://github.com/TMSifat/n8n-nodes-bangla**

Optional nice-to-haves you can do in the GitHub UI:
- Add a repo description: *"The first Bangla text toolkit for n8n"*
- Add topics: `n8n`, `bangla`, `bengali`, `n8n-community-node`
- Add a social preview image

---

## Rebuild after code changes

```bash
cd "d:\MAIN\bangla test toolkit"
npm run build        # compiles TS + copies SVG to dist/
npm test             # confirm 49/49 still pass
git add -A && git commit -m "your message"
git push
```
