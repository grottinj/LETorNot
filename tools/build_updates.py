#!/usr/bin/env python3
"""Render assets/data/updates.json into the Research updates section of index.html
and the "Recent research updates" list on references.html.

Authoring helper only (the site itself has no build step). Run after editing
updates.json:  python3 tools/build_updates.py

Only entries with "verified": true and a non-empty "verified_on" date are
rendered. Nothing is shown publicly until Dr. Grotting has verified it.
"""
import html
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "assets" / "data" / "updates.json"
PAGE = ROOT / "index.html"
REFS = ROOT / "references.html"
START, END = "<!-- updates:start -->", "<!-- updates:end -->"
RSTART, REND = "<!-- recent-refs:start -->", "<!-- recent-refs:end -->"
MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]
REQUIRED = ("pmid", "title", "journal", "published", "summary", "verified_on",
            "authors", "citation", "doi")


def nice_date(iso):
    y, m, d = (int(x) for x in iso.split("-"))
    return f"{MONTHS[m - 1]} {d}, {y}"


def month_year(iso):
    y, m = (int(x) for x in iso.split("-")[:2])
    return f"{MONTHS[m - 1]} {y}"


def card(e):
    esc = html.escape
    out = ['        <li class="update-card">',
           f'          <p class="update-meta">{esc(e["journal"])} &middot; {esc(month_year(e["published"]))}</p>',
           f'          <h3><a href="https://pubmed.ncbi.nlm.nih.gov/{esc(e["pmid"])}/" target="_blank" rel="noopener">{esc(e["title"])}</a></h3>',
           f'          <p>{esc(e["summary"])}</p>']
    if e.get("comment"):
        out.append(f'          <p class="update-comment"><strong>Dr. Grotting\'s comment:</strong> {esc(e["comment"])}</p>')
    out.append(f'          <p class="update-verified">Verified by John Andrew Grotting, MD on {esc(nice_date(e["verified_on"]))}</p>')
    out.append('        </li>')
    return "\n".join(out)


def ref_item(e):
    esc = html.escape
    return "\n".join([
        f'      <li id="update-{esc(e["pmid"])}">',
        f'        {esc(e["authors"])} <em>{esc(e["title"])}</em> {esc(e["citation"])}',
        '        <br>',
        f'        <a href="https://pubmed.ncbi.nlm.nih.gov/{esc(e["pmid"])}/" target="_blank" rel="noopener">PubMed {esc(e["pmid"])}</a> &middot;',
        f'        <a href="https://doi.org/{esc(e["doi"])}" target="_blank" rel="noopener">doi:{esc(e["doi"])}</a>',
        '      </li>'])


def splice(path, start, end, block):
    page = path.read_text()
    a, b = page.index(start), page.index(end)
    path.write_text(page[:a + len(start)] + "\n" + block + "\n    " + page[b:])


def main():
    entries = json.loads(DATA.read_text())
    shown = []
    for e in entries:
        if e.get("verified") is not True:
            continue
        missing = [k for k in REQUIRED if not e.get(k)]
        if missing:
            sys.exit(f"Entry {e.get('pmid')} is marked verified but is missing: {missing}")
        shown.append(e)
    shown.sort(key=lambda e: (e["verified_on"], e["published"]), reverse=True)

    if shown:
        block = "\n".join([
            '    <section class="updates" aria-labelledby="updates-heading">',
            '      <h2 id="updates-heading">Research updates</h2>',
            '      <p>New studies on LET and ACL reconstruction, in plain language. Summaries are prepared with the help of AI tools. Dr. Grotting checks each one against the published paper before it is posted here. Scroll sideways to see more.</p>',
            '      <ul class="updates-row" tabindex="0" aria-label="Research updates, newest first">',
            "\n".join(card(e) for e in shown),
            '      </ul>',
            '      <p class="small">These are single studies. One study rarely settles a question. Talk with your surgeon about what applies to you.</p>',
            '    </section>'])
    else:
        block = "    <!-- No verified research updates yet. -->"

    splice(PAGE, START, END, block)

    # Papers not yet folded into the main reference list / algorithm
    recent = [e for e in shown if not e.get("in_algorithm")]
    if recent:
        rblock = "\n".join([
            '    <section aria-labelledby="recent-refs-heading">',
            '      <h2 id="recent-refs-heading">Recent research updates</h2>',
            '      <p>These newer studies are featured in the Research updates section of the <a href="index.html">home page</a>. Dr. Grotting has verified each summary. They are not yet part of the tool\'s scoring. About every three months they are reviewed and, with his approval, added to the main list above.</p>',
            '      <ul class="recent-refs">',
            "\n".join(ref_item(e) for e in recent),
            '      </ul>',
            '    </section>'])
    else:
        rblock = "    <!-- No recent research updates outside the main list. -->"
    splice(REFS, RSTART, REND, rblock)
    print(f"Rendered {len(shown)} verified update(s) of {len(entries)} total.")


if __name__ == "__main__":
    main()
