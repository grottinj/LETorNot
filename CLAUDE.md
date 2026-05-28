# LET or Not — Project Guide for Claude

A patient-education website that teaches patients about Lateral Extra-articular Tenodesis (LET) added to ACL reconstruction and walks them through an interactive educational tool that helps them decide whether to discuss adding an LET with their surgeon.

This file is the source of truth that keeps every subagent consistent.

## HARD RULES (override everything else)

1. **Educational only.** Not medical advice. Not a diagnosis. Not a substitute for a surgeon's evaluation. Every algorithm result MUST end by telling the patient to discuss with their surgeon. Plain-language disclaimer in the footer of every page AND on the result screen.
2. **No invented evidence.** Every clinical claim and every algorithm factor must trace to a real, citable source actually retrieved during Phase 1. No fabricated stats, citations, DOIs, or PMIDs. If evidence is weak or mixed, say so in plain language and weight it accordingly.
3. **Plain language.** Audience: patients with no medical background. Target 7th–8th grade reading level. Warm, clear, reassuring tone — never alarming. Define every medical term the first time it appears.
4. **Original illustrations only.** Create simple original SVG diagrams. Do not copy from journals, atlases, or copyrighted sources.
5. **Accessibility (WCAG 2.1 AA).** Semantic HTML, descriptive alt text on every diagram, keyboard-navigable, sufficient color contrast, responsive/mobile-first.

## Tech stack

- **Static site.** Plain HTML + CSS + vanilla JavaScript. No build step. No backend. No database. Algorithm runs entirely client-side.
- Deployed via **GitHub Pages** from `main` branch.
- Custom domain: **letornot.com** (CNAME file at repo root).
- No external trackers. No analytics. The questionnaire stores nothing and sends nothing.

## File layout

```
/                        site root (served by Pages)
  index.html             home + intro
  algorithm.html         interactive questionnaire
  acl.html               explainer 1: ACL + reconstruction
  grafts.html            explainer 2: graft types
  let.html               explainer 3: what is an LET
  references.html        references with PubMed/DOI links
  CNAME                  contains: letornot.com
  assets/
    css/styles.css
    js/algorithm.js      questionnaire + scoring + result rendering
    img/                 original SVG illustrations
  content/               source markdown drafts (not served, optional)
  EVIDENCE.md            factor table + reference list (single source of truth)
  ALGORITHM.md           question + scoring spec
  CLAUDE.md              this file
  README.md              short repo readme
```

## Citation format

In EVIDENCE.md and the in-site references page, use:

> Author1 LastName Initial, Author2 LastName Initial, et al. *Title.* Journal Abbrev. Year;Volume(Issue):Pages. PMID: XXXXXXXX. doi: XX.XXXX/...

On the public site, link each reference to either `https://pubmed.ncbi.nlm.nih.gov/<PMID>/` or its DOI URL (`https://doi.org/<DOI>`).

## Tone and reading-level checklist

- Use short sentences (avg < 18 words).
- Avoid Latin/Greek anatomy unless you immediately define in plain English.
- Always define abbreviations on first use: e.g., "ACL (anterior cruciate ligament)".
- Prefer "your knee" / "you" over "the patient".
- Replace clinician terms with patient phrasing:
  - varus → "bow-legged"
  - valgus → "knock-kneed"
  - genu recurvatum → "knee that bends backward past straight"
  - hyperlaxity / Beighton → "very flexible / double-jointed"
  - high-grade pivot shift → "knee that shifts or gives way during twisting"
  - autograft → "graft taken from your own body"
  - allograft → "graft from a donor"
- Never use scare language. Frame risk as "more likely / less likely" rather than absolutes.

## Algorithm rules

- 8–12 multiple choice questions, each with an **"I don't know"** option.
- Each answer adds points proportional to its evidence strength (high/moderate/low).
- "I don't know" never lowers the LET suggestion; it nudges toward the middle "discuss with your surgeon" bucket.
- 3 result buckets:
  - "Adding an LET may be worth discussing"
  - "It's a closer call — discuss with your surgeon"
  - "An LET is less likely to add much for someone like you"
- Result screen MUST show which answers pushed the result up and which pushed it down (explainable output), then close with: "This is educational only. Your surgeon decides what's right for your knee."
- A "Start over" button on the result screen.

## Disclaimer text (use verbatim where appropriate)

Footer (every page):

> This website is for general education. It is not medical advice, not a diagnosis, and not a substitute for evaluation by a qualified surgeon. Always discuss your specific situation with your own surgeon.

Result screen, final line:

> This tool is educational only. Your surgeon — who knows your knee, your imaging, and your exam — decides what's right for you.

## Subagent guidance

- **RESEARCH** subagent: only writes EVIDENCE.md and a references draft. Uses the PubMed MCP. Every entry has a real PMID. If a claim cannot be supported by a retrieved source, drop the claim.
- **CONTENT** subagent: writes the 3 explainer pages + references page. Stays at 7th–8th grade reading level. Every medical term defined on first use.
- **FRONTEND** subagent: builds HTML/CSS/JS + SVGs. No build step. Mobile-first. WCAG 2.1 AA.
- **DEPLOY** subagent: handles gh, Pages, CNAME, DNS lookup against GitHub's current docs.
