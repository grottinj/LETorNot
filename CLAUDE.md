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
- Visit counting: GoatCounter only (cookieless, `letornot.goatcounter.com`), added at Dr. Grotting's request in Nov 2026, with a privacy line in every footer. No other trackers or analytics. The questionnaire stores nothing and sends nothing; never put answers in the URL.

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
    data/updates.json    research updates (source of truth for the home page section)
  tools/build_updates.py renders updates.json into index.html (authoring helper, not a site build)
  sitemap.xml, robots.txt
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

## Author and review

- Author and medical reviewer: **John Andrew Grotting, MD**, orthopedic sports medicine surgeon, Synergy Orthopedic Specialists, San Diego. Use this exact name form on the site.
- Every page carries a "Medically reviewed by ... Last reviewed <date>" byline and matching `lastReviewed` in its JSON-LD. Only change the date when Dr. Grotting has actually reviewed the change.
- The site states that it was built with the help of AI tools and reviewed by Dr. Grotting. Keep that statement.
- Disclosure (his chosen wording, home page): "Dr. Grotting has no financial relationships with companies whose products are discussed on this site." If the site ever discusses a specific company's product, ask him to re-confirm this line first.
- Two statements are intentionally left uncited at his direction (crutches timeline on acl.html; "most guidelines recommend autograft" on grafts.html). Do not change them without asking.

## Research updates (home page)

- Source of truth: `assets/data/updates.json`. Render with `python3 tools/build_updates.py`, which rewrites the block between `<!-- updates:start -->` and `<!-- updates:end -->` in `index.html`.
- **Nothing is published until Dr. Grotting has verified it.** An entry may be added to `updates.json` only after he has explicitly approved that specific article in chat. Never commit unverified drafts to the repository (it is public). Never write, guess or edit his comment: use his words exactly, or leave `comment` empty.
- Entry fields: `pmid`, `title` (exact PubMed title), `journal` (ISO abbreviation), `published` (YYYY-MM-DD), `summary` (2-3 short plain-language sentences drawn only from the abstract; numbers must match the abstract), `comment` (his words, optional), `verified: true`, `verified_on` (the date he approved).
- Summaries follow the hard rules: plain language, no scare language, no claims beyond the paper, and say when a study is small, retrospective or early.
- The row is scrolled by the reader. Do not add auto-scrolling or animation (WCAG 2.2.2).

## Subagent guidance

- **RESEARCH** subagent: only writes EVIDENCE.md and a references draft. Uses the PubMed MCP. Every entry has a real PMID. If a claim cannot be supported by a retrieved source, drop the claim.
- **CONTENT** subagent: writes the 3 explainer pages + references page. Stays at 7th–8th grade reading level. Every medical term defined on first use.
- **FRONTEND** subagent: builds HTML/CSS/JS + SVGs. No build step. Mobile-first. WCAG 2.1 AA.
- **DEPLOY** subagent: handles gh, Pages, CNAME, DNS lookup against GitHub's current docs.
