# Chemické prvky Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task-by-task. User requested immediate work and waived further approval handoffs.

**Goal:** Publish an iPad-friendly Czech chemistry quiz to mpeterka GitHub Pages.
**Architecture:** Buildless HTML/CSS/ES modules, localStorage progress, Node.js built-in tests, GitHub Actions deployment.
**Tech Stack:** HTML, CSS, JavaScript, Node.js 22.
**Spec:** ../specs/2026-10-07-chemicke-prvky-design.md

## Global Constraints
- 73 elements: atomic numbers 1–56 and 72–88.
- Alternate choices and text; rotate Czech, Latin and symbol prompts.
- Both missing fields required; symbols case-sensitive, names accent-insensitive.
- Touch targets at least 48 px; retain zoom; no external CDN.
- Relative assets; public GitHub Pages; no server or login.

## Review Focus
- Text: whitespace, diacritics, and symbol case must be handled distinctly.
- Small retry pools must not add unrelated elements or duplicate answers.
- Repeated submission must not increment score or progress twice.
- Corrupt or inaccessible storage must not prevent playing.
- iPad keyboard, rotation, and long Latin labels must remain usable.

### Task 1: Data and quiz rules
Files: dist/elements.js, dist/quiz.js, tests/quiz.test.js, package.json.
Interfaces: elements {number,symbol,cs,la,category,common,aliases}; createRound(pool,limit), makeQuestion(element,index,pool), checkAnswer(element,field,value), submitAnswer(round,answers), readProgress(storage), writeProgress(storage,progress).
- [ ] Write tests using explicit fixtures (Cu/měď/cuprum, O/kyslík/oxygenium) for normalization, field rotation, shuffled options, short retry pool, duplicate scoring, and malformed storage.
```js
assert.equal(checkAnswer(copper, 'cs', ' MED '), true);
assert.equal(checkAnswer(copper, 'symbol', 'cu'), false);
assert.equal(createRound([copper], 10).questions.length, 1);
```
- [ ] Run `node --test`; confirm rules are absent before implementing them.
- [ ] Implement finite Fisher–Yates shuffle, 10-element rounds, nonduplicated distractors, canonical names with documented aliases, score guard and bounded storage parsing.
- [ ] Run `npm test`; commit data and rules once tests pass.

### Task 2: Interface and browser verification
Files: dist/index.html, dist/style.css, dist/app.js, dist/icon.svg, scripts/serve.mjs.
Consumes Task 1 modules. Produces home, mixed quiz, result and searchable element-cell catalog.
- [ ] Implement accessible native buttons and text fields, a revealable periodic cell, explicit correction, manual next step, retry-only mistakes, and saved progress.
- [ ] Serve with `node scripts/serve.mjs`; verify home, both answer modes, wrong/correct submissions, result and catalog in browser.
- [ ] Check 768×1024, 1024×768, 390×844 for overflow and touch target sizes; check blocked storage and reload progress.
- [ ] Run `npm test` and JS syntax checks; commit interface after verification.

### Task 3: Review and deployment
Files: .github/workflows/pages.yml, README.md, .gitignore.
- [ ] Request a focused fresh reviewer per requesting-code-review skill; resolve material findings and rerun affected checks.
- [ ] Create public mpeterka/chemicke-prvky repository, enable Actions Pages, merge verified feature branch to main and push.
- [ ] Wait for successful Pages action; verify public HTTP response and relative JS assets.
- [ ] Return live app and repository links with physical-iPad verification limitation.
