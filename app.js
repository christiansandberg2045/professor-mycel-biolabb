(function () {
  'use strict';

  var QUIZ = window.QUIZ || []; // frågor och facit finns i quiz.js
  var STORE_KEY = 'mycel-quiz-v1';
  var MAX_AGE = 8 * 60 * 60 * 1000; // sparade svar glöms efter 8 timmar

  var ids = QUIZ.map(function (q) { return q.id; });
  var byId = {};
  QUIZ.forEach(function (q) { byId[q.id] = q; });

  // choices: vilket alternativ som är valt per uppgift. results: true/false efter kontroll.
  var state = { choices: {}, results: {}, busy: false };
  var openId = null;
  var closing = false;
  var lastFocus = null;
  var tiles = {};

  function $(id) { return document.getElementById(id); }
  var grid = $('grid'), hint = $('hint'), verdict = $('verdict'), dock = $('dock'), check = $('check');
  var resetBtn = $('reset'), picker = $('picker'), optionsEl = $('options');

  /* ---------- Hjälpfunktioner för alternativtext ("FÖR ATT *VÄRD*") ---------- */
  function parts(text) { return text.split('*'); }
  function keyWords(text) {
    return parts(text).filter(function (s, i) { return i % 2 === 1 && s; }).join(' ');
  }
  function tileWord(text) { return keyWords(text) || text; }
  function symbolUrl(q) { return 'assets/img/symbols/' + q.symbol + '.png'; }

  /* ---------- Spara så att svaren finns kvar om sidan laddas om ---------- */
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ t: Date.now(), c: state.choices, r: state.results })); } catch (e) {}
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
    } catch (e) {}
  }
  function clearSaved() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} }

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
    resetBtn.hidden = !allOk;
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
    delete state.results[id]; // ändrat svar måste kontrolleras igen
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
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
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
    clearSaved();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Händelser ---------- */
  check.addEventListener('click', checkAnswers);
  $('close').addEventListener('click', closePicker);
  picker.addEventListener('click', function (e) { if (e.target === picker) closePicker(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePicker(); });

  load();
  render();
})();
