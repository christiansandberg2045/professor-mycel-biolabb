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
  // Äldre config med en enda text (utan språk) räknas som svenska
  if (INTRO && INTRO.title) INTRO = { sv: Object.assign({ label: 'Svenska' }, INTRO) };
  var INTRO_KEY = 'mycel-intro-v1';
  var LANG_KEY = 'mycel-lang-v1';
  var BASE_LANG = 'sv';     // originalspråket i quiz.js
  var appLang = BASE_LANG;  // språket besökaren har valt (styr hela appen)

  // Text på valt språk (config.js, window.TEXT). Saknas den används svenska.
  var TEXT = window.TEXT || {};
  function txt(key, vars) {
    var L = TEXT[appLang];
    var s = L && L[key] !== undefined ? L[key] : (TEXT[BASE_LANG] || {})[key];
    if (typeof s !== 'string') return s === undefined ? '' : s;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
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
  // Ordet som visas på rutan när man valt: på valt språk (översättningen), annars svenska
  function tileWord(q, idx) {
    var T = tr(q);
    var text = (T && T.options && T.options[idx]) || q.options[idx];
    return keyWords(text) || text.replace(/\*/g, '');
  }
  // Översättning av en uppgift till valt språk (null = svenska: då visas originaltexterna)
  function tr(q) { return appLang === BASE_LANG ? null : ((q.i18n && q.i18n[appLang]) || null); }
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
      var w = c === undefined ? '' : tileWord(q, c);
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
      var tq = tr(q);
      t.el.setAttribute('aria-label',
        (tq ? tq.title : q.title) + '. ' + (w ? txt('ariaChosen') + ': ' + w : txt('ariaNone')) +
        (r === true ? '. ' + txt('ariaRight') + '.' : r === false ? '. ' + txt('ariaWrong') + '.' : ''));
    });
    grid.classList.toggle('complete', allOk);

    // Rad under rubriken: tips, status eller resultat
    verdict.hidden = !checked;
    hint.hidden = checked;
    if (checked) {
      verdict.classList.toggle('ok', allOk);
      $('verdictTitle').textContent = allOk ? txt('allCorrect') : txt('someCorrect', { n: correct, total: ids.length });
      $('verdictSub').textContent = allOk ? txt('wellDone') : txt('tryAgain');
      $('verdictSign').hidden = !allOk;
    } else {
      hint.textContent = allChosen ? txt('hintAll') : txt('hintStart');
    }

    dock.classList.toggle('show', allChosen && !checked);
    check.disabled = state.busy;
    check.textContent = state.busy ? '…' : txt('check');

    // Utlottning: efter några sekunder byts korten mot formuläret, och sedan mot ett tack
    var stage = prizeOn && allOk ? state.stage : '';
    var inForm = stage === 'form', inFb = stage === 'feedback', inEnd = stage === 'done';
    var away = inForm || inFb || inEnd;
    grid.hidden = away;
    if (!away) grid.classList.remove('leaving');
    $('prize').hidden = !inForm;
    $('feedback').hidden = !inFb;
    $('thanks').hidden = !inEnd;
    if (inEnd) $('thanksText').textContent = state.entered ? txt('thanks') : txt('thanksNoEntry');
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

    var T = tr(q); // översättning till valt språk, eller null för svenska
    $('pSym').src = symbolUrl(q);

    // Rubrik: översättningen, med den svenska rubriken i parentes under
    var title = $('pTitle');
    title.textContent = '';
    title.classList.toggle('tr', !!T);
    if (T) {
      var main = document.createElement('span');
      main.className = 't-main';
      main.textContent = T.title;
      var sv = document.createElement('span');
      sv.className = 't-sv';
      sv.textContent = '(' + q.title + ')';
      title.appendChild(main);
      title.appendChild(sv);
    } else {
      title.textContent = q.title;
    }
    // Fråga: bara översättningen
    $('pQuestion').textContent = T ? T.question : q.question;

    // i-knappen (professorns anteckning översatt) finns bara när det finns en översättning
    var hasNote = !!(T && T.note && T.note.length);
    $('pInfo').hidden = !hasNote;
    if (hasNote) $('pInfo').setAttribute('aria-label', txt('infoLabel'));

    optionsEl.textContent = '';
    q.options.forEach(function (text, idx) {
      var translated = T && T.options && T.options[idx];
      var shown = translated || text;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      var hasKey = !!keyWords(shown);
      if (hasKey) b.classList.add('has-key');
      parts(shown).forEach(function (s, i) {
        if (!s) return;
        var n = document.createElement(i % 2 ? 'b' : 'span');
        n.textContent = s;
        b.appendChild(n);
      });
      // Det svenska ordet i parentes, så att man kan matcha det mot ordet under luckan
      if (translated) {
        var svWord = keyWords(text) || text;
        if (shown.replace(/\*/g, '').toUpperCase() !== svWord.toUpperCase()) {
          var s = document.createElement('span');
          s.className = 'sv';
          s.textContent = '(' + svWord + ')';
          b.appendChild(s);
        }
      }
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
    sendBtn.textContent = state.sending ? txt('sending') : txt('send');
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
      setError(txt('sendError'));
    }

    fetch(PRIZE.endpoint, {
      method: 'POST',
      // text/plain gör att webbläsaren skickar direkt utan förfrågan i förväg (Apps Script klarar inte den)
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email: email, consent: true, consentText: txt('consent'), website: $('website').value }),
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
    $('fbSend').textContent = fbSending ? txt('sending') : txt('send');
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
      setFbError(txt('fbError'));
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

  /* ---------- Introduktion: kort förklaring när man öppnar sidan (svenska, danska, norska) ---------- */
  var introEl = $('intro');
  var introOpen = false;

  // Språk: det man valt sist, annars telefonens språk (danska/norska), annars det första i config.js
  function pickLang() {
    var keys = Object.keys(INTRO);
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && INTRO[saved]) return saved;
    } catch (e) {}
    var nav = String((navigator.languages && navigator.languages[0]) || navigator.language || '')
      .toLowerCase().slice(0, 2);
    var byPhone = { sv: 'sv', da: 'da', nb: 'no', nn: 'no', no: 'no' }[nav];
    return byPhone && INTRO[byPhone] ? byPhone : keys[0];
  }

  function renderIntro(lang) {
    var t = INTRO[lang];
    if (!t) return;
    appLang = lang;
    $('introNote').lang = lang;
    $('introTitle').textContent = t.title;
    $('introLead').textContent = t.lead;
    $('introMore').textContent = t.more;
    $('introGo').textContent = t.button;
    Array.prototype.forEach.call($('langs').children, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    applyTexts();
  }

  // Byter alla fasta texter i sidan till valt språk (se data-t i index.html och window.TEXT)
  function applyTexts() {
    document.documentElement.lang = appLang;
    document.title = txt('pageTitle');
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) {
      el.textContent = txt(el.getAttribute('data-t'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-t-aria]'), function (el) {
      el.setAttribute('aria-label', txt(el.getAttribute('data-t-aria')));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-t-ph]'), function (el) {
      el.setAttribute('placeholder', txt(el.getAttribute('data-t-ph')));
    });
    // Långa namn (t.ex. "Mycelium's biolab") får lite mindre text så att de ryms på en rad
    document.querySelector('h1').classList.toggle('long', txt('name').length > 15);
    // Policyraden finns bara på svenska – på övriga språk visas bara länken till policyn
    $('privacyNote').hidden = !txt('privacy');
    // Länken till personuppgiftspolicyn
    if (PRIZE.privacyUrl) {
      $('privacyMoreText').textContent = txt('privacyMore');
      $('privacyLink').textContent = txt('privacyLink');
      $('privacyLink').href = PRIZE.privacyUrl;
      $('privacyMore').hidden = false;
    } else {
      $('privacyMore').hidden = true;
    }
    // Ansiktena i feedbacken
    var faces = txt('faces') || [];
    faceBtns.forEach(function (b, i) { b.querySelector('span').textContent = faces[i] || ''; });
    // Knappar vars text byts under tiden
    resetBtn.textContent = armed ? txt('resetConfirm') : txt('reset');
    updateSend();
    updateFb();
  }

  function buildLangButtons() {
    var keys = Object.keys(INTRO);
    if (keys.length < 2) { $('langs').hidden = true; return; }
    keys.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang';
      b.lang = k;
      b.setAttribute('data-lang', k);
      b.textContent = INTRO[k].label || k.toUpperCase();
      b.addEventListener('click', function () {
        try { localStorage.setItem(LANG_KEY, k); } catch (e) {}
        renderIntro(k);
        render(); // rutor, rad under rubriken och knappar byter språk
      });
      $('langs').appendChild(b);
    });
  }

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

  /* ---------- Professorns anteckning, översatt (i-knappen i en uppgift) ---------- */
  var noteEl = $('noteview');
  var noteOpen = false;
  var noteFocus = null;
  function openNote() {
    var q = byId[openId];
    var T = q && tr(q);
    if (!T || !T.note || noteOpen) return;
    noteOpen = true;
    noteFocus = document.activeElement;
    noteEl.lang = appLang;
    $('nvTitle').textContent = txt('noteTitle');
    var box = $('nvText');
    box.textContent = '';
    T.note.forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      box.appendChild(p);
    });
    $('nvClose').textContent = txt('noteClose') || 'OK';
    noteEl.hidden = false;
    void noteEl.offsetWidth; // gör att inglidningen startar
    noteEl.classList.add('open');
    $('nvClose').focus({ preventScroll: true });
  }
  function closeNote() {
    if (!noteOpen) return;
    noteOpen = false;
    noteEl.classList.remove('open');
    setTimeout(function () {
      noteEl.hidden = true;
      if (noteFocus && noteFocus.focus) noteFocus.focus({ preventScroll: true });
    }, 250);
  }

  /* ---------- Börja om (två tryck så det inte sker av misstag) ---------- */
  var armed = false, armTimer = null;
  function disarm() { armed = false; resetBtn.textContent = txt('reset'); }
  resetBtn.addEventListener('click', function () {
    if (!armed) {
      armed = true;
      resetBtn.textContent = txt('resetConfirm');
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
    if (e.key !== 'Escape') return;
    if (noteOpen) { closeNote(); return; }
    closePicker();
    closeIntro();
  });

  $('prizeForm').addEventListener('submit', function (e) { e.preventDefault(); sendEntry(); });
  $('prizeForm').addEventListener('input', updateSend);
  $('prizeForm').addEventListener('change', updateSend);
  emailInput.addEventListener('blur', function () {
    var v = emailInput.value.trim();
    if (v && !emailOk(v)) setError(txt('emailError'));
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

  $('pInfo').addEventListener('click', openNote);
  $('nvClose').addEventListener('click', closeNote);
  noteEl.addEventListener('click', function (e) { if (e.target === noteEl) closeNote(); });

  $('help').addEventListener('click', openIntro);
  $('introGo').addEventListener('click', closeIntro);
  introEl.addEventListener('click', function (e) { if (e.target === introEl) closeIntro(); });

  if (INTRO) {
    buildLangButtons();
    renderIntro(pickLang()); // väljer språk och sätter alla texter
  } else {
    $('help').hidden = true;
    applyTexts();
  }

  load();
  render();

  // Visa introduktionen första gången – men inte för den som redan har börjat svara
  var hasProgress = Object.keys(state.choices).length > 0;
  if (INTRO && !hasProgress && !introSeen()) openIntro();
})();
