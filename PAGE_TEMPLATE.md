# PAGE_TEMPLATE.md

Shared HTML page skeleton used by CONTENT and FRONTEND subagents so the site stays consistent.

Required structure for every HTML page (except the home hero):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="<page-specific description>">
  <title><Page name> · LET or Not</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html">
        <!-- inline brand-mark SVG (small knee glyph) -->
        <svg class="brand-mark" viewBox="0 0 28 28" aria-hidden="true">...</svg>
        LET or Not
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="acl.html">ACL basics</a>
        <a href="grafts.html">Graft types</a>
        <a href="let.html">What is an LET</a>
        <a href="algorithm.html">Should I ask about LET?</a>
        <a href="references.html">References</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <h1>Page heading</h1>
    <p class="lead">Lead paragraph in plain language.</p>
    <!-- page content -->
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p><strong>Disclaimer.</strong> This website is for general education. It is not medical advice, not a diagnosis, and not a substitute for evaluation by a qualified surgeon. Always discuss your specific situation with your own surgeon.</p>
      <p class="small">© LET or Not · Built as patient-education material.</p>
    </div>
  </footer>
</body>
</html>
```

## Rules

- The `aria-current="page"` attribute should be added to the nav link matching the current page.
- Define abbreviations on first use: e.g., *"ACL (anterior cruciate ligament)"*.
- All SVG illustrations must be **original** and contain a `<title>` and `<desc>` element for accessibility, plus `role="img"` and an `aria-labelledby` referencing the title.
- Use `<figure>` + `<figcaption>` for diagrams.
- Reading-level target: 7th–8th grade. Use short sentences. Translate clinical terms.
- Never write "the patient" — use "you" / "your knee".
- Footer disclaimer text is fixed (do not paraphrase).
