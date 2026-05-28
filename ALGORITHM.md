# ALGORITHM.md

The questionnaire and transparent scoring model used on `/algorithm.html`.

This spec is derived from `EVIDENCE.md`. Every weight is tied to the strength of evidence for that factor. The algorithm runs entirely client-side in `assets/js/algorithm.js`.

---

## Design rules (from CLAUDE.md)

- 11 patient-language questions.
- Every question has an **"I don't know"** option.
- Each answer adds points proportional to evidence strength.
- "I don't know" adds a small neutral nudge upward (never less than "no"), AND increments an uncertainty counter that can push the result toward the middle bucket.
- 3 result buckets with plain-language explanations.
- Result screen lists which answers pushed the score up and which pushed it down — explainable.
- Result screen always ends: *"This tool is educational only. Your surgeon — who knows your knee, your imaging, and your exam — decides what's right for you."*
- "Start over" button.

---

## Weight scale

| Strength of evidence (from EVIDENCE.md) | Max weight per question |
|---|---|
| High | 3 |
| Moderate–High | 2 |
| Moderate | 2 |
| Low–Moderate | 1 |
| Low | 1 |

"I don't know" answer = **+1 point** to score AND +1 to uncertainty counter.

If uncertainty counter ≥ 4, the final result is **forced into the middle bucket** ("It's a closer call — discuss with your surgeon"), regardless of score — too much unknown to give a confident lean.

---

## Questions

Each entry: `id` — patient phrasing — options with scoring.

### Q1. Age (weight 3, evidence: high)

> **How old are you?**

- Under 25 → **+3**
- 25 to 30 → **+1**
- Over 30 → **0**
- I don't know → **+1 (uncertain)**

Evidence: STABILITY 1 RCT (PMID 31940222) enrolled 14–25; SANTI cohort (PMID 36255278) showed ~5.6× higher graft rupture risk in <20 vs >30; Petit 2026 (PMID 41733021) confirms highest failure in ≤25. Age is the single most consistent risk factor.

### Q2. Sport / activity (weight 3, evidence: high)

> **After you recover, do you plan to return to sports that involve cutting, pivoting, or jumping — like soccer, basketball, football, rugby, skiing, gymnastics, or martial arts?**

- Yes, I plan to return to those sports → **+3**
- Maybe / I play some of these but not at a high level → **+2**
- No, I do mostly straight-line activity (running, cycling, swimming) → **0**
- I don't know → **+1 (uncertain)**

Evidence: STABILITY inclusion criterion (PMID 31940222); Webster 2014 (PMID 24451111) — ~4× odds of graft rupture in patients returning to pivoting sports; Rezansoff 2023 (PMID 37270112).

### Q3. Pivot shift on surgeon's exam (weight 3, evidence: high)

> **When your surgeon examines your knee, do they say it shows a strong "shift" or "give-way" when they twist it — sometimes called a "high-grade pivot shift"?**

- Yes, a strong shift → **+3**
- A mild shift / some shift → **+1**
- No / not that I know of → **0**
- I don't know → **+1 (uncertain)**

Evidence: 87.9% of STABILITY patients had grade ≥2 pivot shift (PMID 31940222); LET reduced asymmetric pivot shift, OR 0.56 (Firth PMID 35050817); meta-analyses all confirm LET reduces post-op pivot shift positivity.

### Q4. Generalized flexibility / hypermobility (weight 2, evidence: moderate–high)

> **Are you very flexible or "double-jointed"? For example: can you bend your thumb back to touch your forearm, bend your little finger backward more than 90°, or place your palms flat on the floor with knees straight?**

- Yes, I'm very flexible / double-jointed → **+2**
- A little flexible → **+1**
- No, normal flexibility → **0**
- I don't know → **+1 (uncertain)**

Evidence: STABILITY inclusion (Beighton ≥4 or knee hyperextension >10°); 42% of STABILITY had GLL; Firth 2022 (PMID 35050817) — preop laxity OR 3.27 for graft rupture; Getgood editorial (PMID 34972553).

### Q5. Knee that bends backward (weight 1, evidence: moderate)

> **Does your good (uninjured) knee bend backward past straight when you stand — sometimes called "knee hyperextension" or "knee that locks back"?**

- Yes, noticeably → **+1**
- A little → **+1**
- No → **0**
- I don't know → **+1 (uncertain)**

Evidence: STABILITY enrollment criterion equivalent (>10° hyperextension, PMID 31940222); Getgood editorial framework (PMID 34972553).

### Q6. Planned graft type (weight 3, evidence: high)

> **Has your surgeon talked about which tissue (graft) they plan to use to rebuild your ACL? The graft is often taken from your own body.**

- Hamstring tendon (from the back of the thigh) → **+3**
- Patellar tendon (front of the knee, "BTB") → **+1**
- Quadriceps tendon (top of the kneecap) → **+1**
- Donor tissue (allograft) → **0**
- I don't know yet → **+1 (uncertain)**

Evidence: STABILITY exclusively studied hamstring autograft (PMID 31940222); SANTI (PMID 28151693) showed hamstring alone had highest failure; Petit 2026 (PMID 41733021) — hamstring 11.1% vs BPTB 5.1% in <25. Adding LET partly neutralizes the hamstring disadvantage.

### Q7. Bow-legged alignment (weight 1, evidence: low–moderate)

> **When you stand with your feet together, does your surgeon say your knees are "bow-legged" (knees stay apart)?**

- Yes → **+1**
- A little → **+1**
- No / knock-kneed instead / normal → **0**
- I don't know → **+1 (uncertain)**

Evidence: Quinn JBJS Reviews 2024 (PMID 39018384) — varus >5° increases ACL graft stress; Tollefson editorial (PMID 39580122). Direct LET-interaction evidence is limited, hence low weight.

### Q8. Posterior tibial slope (weight 2, evidence: moderate–high)

> **Has your surgeon ever mentioned that the top of your shin bone tilts more than average (sometimes called "increased posterior tibial slope" or "high tibial slope")?**

- Yes → **+2**
- No → **0**
- I don't know → **+1 (uncertain)**

Note: Most patients won't know this. The "I don't know" path is expected and is fine.

Evidence: Firth 2022 (PMID 35050817) — PTS OR 1.15 per degree for graft rupture; Tollefson editorial (PMID 39580122) recommends lateral augmentation in high-PTS primary ACLR.

### Q9. First or repeat ACL surgery on this knee (weight 2, evidence: moderate)

> **Is this your first ACL surgery on this knee, or has this knee already had ACL surgery once or more before?**

- This is a repeat surgery on this knee (revision) → **+2**
- This is my first ACL surgery → **0**
- I don't know → **+1 (uncertain)**

Evidence: Quinn JBJS Reviews 2024 (PMID 39018384) lists lateral augmentation as standard in revision; SANTI Rayes 2021 (PMID 34898285); long-term SANTI (PMID 34351825) showed >5× revision risk without ALLR.

### Q10. Meniscus tear or prior meniscectomy (weight 2, evidence: moderate)

> **Along with your ACL tear, has your surgeon told you that your meniscus (a C-shaped cushion of cartilage in your knee) is torn, or that you've had part of it removed in a previous surgery?**

- Yes, torn or previously removed → **+2**
- No / not that I know of → **0**
- I don't know → **+1 (uncertain)**

Evidence: SANTI Sonnery-Cottet 2018 (PMID 29741400) — ALLR halves meniscal repair failure (HR 0.44); El Helou 2023 (PMID 36734511); Pettinari 2024 (PMID 38794893).

### Q11. Family history / other-side ACL injury (weight 1, evidence: low)

> **Has a close family member (parent, sibling) torn their ACL, or have you ever torn the ACL in your other knee?**

- Yes → **+1**
- No → **0**
- I don't know → **+1 (uncertain)**

Evidence: Webster 2014 (PMID 24451111) — family history doubles odds; Sward 2010 (PMID 20062970). Not a direct LET indication; signals general elevated ACL injury risk.

---

## Scoring math

```
total_score = sum of all selected option weights
uncertainty = count of "I don't know" answers
max_possible = 3+3+3+2+1+3+1+2+2+2+1 = 23
```

### Bucket thresholds

| Score range | Bucket | Label |
|---|---|---|
| ≥ 12 | HIGH | "Adding an LET may be worth discussing" |
| 6 – 11 | MIDDLE | "It's a closer call — discuss with your surgeon" |
| 0 – 5 | LOW | "An LET is less likely to add much for someone like you" |

**Override rule:** if `uncertainty >= 4`, force bucket = MIDDLE.

These thresholds reflect:
- **High bucket** corresponds to a patient who meets the STABILITY-style profile (young + pivoting + high-grade laxity/pivot shift + hamstring graft) which clears 12 easily.
- **Middle bucket** captures patients with 1–2 strong factors or several moderate ones — a real clinical "closer call."
- **Low bucket** is the patient with few risk factors (older, low-pivot sport, no laxity, allograft or BPTB, primary, no meniscus issue).

---

## Result screen requirements

1. The bucket label (large heading).
2. A 2-3 sentence plain-language explanation of the bucket.
3. An explainable breakdown:
   - **"What pushed your result toward considering an LET:"** — list each question + answer that added ≥2 points, with a one-sentence reason.
   - **"What pushed your result the other way:"** — list each question + answer that added 0 points where another option would have added more.
   - If uncertainty ≥ 4: a callout: *"You answered 'I don't know' to several questions. That's normal — and it's why we're nudging your result toward 'discuss with your surgeon.' Your surgeon can answer many of these directly from your exam, imaging, and history."*
4. A "What to do next" block:
   - *"Print or screenshot this page and bring it to your next appointment. Your surgeon may agree, disagree, or add factors specific to your knee."*
5. The required closing disclaimer line.
6. A "Start over" button.

---

## File contract

- The questions array, weights, and bucket thresholds live in `assets/js/algorithm.js`.
- The `algorithm.html` page contains an empty `<main id="quiz">` shell and a footer disclaimer.
- The JS progressively renders each question (one at a time, mobile-friendly), shows a progress indicator (e.g., "Question 3 of 11"), and on completion renders the result view with the explainable breakdown.
- Nothing is sent to any server. Nothing is stored. The whole quiz state is in memory only — refreshing the page restarts the quiz.

---

*Last updated: 2026-05-28. Built from EVIDENCE.md.*
