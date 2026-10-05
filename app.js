(function () {
  'use strict';

  var QUIZ = window.QUIZ || []; // frågor och facit finns i quiz.js
  var STORE_KEY = 'mycel-quiz-v1';
  var MAX_AGE = 8 * 60 * 60 * 1000; // sparade svar glöms efter 8 timmar

  // Statistik via GoatCounter (gratis, utan cookies). Skapa ett konto på goatcounter.com och
  // skriv in din kod här, t.ex. 'mycel' för mycel.goatcounter.com. Tom kod = ingen räkning.
  var GOATCOUNTER = 'christiansandberg';
  var STATS_KEY = 'mycel-stats-v1';

  var ids = QUIZ.map(function (q) { return q.id; });
  var byId = {};
  QUIZ.forEach(function (q) { byId[q.id] = q; });

  // choices: vilket alternativ som är valt per uppgift. results: true/false efter kontroll.
  // stage: var man är efter "Alla rätt" ('' = korten visas, 'form' = e-post, 'feedback', 'done')
  // entered: true om man skickade in sin e-postadress till utlottningen
  var state = { choices: {}, results: {}, busy: false, stage: '', entered: false, sending: false };

  // Utlottning och feedback (config.js). Utan adress till brevlådan visas varken utlottning eller feedback.
  var PRIZE = window.PRIZE || {};
  var prizeOn = !!PRIZE.endpoint;
  var FB = prizeOn && PRIZE.feedback && PRIZE.feedback.enabled ? PRIZE.feedback : null;
  var INTRO = window.INTRO || null;
  var INTRO_KEY = 'mycel-intro-v1';
  var openId = null;
  var closing = false;
  var lastFocus = null;
  var tiles = {};

  function $(id) { return document.getElementById(id); }
  var grid = $('grid'), hint = $('hint'), verdict = $('verdict'), dock = $('dock'), check = $('check');
  var resetBtn = $('reset'), picker = $('picker'), optionsEl = $('options');
  var emailInput = $('email'), consentBox = $('consent'), sendBtn = $('send'), formError = $('formError');

  /* ---------- Hjälpfunktioner för alternativtext ("FÖR ATT *VÄRD*") ---------- */
  function parts(text) { return text.split('*'); }
  function keyWords(text) {
    return parts(text).filter(function (s, i) { return i % 2 === 1 && s; }).join(' ');
  }
  function tileWord(text) { return keyWords(text) || text; }
  function symbolUrl(q) { return 'assets/img/symbols/' + q.symbol + '.png'; }

  /* ---------- Spara så att svaren finns kvar om sidan laddas om ---------- */
  function save() {
    // E-postadressen sparas aldrig på telefonen – bara hur långt man har kommit
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        t: Date.now(), c: state.choices, r: state.results, s: state.stage, e: state.entered
      }));
    } catch (e) {}
  }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!d || Date.now() - d.t > MAX_AGE) return;
      QUIZ.forEach(function (q) {
        var c = d.c && d.c[q.id];
        if (typeof c === 'number' && q.options[c] !== undefined) {
          state.choices[q.id] = c;
          // Rättningen räknas om, så ett ändrat facit i quiz.js slår igenom direkt
          if (d.r && typeof d.r[q.id] === 'boolean') state.results[q.id] = c === q.answer;
        }
      });
      if (d.s === 'form' || d.s === 'feedback' || d.s === 'done') state.stage = d.s;
      else if (d.s === 'sent') { state.stage = 'done'; state.entered = true; }  // äldre sparat läge
      else if (d.s === 'skipped') state.stage = 'done';                         // äldre sparat läge
      if (d.e) state.entered = true;
    } catch (e) {}
  }
  function clearSaved() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} }

  /* ---------- Statistik: varje webbläsare räknas högst en gång per händelse ---------- */
  // 'svarat' = valt ett svar på minst en fråga, 'klarat' = alla rätt
  function track(event) {
    if (!GOATCOUNTER) return;
    var done = {};
    try { done = JSON.parse(localStorage.getItem(STATS_KEY) || '{}') || {}; } catch (e) {}
    if (done[event]) return;
    done[event] = 1;
    try { localStorage.setItem(STATS_KEY, JSON.stringify(done)); } catch (e) {}
    new Image().src = 'https://' + GOATCOUNTER + '.goatcounter.com/count?e=true&p=' +
      encodeURIComponent('quiz-' + event) + '&t=' + encodeURIComponent('Quiz ' + event) +
      '&rnd=' + Math.random().toString(36).slice(2);
  }

  /* ---------- Bygg rutorna ---------- */
  QUIZ.forEach(function (q, i) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'tile';
    el.style.setProperty('--i', i);

    var img = document.createElement('img');
    img.className = 'sym';
    img.alt = '';
    img.src = symbolUrl(q);

    var word = document.createElement('span');
    word.className = 'word display';

    var badge = document.createElement('span');
    badge.className = 'badge';
    badge.innerHTML =
      '<svg class="i-ok" aria-hidden="true"><use href="#i-ok"/></svg>' +
      '<svg class="i-bad" aria-hidden="true"><use href="#i-bad"/></svg>';

    el.appendChild(img);
    el.appendChild(word);
    el.appendChild(badge);
    el.addEventListener('click', function () {
      if (state.results[q.id] === true) return; // rätt svar är låsta
      openPicker(q.id);
    });
    grid.appendChild(el);
    tiles[q.id] = { el: el, word: word };
  });

  /* ---------- Rita om allt utifrån state ---------- */
  function render() {
    var chosen = 0, correct = 0, checked = true;
    ids.forEach(function (id) {
      if (state.choices[id] !== undefined) chosen++;
      if (state.results[id] === true) correct++;
      if (typeof state.results[id] !== 'boolean') checked = false;
    });
    var allChosen = chosen === ids.length;
    var allOk = checked && correct === ids.length;

    QUIZ.forEach(function (q) {
      var t = tiles[q.id], c = state.choices[q.id], r = state.results[q.id];
      var w = c === undefined ? '' : tileWord(q.options[c]);
      t.word.textContent = '';
      if (w) {
        var ink = document.createElement('span');
        ink.className = 'ink';
        ink.textContent = w;
        t.word.appendChild(ink);
      }
      t.word.classList.toggle('long', w.length > 8);
      t.el.classList.toggle('is-filled', c !== undefined);
      t.el.classList.toggle('is-ok', r === true);
      t.el.classList.toggle('is-bad', r === false);
      t.el.setAttribute('aria-label',
        q.title + '. ' + (w ? 'Valt ord: ' + w : 'Inget ord valt') +
        (r === true ? '. Rätt.' : r === false ? '. Fel.' : ''));
    });
    grid.classList.toggle('complete', allOk);

    // Rad under rubriken: tips, status eller resultat
    verdict.hidden = !checked;
    hint.hidden = checked;
    if (checked) {
      verdict.classList.toggle('ok', allOk);
      $('verdictTitle').textContent = allOk ? 'Alla rätt!' : correct + ' av ' + ids.length + ' rätt';
      $('verdictSub').textContent = allOk ? 'Bra jobbat!' : 'Titta noga och byt de markerade.';
      $('verdictSign').hidden = !allOk;
    } else {
      hint.textContent = allChosen ? 'Alla ord valda' : 'Tryck på en symbol';
    }

    dock.classList.toggle('show', allChosen && !checked);
    check.disabled = state.busy;
    check.textContent = state.busy ? '…' : 'Kontrollera';

    // Utlottning: efter några sekunder byts korten mot formuläret, och sedan mot ett tack
    var stage = prizeOn && allOk ? state.stage : '';
    var inForm = stage === 'form', inFb = stage === 'feedback', inEnd = stage === 'done';
    var away = inForm || inFb || inEnd;
    grid.hidden = away;
    if (!away) grid.classList.remove('leaving');
    $('prize').hidden = !inForm;
    $('feedback').hidden = !inFb;
    $('thanks').hidden = !inEnd;
    if (inEnd) $('thanksText').textContent = state.entered ? PRIZE.thanks : PRIZE.thanksNoEntry;
    resetBtn.hidden = !allOk || (prizeOn && !inEnd);
    if (prizeOn && allOk && !state.stage) {
      if (!prizeTimer && !prizeFading) prizeTimer = setTimeout(showForm, (PRIZE.delaySeconds || 5) * 1000);
    } else if (prizeTimer) {
      clearTimeout(prizeTimer);
      prizeTimer = null;
    }
  }

  /* ---------- Välj ord ---------- */
  function openPicker(id) {
    var q = byId[id];
    openId = id;
    closing = false;
    lastFocus = document.activeElement;

    $('pSym').src = symbolUrl(q);
    $('pTitle').textContent = q.title;
    $('pQuestion').textContent = q.question;

    optionsEl.textContent = '';
    q.options.forEach(function (text, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      var hasKey = !!keyWords(text);
      if (hasKey) b.classList.add('has-key');
      parts(text).forEach(function (s, i) {
        if (!s) return;
        var n = document.createElement(i % 2 ? 'b' : 'span');
        n.textContent = s;
        b.appendChild(n);
      });
      b.setAttribute('aria-pressed', state.choices[id] === idx ? 'true' : 'false');
      b.addEventListener('click', function () { choose(id, idx); });
      optionsEl.appendChild(b);
    });

    picker.hidden = false;
    void picker.offsetWidth; // gör att slide-in-animationen startar
    picker.classList.add('open');
    document.body.classList.add('locked');
    var first = optionsEl.firstChild;
    if (first && first.focus) first.focus({ preventScroll: true });
  }

  function closePicker() {
    if (openId === null || closing) return;
    closing = true;
    picker.classList.remove('open');
    document.body.classList.remove('locked');
    setTimeout(function () {
      picker.hidden = true;
      openId = null;
      closing = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 300);
  }

  function choose(id, idx) {
    if (closing) return;
    state.choices[id] = idx;
    track('svarat');
    delete state.results[id]; // ändrat svar måste kontrolleras igen
    state.stage = '';
    save();
    Array.prototype.forEach.call(optionsEl.children, function (b, i) {
      b.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
    });
    render();
    var el = tiles[id].el;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    setTimeout(closePicker, 320);
  }

  /* ---------- Kontrollera ---------- */
  function checkAnswers() {
    if (state.busy) return;
    state.busy = true;
    render();
    // Kort paus så att knappen hinner visa att något händer
    setTimeout(function () {
      var r = {};
      QUIZ.forEach(function (q) { r[q.id] = state.choices[q.id] === q.answer; });
      state.results = r;
      state.busy = false;
      if (ids.every(function (id) { return r[id]; })) track('klarat');
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  }

  /* ---------- Utlottning: e-postadress skickas till brevlådan (Apps Script -> kalkylblad) ---------- */
  var prizeTimer = null, prizeFading = false;

  // Samma regler som i brevlådan: något@domän.xx, inga mellanslag, och inget som kan tolkas som formel
  function emailOk(v) {
    return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && !/^[=+\-@]/.test(v);
  }
  function setError(msg) { formError.textContent = msg || ''; formError.hidden = !msg; }
  function updateSend() {
    sendBtn.disabled = state.sending || !(consentBox.checked && emailOk(emailInput.value.trim()));
    sendBtn.textContent = state.sending ? 'Skickar…' : 'Skicka';
  }
  function resetForm() {
    emailInput.value = '';
    $('website').value = '';
    consentBox.checked = false;
    state.sending = false;
    setError('');
    updateSend();
  }

  function showForm() {
    prizeTimer = null;
    prizeFading = true;
    grid.classList.add('leaving'); // korten tonas ut, sedan tar formuläret över
    setTimeout(function () {
      prizeFading = false;
      if (state.stage) return; // något annat har hunnit hända under tiden
      state.stage = 'form';
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      $('prizeTitle').focus({ preventScroll: true });
    }, 380);
  }

  // Går vidare i flödet: e-post -> feedback (om den är på) -> tack
  function go(stage) {
    state.stage = stage;
    save();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var target = stage === 'feedback' ? $('fbTitle') : $('thanksText');
    if (target) target.focus({ preventScroll: true });
  }
  function afterEmail(entered) {
    state.entered = entered;
    resetForm();
    go(FB ? 'feedback' : 'done');
  }

  function sendEntry() {
    if (state.sending) return;
    var email = emailInput.value.trim();
    if (!consentBox.checked || !emailOk(email)) { updateSend(); return; }
    state.sending = true;
    setError('');
    updateSend();

    var ctrl = window.AbortController ? new AbortController() : null;
    var timeout = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    function failed() {
      state.sending = false;
      updateSend();
      setError('Något gick fel. Kontrollera nätet och försök igen.');
    }

    fetch(PRIZE.endpoint, {
      method: 'POST',
      // text/plain gör att webbläsaren skickar direkt utan förfrågan i förväg (Apps Script klarar inte den)
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email: email, consent: true, consentText: PRIZE.consent, website: $('website').value }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (res) {
        if (!res || res.ok !== true) throw new Error('server');
        track('epost');
        afterEmail(true);
      })
      .catch(failed)
      .then(function () { clearTimeout(timeout); });
  }

  /* ---------- Feedback: ett tryck på ett ansikte + frivillig kommentar ---------- */
  var fbRating = 0, fbSending = false;
  var faceBtns = Array.prototype.slice.call(document.querySelectorAll('.face'));

  function setFbError(msg) { $('fbError').textContent = msg || ''; $('fbError').hidden = !msg; }
  function updateFb() {
    if (!FB) return;
    $('fbSend').disabled = fbSending || !fbRating;
    $('fbSend').textContent = fbSending ? 'Skickar…' : FB.send;
  }
  function resetFeedback() {
    fbRating = 0;
    fbSending = false;
    $('fbText').value = '';
    faceBtns.forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
    setFbError('');
    updateFb();
  }
  function sendFeedback() {
    if (fbSending || !fbRating) return;
    fbSending = true;
    setFbError('');
    updateFb();

    var ctrl = window.AbortController ? new AbortController() : null;
    var timeout = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    function failed() {
      fbSending = false;
      updateFb();
      setFbError('Något gick fel. Försök igen, eller hoppa över.');
    }

    fetch(PRIZE.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'feedback', rating: fbRating, comment: $('fbText').value.trim() }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (res) {
        if (!res || res.ok !== true) throw new Error('server');
        track('feedback');
        resetFeedback();
        go('done');
      })
      .catch(failed)
      .then(function () { clearTimeout(timeout); });
  }

  /* ---------- Introduktion: kort förklaring när man öppnar sidan ---------- */
  var introEl = $('intro');
  var introOpen = false;
  function introSeen() {
    try { var t = +localStorage.getItem(INTRO_KEY); return !!t && Date.now() - t < MAX_AGE; } catch (e) { return false; }
  }
  function openIntro() {
    if (!INTRO || introOpen) return;
    introOpen = true;
    lastFocus = document.activeElement;
    introEl.hidden = false;
    void introEl.offsetWidth; // gör att inglidningen startar
    introEl.classList.add('open');
    document.body.classList.add('locked');
    $('introGo').focus({ preventScroll: true });
  }
  function closeIntro() {
    if (!introOpen) return;
    introOpen = false;
    try { localStorage.setItem(INTRO_KEY, String(Date.now())); } catch (e) {}
    introEl.classList.remove('open');
    document.body.classList.remove('locked');
    setTimeout(function () {
      introEl.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 280);
  }

  /* ---------- Börja om (två tryck så det inte sker av misstag) ---------- */
  var armed = false, armTimer = null;
  function disarm() { armed = false; resetBtn.textContent = 'Börja om'; }
  resetBtn.addEventListener('click', function () {
    if (!armed) {
      armed = true;
      resetBtn.textContent = 'Tryck igen för att börja om';
      armTimer = setTimeout(disarm, 5000);
      return;
    }
    clearTimeout(armTimer);
    disarm();
    state.choices = {};
    state.results = {};
    state.stage = '';
    state.entered = false;
    clearSaved();
    resetForm();
    resetFeedback();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Händelser ---------- */
  check.addEventListener('click', checkAnswers);
  $('close').addEventListener('click', closePicker);
  picker.addEventListener('click', function (e) { if (e.target === picker) closePicker(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePicker(); closeIntro(); }
  });

  $('prizeForm').addEventListener('submit', function (e) { e.preventDefault(); sendEntry(); });
  $('prizeForm').addEventListener('input', updateSend);
  $('prizeForm').addEventListener('change', updateSend);
  emailInput.addEventListener('blur', function () {
    var v = emailInput.value.trim();
    if (v && !emailOk(v)) setError('Kontrollera e-postadressen.');
  });
  emailInput.addEventListener('input', function () {
    if (!formError.hidden && emailOk(emailInput.value.trim())) setError('');
  });
  $('skip').addEventListener('click', function () { afterEmail(false); });

  faceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbRating = +b.getAttribute('data-rating');
      faceBtns.forEach(function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      updateFb();
    });
  });
  $('fbSend').addEventListener('click', sendFeedback);
  $('fbSkip').addEventListener('click', function () { resetFeedback(); go('done'); });

  $('help').addEventListener('click', openIntro);
  $('introGo').addEventListener('click', closeIntro);
  introEl.addEventListener('click', function (e) { if (e.target === introEl) closeIntro(); });

  if (prizeOn) {
    $('prizeTitle').textContent = PRIZE.title;
    $('prizeIntro').textContent = PRIZE.intro;
    $('consentText').textContent = PRIZE.consent;
    $('privacyNote').textContent = PRIZE.privacy;
    if (PRIZE.privacyUrl) {
      $('privacyMoreText').textContent = PRIZE.privacyMore;
      $('privacyLink').textContent = PRIZE.privacyLinkText;
      $('privacyLink').href = PRIZE.privacyUrl;
    } else {
      $('privacyMore').hidden = true;
    }
  }

  if (FB) {
    $('fbTitle').textContent = FB.title;
    $('fbTextLabel').textContent = FB.commentLabel;
    $('fbNote').textContent = FB.note;
    $('fbSkip').textContent = FB.skip;
    faceBtns.forEach(function (b, i) { b.querySelector('span').textContent = FB.faces[i] || ''; });
    updateFb();
  }

  if (INTRO) {
    $('introTitle').textContent = INTRO.title;
    $('introLead').textContent = INTRO.lead;
    $('introMore').textContent = INTRO.more;
    $('introGo').textContent = INTRO.button;
    INTRO.steps.forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      $('introSteps').appendChild(li);
    });
  } else {
    $('help').hidden = true;
  }

  load();
  render();

  // Visa introduktionen första gången – men inte för den som redan har börjat svara
  var hasProgress = Object.keys(state.choices).length > 0;
  if (INTRO && !hasProgress && !introSeen()) openIntro();
})();
