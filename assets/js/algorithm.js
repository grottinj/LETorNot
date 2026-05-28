/**
 * LET or Not — algorithm.js
 * Vanilla JS, no dependencies, no build step.
 * All quiz state lives in memory. No fetch, no localStorage, no analytics.
 *
 * Spec source: ALGORITHM.md (last updated 2026-05-28)
 */

'use strict';

// ---------------------------------------------------------------------------
// 1. QUESTIONS  (exact text and weights from ALGORITHM.md)
// ---------------------------------------------------------------------------

const QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    text: 'How old are you?',
    maxWeight: 3,
    options: [
      { label: 'Under 25',    weight: 3, uncertain: false },
      { label: '25 to 30',    weight: 1, uncertain: false },
      { label: 'Over 30',     weight: 0, uncertain: false },
      { label: "I don't know", weight: 1, uncertain: true  },
    ],
    reason: 'Younger age is the single most consistent risk factor for a new ACL graft tearing.',
  },
  {
    id: 'q2',
    number: 2,
    text: 'After you recover, do you plan to return to sports that involve cutting, pivoting, or jumping — like soccer, basketball, football, rugby, skiing, gymnastics, or martial arts?',
    maxWeight: 3,
    options: [
      { label: 'Yes, I plan to return to those sports',                                  weight: 3, uncertain: false },
      { label: 'Maybe / I play some of these but not at a high level',                   weight: 2, uncertain: false },
      { label: 'No, I do mostly straight-line activity (running, cycling, swimming)',    weight: 0, uncertain: false },
      { label: "I don't know",                                                           weight: 1, uncertain: true  },
    ],
    reason: 'Returning to cutting and pivoting sports roughly quadruples the chance of a graft rupture.',
  },
  {
    id: 'q3',
    number: 3,
    text: 'When your surgeon examines your knee, do they say it shows a strong "shift" or "give-way" when they twist it — sometimes called a "high-grade pivot shift"?',
    maxWeight: 3,
    options: [
      { label: 'Yes, a strong shift',         weight: 3, uncertain: false },
      { label: 'A mild shift / some shift',   weight: 1, uncertain: false },
      { label: 'No / not that I know of',     weight: 0, uncertain: false },
      { label: "I don't know",                weight: 1, uncertain: true  },
    ],
    reason: 'A high-grade pivot shift (strong give-way on exam) is a key sign that your knee will benefit from the extra stability an LET provides.',
  },
  {
    id: 'q4',
    number: 4,
    text: 'Are you very flexible or "double-jointed"? For example: can you bend your thumb back to touch your forearm, bend your little finger backward more than 90°, or place your palms flat on the floor with knees straight?',
    maxWeight: 2,
    options: [
      { label: 'Yes, I\'m very flexible / double-jointed',  weight: 2, uncertain: false },
      { label: 'A little flexible',                         weight: 1, uncertain: false },
      { label: 'No, normal flexibility',                    weight: 0, uncertain: false },
      { label: "I don't know",                              weight: 1, uncertain: true  },
    ],
    reason: 'Generalized joint looseness (hypermobility) more than triples the risk of a graft failing after ACL surgery.',
  },
  {
    id: 'q5',
    number: 5,
    text: 'Does your good (uninjured) knee bend backward past straight when you stand — sometimes called "knee hyperextension" or "knee that locks back"?',
    maxWeight: 1,
    options: [
      { label: 'Yes, noticeably',    weight: 1, uncertain: false },
      { label: 'A little',           weight: 1, uncertain: false },
      { label: 'No',                 weight: 0, uncertain: false },
      { label: "I don't know",       weight: 1, uncertain: true  },
    ],
    reason: 'A knee that bends back past straight is a sign of overall joint looseness that can stress a new graft.',
  },
  {
    id: 'q6',
    number: 6,
    text: 'Has your surgeon talked about which tissue (graft) they plan to use to rebuild your ACL? The graft is often taken from your own body.',
    maxWeight: 3,
    options: [
      { label: 'Hamstring tendon (from the back of the thigh)',      weight: 3, uncertain: false },
      { label: 'Patellar tendon (front of the knee, "BTB")',         weight: 1, uncertain: false },
      { label: 'Quadriceps tendon (top of the kneecap)',             weight: 1, uncertain: false },
      { label: 'Donor tissue (allograft)',                           weight: 0, uncertain: false },
      { label: "I don't know yet",                                   weight: 1, uncertain: true  },
    ],
    reason: 'Hamstring grafts have the highest re-tear rates in young patients. Adding an LET partly compensates for that vulnerability.',
  },
  {
    id: 'q7',
    number: 7,
    text: 'When you stand with your feet together, does your surgeon say your knees are "bow-legged" (knees stay apart)?',
    maxWeight: 1,
    options: [
      { label: 'Yes',                                          weight: 1, uncertain: false },
      { label: 'A little',                                     weight: 1, uncertain: false },
      { label: 'No / knock-kneed instead / normal',            weight: 0, uncertain: false },
      { label: "I don't know",                                 weight: 1, uncertain: true  },
    ],
    reason: 'Bow-legged alignment (varus) increases stress on the outer side of the knee, where the LET provides extra support.',
  },
  {
    id: 'q8',
    number: 8,
    text: 'Has your surgeon ever mentioned that the top of your shin bone tilts more than average (sometimes called "increased posterior tibial slope" or "high tibial slope")?',
    maxWeight: 2,
    options: [
      { label: 'Yes',             weight: 2, uncertain: false },
      { label: 'No',              weight: 0, uncertain: false },
      { label: "I don't know",    weight: 1, uncertain: true  },
    ],
    reason: 'A steep tibial slope pushes the shin bone forward under load, adding extra strain to a new ACL graft. Lateral augmentation is often recommended when the slope is high.',
  },
  {
    id: 'q9',
    number: 9,
    text: 'Is this your first ACL surgery on this knee, or has this knee already had ACL surgery once or more before?',
    maxWeight: 2,
    options: [
      { label: 'This is a repeat surgery on this knee (revision)',   weight: 2, uncertain: false },
      { label: 'This is my first ACL surgery',                       weight: 0, uncertain: false },
      { label: "I don't know",                                       weight: 1, uncertain: true  },
    ],
    reason: 'Revision ACL surgery has a much higher re-tear risk. Lateral augmentation is widely considered standard practice in revision cases.',
  },
  {
    id: 'q10',
    number: 10,
    text: 'Along with your ACL tear, has your surgeon told you that your meniscus (a C-shaped cushion of cartilage in your knee) is torn, or that you\'ve had part of it removed in a previous surgery?',
    maxWeight: 2,
    options: [
      { label: 'Yes, torn or previously removed',   weight: 2, uncertain: false },
      { label: 'No / not that I know of',           weight: 0, uncertain: false },
      { label: "I don't know",                      weight: 1, uncertain: true  },
    ],
    reason: 'Adding an LET roughly halves the chance of a repaired meniscus re-tearing, making it especially valuable when the meniscus is already injured.',
  },
  {
    id: 'q11',
    number: 11,
    text: 'Has a close family member (parent, sibling) torn their ACL, or have you ever torn the ACL in your other knee?',
    maxWeight: 1,
    options: [
      { label: 'Yes',             weight: 1, uncertain: false },
      { label: 'No',              weight: 0, uncertain: false },
      { label: "I don't know",    weight: 1, uncertain: true  },
    ],
    reason: 'A family history of ACL tears, or a prior tear on the other side, signals that your ligaments may be generally more vulnerable.',
  },
];

// ---------------------------------------------------------------------------
// 2. SCORING CONSTANTS
// ---------------------------------------------------------------------------

const TOTAL_QUESTIONS  = QUESTIONS.length; // 11
const MAX_SCORE        = 23;               // 3+3+3+2+1+3+1+2+2+2+1
const THRESHOLD_HIGH   = 12;
const THRESHOLD_MIDDLE = 6;
const UNCERTAINTY_OVERRIDE = 4;

// ---------------------------------------------------------------------------
// 3. STATE
// ---------------------------------------------------------------------------

let currentIndex = 0;     // which question is showing (0-based)
let answers = [];          // Array of { questionId, optionIndex, label, weight, uncertain }

// ---------------------------------------------------------------------------
// 4. DOM HELPERS
// ---------------------------------------------------------------------------

const root        = () => document.getElementById('quiz-root');
const progressEl  = () => document.getElementById('quiz-progress');
const progressBar = () => document.getElementById('quiz-progress-fill');
const progressBarWrap = () => progressEl()?.closest('[role="progressbar"]') ?? document.querySelector('.quiz-progress-bar');

function updateProgress(questionNumber) {
  const pct = Math.round(((questionNumber - 1) / TOTAL_QUESTIONS) * 100);
  const p = progressEl();
  const bar = progressBar();
  const wrap = document.querySelector('.quiz-progress-bar');

  if (p) {
    p.textContent = `Question ${questionNumber} of ${TOTAL_QUESTIONS}`;
    p.setAttribute('aria-live', 'polite');
  }
  if (bar) bar.style.width = `${pct}%`;
  if (wrap) {
    wrap.setAttribute('aria-valuenow', pct);
    wrap.setAttribute('aria-label', `Quiz progress: question ${questionNumber} of ${TOTAL_QUESTIONS}`);
  }
}

function updateProgressComplete() {
  const p = progressEl();
  const bar = progressBar();
  const wrap = document.querySelector('.quiz-progress-bar');
  if (p) p.textContent = `Complete — ${TOTAL_QUESTIONS} of ${TOTAL_QUESTIONS} questions answered`;
  if (bar) bar.style.width = '100%';
  if (wrap) wrap.setAttribute('aria-valuenow', 100);
}

// ---------------------------------------------------------------------------
// 5. RENDER QUESTION
// ---------------------------------------------------------------------------

function renderQuestion(index) {
  const q = QUESTIONS[index];
  const existingAnswer = answers[index];
  updateProgress(index + 1);

  const html = `
    <div class="question" id="question-card" role="group" aria-labelledby="q-heading">
      <h2 id="q-heading">${escHtml(q.text)}</h2>
      <ul class="options" role="list">
        ${q.options.map((opt, i) => {
          const checked = existingAnswer && existingAnswer.optionIndex === i ? 'checked' : '';
          const dontknow = opt.uncertain ? ' dontknow' : '';
          const optId = `${q.id}-opt-${i}`;
          return `
            <li>
              <label class="option${dontknow}" for="${optId}">
                <input
                  type="radio"
                  id="${optId}"
                  name="${q.id}"
                  value="${i}"
                  ${checked}
                  aria-describedby="q-heading"
                >
                <span>${escHtml(opt.label)}</span>
              </label>
            </li>`;
        }).join('')}
      </ul>
      <div class="quiz-actions">
        <button class="btn secondary" id="btn-back" ${index === 0 ? 'disabled aria-disabled="true"' : ''}>
          &larr; Back
        </button>
        <button class="btn" id="btn-next" ${!existingAnswer ? 'disabled aria-disabled="true"' : ''}>
          ${index === TOTAL_QUESTIONS - 1 ? 'See my result &rarr;' : 'Next &rarr;'}
        </button>
      </div>
    </div>`;

  root().innerHTML = html;

  // Wire radio change to enable Next
  const radios = root().querySelectorAll(`input[name="${q.id}"]`);
  radios.forEach(r => r.addEventListener('change', () => {
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.removeAttribute('aria-disabled');
    }
  }));

  // Wire Back button
  const backBtn = document.getElementById('btn-back');
  if (backBtn && index > 0) {
    backBtn.addEventListener('click', () => {
      currentIndex--;
      renderQuestion(currentIndex);
    });
  }

  // Wire Next button
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => advanceQuestion(index, q));
  }

  // Focus the first option (or pre-selected option) for keyboard nav
  const firstRadio = root().querySelector(`input[name="${q.id}"]`);
  if (firstRadio) {
    const targetRadio = root().querySelector(`input[name="${q.id}"]:checked`) || firstRadio;
    // Small delay to allow DOM paint
    requestAnimationFrame(() => targetRadio.focus());
  }
}

function advanceQuestion(index, q) {
  const selected = root().querySelector(`input[name="${q.id}"]:checked`);
  if (!selected) return;

  const optIdx = parseInt(selected.value, 10);
  const opt = q.options[optIdx];

  answers[index] = {
    questionId:  q.id,
    questionText: q.text,
    questionReason: q.reason,
    questionMaxWeight: q.maxWeight,
    optionIndex: optIdx,
    label:       opt.label,
    weight:      opt.weight,
    uncertain:   opt.uncertain,
  };

  if (index < TOTAL_QUESTIONS - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  } else {
    computeAndRenderResult();
  }
}

// ---------------------------------------------------------------------------
// 6. KEYBOARD SHORTCUTS
// ---------------------------------------------------------------------------

document.addEventListener('keydown', e => {
  // Only act when a question is showing
  if (!document.getElementById('question-card')) return;

  const q = QUESTIONS[currentIndex];
  const key = e.key;

  // Number keys 1-9 select option
  if (/^[1-9]$/.test(key)) {
    const i = parseInt(key, 10) - 1;
    if (i < q.options.length) {
      const radio = document.getElementById(`${q.id}-opt-${i}`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        radio.focus();
      }
    }
  }

  // Enter advances
  if (key === 'Enter') {
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    }
  }
});

// ---------------------------------------------------------------------------
// 7. SCORING
// ---------------------------------------------------------------------------

function computeScore() {
  let total = 0;
  let uncertainCount = 0;
  answers.forEach(a => {
    total += a.weight;
    if (a.uncertain) uncertainCount++;
  });
  return { total, uncertainCount };
}

function resolveBucket(total, uncertainCount) {
  if (uncertainCount >= UNCERTAINTY_OVERRIDE) return 'middle';
  if (total >= THRESHOLD_HIGH) return 'high';
  if (total >= THRESHOLD_MIDDLE) return 'middle';
  return 'low';
}

// ---------------------------------------------------------------------------
// 8. RESULT RENDERING
// ---------------------------------------------------------------------------

const BUCKET_META = {
  high: {
    tag:   'Worth discussing',
    label: 'Adding an LET may be worth discussing',
    explanation: `Your answers match several of the risk factors that research links most strongly to ACL graft failure. Studies suggest that patients with your profile — especially younger athletes returning to high-demand sports with a hamstring graft — are the ones most likely to benefit from the extra stability an LET provides. Bringing this to your surgeon is a reasonable next step.`,
  },
  middle: {
    tag:   'Closer call',
    label: 'It\'s a closer call — discuss with your surgeon',
    explanation: `Your answers show a mix of factors — some that raise the question of an LET, some that don't point strongly in either direction. This is genuinely a zone where the right answer depends on details only your surgeon can assess: your exam findings, your imaging, and your full surgical plan. This tool's result is a prompt for a richer conversation, not a recommendation.`,
  },
  low: {
    tag:   'Less likely to help',
    label: 'An LET is less likely to add much for someone like you',
    explanation: `Based on your answers, the factors most strongly associated with benefiting from an LET are mostly absent. Research suggests that patients with fewer risk factors — for example, older recreational athletes choosing a non-hamstring graft for a first-time ACL surgery — gain less from lateral augmentation. That said, your surgeon may see something your answers don't capture.`,
  },
};

function buildFactorListsHtml(answersArr) {
  const up   = answersArr.filter(a => a.weight >= 2);
  const down = answersArr.filter(a => a.weight === 0 && a.questionMaxWeight > 0);

  let upHtml = '';
  if (up.length > 0) {
    upHtml = `
      <h3>What pushed your result toward considering an LET</h3>
      <ul class="factor-list up">
        ${up.map(a => `
          <li>
            <span class="qtext">${escHtml(a.questionText)}</span>
            <span class="atext">Your answer: "${escHtml(a.label)}" &mdash; ${escHtml(a.questionReason)}</span>
          </li>`).join('')}
      </ul>`;
  } else {
    upHtml = `<h3>What pushed your result toward considering an LET</h3><p class="muted">None of your answers added strong weight in this direction.</p>`;
  }

  let downHtml = '';
  if (down.length > 0) {
    downHtml = `
      <h3>What pushed your result the other way</h3>
      <ul class="factor-list down">
        ${down.map(a => `
          <li>
            <span class="qtext">${escHtml(a.questionText)}</span>
            <span class="atext">Your answer: "${escHtml(a.label)}"</span>
          </li>`).join('')}
      </ul>`;
  } else {
    downHtml = `<h3>What pushed your result the other way</h3><p class="muted">No answers clearly pushed against an LET.</p>`;
  }

  return upHtml + downHtml;
}

function computeAndRenderResult() {
  const { total, uncertainCount } = computeScore();
  const bucket = resolveBucket(total, uncertainCount);
  const meta = BUCKET_META[bucket];

  updateProgressComplete();

  const uncertainCalloutHtml = uncertainCount >= UNCERTAINTY_OVERRIDE
    ? `<div class="uncertainty-callout" role="note">
        <strong>A note about your "I don't know" answers:</strong>
        You answered "I don't know" to several questions. That's normal — and it's why we're nudging your result toward "discuss with your surgeon." Your surgeon can answer many of these directly from your exam, imaging, and history.
       </div>`
    : '';

  const factorsHtml = buildFactorListsHtml(answers);

  const html = `
    <div class="result-bucket ${bucket}" id="result-section">
      <span class="tag">${escHtml(meta.tag)}</span>
      <h2>${escHtml(meta.label)}</h2>
      <p>${escHtml(meta.explanation)}</p>
    </div>

    ${uncertainCalloutHtml}

    <div class="card" style="margin-top:1.5rem;">
      ${factorsHtml}
    </div>

    <div class="next-steps">
      <h3>What to do next</h3>
      <p>Print or screenshot this page and bring it to your next appointment. Your surgeon may agree, disagree, or add factors specific to your knee.</p>
    </div>

    <p style="background:var(--c-disclaimer-bg);border-radius:var(--radius-sm);padding:1rem;color:var(--c-disclaimer-ink);font-size:0.97rem;margin-top:1rem;">
      <em>This tool is educational only. Your surgeon — who knows your knee, your imaging, and your exam — decides what's right for you.</em>
    </p>

    <div class="quiz-actions" style="margin-top:1.5rem;">
      <button class="btn secondary" id="btn-start-over">&#8635; Start over</button>
    </div>`;

  root().innerHTML = html;

  const startOverBtn = document.getElementById('btn-start-over');
  if (startOverBtn) {
    startOverBtn.addEventListener('click', resetQuiz);
  }

  // Scroll result into view
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    requestAnimationFrame(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}

// ---------------------------------------------------------------------------
// 9. RESET
// ---------------------------------------------------------------------------

function resetQuiz() {
  currentIndex = 0;
  answers = [];
  updateProgress(1);
  renderQuestion(0);
  // Scroll back to top of quiz
  const mainEl = document.getElementById('main');
  if (mainEl) requestAnimationFrame(() => mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

// ---------------------------------------------------------------------------
// 10. UTILITY
// ---------------------------------------------------------------------------

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// 11. INIT
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  renderQuestion(0);
});
