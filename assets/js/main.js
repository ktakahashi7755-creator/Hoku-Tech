/* ─────────────────────────────────────────────
   Hoku Tech — main.js (Clean Build)
   iOS Safari 完全対応版
───────────────────────────────────────────── */

/* ── グローバルエラーハンドラ ── */

/* ── 安全なsetTimeoutラッパー ── */
function _safeTimeout(fn, delay) {
  return setTimeout(function() {
    try { fn(); }
    catch(e) {
      if (window.console) console.warn('[FCC timeout]', e && (e.message || String(e)));
    }
  }, delay || 0);
}
function _safeMO(callback) {
  return new MutationObserver(function(muts, obs) {
    try { callback(muts, obs); }
    catch(e) {
      if (window.console) console.warn('[FCC MO]', e && (e.message || String(e)));
    }
  });
}

(function() {
  'use strict';
  // iOS Safari file:// で "Script error." を詳細化
  window.addEventListener('error', function(e) {
    try {
      var msg = (e && e.message) || 'Script error';
      var file = (e && e.filename) || 'inline';
      var line = (e && e.lineno) || 0;
      // エラーを記録（本番では無効化可能）
      if (window.console && console.warn) {
        console.warn('[FCC] Error:', msg, '@', file, ':', line);
      }
    } catch(ex) {}
    return false;
  });
  window.addEventListener('unhandledrejection', function(e) {
    try {
      if (window.console && console.warn) console.warn('[FCC] Promise rejection:', e && e.reason);
    } catch(ex) {}
  });
})();

/* ── iOS 互換ユーティリティ関数 ── */
function _safeCall(fn, fallback) {
  try { return fn(); } catch(e) { return fallback; }
}
function _unique(arr) {
  var seen = {}, result = [];
  (arr || []).forEach(function(v) {
    var k = String(v);
    if (!seen[k]) { seen[k] = 1; result.push(v); }
  });
  return result;
}
var _storage = {
  get: function(k, def) {
    try {
      var v = localStorage.getItem(k);
      return (v !== null && v !== undefined) ? JSON.parse(v) : def;
    } catch(e) { return def; }
  },
  set: function(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(e) { return false; }
  }
};

/* =========================================================
   Hoku Tech v2 — main.js
   4層ナビゲーション: Phase → Chapter → Lesson → Detail
   ========================================================= */

/* ── グローバルユーティリティ（全IIFE共有） ── */
function _esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function _qs(sel, root) { return (root || document).querySelector(sel); }
function _qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
(function () {
  'use strict';
  /* Suppress "Script error." in iOS Quick Look / file:// sandbox */
  try { window.addEventListener('error', function(e){ e.preventDefault(); return true; }); } catch(_){}
  try { window.addEventListener('unhandledrejection', function(e){ e.preventDefault(); }); } catch(_){}

  
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  
  const PHASES   = Array.isArray(window.PHASES)   ? window.PHASES   : [];
  const CHAPTERS = window.CHAPTERS  || {};
  const GLOSSARY = Array.isArray(window.GLOSSARY)  ? window.GLOSSARY  : [];
  const ERRORS   = Array.isArray(window.COMMON_ERRORS) ? window.COMMON_ERRORS : [];

  // Merge all lesson detail objects (全Phase)
  const LESSONS = Object.assign(
    {},
    window.LESSON_P00 || {},
    window.LESSON_P01 || {},
    window.LESSON_P02 || {},
    window.LESSON_P03 || {},
    window.LESSON_P04 || {},
    window.LESSON_P05 || {},
    window.LESSON_P06 || {},
    window.LESSON_P07 || {},
    window.LESSON_P08 || {},
    window.LESSON_P09 || {},
    window.LESSON_P10 || {},
    window.LESSON_P11 || {},
    window.LESSON_P12 || {}
  );

  
  const LS = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch(e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
  };

  const Progress = {
    donePhases:  () => LS.get('fcc:v2:donePhases', []),
    doneLessons: () => LS.get('fcc:v2:doneLessons', []),
    togglePhase:  n => { const a = Progress.donePhases(); const i = a.indexOf(n); i >= 0 ? a.splice(i,1) : a.push(n); LS.set('fcc:v2:donePhases', a); return a; },
    toggleLesson: id => { const a = Progress.doneLessons(); const i = a.indexOf(id); i >= 0 ? a.splice(i,1) : a.push(id); LS.set('fcc:v2:doneLessons', a); return a; },
    checklistGet: k => LS.get('fcc:v2:cl:' + k, false),
    checklistSet: (k, v) => LS.set('fcc:v2:cl:' + k, v),
  };

  
  let currentView = 'home';
  let currentPhaseId   = null;
  let currentChapterId = null;
  let currentLessonId  = null;

  
  function nav(view, opts = {}) {
    currentView = view;
    $$('.app-section').forEach(s => s.classList.remove('active'));
    const sec = $('#sec-' + view);
    if (sec) sec.classList.add('active');

    // Sidebar highlight
    $$('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === view);
    });

    updateBreadcrumb();
    updateProgress();

    if (!opts.noScroll) {
      window.scrollTo(0, 0);
    }

    // Hash for back/forward
    const hash = [view, opts.phaseId, opts.chapterId, opts.lessonId].filter(Boolean).join(':');
    try { history.replaceState(null, '', '#' + hash); } catch(_){}

    // Close mobile sidebar
    ($('#sidebar')) && $('#sidebar').classList.remove('open');
    ($('.backdrop')) && $('.backdrop').classList.remove('show');
  }

  
  function updateBreadcrumb() {
    const bc = $('#breadcrumb');
    if (!bc) return;
    const parts = [];

    const label = {
      home: 'ホーム', phases: 'Phase 一覧', lessons: 'レッスン',
      assignments: '課題提出', skillchecks: 'スキルチェック', hoku: 'Hoku活用', 'p12-apps': '卒業制作テーマ',
      'ai-rules': 'AI活用', 'claude-code': 'Claude Code',
      portfolio: 'ポートフォリオ', instructor: '講師向け',
      templates: 'テンプレート', business: '法人・SES',
      pricing: '価格プラン', glossary: '用語集', 'error-list': 'エラー集'
    };

    parts.push(`<span class="bc-link" data-view="home">ホーム</span>`);

    if (['phase-detail','chapter-detail','lesson-detail'].includes(currentView)) {
      parts.push(`<span class="bc-link" data-view="phases">Phase 一覧</span>`);
    }
    if (['chapter-detail','lesson-detail'].includes(currentView) && currentPhaseId) {
      const p = PHASES.find(x => x.id === currentPhaseId);
      if (p) parts.push(`<span class="bc-link" data-view="phase-detail" data-phase="${_esc(p.id)}">Phase ${p.num}: ${_esc(p.title)}</span>`);
    }
    if (currentView === 'lesson-detail' && currentChapterId) {
      const ch = CHAPTERS[currentChapterId];
      if (ch) parts.push(`<span class="bc-link" data-view="chapter-detail" data-chapter="${_esc(ch.id)}">Chapter ${_esc(ch.num)}</span>`);
    }
    if (label[currentView] && !['phase-detail','chapter-detail','lesson-detail'].includes(currentView)) {
      parts.push(`<span class="bc-current">${label[currentView]}</span>`);
    }

    bc.innerHTML = parts.join('<span class="bc-sep">›</span>');

    $$('.bc-link', bc).forEach(link => {
      link.addEventListener('click', () => {
        const v = link.dataset.view;
        if (v === 'phase-detail' && link.dataset.phase) showPhaseDetail(link.dataset.phase);
        else if (v === 'chapter-detail' && link.dataset.chapter) showChapterDetail(link.dataset.chapter);
        else nav(v);
      });
    });
  }

  
  function updateProgress() {
    const done = Progress.donePhases();
    const pct = Math.round(done.length / Math.max(PHASES.length, 1) * 100);
    const fill = $('#progress-fill');
    const pill = $('#progress-pill');
    const num  = $('#progress-num');
    if (fill) fill.style.width = pct + '%';
    if (pill) pill.textContent = pct + '%';
    if (num)  num.textContent  = done.length + ' / ' + PHASES.length;
  }

  
  function renderHome() {
    updateProgress();
  }

  
  let phaseSearch = '', phaseCategory = 'all';

  function renderPhaseList() {
    const grid = $('#phase-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const done = Progress.donePhases();
    const q = phaseSearch.toLowerCase();

    PHASES.forEach(p => {
      const hay = (p.title + p.category + (p.chapters ? '' : '') + p.goalItems.join(' ')).toLowerCase();
      if (q && !hay.includes(q)) return;
      if (phaseCategory !== 'all' && p.category !== phaseCategory) return;

      const isDone = done.includes(p.num);
      const doneL  = Progress.doneLessons();
      const totalLessons = (p.chapters || []).reduce((s, cid) => {
        const ch = CHAPTERS[cid];
        return s + (ch ? (ch.lessons || []).length : 0);
      }, 0);
      const doneLessonsCount = (p.chapters || []).reduce((s, cid) => {
        const ch = CHAPTERS[cid];
        return s + (ch ? (ch.lessons || []).filter(lid => doneL.includes(lid)).length : 0);
      }, 0);

      const card = el('div', 'phase-card' + (isDone ? ' done' : ''));
      card.innerHTML = `
        <div class="pc-check">${isDone ? '✓' : ''}</div>
        <div class="pc-header">
          <div class="pc-num">${String(p.num).padStart(2,'0')}</div>
          <div class="pc-meta">
            <h3>${_esc(p.title)}</h3>
            <div class="pc-sub">
              <span class="chip chip-${p.category.toLowerCase()}">${_esc(p.category)}</span>
              <span class="chip">${_esc(p.duration)}</span>
              ${(p.chapters||[]).length}Chapter
            </div>
          </div>
        </div>
        <p class="pc-goal">${_esc(p.goal)}</p>
        <div class="pc-progress">
          <div class="pc-prog-bar"><div style="width:${totalLessons ? Math.round(doneLessonsCount/totalLessons*100) : 0}%"></div></div>
          <span class="pc-prog-text">${doneLessonsCount}/${totalLessons} Lesson</span>
        </div>`;
      card.addEventListener('click', () => showPhaseDetail(p.id));
      grid.appendChild(card);
    });

    if (!grid.children.length) {
      grid.innerHTML = '<p class="empty-msg">該当するPhaseがありません。</p>';
    }
  }

  
  function showPhaseDetail(phaseId) {
    currentPhaseId = phaseId;
    currentChapterId = null;
    currentLessonId = null;
    const p = PHASES.find(x => x.id === phaseId);
    if (!p) { nav('phases'); return; }
    const px = (window.PHASES_EXTRA || {})[phaseId] || {};

    const root = $('#phase-detail-root');
    if (!root) return;
    root.innerHTML = '';

    const done = Progress.donePhases();
    const isDone = done.includes(p.num);

    // ── ヒーロー ──
    let html = `
      <div class="detail-hero phase-hero">
        <div class="dh-num">${String(p.num).padStart(2,'0')}</div>
        <div class="dh-body">
          <div class="dh-chips">
            <span class="chip chip-${_esc(p.category.toLowerCase())}">${_esc(p.category)}</span>
            <span class="chip">${_esc(p.duration)}</span>
          </div>
          <h1>${_esc(p.title)}</h1>
          <p class="dh-goal">${_esc(p.goal)}</p>
        </div>
      </div>`;

    // ── ゴール一覧 ──
    html += `<div class="goal-box"><h3>このPhaseで達成すること</h3><ul class="goal-list">
      ${(p.goalItems||[]).map(g=>`<li>${_esc(g)}</li>`).join('')}</ul></div>`;

    // ── 前提知識・身につくスキル ──
    if (px.prerequisites || px.skills) {
      html += '<div class="phase-meta-grid">';
      if (px.prerequisites && px.prerequisites.length) {
        html += `<div class="phase-meta-card pm-prereq"><h4>前提知識</h4><ul>${px.prerequisites.map(i=>`<li>${_esc(i)}</li>`).join('')}</ul></div>`;
      }
      if (px.skills && px.skills.length) {
        html += `<div class="phase-meta-card pm-skills"><h4>身につくスキル</h4><ul>${px.skills.map(i=>`<li>${_esc(i)}</li>`).join('')}</ul></div>`;
      }
      html += '</div>';
    }

    // ── 現場での利用シーン ──
    if (px.realWorldUse) {
      html += `<div class="callout callout-field"><div><strong>現場での利用シーン</strong><p>${_esc(px.realWorldUse)}</p></div></div>`;
    }

    // ── 重要用語 ──
    if (px.keywords && px.keywords.length) {
      html += `<details class="phase-accordion"><summary>重要キーワード（${px.keywords.length}語）</summary>
        <div class="acc-body kw-chips">${px.keywords.map(k=>`<span class="kw-chip">${_esc(k)}</span>`).join('')}</div></details>`;
    }

    // ── 学習ステップ ──
    if (px.learningSteps && px.learningSteps.length) {
      html += `<details class="phase-accordion" open><summary>学習ステップ（${px.learningSteps.length}ステップ）</summary>
        <div class="acc-body"><ol class="learning-steps">${px.learningSteps.map(s=>`<li>${_esc(s)}</li>`).join('')}</ol></div></details>`;
    }

    // ── ハンズオン演習 ──
    if (px.handsOn && px.handsOn.length) {
      html += `<details class="phase-accordion"><summary>ハンズオン演習（${px.handsOn.length}件）</summary><div class="acc-body">`;
      px.handsOn.forEach(h => {
        html += `<div class="handson-card"><h4>${_esc(h.title)}</h4><p>${_esc(h.desc)}</p></div>`;
      });
      html += '</div></details>';
    }

    // ── Chapters ──
    html += `<h2 class="section-h2">Chapters</h2>
      <div class="chapter-grid" id="chapter-grid-${phaseId}"></div>`;

    // ── Hoku 活用 ──
    if (px.hokuUseCases || px.hokuWarnings) {
      html += '<details class="phase-accordion hoku-accordion"><summary>Hoku AIメンター活用ポイント</summary><div class="acc-body hoku-body">';
      if (px.hokuUseCases && px.hokuUseCases.length) {
        html += '<div class="hoku-ok"><h4>Hokuに相談できること</h4><ul>';
        px.hokuUseCases.forEach(u => { html += `<li>${_esc(u)}</li>`; });
        html += '</ul></div>';
      }
      if (px.hokuWarnings && px.hokuWarnings.length) {
        html += '<div class="hoku-ng"><h4>自分で取り組むべきこと</h4><ul>';
        px.hokuWarnings.forEach(w => { html += `<li>${_esc(w)}</li>`; });
        html += '</ul></div>';
      }
      html += '</div></details>';
    }

    // ── エラー相談テンプレート ──
    if (px.errorConsultation) {
      const ec = px.errorConsultation;
      html += '<details class="phase-accordion"><summary><span class="acc-icon">🚨</span>エラー・問題が出たときの相談テンプレート</summary><div class="acc-body">';
      if (ec.template) {
        html += `<pre class="error-template">${_esc(ec.template)}</pre>`;
        html += `<button class="btn btn-sm copy-btn" data-copy-text="${_esc(ec.template).replace(/"/g,'&quot;')}">Copy</button>`;
      }
      if (ec.screenshotTips && ec.screenshotTips.length) {
        html += '<h5>スクリーンショットを送る時の注意</h5><ul>';
        ec.screenshotTips.forEach(t => { html += `<li>${_esc(t)}</li>`; });
        html += '</ul>';
      }
      html += '</div></details>';
    }

    // ── 面談想定質問 ──
    if (px.interviewQ && px.interviewQ.length) {
      html += '<details class="phase-accordion"><summary>面談想定質問</summary><div class="acc-body"><ul class="interview-q-list">';
      px.interviewQ.forEach(q => { html += `<li>${_esc(q)}</li>`; });
      html += '</ul><div class="callout callout-tip" style="margin-top:12px"><p>自分の言葉で答えられるまで練習してください。HokuまたはPhase 12スキルチェックで模擬練習できます。</p></div></div></details>';
    }

    // ── 合格基準・次のPhaseへの条件 ──
    if (px.passCriteria && px.passCriteria.length) {
      html += '<details class="phase-accordion"><summary>合格基準・次のPhaseへの条件</summary><div class="acc-body">';
      html += '<h4>合格基準</h4><ul class="pass-criteria">';
      px.passCriteria.forEach(c => { html += `<li><input type="checkbox" style="margin-right:6px">${_esc(c)}</li>`; });
      html += '</ul>';
      if (px.resubmit) html += `<div class="callout callout-warn"><span class="callout-icon">🔄</span><strong>再提出条件：</strong>${_esc(px.resubmit)}</div>`;
      if (px.nextPhaseCondition) html += `<div class="callout callout-next"><span class="callout-icon">➡️</span><strong>次のPhaseへ進む条件：</strong>${_esc(px.nextPhaseCondition)}</div>`;
      html += '</div></details>';
    }

    // ── Phase完了ボタン ──
    html += `<div class="phase-actions">
      <button class="btn btn-primary done-phase-btn" data-phase="${p.num}">
        ${isDone ? '✓ 完了済み（取り消し）' : 'このPhaseを完了にする'}
      </button>
      ${p.num < 12 ? `<button class="btn btn-ghost next-phase-btn" data-next="${p.num + 1}">次の Phase ${p.num + 1} へ →</button>` : ''}
    </div>`;

    root.innerHTML = html;

    // ── Chapter cards ──
    const cGrid = root.querySelector('#chapter-grid-' + phaseId);
    (p.chapters || []).forEach((cid, i) => {
      const ch = CHAPTERS[cid];
      if (!ch) return;
      const doneL = Progress.doneLessons();
      const doneCnt = (ch.lessons||[]).filter(lid => doneL.includes(lid)).length;
      const total = (ch.lessons||[]).length;
      const card = el('div', 'chapter-card');
      card.innerHTML = `
        <div class="ch-num">Ch ${_esc(ch.num)}</div>
        <h3>${_esc(ch.title)}</h3>
        <p>${_esc(ch.desc)}</p>
        <div class="ch-footer">
          <span>${total}レッスン</span>
          <span class="${doneCnt===total&&total>0?'done-badge':''}">${doneCnt}/${total} 完了</span>
        </div>`;
      card.addEventListener('click', () => showChapterDetail(cid));
      cGrid.appendChild(card);
    });

    // ── Event bindings ──
    var _doneBtnEl = root.querySelector('.done-phase-btn'); if(_doneBtnEl) _doneBtnEl.addEventListener('click', function() {
      Progress.togglePhase(p.num);
      showPhaseDetail(phaseId);
      renderPhaseList();
      updateProgress();
    });
    var _nextBtnEl = root.querySelector('.next-phase-btn'); if(_nextBtnEl) _nextBtnEl.addEventListener('click', function() {
      const nextNum = parseInt(this.dataset.next);
      const nextPhase = PHASES.find(x => x.num === nextNum);
      if (nextPhase) showPhaseDetail(nextPhase.id);
    });

    // copy buttons
    Array.from(root.querySelectorAll('.copy-btn[data-copy-text]')).forEach(btn => {
      btn.addEventListener('click', function() {
        safeCopy(this.dataset.copyText);
        this.textContent = '✓ コピーしました';
        setTimeout(() => { this.textContent = 'Copy'; }, 2000);
      });
    });

    nav('phase-detail', { phaseId });
  }


  
  function showChapterDetail(chapterId) {
    currentChapterId = chapterId;
    currentLessonId = null;
    const ch = CHAPTERS[chapterId];
    if (!ch) { if (currentPhaseId) showPhaseDetail(currentPhaseId); else nav('phases'); return; }
    currentPhaseId = currentPhaseId || ch.phase;

    const root = $('#chapter-detail-root');
    if (!root) return;
    root.innerHTML = '';

    const doneL = Progress.doneLessons();

    root.innerHTML = `
      <div class="detail-hero">
        <div class="dh-num">Ch ${_esc(ch.num)}</div>
        <div class="dh-body">
          <h1>${_esc(ch.title)}</h1>
          <p>${_esc(ch.desc)}</p>
        </div>
      </div>
      <div class="lesson-list" id="lesson-list-${chapterId}"></div>`;

    const lList = root.querySelector('#lesson-list-' + chapterId);
    (ch.lessons || []).forEach((lid, idx) => {
      const lesson = LESSONS[lid];
      const isDoneL = doneL.includes(lid);

      const row = el('div', 'lesson-row' + (isDoneL ? ' done' : ''));
      if (lesson) {
        row.innerHTML = `
          <div class="lr-check">${isDoneL ? '✓' : String(idx + 1).padStart(2,'0')}</div>
          <div class="lr-body">
            <div class="lr-title">${_esc(lesson.num)} ${_esc(lesson.title)}</div>
            <div class="lr-meta">${_esc(lesson.duration || '')} ／ ${_esc(lesson.goal || '').substring(0, 60)}…</div>
          </div>
          <div class="lr-arrow">›</div>`;
        row.addEventListener('click', () => showLessonDetail(lid));
      } else {
        row.innerHTML = `
          <div class="lr-check">${String(idx + 1).padStart(2,'0')}</div>
          <div class="lr-body">
            <div class="lr-title">${_esc(lid)}</div>
            <div class="lr-meta lr-coming">—</div>
          </div>`;
        row.style.opacity = '0.5';
        row.style.cursor  = 'default';
      }
      lList.appendChild(row);
    });

    nav('chapter-detail', { phaseId: currentPhaseId, chapterId });
  }

  
  function showLessonDetail(lessonId) {
    currentLessonId = lessonId;
    const l = LESSONS[lessonId];
    if (!l) {
      if (currentChapterId) showChapterDetail(currentChapterId);
      else nav('phases');
      return;
    }

    const ch = CHAPTERS[l.chapter];
    if (ch) currentChapterId = l.chapter;
    const p = ch ? PHASES.find(x => x.id === ch.phase) : null;
    if (p) currentPhaseId = p.id;

    const root = $('#lesson-detail-root');
    if (!root) return;
    root.innerHTML = '';

    const isDone = Progress.doneLessons().includes(lessonId);

    // Build each section
    const sections = [];

    // 1. Hero
    sections.push(`
      <div class="lesson-hero">
        <div class="lh-meta">
          ${ch ? `<span class="chip">Ch ${_esc(ch.num)}</span>` : ''}
          <span class="chip chip-dur">⏱ ${_esc(l.duration || '30分')}</span>
        </div>
        <h1>${_esc(l.num)} ${_esc(l.title)}</h1>
        <div class="lesson-goal-banner">
          
          <span>${_esc(l.goal || '')}</span>
        </div>
      </div>`);

    // 2. なぜ学ぶか
    if (l.why) sections.push(lessonSection('なぜこれを学ぶのか', `<p>${_esc(l.why)}</p>`, 'why-section'));

    // 3. 現場での使われ方
    if (l.fieldUse) sections.push(lessonSection('現場での使われ方', `<p>${_esc(l.fieldUse)}</p>`, 'field-section'));

    // 4. たとえ話
    if (l.analogy) sections.push(lessonSection('たとえ話でイメージをつかむ', `
      <div class="analogy-box"><p>${_esc(l.analogy)}</p></div>`, 'analogy-section'));

    // 5. 用語
    if (l.terms && l.terms.length) {
      const termHTML = l.terms.map(t => `
        <div class="term-card">
          <dt>${_esc(t.term)}</dt>
          <dd>${_esc(t.meaning)}</dd>
        </div>`).join('');
      sections.push(lessonSection('📖 重要用語', `<div class="terms-grid">${termHTML}</div>`, 'terms-section'));
    }

    // 6. Steps
    if (l.steps && l.steps.length) {
      const stepsHTML = l.steps.map(s => `
        <div class="step-card">
          <div class="step-num">STEP ${s.num}</div>
          <div class="step-body">
            <h4>${_esc(s.title)}</h4>
            ${s.description ? `<p>${_esc(s.description)}</p>` : ''}
            ${(s.windows || s.mac) ? `
            <div class="os-tabs">
              <button class="os-tab active" data-os="windows">🪟 Windows</button>
              <button class="os-tab" data-os="mac">🍎 Mac</button>
            </div>
            ${s.windows ? `<div class="os-content os-windows"><pre class="step-code">${_esc(s.windows)}</pre></div>` : ''}
            ${s.mac     ? `<div class="os-content os-mac" style="display:none"><pre class="step-code">${_esc(s.mac)}</pre></div>` : ''}
            ` : ''}
          </div>
        </div>`).join('');
      sections.push(lessonSection('操作手順（Step by Step）', `<div class="steps-wrap">${stepsHTML}</div>`, 'steps-section'));
    }

    // 7. Code
    if (l.code) {
      sections.push(lessonSection('💻 コード', `
        <div class="code-block-wrap">
          <div class="code-block-header"><span>コード</span><button class="copy-btn" data-code="${_esc(l.code)}">Copy</button></div>
          <pre class="code-block">${_esc(l.code)}</pre>
        </div>
        ${l.codeExplanation ? `
          <h4 class="code-explain-title">コードの意味を1行ずつ確認</h4>
          <div class="code-explanations">
            ${(l.codeExplanation || []).map(e => `
              <div class="code-ex-row">
                <code class="code-ex-code">${_esc(e.line)}</code>
                <span class="code-ex-meaning">${_esc(e.meaning)}</span>
              </div>`).join('')}
          </div>` : ''}`, 'code-section'));
    }

    if (l.code2) {
      sections.push(lessonSection('💻 コード（その2）', `
        <div class="code-block-wrap">
          <div class="code-block-header"><span>main.js</span><button class="copy-btn" data-code="${_esc(l.code2)}">Copy</button></div>
          <pre class="code-block">${_esc(l.code2)}</pre>
        </div>`, 'code2-section'));
    }

    // 8. Expected output
    if (l.expectedOutput) {
      sections.push(lessonSection('期待される出力', `
        <div class="expected-output">
          <div class="eo-header">期待される出力</div>
          <pre>${_esc(l.expectedOutput)}</pre>
        </div>`, 'output-section'));
    }

    // 9. Errors
    if (l.errors && l.errors.length) {
      const errsHTML = l.errors.map(e => `
        <div class="error-card">
          <div class="err-msg">⚠ ${_esc(e.msg)}</div>
          <div class="err-cause"><strong>原因：</strong>${_esc(e.cause)}</div>
          <div class="err-fix"><strong>解決：</strong>${_esc(e.fix)}</div>
        </div>`).join('');
      sections.push(lessonSection('🚨 よくあるエラーと解決方法', errsHTML, 'errors-section'));
    }

    // 10. Quiz
    if (l.quiz && l.quiz.length) {
      const quizHTML = l.quiz.map((q, i) => `
        <details class="quiz-item">
          <summary>Q${i+1}. ${_esc(q.q)}</summary>
          <div class="quiz-answer">${_esc(q.a)}</div>
        </details>`).join('');
      sections.push(lessonSection('🧠 確認問題', quizHTML, 'quiz-section'));
    }

    // 11. Mini task
    if (l.miniTask) {
      sections.push(lessonSection('ミニ課題', `
        <div class="mini-task-box">
          <div class="mt-badge">課題</div>
          <div class="mt-text">${_esc(l.miniTask).replace(/\n/g,'<br>')}</div>
          <label class="mt-check">
            <input type="checkbox" class="lesson-done-check" data-lid="${_esc(lessonId)}">
            このミニ課題を完了した
          </label>
        </div>`, 'task-section'));
    }

    // 12. AI guidance
    if ((l.aiOk && l.aiOk.length) || (l.aiNg && l.aiNg.length)) {
      sections.push(lessonSection('AI活用ガイド', `
        <div class="ai-guidance">
          ${l.aiOk ? `
          <div class="ai-ok">
            <h4>AIを活用できること</h4>
            ${l.aiOk.map(x => `<div class="ai-item">「${_esc(x)}」</div>`).join('')}
          </div>` : ''}
          ${l.aiNg ? `
          <div class="ai-ng">
            <h4>❌ AIに丸投げしない</h4>
            ${l.aiNg.map(x => `<div class="ai-item ai-ng-item">「${_esc(x)}」</div>`).join('')}
          </div>` : ''}
        </div>`, 'ai-section'));
    }

    // 13. Interview Q
    if (l.interviewQ && l.interviewQ.length) {
      sections.push(lessonSection('💼 面談で聞かれる質問', `
        <div class="interview-qs">
          ${l.interviewQ.map(q => `<div class="iq-item">「${_esc(q)}」</div>`).join('')}
        </div>`, 'interview-section'));
    }

    // 14. Navigation (prev / next)
    const nextBtn = l.nextLesson ? `
      <button class="btn btn-primary next-lesson-btn" data-lid="${_esc(l.nextLesson)}">
        次のLesson へ →
      </button>` : '';
    sections.push(`
      <div class="lesson-nav-actions">
        <button class="btn btn-ghost done-lesson-btn ${isDone ? 'done-active' : ''}" data-lid="${_esc(lessonId)}">
          ${isDone ? '✓ 完了済み（取り消し）' : 'このLessonを完了にする'}
        </button>
        ${nextBtn}
      </div>`);

    root.innerHTML = sections.join('');

    // Bind interactions
    bindOsTabs(root);
    bindCopyBtns(root);
    bindLessonDone(root);
    bindChecklists(root);

    nav('lesson-detail', { phaseId: currentPhaseId, chapterId: currentChapterId, lessonId });
  }

  function lessonSection(title, html, cls = '') {
    return `<section class="lesson-sec ${cls}"><h2 class="ls-title">${title}</h2>${html}</section>`;
  }

  
  function bindOsTabs(root) {
    $$('.step-card', root).forEach(card => {
      $$('.os-tab', card).forEach(tab => {
        tab.addEventListener('click', () => {
          $$('.os-tab', card).forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          $$('.os-content', card).forEach(c => c.style.display = 'none');
          const target = card.querySelector('.os-' + tab.dataset.os);
          if (target) target.style.display = 'block';
        });
      });
    });
  }

  
  function bindCopyBtns(root) {
    $$('.copy-btn', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code || btn.closest('.code-block-wrap').querySelector('pre') && btn.closest('.code-block-wrap').querySelector('pre').innerText || '';
        const clean = code.replace(/Copy$|コピー済み$/, '').trim();
        function doFallback(t) {
          try {
            const ta = document.createElement('textarea');
            ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
            document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, 99999);
            document.execCommand('copy'); document.body.removeChild(ta);
            return true;
          } catch(e2) { return false; }
        }
        function markOk() {
          btn.textContent = '✓ Copied'; btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }
        function markFail() {
          btn.textContent = '⚠ 失敗'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(clean).then(markOk).catch(() => { doFallback(clean) ? markOk() : markFail(); });
          } else {
            doFallback(clean) ? markOk() : markFail();
          }
        } catch(e) { doFallback(clean) ? markOk() : markFail(); }
      });
    });

    // Also bind static copy-block elements
    $$('.copy-block:not([data-cb])', root || document).forEach(block => {
      block.dataset.cb = '1';
      const btn = el('button', 'copy-btn-static', 'Copy');
      block.style.position = 'relative';
      block.appendChild(btn);
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const txt = block.innerText.replace(/Copy$|✓ Copied$/, '').trim();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(() => {
              btn.textContent = '✓ Copied';
              setTimeout(() => btn.textContent = 'Copy', 2000);
            }).catch(() => {});
          }
        } catch(_) {}
      });
    });
  }

  
  function bindLessonDone(root) {
    $$('.done-lesson-btn', root).forEach(btn => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.lid;
        Progress.toggleLesson(lid);
        showLessonDetail(lid);
        updateProgress();
      });
    });
    $$('.next-lesson-btn', root).forEach(btn => {
      btn.addEventListener('click', () => showLessonDetail(btn.dataset.lid));
    });
    $$('.lesson-done-check', root).forEach(cb => {
      const lid = cb.dataset.lid;
      cb.checked = Progress.doneLessons().includes(lid);
      cb.addEventListener('change', () => {
        if (cb.checked && !Progress.doneLessons().includes(lid)) Progress.toggleLesson(lid);
        else if (!cb.checked && Progress.doneLessons().includes(lid)) Progress.toggleLesson(lid);
        updateProgress();
      });
    });
  }

  
  function bindChecklists(root) {
    $$('[data-checklist]', root || document).forEach(list => {
      if (list.dataset.clBound) return;
      list.dataset.clBound = '1';
      const key = list.dataset.checklist;
      $$('li', list).forEach((li, idx) => {
        const k = key + ':' + idx;
        if (Progress.checklistGet(k)) li.classList.add('checked');
        li.addEventListener('click', () => {
          li.classList.toggle('checked');
          Progress.checklistSet(k, li.classList.contains('checked'));
        });
      });
    });
  }

  
  function renderGlossary() {
    const root = $('#glossary-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';

    const categories = _unique(GLOSSARY.map(function(g){ return g.category; }));
    let html = '<div class="glossary-search"><input type="search" id="glossary-q" placeholder="用語を検索…" class="search-input"></div>';

    categories.forEach(cat => {
      const terms = GLOSSARY.filter(g => g.category === cat);
      html += `<h2 class="glossary-cat">${_esc(cat)}</h2><div class="glossary-grid">`;
      terms.forEach(g => {
        html += `<div class="gterm-card" data-term="${_esc(g.term)} ${_esc(g.short)} ${_esc(g.full)}">
          <dt>${_esc(g.term)}</dt>
          <dd class="gt-short">${_esc(g.short)}</dd>
          <dd class="gt-full">${_esc(g.full)}</dd>
        </div>`;
      });
      html += '</div>';
    });

    root.innerHTML = html;

    const qi = root.querySelector('#glossary-q');
    if(qi) qi.addEventListener('input', function() {
      const q = qi.value.toLowerCase();
      $$('.gterm-card', root).forEach(c => {
        c.style.display = c.dataset.term.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  
  function renderErrorList() {
    const root = $('#error-list-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';

    let html = '';
    ERRORS.forEach(e => {
      html += `<div class="error-card-full">
        <div class="ecf-msg">⚠ ${_esc(e.msg)}</div>
        ${e.category ? `<span class="chip">${_esc(e.category)}</span>` : ''}
        <div class="ecf-body">
          <div><strong>原因：</strong>${_esc(e.cause)}</div>
          <div><strong>解決：</strong>${_esc(e.fix)}</div>
          ${e.example ? `<pre class="error-example">${_esc(e.example)}</pre>` : ''}
        </div>
      </div>`;
    });
    root.innerHTML = html || '<p class="empty-msg">エラー集を—です。</p>';
  }

  
  function renderTemplates() {
    const root = $('#templates-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';

    const templates = [
      {title:'課題提出テンプレート', code:`【氏名】
【提出日】YYYY-MM-DD
【Phase】Phase XX
【課題名】
【GitHub URL】https://github.com/...
【公開URL】

## 作ったもの
## 実装した機能
## 工夫した点
## AIを使った箇所
## 自分で書いた箇所
## まだ理解が浅いこと
## 講師への質問`},
      {title:'日報テンプレート', code:`## 日報 YYYY-MM-DD
【今日学んだこと】
【できるようになったこと】
【発生したエラーと解決】
【AIを使った箇所】
【明日やること】
【質問】`},
      {title:'AI利用ログ', code:`## AI利用ログ
### 依頼したこと
### 採用した出力
### 不採用と理由
### 自分で判断した箇所
### 理解が浅いと思う箇所`},
      {title:'CLAUDE.md 雛形', code:`# プロジェクト名
## 目的
## 技術スタック
## ディレクトリ構成
## コーディング規約
## 命名規則
## やってはいけないこと
## テスト方針
## 私の理解度`}
    ];

    let html = '';
    templates.forEach(t => {
      html += `<h2>${_esc(t.title)}</h2>
        <div class="code-block-wrap">
          <div class="code-block-header">
            <span>${_esc(t.title)}</span>
            <button class="copy-btn" data-code="${_esc(t.code)}">Copy</button>
          </div>
          <pre class="code-block">${_esc(t.code)}</pre>
        </div>`;
    });

    root.innerHTML = html;
    bindCopyBtns(root);
  }


  
  function renderAssignments() {
    var root = $('#assignments-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';
    var ASNS = window.ASSIGNMENTS || [];
    var html = '';
    ASNS.forEach(function(a) {
      html += '<div class="assignment-card" id="asn-' + _esc(a.id) + '">';
      html += '<div class="asn-header"><span class="chip chip-' + _esc(a.phase) + '">Phase ' + _esc(a.phase.replace('p','')) + '</span>';
      html += '<h3>' + _esc(a.title) + '</h3></div>';
      html += '<p class="asn-goal">' + _esc(a.goal) + '</p>';
      html += '<details class="asn-detail"><summary>課題の詳細を見る</summary><div class="asn-body">';
      html += '<h4>作成するもの</h4><p>' + _esc(a.build) + '</p>';
      html += '<h4>必須要件</h4><ul>' + (a.requirements||[]).map(function(r){ return '<li>'+_esc(r)+'</li>'; }).join('') + '</ul>';
      html += '<h4>📦 提出物</h4><ul>' + (a.deliverables||[]).map(function(r){ return '<li>'+_esc(r)+'</li>'; }).join('') + '</ul>';
      if (a.github && a.github.required) html += '<div class="callout">GitHubリポジトリへのpushが必須です。' + (a.github.readme ? 'README.mdも必須。' : '') + '</div>';
      html += '<h4>合格条件</h4><p>' + _esc(a.passCond) + '</p>';
      html += '</div></details></div>';
    });
    root.innerHTML = html || '<p class="empty-msg">課題データを読み込み中です。</p>';
  }

  
  function renderSkillChecks() {
    var root = $('#skillchecks-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';
    var SC = window.SKILLCHECKS || {};
    var html = '';
    Object.values(SC).forEach(function(phase) {
      html += '<div class="sc-phase"><h2>Phase ' + _esc(phase.phase.replace('p','')) + ': ' + _esc(phase.title) + '</h2>';
      html += '<div class="sc-questions">';
      (phase.questions||[]).forEach(function(q, i) {
        html += '<details class="sc-item"><summary><span class="sc-num">Q'+(i+1)+'</span>' + _esc(q.q) + '</summary>';
        html += '<div class="sc-answer"><div class="sc-ans-label">模範解答</div><p>' + _esc(q.answer) + '</p>';
        if (q.explanation) html += '<p class="sc-explain">' + _esc(q.explanation) + '</p>';
        html += '</div></details>';
      });
      html += '</div></div>';
    });
    root.innerHTML = html || '<p class="empty-msg">スキルチェックを読み込み中です。</p>';
  }


  
  function renderP12Apps() {
    var root = $('#p12-apps-root');
    if (!root) return;
    if (root.dataset.rendered) return;
    root.dataset.rendered = '1';
    var apps = window.P12_APPS || [];
    var html = '<div class="p12-app-grid">';
    apps.forEach(function(app) {
      html += '<div class="p12-app-card">';
      html += '<div class="p12-app-header">';
      html += '<span class="p12-app-emoji">' + _esc(app.emoji) + '</span>';
      html += '<div><h3>' + _esc(app.title) + '</h3>';
      html += '<span class="p12-diff">難易度: ' + _esc(app.difficulty) + '</span></div></div>';
      html += '<p>' + _esc(app.summary) + '</p>';
      html += '<details class="phase-accordion"><summary>詳細を見る</summary><div class="acc-body">';
      html += '<h4>対象ユーザー</h4><p>' + _esc(app.target) + '</p>';
      html += '<h4>主要機能</h4><ul>' + (app.functions||[]).map(function(f){return '<li>'+_esc(f)+'</li>';}).join('') + '</ul>';
      html += '<h4>技術スタック</h4>';
      html += '<div class="tech-stack-row">';
      if(app.techStack) {
        if(app.techStack.front) html += '<span class="tech-badge tech-front">Front: '+_esc(app.techStack.front)+'</span>';
        if(app.techStack.back)  html += '<span class="tech-badge tech-back">Back: '+_esc(app.techStack.back)+'</span>';
        if(app.techStack.db)    html += '<span class="tech-badge tech-db">DB: '+_esc(app.techStack.db)+'</span>';
        if(app.techStack.ai)    html += '<span class="tech-badge tech-ai">AI: '+_esc(app.techStack.ai)+'</span>';
      }
      html += '</div>';
      if(app.tables && app.tables.length) {
        html += '<h4>🗄️ テーブル設計</h4><table class="data-table"><thead><tr><th>テーブル</th><th>主なカラム</th></tr></thead><tbody>';
        app.tables.forEach(function(t){ html += '<tr><td><code>'+_esc(t.name)+'</code></td><td>'+_esc(t.cols)+'</td></tr>'; });
        html += '</tbody></table>';
      }
      if(app.apiList && app.apiList.length) {
        html += '<h4>🌐 API設計</h4><table class="data-table"><thead><tr><th>Method</th><th>Path</th><th>説明</th></tr></thead><tbody>';
        app.apiList.forEach(function(a){
          var cls = a.method==='GET'?'method-get':a.method==='POST'?'method-post':a.method==='PUT'?'method-put':'method-del';
          html += '<tr><td><span class="http-method '+cls+'">'+_esc(a.method)+'</span></td><td><code>'+_esc(a.path)+'</code></td><td>'+_esc(a.desc)+'</td></tr>';
        });
        html += '</tbody></table>';
      }
      if(app.implementSteps && app.implementSteps.length) {
        html += '<h4>🗺️ 実装手順</h4><ol class="learning-steps">';
        app.implementSteps.forEach(function(s){ html += '<li>'+_esc(s)+'</li>'; });
        html += '</ol>';
      }
      if(app.interviewPoints && app.interviewPoints.length) {
        html += '<h4>面談でよく聞かれること</h4><ul>';
        app.interviewPoints.forEach(function(q){ html += '<li>'+_esc(q)+'</li>'; });
        html += '</ul>';
      }
      html += '</div></details></div>';
    });
    html += '</div>';
    root.innerHTML = html || '<p class="empty-msg">アプリテンプレートを読み込み中です。</p>';
  }

  
  function renderDiagrams() {
    var D = window.DIAGRAMS || {};
    // Phase詳細のdiagram-phaseに対応するphase idと図解をマッピング
    var phaseMap = {
      p01: ['webApp3Layer','httpFlow'],
      p05: ['reactComponents'],
      p06: ['nextjsAppRouter'],
      p07: ['springBoot3Layer'],
      p08: ['erDiagram'],
      p09: ['springBoot3Layer'],
      p11: ['aiDevFlow','hokuFlow'],
      p12: ['fullStackArch','erDiagram']
    };
    // Hokuページにhokuフロー図を挿入
    var hokuDiagramRoot = $('#hoku-diagram-root');
    if (hokuDiagramRoot && D.hokuFlow) hokuDiagramRoot.innerHTML = D.hokuFlow;
    var aiDiagramRoot = $('#ai-dev-diagram-root');
    if (aiDiagramRoot && D.aiDevFlow) aiDiagramRoot.innerHTML = D.aiDevFlow;
    var fullstackDiagramRoot = $('#fullstack-diagram-root');
    if (fullstackDiagramRoot && D.fullStackArch) fullstackDiagramRoot.innerHTML = D.fullStackArch;
  }

  
  function renderHoku() {
    var root = $('#hoku-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';
    // static content - already in HTML
  }

  
  function routeHash() {
    const h = (location.hash || '').replace(/^#/, '');
    if (!h) { nav('home', {noScroll:true}); renderHome(); return; }
    const parts = h.split(':');
    const view = parts[0];
    switch(view) {
      case 'phase-detail':    if (parts[1]) showPhaseDetail(parts[1]); break;
      case 'chapter-detail':  if (parts[1]) showChapterDetail(parts[1]); break;
      case 'lesson-detail':   if (parts[1]) showLessonDetail(parts[1]); break;
      case 'glossary':        nav('glossary', {noScroll:true}); renderGlossary(); break;
      case 'error-list':      nav('error-list', {noScroll:true}); renderErrorList(); break;
      case 'templates':       nav('templates', {noScroll:true}); renderTemplates(); break;
      case 'assignments':    nav('assignments', {noScroll:true}); renderAssignments(); break;
      case 'skillchecks':   nav('skillchecks', {noScroll:true}); renderSkillChecks(); break;
      case 'hoku':           nav('hoku', {noScroll:true}); renderHoku(); break;
      case 'p12-apps':      nav('p12-apps', {noScroll:true}); renderP12Apps(); renderDiagrams(); break;
      default:
        if ($('#sec-' + view)) nav(view, {noScroll:true});
        else nav('home', {noScroll:true});
    }
  }

  
  document.addEventListener('DOMContentLoaded', () => {

    // Sidebar nav
    $$('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const v = item.dataset.view;
        if (!v) return;
        nav(v);
        if (v === 'phases')     renderPhaseList();
        if (v === 'glossary')    renderGlossary();
        if (v === 'error-list')  renderErrorList();
        if (v === 'templates')   renderTemplates();
        if (v === 'assignments') renderAssignments();
        if (v === 'skillchecks') renderSkillChecks();
        if (v === 'hoku')        renderHoku();
        if (v === 'p12-apps')   { renderP12Apps(); renderDiagrams(); }
        if (v === 'error-list') renderErrorList();
        if (v === 'templates')  renderTemplates();
        if (v === 'home')       renderHome();
      });
    });

    // Phase search / filter
    const phaseQ = $('#phase-search');
    if(phaseQ) phaseQ.addEventListener('input', function() { phaseSearch = phaseQ.value; renderPhaseList(); });

    $$('#phase-filter .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('#phase-filter .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        phaseCategory = chip.dataset.cat || 'all';
        renderPhaseList();
      });
    });

    // Mobile hamburger
    const menuBtn = $('#menu-btn');
    const sidebar = $('#sidebar');
    const backdrop = $('.backdrop');
    if(menuBtn) menuBtn.addEventListener('click', function() {
      if(sidebar) sidebar.classList.toggle('open');
      if(backdrop) backdrop.classList.toggle('show');
    });
    if(backdrop) backdrop.addEventListener('click', function() {
      if(sidebar) sidebar.classList.remove('open');
      if(backdrop) backdrop.classList.remove('show');
    });

    // To-top button (window scroll)
    const toTop = el('button', 'to-top', '↑');
    toTop.setAttribute('aria-label', 'トップへ戻る');
    document.body.appendChild(toTop);
    window.addEventListener('scroll', function() {
      toTop.classList.toggle('show', (window.scrollY || window.pageYOffset) > 400);
    }, { passive: true });
    toTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Footer year
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Bind static checklists and copy blocks
    bindChecklists();
    bindCopyBtns();

    // Initial render
    renderHome();
    renderPhaseList();
    routeHash();
    try { window.addEventListener('hashchange', routeHash); } catch(_){}
  });

})();



/* iOS互換ユーティリティ */

/* ── iOS Safari localStorage 安全ラッパー ── */


(function() {
  'use strict';
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  
  window._patchRenderSkillChecks = function() {
    var root = $('#skillchecks-root');
    if (!root) return;
    root.removeAttribute('data-rendered');
    var SC = window.SKILLCHECKS || {};
    var pks = Object.keys(SC);
    if (!pks.length) { root.innerHTML = '<p class="empty-msg">データ読み込み中…</p>'; return; }

    var typeLabels = {choice:'選択式', text:'記述式', code:'コード読解'};
    var html = '<div class="sc-filter-bar"><button class="sc-filter-btn active" data-phase="all">全Phase（' + pks.length + '）</button>';
    pks.forEach(function(pk){ html += '<button class="sc-filter-btn" data-phase="'+_esc(pk)+'">Phase '+_esc(pk.replace('p',''))+'</button>'; });
    html += '</div>';

    pks.forEach(function(pk) {
      var phase = SC[pk]; var qs = phase.questions||[];
      var tc = {}; qs.forEach(function(q){ tc[q.type]=(tc[q.type]||0)+1; });
      html += '<div class="sc-phase" data-phase="'+_esc(pk)+'">';
      html += '<div class="sc-phase-header"><h2>'+_esc(phase.title)+'</h2><div class="sc-type-summary">';
      Object.keys(tc).forEach(function(t){ html += '<span class="sc-type-chip sc-type-'+_esc(t)+'">'+(typeLabels[t]||_esc(t))+': '+tc[t]+'問</span>'; });
      html += '</div></div><div class="sc-questions">';

      qs.forEach(function(q,i) {
        var tl = typeLabels[q.type]||_esc(q.type||'');
        html += '<details class="sc-item">';
        html += '<summary><span class="sc-num">Q'+(i+1)+'</span><span class="sc-type-tag sc-type-'+(q.type||'text')+'">'+tl+'</span><span class="sc-q-text">'+_esc(q.q)+'</span></summary>';
        html += '<div class="sc-answer-body">';
        html += '<div class="sc-ans-block"><div class="sc-ans-label">模範解答</div><p>'+_esc(q.answer)+'</p></div>';
        if (q.explanation) html += '<div class="sc-explain-block"><div class="sc-explain-label">解説</div><p>'+_esc(q.explanation)+'</p></div>';
        if (q.commonMistakes && q.commonMistakes.length) {
          html += '<div class="sc-mistake-block"><div class="sc-mistake-label">よくある間違い</div><ul>';
          q.commonMistakes.forEach(function(m){ html += '<li>'+_esc(m)+'</li>'; });
          html += '</ul></div>';
        }
        var meta = [];
        if (q.passLine) meta.push('合格ライン: '+_esc(q.passLine));
        if (q.instructorCheckPoint) meta.push('👤 講師確認: '+_esc(q.instructorCheckPoint));
        if (meta.length) html += '<div class="sc-meta-row">'+meta.map(function(m){ return '<span class="sc-meta-item">'+m+'</span>'; }).join('')+'</div>';
        html += '<div class="sc-hoku-hint">自分の言葉で答えて、HokuまたはClaudeでフィードバックをもらいましょう。</div>';
        html += '</div></details>';
      });
      html += '</div></div>';
    });

    root.innerHTML = html;
    $$('.sc-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        $$('.sc-filter-btn').forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var ph = this.dataset.phase;
        $$('.sc-phase').forEach(function(el){ el.style.display = (ph==='all'||el.dataset.phase===ph)?'':'none'; });
      });
    });
  };

  
  window._patchRenderAssignments = function() {
    var root = $('#assignments-root');
    if (!root) return;
    root.removeAttribute('data-rendered');
    var ASNS = window.ASSIGNMENTS||[];
    var html = '';
    ASNS.forEach(function(a) {
      html += '<div class="assignment-card" id="asn-'+_esc(a.id)+'">';
      html += '<div class="asn-header"><span class="chip chip-'+_esc(a.phase)+'">Phase '+_esc(a.phase.replace('p',''))+'</span><h3>'+_esc(a.title)+'</h3></div>';
      html += '<p class="asn-goal">'+_esc(a.goal)+'</p>';
      html += '<details class="phase-accordion"><summary>課題詳細・要件・提出チェックリストを開く</summary><div class="asn-body">';

      if (a.scenario) html += '<div class="callout callout-field"><div><strong>想定シーン</strong><p>'+_esc(a.scenario)+'</p></div></div>';
      html += '<div class="asn-section"><h4>📦 作るもの</h4><p>'+_esc(a.build)+'</p></div>';
      html += '<div class="asn-section"><h4>必須要件</h4><ul class="asn-req-list">';
      (a.requirements||[]).forEach(function(r){ html += '<li>'+_esc(r)+'</li>'; });
      html += '</ul></div>';
      if (a.recommended && a.recommended.length) {
        html += '<div class="asn-section"><h4>⭐ 推奨要件</h4><ul class="asn-req-list asn-recommend">';
        a.recommended.forEach(function(r){ html += '<li>'+_esc(r)+'</li>'; });
        html += '</ul></div>';
      }
      if (a.steps && a.steps.length) {
        html += '<div class="asn-section"><h4>🗺️ 作業手順</h4><ol class="asn-steps">';
        a.steps.forEach(function(s){ html += '<li>'+_esc(s)+'</li>'; });
        html += '</ol></div>';
      }
      html += '<div class="asn-section asn-deliverables"><h4>📤 提出物</h4><ul>';
      (a.deliverables||[]).forEach(function(d){ html += '<li>'+_esc(d)+'</li>'; });
      html += '</ul>';
      if (a.github && a.github.required) html += '<div class="callout" style="margin-top:8px"><span class="callout-icon">📂</span><div><strong>GitHub提出必須</strong>'+(a.github.readme ? '<p>README.md必須（技術スタック・起動方法・AI利用ログ）</p>' : '')+'</div></div>';
      html += '</div>';

      // 提出前チェックリスト
      var checks = ['機能が全て動作することをブラウザで確認した','Consoleにエラーが出ていない','スマホ（390px）で表示が崩れない','GitHubにpush済み'];
      if (a.github && a.github.readme) checks.push('README.mdが整備されデプロイURLが記載されている');
      if (a.hokiLog) checks.push('AI利用ログ（AI-USAGE.md）が作成されている');
      html += '<div class="asn-section"><h4>提出前チェックリスト</h4><div class="pre-submit-checklist">';
      checks.forEach(function(c){ html += '<label class="pre-check-item"><input type="checkbox"> '+_esc(c)+'</label>'; });
      html += '</div></div>';

      // 合格基準
      html += '<div class="asn-section"><h4>評価基準・合格条件</h4><div class="eval-box">';
      html += '<div class="eval-pass"><strong>合格条件</strong><p>'+_esc(a.passCond)+'</p></div>';
      if (a.resubmit) html += '<div class="eval-resubmit"><strong>🔄 再提出条件</strong><p>'+_esc(a.resubmit)+'</p></div>';
      if (a.criteria && a.criteria.length) { html += '<h5>採点観点:</h5><ul>'; a.criteria.forEach(function(c){ html += '<li>'+_esc(c)+'</li>'; }); html += '</ul>'; }
      html += '</div></div>';

      // 講師確認
      if (a.reviewPoints && a.reviewPoints.length) {
        html += '<details class="phase-accordion" style="margin-top:10px"><summary>👤 講師レビュー観点</summary><div class="acc-body"><ul>';
        a.reviewPoints.forEach(function(r){ html += '<li>'+_esc(r)+'</li>'; });
        html += '</ul></div></details>';
      }
      html += '</div></details></div>';
    });
    root.innerHTML = html||'<p class="empty-msg">課題データを読み込み中です。</p>';
  };

  
  var _origShowLesson = null;
  document.addEventListener('DOMContentLoaded', function() {
    // スキルチェック・課題の初期レンダリングをパッチ版で行う
    var nav = window._nav || function(){};

    // skillchecks ページを開いたら自動でパッチ版を使う
    document.addEventListener('click', function(e) {
      var item = e.target.closest('[data-view="skillchecks"]');
      if (item) { setTimeout(function(){ window._patchRenderSkillChecks(); }, 200); }
      var item2 = e.target.closest('[data-view="assignments"]');
      if (item2) { setTimeout(function(){ window._patchRenderAssignments(); }, 200); }
    });
  });
})();


(function() {
  var DIAG_MAP = {
    p01: ['webApp3Layer','httpFlow'],
    p05: ['reactComponents'],
    p06: ['nextjsAppRouter'],
    p07: ['springBoot3Layer'],
    p08: ['erDiagram'],
    p09: ['springBoot3Layer'],
    p11: ['aiDevFlow','hokuFlow'],
    p12: ['fullStackArch']
  };
  function injectDiagram(phaseId) {
    var ids = DIAG_MAP[phaseId];
    var D = window.DIAGRAMS || {};
    if (!ids || !ids.length || !Object.keys(D).length) return;
    var root = document.querySelector('#phase-detail-root');
    if (!root) return;
    // 既に挿入済みならスキップ
    if (root.querySelector('.phase-diagram-section')) return;
    // ハンズオン演習の後・Chapters前に挿入
    var chapH2 = null;
    Array.from(root.querySelectorAll('h2')).forEach(function(h) {
      if (h.textContent.includes('Chapter')) chapH2 = h;
    });
    var diagDiv = document.createElement('div');
    diagDiv.className = 'phase-diagram-section';
    var inner = '<details class="phase-accordion" open><summary><span class="acc-icon">🗺️</span>関連図解（'+ids.length+'枚）</summary><div class="acc-body diagrams-section">';
    ids.forEach(function(did) { if (D[did]) inner += D[did]; });
    inner += '</div></details>';
    diagDiv.innerHTML = inner;
    if (chapH2) {
      root.insertBefore(diagDiv, chapH2);
    } else {
      root.appendChild(diagDiv);
    }
  }
  // Phase カードクリック後に図解を注入
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.phase-card');
    if (card) {
      var phaseId = card.dataset && card.dataset.phase;
      if (phaseId) setTimeout(function(){ injectDiagram(phaseId); }, 350);
    }
    // 「次のPhaseへ」ボタン
    var nextBtn = e.target.closest('.next-phase-btn');
    if (nextBtn) {
      setTimeout(function(){
        // 現在のphaseIdを推測（breadcrumb等から）
        var bc = document.querySelector('.breadcrumb');
        if (bc) {
          var m = bc.textContent.match(/Phase\s+(\d+)/);
          if (m) injectDiagram('p'+m[1].padStart(2,'0'));
        }
      }, 400);
    }
  });
  // hashchange にも対応
  window.addEventListener('hashchange', function() {
    var hash = location.hash;
    var m = hash.match(/phase-detail:([a-z0-9]+)/);
    if (m) setTimeout(function(){ injectDiagram(m[1]); }, 350);
  });
  // 既存の showPhaseDetail をラップ
  document.addEventListener('DOMContentLoaded', function() {
    // DOMContentLoaded後に元の showPhaseDetail をラップ可能
    setTimeout(function() {
      // カードのdata-phase属性を付与
      Array.from(document.querySelectorAll('.phase-card')).forEach(function(card, i) {
        var phases = window.PHASES || [];
        if (phases[i]) card.dataset.phase = phases[i].id;
      });
    }, 500);
  });
})();


(function() {
  var _orig_renderPhaseList = null;
  // MutationObserver で phase-grid を監視
  var observer = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        try {
          if (!node.classList || !node.classList.contains('phase-card')) return;
          // PHASES データから pc-num を使って data-phase 設定
          var pcNum = node.querySelector('.pc-num, .pn, .dh-num');
          if (!pcNum) return;
          var phNumText = pcNum.textContent ? pcNum.textContent.trim() : '';
          if (!phNumText) return;
          var phases = window.PHASES || [];
          var num = parseInt(phNumText.replace(/^0+/,''), 10) || 0;
          var ph = phases.find(function(p){ return p.num === num; });
          if (ph) node.dataset.phase = ph.id;
        } catch(e) {}
      });
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    var grid = document.querySelector('#phase-grid');
    if (grid) observer.observe(grid, {childList:true, subtree:false});
  });
})();


(function() {
  function hookShowPhase() {
    // グローバルまたはクロージャ内のshowPhaseDetailをフック不可なので
    // phase-detail-rootのMutationObserverで変更を検知して注入する
    var root = document.querySelector('#phase-detail-root');
    if (!root) return;
    var obs = new MutationObserver(function() {
      // Phase詳細が更新されたら図解を注入
      // 現在のphaseIdをクラスや内容から推測
      var heroNum = root.querySelector('.dh-num');
      if (!heroNum) return;
      var num = parseInt(heroNum.textContent.trim()) || -1;
      var phases = window.PHASES || [];
      var ph = phases.find(function(p){ return p.num === num; });
      if (ph) {
        setTimeout(function(){ 
          if (typeof injectDiagram === 'function') injectDiagram(ph.id);
          else {
            // インジェクター関数を直接実行
            var DIAG_MAP = {
              p01:['webApp3Layer','httpFlow'], p05:['reactComponents'],
              p06:['nextjsAppRouter'], p07:['springBoot3Layer'],
              p08:['erDiagram'], p09:['springBoot3Layer'],
              p11:['aiDevFlow','hokuFlow'], p12:['fullStackArch']
            };
            var ids = DIAG_MAP[ph.id]; var D = window.DIAGRAMS||{};
            if (!ids||!ids.length||!Object.keys(D).length) return;
            if (root.querySelector('.phase-diagram-section')) return;
            var chapH2 = null;
            Array.from(root.querySelectorAll('h2')).forEach(function(h){
              if (h.textContent.includes('Chapter')) chapH2 = h;
            });
            var div = document.createElement('div');
            div.className = 'phase-diagram-section';
            var inner = '<details class="phase-accordion"><summary><span class="acc-icon">🗺️</span>関連図解（'+ids.length+'枚）</summary><div class="acc-body diagrams-section">';
            ids.forEach(function(did){ if(D[did]) inner+=D[did]; });
            inner += '</div></details>';
            div.innerHTML = inner;
            if (chapH2) root.insertBefore(div, chapH2);
            else root.appendChild(div);
          }
        }, 100);
      }
    });
    obs.observe(root, {childList:true, subtree:false});
  }
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(hookShowPhase, 300);
  });
})();


(function() {
  // コードブロックに疑似シンタックスハイライトを適用
  function applyCodeHighlight(root) {
    Array.from(root.querySelectorAll('pre.code-block')).forEach(function(pre) {
      if (pre.dataset.highlighted) return;
      pre.dataset.highlighted = '1';
      var code = pre.textContent;
      // キーワード置換（HTMLエスケープ後に適用）
      var keywords = ['function','const','let','var','return','if','else','for','while','class','import','export','async','await','public','private','void','static','new','this','extends','implements','interface'];
      var stringReplacer = function(match) { return '<span class="hl-string">'+match+'</span>'; };
      var commentReplacer = function(match) { return '<span class="hl-comment">'+match+'</span>'; };
      // エスケープ済みのHTML上で操作しないため、plain textにキーワードclassを付与
      var highlighted = pre.innerHTML;
      keywords.forEach(function(kw) {
        var re = new RegExp('\\b('+kw+')\\b','g');
        highlighted = highlighted.replace(re, '<span class="hl-kw">$1</span>');
      });
      // 文字列 (シングルクォート・ダブルクォート)
      highlighted = highlighted.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="hl-string">$1</span>');
      // コメント (//)
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>');
      // 数字
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="hl-num">$1</span>');
      pre.innerHTML = highlighted;
    });
  }

  // Lesson詳細に「自己説明練習」セクションを追加
  function enhanceLessonDetail() {
    var root = document.querySelector('#lesson-detail-root');
    if (!root || root.dataset.enhanced) return;
    root.dataset.enhanced = '1';

    // self-explain セクションを nav-actions の前に挿入
    var navActions = root.querySelector('.lesson-nav-actions');
    if (!navActions) return;

    var selfExplainDiv = document.createElement('div');
    selfExplainDiv.className = 'lesson-section self-explain-section';
    selfExplainDiv.innerHTML = [
      '<h3 class="ls-h3"><span class="ls-icon">🗣️</span>自分の言葉で説明してみよう</h3>',
      '<div class="self-explain-box">',
      '<p class="se-prompt">このレッスンで学んだことを初心者に説明するとしたら、どう説明しますか？以下の練習をやってみましょう。</p>',
      '<ol class="se-steps">',
      '<li>ノートに「一言で言うと〇〇だ」と書く</li>',
      '<li>なぜそれが必要なのかを1文で書く</li>',
      '<li>現場でどう使われるかを例えで説明する</li>',
      '<li>Hokuに「このレッスン内容を私が正しく理解しているか確認してください」と依頼する</li>',
      '</ol>',
      '<div class="se-hoku-prompt">',
      '<strong>Hoku / Claude へのプロンプト例</strong>',
      '<pre class="se-template">私は「[このレッスンのタイトル]」を学習しました。\n以下が私の理解です：\n[自分の言葉で説明]\n\n理解が正しいか確認してください。\n間違いがあれば指摘してください。</pre>',
      '<button class="btn btn-sm se-copy-btn">Copy</button>',
      '</div>',
      '</div>'
    ].join('');

    root.insertBefore(selfExplainDiv, navActions);

    // コピーボタン
    var copyBtn = selfExplainDiv.querySelector('.se-copy-btn');
    if (copyBtn) {
      var tpl = selfExplainDiv.querySelector('.se-template');
      copyBtn.addEventListener('click', function() {
        var text = tpl ? tpl.textContent : '';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function(){
            copyBtn.textContent = '✓ コピー済み';
            setTimeout(function(){ copyBtn.textContent = 'Copy'; }, 2000);
          });
        }
      });
    }

    // コードハイライト適用
    applyCodeHighlight(root);
  }

  // Lesson詳細の変更を監視
  var lessonRoot = null;
  var lessonObs = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      if (m.addedNodes.length > 0) {
        setTimeout(function(){ enhanceLessonDetail(); }, 150);
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    lessonRoot = document.querySelector('#lesson-detail-root');
    if (lessonRoot) lessonObs.observe(lessonRoot, {childList:true});
  });
})();


(function() {
  function applyHL() {
    Array.from(document.querySelectorAll('pre.code-block:not([data-hl])')).forEach(function(pre) {
      pre.setAttribute('data-hl','1');
      var html = pre.innerHTML;
      var kws = ['function','const','let','var','return','if','else','for','while',
                 'class','import','export','async','await','new','this','typeof',
                 'public','private','void','static','extends','implements','interface',
                 'throw','try','catch','finally','true','false','null','undefined'];
      kws.forEach(function(kw) {
        // span内に既にあるものは無視
        var re = new RegExp('(?<![<\\w])\\b('+kw+')\\b(?![\\w>])','g');
        html = html.replace(re,'<span class="hl-kw">$1</span>');
      });
      // 文字列 (エスケープ済みの &quot; と &#39;)
      html = html.replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)/g,'<span class="hl-string">$1</span>');
      html = html.replace(/(&#39;(?:[^&]|&(?!#39;))*?&#39;)/g,'<span class="hl-string">$1</span>');
      // @アノテーション
      html = html.replace(/@([A-Za-z]+)/g,'<span class="hl-annotation">@$1</span>');
      // コメント (// ...) ただし既にspanの中には適用しない
      html = html.replace(/(\/\/[^\n<]*)/g,'<span class="hl-comment">$1</span>');
      pre.innerHTML = html;
    });
  }
  // Lesson詳細の変化を監視
  var lRoot = null;
  var obs = new MutationObserver(function(){ setTimeout(applyHL,100); });
  document.addEventListener('DOMContentLoaded', function() {
    lRoot = document.querySelector('#lesson-detail-root');
    if(lRoot) obs.observe(lRoot,{childList:true,subtree:true});
  });
})();


(function() {
  function injectSelfExplain(root) {
    if (!root || root.querySelector('.self-explain-section')) return;
    // nav-actions または最後のsectionの後に挿入
    var navAct = root.querySelector('.lesson-nav-actions');
    if (!navAct && root.children.length === 0) return;

    var div = document.createElement('div');
    div.className = 'lesson-section self-explain-section';
    div.innerHTML = [
      '<h3 class="ls-h3"><span class="ls-icon">🗣️</span>自分の言葉で説明してみよう</h3>',
      '<div class="self-explain-box">',
      '<p class="se-prompt">このレッスンで学んだことを初心者に説明するとしたら、どう説明しますか？Hokuに答えを採点してもらう前に、まず自分で答えを書いてみましょう。</p>',
      '<ol class="se-steps">',
      '<li>「一言で言うと〇〇だ」とノートに書く</li>',
      '<li>なぜそれが必要かを1文で書く</li>',
      '<li>現場でどう使われるかを具体例で書く</li>',
      '<li>Hokuに「私の理解が正しいか確認してください」と依頼する</li>',
      '</ol>',
      '<div class="se-hoku-prompt">',
      '<strong>以下をコピーして Claude / Hoku に貼りましょう</strong>',
      '<pre class="se-template">私は「このレッスンのタイトル」を学習しました。\n私の理解：\n（ここに自分の言葉で説明を書く）\n\n理解が正しいか確認してください。\n間違いや不足があれば具体的に指摘してください。</pre>',
      '<button class="btn btn-sm se-copy-btn">Copy</button>',
      '</div></div>'
    ].join('');

    if (navAct) {
      root.insertBefore(div, navAct);
    } else {
      root.appendChild(div);
    }

    var btn = div.querySelector('.se-copy-btn');
    var tpl = div.querySelector('.se-template');
    if (btn && tpl) {
      btn.addEventListener('click', function() {
        var txt = tpl.textContent||tpl.innerText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function(){
            btn.textContent='✓ コピー済み';
            setTimeout(function(){btn.textContent='Copy';},2000);
          }).catch(function(){});
        }
      });
    }
  }

  // lesson-detail-root を MutationObserver で監視（childList + subtree）
  document.addEventListener('DOMContentLoaded', function() {
    var lRoot = document.querySelector('#lesson-detail-root');
    if (!lRoot) return;
    var timer = null;
    var obs = new MutationObserver(function(muts) {
      var hasAdded = muts.some(function(m){ return m.addedNodes.length > 0; });
      if (!hasAdded) return;
      clearTimeout(timer);
      timer = setTimeout(function() {
        injectSelfExplain(lRoot);
      }, 200);
    });
    obs.observe(lRoot, {childList: true, subtree: false});
  });
})();


(function() {
  var obs = new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      if (!m.addedNodes.length) return;
      var root = document.querySelector('#phase-detail-root');
      if (!root || root.querySelector('.phase-illus-wrap')) return;
      var hero = root.querySelector('.detail-hero.phase-hero');
      if (!hero) return;
      // 現在のPhase番号を取得
      var numEl = root.querySelector('.dh-num');
      if (!numEl) return;
      var numStr = numEl.textContent.trim();
      var phNum = parseInt(numStr, 10);
      var PHASES = window.PHASES || [];
      var ph = PHASES.find(function(p){ return p.num === phNum; });
      if (!ph) return;
      var ILL = window.PHASE_ILLUSTRATIONS || {};
      if (!ILL[ph.id]) return;
      // 挿入済みチェック
      if (root.querySelector('.phase-illus-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'phase-illus-wrap';
      wrap.innerHTML = ILL[ph.id];
      // ヒーローの次に挿入
      hero.parentNode.insertBefore(wrap, hero.nextSibling);
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    var root = document.querySelector('#phase-detail-root');
    if (root) obs.observe(root, {childList: true, subtree: false});
  });
})();


(function() {
  var _origPatch = window._patchRenderSkillChecks;
  window._patchRenderSkillChecks = function() {
    // SC_ENHANCEMENTS をSKILLCHECKS にマージ
    var ENC = window.SC_ENHANCEMENTS || {};
    var SC = window.SKILLCHECKS || {};
    Object.keys(SC).forEach(function(pk) {
      var phase = SC[pk];
      (phase.questions || []).forEach(function(q) {
        var enh = ENC[q.id];
        if (!enh) return;
        if (enh.commonMistakes) q.commonMistakes = enh.commonMistakes;
        if (enh.passLine)        q.passLine        = enh.passLine;
        if (enh.instructorCheckPoint) q.instructorCheckPoint = enh.instructorCheckPoint;
      });
    });
    if (_origPatch) _origPatch();
    else {
      // フォールバック: 通常のrenderSkillChecksを呼ぶ
      var r = document.querySelector('#skillchecks-root');
      if (r) { r.removeAttribute('data-rendered'); }
    }
  };
})();


(function() {
  // renderGlossaryを拡張してエラー集と追加用語を表示
  var _origGlossary = null;
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var origFn = window.renderGlossary;
      if (!origFn) return;
      window.renderGlossary = function() {
        origFn();
        // 追加用語と用語集エラーを追加
        var root = document.querySelector('#glossary-root') || document.querySelector('#error-list-root');
        // エラー集セクションを別途レンダリング
        renderGlossaryErrors();
        renderExtraTerms();
      };
    }, 500);
  });

  window.renderGlossaryErrors = function() {
    var root = document.querySelector('#error-list-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';
    var ERRS = window.GLOSSARY_ERRORS || [];
    if (!ERRS.length) { root.innerHTML = '<p class="empty-msg">エラー集を—です。</p>'; return; }

    // カテゴリフィルター
    var phases = _unique(ERRS.map(function(e){ return e.phase; }));
    var html = '<div class="glossary-nav"><button class="glossary-nav-btn active" data-phase="all">すべて（'+ERRS.length+'件）</button>';
    phases.forEach(function(p){ html += '<button class="glossary-nav-btn" data-phase="'+_esc(p)+'">'+_esc(p)+'</button>'; });
    html += '</div><div class="error-grid">';

    ERRS.forEach(function(e) {
      html += '<div class="glossary-error-card" data-phase="'+_esc(e.phase)+'">';
      html += '<div class="err-code">'+_esc(e.code)+'</div>';
      html += '<span class="err-phase">Phase: '+_esc(e.phase)+'</span>';
      if (e.msg) html += '<div style="font-size:.82rem;color:var(--ink-4);font-family:monospace;margin:4px 0;padding:4px 8px;background:#fff1f2;border-radius:4px">'+_esc(e.msg)+'</div>';
      html += '<div class="err-cause"><strong>原因:</strong> '+_esc(e.cause)+'</div>';
      html += '<div class="err-fix"><strong>解決:</strong> '+_esc(e.fix)+'</div>';
      html += '</div>';
    });
    html += '</div>';
    root.innerHTML = html;

    // フィルター
    Array.from(root.querySelectorAll('.glossary-nav-btn')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        Array.from(root.querySelectorAll('.glossary-nav-btn')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var ph = this.dataset.phase;
        Array.from(root.querySelectorAll('.glossary-error-card')).forEach(function(c){
          c.style.display = (ph==='all' || c.dataset.phase===ph) ? '' : 'none';
        });
      });
    });
  };

  window.renderExtraTerms = function() {
    var EXTRA = window.GLOSSARY_EXTRA_TERMS || [];
    if (!EXTRA.length) return;
    var glossRoot = document.querySelector('#glossary-root');
    if (!glossRoot || glossRoot.querySelector('.extra-terms-section')) return;
    var div = document.createElement('div');
    div.className = 'extra-terms-section';
    var catGroups = {};
    EXTRA.forEach(function(t){ catGroups[t.cat] = catGroups[t.cat]||[]; catGroups[t.cat].push(t); });
    var html = '<h3 style="margin-top:24px;margin-bottom:12px">追加用語集</h3><div class="terms-grid">';
    Object.keys(catGroups).forEach(function(cat) {
      catGroups[cat].forEach(function(t) {
        html += '<div class="term-card"><dt>'+_esc(t.term)+'</dt><dd>'+_esc(t.meaning)+'</dd><span class="term-cat">'+_esc(cat)+'</span></div>';
      });
    });
    html += '</div>';
    div.innerHTML = html;
    glossRoot.appendChild(div);
  };
})();


(function() {
  // Phase詳細の面談質問に「良い回答 vs 悪い回答」を追加
  var INTERVIEW_EXAMPLES = {
    p05: [
      { q:'useStateとは何ですか？',
        ng:'Reactのフックです。stateを管理します。',
        ngReason:'表面的すぎる。なぜ必要かが説明できていない。',
        ok:'コンポーネントの状態を管理するReact Hookです。値が変わると自動で再レンダリングが起きるため、UIと状態を同期させることができます。例えばチェックボックスのON/OFFをuseStateで管理すると、チェックと同時に画面が更新されます。' },
      { q:'propsとstateの違いを教えてください。',
        ng:'propsは外からもらうデータ、stateは内部のデータです。',
        ngReason:'なぜ分離するのかの説明がない。',
        ok:'propsは親コンポーネントから渡す読み取り専用のデータです。stateはコンポーネント自身が管理し変更できるデータです。propsを変えたい場合はコールバック関数で親に通知してstateを更新してもらいます。' }
    ],
    p09: [
      { q:'Spring Bootの3層構造を説明してください。',
        ng:'Controller・Service・Repositoryがあります。',
        ngReason:'各層の役割と責務の分離の理由が説明できていない。',
        ok:'Controller層はHTTPリクエストを受け付けてService層に処理を委譲します。Service層はビジネスロジックを実行します。Repository層はDBへのCRUD操作を担当します。責務を分離することで変更が局所化され、テストも書きやすくなります。' }
    ],
    p12: [
      { q:'なぜこのアプリを作りましたか？',
        ng:'カリキュラムの課題だったからです。',
        ngReason:'自分の意図が伝わらない。面接官に熱意を感じてもらえない。',
        ok:'毎日の学習記録をエクセルで管理していて非効率だと感じたため、自分自身の課題を解決するアプリを作りました。実際に毎日使っているので、使いやすさを意識した設計ができたと思います。' }
    ]
  };

  // Phase詳細の面談質問セクションに比較UIを追加
  var phaseObs = new MutationObserver(function(muts) {
    if (!muts.some(function(m){ return m.addedNodes.length>0; })) return;
    var root = document.querySelector('#phase-detail-root');
    if (!root || root.querySelector('.interview-examples-added')) return;
    var numEl = root.querySelector('.dh-num');
    if (!numEl) return;
    var phNum = parseInt(numEl.textContent.trim(), 10);
    var PHASES = window.PHASES || [];
    var ph = PHASES.find(function(p){ return p.num===phNum; });
    if (!ph) return;
    var examples = INTERVIEW_EXAMPLES[ph.id];
    if (!examples || !examples.length) return;

    // 面談質問リストを見つける
    var iqList = root.querySelector('.interview-q-list');
    if (!iqList || iqList.parentNode.querySelector('.interview-examples-added')) return;

    var div = document.createElement('div');
    div.className = 'interview-examples-added';
    var html = '<h4 style="margin-top:16px;color:var(--ink-2)">良い回答 vs 悪い回答の例</h4>';
    examples.forEach(function(ex) {
      html += '<div style="margin-bottom:14px">';
      html += '<p style="font-size:.88rem;font-weight:600;color:var(--ink-1);margin-bottom:8px">Q: '+_esc(ex.q)+'</p>';
      html += '<div class="interview-compare">';
      html += '<div class="interview-ng"><div class="ic-label">❌ NG回答</div><p>'+_esc(ex.ng)+'</p><p class="ic-reason">→ '+_esc(ex.ngReason)+'</p></div>';
      html += '<div class="interview-ok"><div class="ic-label">OK回答</div><p>'+_esc(ex.ok)+'</p></div>';
      html += '</div></div>';
    });
    div.innerHTML = html;
    iqList.parentNode.appendChild(div);
  });

  document.addEventListener('DOMContentLoaded', function() {
    var pRoot = document.querySelector('#phase-detail-root');
    if (pRoot) phaseObs.observe(pRoot, {childList:true, subtree:false});

    // NextAction セクション（Lesson詳細）
    var lRoot = document.querySelector('#lesson-detail-root');
    if (!lRoot) return;
    var lObs = new MutationObserver(function(muts) {
      if (!muts.some(function(m){ return m.addedNodes.length>0; })) return;
      setTimeout(function(){ injectNextAction(lRoot); }, 300);
    });
    lObs.observe(lRoot, {childList:true, subtree:false});
  });

  function injectNextAction(root) {
    if (!root || root.querySelector('.next-action-section')) return;
    var navAct = root.querySelector('.lesson-nav-actions');
    if (!navAct) return;
    // 現在のLesson IDを取得
    var h1 = root.querySelector('h1');
    if (!h1) return;
    var defaultActions = [
      'このコードを実際に動かして出力を確認する',
      '変数名・値を変えて動作の変化を観察する',
      'Hokuに「このレッスンで学んだことを初心者に説明してください」と依頼して理解を深める',
      '次のレッスンに進む前にスキルチェックに挑戦する'
    ];
    var div = document.createElement('div');
    div.className = 'next-action-section';
    var html = '<h3>次にやること</h3>';
    html += '<ul class="next-action-list">';
    defaultActions.forEach(function(a){ html += '<li>'+_esc(a)+'</li>'; });
    html += '</ul>';
    div.innerHTML = html;
    navAct.parentNode.insertBefore(div, navAct);
  }
})();


(function() {
  // Phase カードに進捗バーを追加
  var origRenderPhaseList = null;
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function(){
      // Phase グリッドのMutationObserverで進捗バーを追加
      var grid = document.querySelector('#phase-grid');
      if (!grid) return;
      var obs = new MutationObserver(function() {
        addProgressBars();
      });
      obs.observe(grid, {childList:true, subtree:false});
      try { addProgressBars(); } catch(e) { if(window.console) console.warn('[FCC-prog]', e && e.message); }
    }, 600);
  });

  function addProgressBars() {
    var PHASES = window.PHASES || [];
    var doneL = [];
    try { doneL = _storage.get('fcc_done_lessons', []); } catch(e){}
    var CHAPTERS = window.CHAPTERS || {};

    Array.from(document.querySelectorAll('.phase-card:not([data-prog-added])')).forEach(function(card, i) {
      card.dataset.progAdded = '1';
      var ph = PHASES[i];
      if (!ph) return;
      var totalL = 0, doneCount = 0;
      (ph.chapters||[]).forEach(function(cid) {
        var ch = CHAPTERS[cid];
        if (!ch) return;
        totalL += (ch.lessons||[]).length;
        doneCount += (ch.lessons||[]).filter(function(lid){ return doneL.includes(lid); }).length;
      });
      if (totalL === 0) return;
      var pct = Math.round(doneCount / totalL * 100);
      var wrap = document.createElement('div');
      wrap.className = 'phase-progress-bar-wrap';
      wrap.innerHTML = '<div class="phase-progress-bar"><div class="phase-progress-fill" style="width:'+pct+'%"></div></div>'+
                       '<div class="phase-progress-text">'+doneCount+'/'+totalL+' Lesson ('+pct+'%)</div>';
      card.appendChild(wrap);
      // categoryをdata属性で設定（CSSのカラーストリップ用）
      if (ph.category) card.setAttribute('data-cat', ph.category);
    });
  }

  // 今週の学習サマリーをホームに追加
  document.addEventListener('DOMContentLoaded', function() {
    _safeTimeout(function(){
      var statsBar = document.querySelector('.hero-stats-bar');
      if (!statsBar) return;
      try {
        var doneL = _storage.get('fcc_done_lessons', []);
        var doneP = _storage.get('fcc_done_phases', []);
        // 週次レッスン数（7日以内の完了ログ）
        var weekLog = _storage.get('fcc_week_log', []);
        var now = Date.now();
        var weekCount = weekLog.filter(function(t){ return now - t < 7*24*3600*1000; }).length;
        // 統計バーを更新
        var nums = statsBar.querySelectorAll('.hero-stat-num');
        var labels = statsBar.querySelectorAll('.hero-stat-label');
        if (nums[0]) { nums[0].textContent = doneL.length; labels[0].textContent = '完了Lesson'; }
        if (nums[1]) { nums[1].textContent = doneP.length; labels[1].textContent = '完了Phase'; }
        if (nums[2]) { nums[2].textContent = weekCount; labels[2].textContent = '今週の学習数'; }
      } catch(e) {}
    }, 800);
  });
})();

/* ── Phase 12 アプリ README 充実版 ── */
(function() {
  var README_FULL = {
    'app-task': [
      '# タスク管理アプリ（Hoku Tech 卒業制作）',
      '',
      '## 🚀 デモURL',
      '- **Frontend**: https://your-app.vercel.app',
      '- **API**: https://your-api.onrender.com/api/tasks',
      '',
      '## 📋 アプリ概要',
      'CRUD操作・優先度管理・キーワード検索を備えたタスク管理Webアプリ。',
      'Next.js + Spring Boot + MySQLのフルスタック構成で実装しました。',
      '',
      '## 🛠 技術スタック',
      '| 領域 | 技術 |',
      '|------|------|',
      '| Frontend | Next.js 14 / TypeScript / Tailwind CSS |',
      '| Backend | Spring Boot 3.x / Java 17 |',
      '| Database | MySQL 8 (Render) |',
      '| Deploy | Vercel (Front) + Render (Back) |',
      '',
      '## 🗄 ER図',
      '```mermaid',
      'erDiagram',
      '  users {',
      '    bigint id PK',
      '    varchar name',
      '    varchar email UK',
      '    timestamp created_at',
      '  }',
      '  tasks {',
      '    bigint id PK',
      '    bigint user_id FK',
      '    varchar title',
      '    enum priority',
      '    boolean done',
      '    date due_date',
      '    timestamp created_at',
      '  }',
      '  users ||--o{ tasks : "has"',
      '```',
      '',
      '## 🌐 API一覧',
      '| Method | Path | 説明 |',
      '|--------|------|------|',
      '| GET | /api/tasks | 一覧取得（フィルタ対応） |',
      '| POST | /api/tasks | タスク作成 |',
      '| PUT | /api/tasks/:id | タスク更新 |',
      '| DELETE | /api/tasks/:id | タスク削除 |',
      '',
      '```bash',
      '# 一覧取得（curl例）',
      'curl https://your-api.onrender.com/api/tasks',
      '# タスク作成',
      'curl -X POST https://your-api.onrender.com/api/tasks \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'{"title":"HTML学習","priority":"HIGH"}\'',
      '```',
      '',
      '##  ローカル起動',
      '```bash',
      '# Backend',
      'cd backend',
      'cp .env.example .env  # DB設定を記入',
      './mvnw spring-boot:run',
      '',
      '# Frontend',
      'cd frontend',
      'cp .env.local.example .env.local  # API URLを設定',
      'npm install && npm run dev',
      '```',
      '',
      '## 🔐 環境変数',
      '```env',
      '# backend/.env',
      'DB_HOST=localhost',
      'DB_PORT=3306',
      'DB_NAME=taskdb',
      'DB_USER=root',
      'DB_PASSWORD=your_password',
      '',
      '# frontend/.env.local',
      'NEXT_PUBLIC_API_URL=http://localhost:8080',
      '```',
      '',
      '## 🤖 AI利用について',
      '詳細は [AI-USAGE.md](./AI-USAGE.md) を参照。',
      'AIを活用した箇所・採用/修正/却下の判断理由を記録しています。'
    ].join('\\n'),
    'app-ai-support': [
      '# AIチャット付き業務支援アプリ',
      '',
      '## ⚠️ 注意',
      'APIキーの利用にコストが発生します。デモ環境には使用量上限を設定しています。',
      '',
      '## 🚀 デモURL',
      '- **Frontend**: https://your-ai-app.vercel.app',
      '- **API**: https://your-ai-api.onrender.com',
      '',
      '## 📋 アプリ概要',
      'OpenAI GPT-4またはClaude APIを使ったAIチャット機能と、',
      '問い合わせ返信ドラフト自動生成を持つ業務支援Webアプリ。',
      '',
      '## 🛠 技術スタック',
      '| 領域 | 技術 |',
      '|------|------|',
      '| Frontend | Next.js 14 / TypeScript |',
      '| Backend | Spring Boot 3.x / Java 17 |',
      '| Database | MySQL 8 |',
      '| AI | OpenAI API (gpt-4o) |',
      '| Deploy | Vercel + Render |',
      '',
      '## 🗄 ER図',
      '```mermaid',
      'erDiagram',
      '  chat_sessions {',
      '    bigint id PK',
      '    bigint user_id FK',
      '    varchar title',
      '    timestamp created_at',
      '  }',
      '  chat_messages {',
      '    bigint id PK',
      '    bigint session_id FK',
      '    enum role',
      '    text content',
      '    int token_count',
      '    timestamp created_at',
      '  }',
      '  chat_sessions ||--o{ chat_messages : "contains"',
      '```',
      '',
      '## 🌐 主要API',
      '```bash',
      '# AIにメッセージ送信',
      'curl -X POST https://your-api.onrender.com/api/chat/message \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'{"sessionId":1,"message":"Javaの例外処理を教えてください"}\'',
      '```',
      '',
      '## 🔐 環境変数',
      '```env',
      '# backend/.env',
      'OPENAI_API_KEY=sk-xxxx  # 絶対にGitHubにpushしない',
      'DB_URL=jdbc:mysql://localhost:3306/aidb',
      '',
      '# frontend/.env.local',
      'NEXT_PUBLIC_API_URL=http://localhost:8080',
      '```',
      '',
      '## 🤖 AI利用について',
      '詳細は [AI-USAGE.md](./AI-USAGE.md) を参照。',
      'APIキー・個人情報はプロンプトに含めていません。'
    ].join('\\n')
  };

  // P12_APPSのreadmeExampleを上書き
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var apps = window.P12_APPS || [];
      apps.forEach(function(app) {
        if (README_FULL[app.id]) {
          app.readmeExample = README_FULL[app.id];
        }
      });
    }, 200);
  });
})();

/* ── 拡張用語集＋エラー集レンダリング ── */
(function() {
  function esc(s){ if(s==null)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  function renderExtraGlossary() {
    var glossRoot = document.querySelector('#glossary-root');
    if (!glossRoot) return;
    if (glossRoot.querySelector('.extra-glossary-done')) return;

    var EXTRA = window.GLOSSARY_EXTRA_TERMS || [];
    if (!EXTRA.length) return;

    var div = document.createElement('div');
    div.className = 'extra-glossary-done';
    div.style.marginTop = '28px';

    // カテゴリ別にグループ化
    var cats = {};
    EXTRA.forEach(function(t){ cats[t.cat] = cats[t.cat]||[]; cats[t.cat].push(t); });

    var html = '<h2 style="font-size:1.1rem;margin-bottom:16px">追加用語集（20語）</h2>';

    // カテゴリフィルター
    html += '<div class="glossary-nav" style="margin-bottom:14px"><button class="glossary-nav-btn active" data-cat="all">すべて</button>';
    Object.keys(cats).forEach(function(cat){ html += '<button class="glossary-nav-btn" data-cat="'+_esc(cat)+'">'+_esc(cat)+'</button>'; });
    html += '</div>';

    html += '<div class="extra-terms-grid">';
    EXTRA.forEach(function(t) {
      html += '<div class="term-card extra-term-card" data-cat="'+_esc(t.cat)+'">';
      html += '<div class="extra-term-header"><dt>'+_esc(t.term)+'</dt>';
      html += '<span class="extra-term-cat">'+_esc(t.cat)+'</span></div>';
      html += '<div class="extra-term-short">'+_esc(t.short)+'</div>';
      html += '<dd>'+_esc(t.meaning)+'</dd>';
      html += '</div>';
    });
    html += '</div>';

    div.innerHTML = html;
    glossRoot.appendChild(div);

    // フィルター
    Array.from(div.querySelectorAll('.glossary-nav-btn')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        Array.from(div.querySelectorAll('.glossary-nav-btn')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var cat = this.dataset.cat;
        Array.from(div.querySelectorAll('.extra-term-card')).forEach(function(c){
          c.style.display = (cat==='all' || c.dataset.cat===cat) ? '' : 'none';
        });
      });
    });
  }

  function renderErrorList() {
    var root = document.querySelector('#error-list-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';

    var ERRS = window.GLOSSARY_ERRORS || [];
    if (!ERRS.length) { root.innerHTML = '<p class="empty-msg">エラー集データを読み込み中…</p>'; return; }

    var phases = _unique(ERRS.map(function(e){ return e.phase; }));

    var html = '<div class="sc-filter-bar">';
    html += '<button class="sc-filter-btn active" data-ph="all">すべて（'+ERRS.length+'件）</button>';
    phases.forEach(function(p){ html += '<button class="sc-filter-btn" data-ph="'+_esc(p)+'">'+_esc(p)+'</button>'; });
    html += '</div><div class="error-cards-grid">';

    ERRS.forEach(function(e) {
      html += '<div class="error-item-card" data-ph="'+_esc(e.phase)+'">';
      html += '<div class="eic-header">';
      html += '<span class="eic-code">'+_esc(e.code)+'</span>';
      html += '<span class="eic-phase">'+_esc(e.phase)+'</span>';
      html += '</div>';
      if (e.msg) html += '<div class="eic-msg"><code>'+_esc(e.msg)+'</code></div>';
      html += '<div class="eic-body">';
      html += '<div class="eic-cause"><strong>🔍 原因</strong>：'+_esc(e.cause)+'</div>';
      html += '<div class="eic-fix"><strong>解決策</strong>：'+_esc(e.fix)+'</div>';
      html += '</div></div>';
    });
    html += '</div>';

    root.innerHTML = html;

    Array.from(root.querySelectorAll('.sc-filter-btn')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        Array.from(root.querySelectorAll('.sc-filter-btn')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var ph = this.dataset.ph;
        Array.from(root.querySelectorAll('.error-item-card')).forEach(function(c){
          c.style.display = (ph==='all' || c.dataset.ph===ph) ? '' : 'none';
        });
      });
    });
  }

  // MutationObserverでGlossaryページ表示時に発火
  document.addEventListener('DOMContentLoaded', function() {
    var obs = new MutationObserver(function() {
      var secGloss = document.querySelector('#sec-glossary');
      var secErr = document.querySelector('#sec-error-list');
      if (secGloss && secGloss.classList.contains('active')) renderExtraGlossary();
      if (secErr && secErr.classList.contains('active')) renderErrorList();
    });
    obs.observe(document.body, {subtree:false, attributes:true, attributeFilter:['class']});
    // クリックでも発火
    document.addEventListener('click', function(e) {
      var v = e.target.closest('[data-view]');
      if (!v) return;
      if (v.dataset.view === 'glossary') setTimeout(renderExtraGlossary, 300);
      if (v.dataset.view === 'error-list') setTimeout(renderErrorList, 300);
    });
  });
})();

/* ── NextAction + エラー集 修正パッチ ── */
(function() {
  function esc(s){ if(s==null)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  // NextAction を確実に注入（クリックベース）
  document.addEventListener('click', function(e) {
    var lRow = e.target.closest('.lesson-row');
    if (!lRow) return;
    setTimeout(function() {
      var root = document.querySelector('#lesson-detail-root');
      if (!root || root.querySelector('.next-action-section')) return;
      var navAct = root.querySelector('.lesson-nav-actions');
      if (!navAct) return;
      var actions = [
        'このコードを実際に動かして出力を確認する',
        '変数名・値を変えて何が変わるか観察する',
        'Hokuに「このレッスンで学んだことを初心者向けに説明してください」と依頼してフィードバックをもらう',
        '次のレッスンのスキルチェック問題に挑戦する'
      ];
      var div = document.createElement('div');
      div.className = 'next-action-section';
      div.innerHTML = '<h3>次にやること</h3><ul class="next-action-list">'+
        actions.map(function(a){ return '<li>'+_esc(a)+'</li>'; }).join('')+
        '</ul>';
      navAct.parentNode.insertBefore(div, navAct);
    }, 500);
  });

  // エラー集を確実にレンダリング
  window._renderErrorListNow = function() {
    var root = document.querySelector('#error-list-root');
    if (!root) return;
    root.removeAttribute('data-rendered');

    var ERRS = window.GLOSSARY_ERRORS || [];
    if (!ERRS.length) { root.innerHTML = '<p class="empty-msg">エラー集データを読み込み中…</p>'; return; }

    var phases = [];
    ERRS.forEach(function(e){ if(!phases.includes(e.phase)) phases.push(e.phase); });

    var html = '<div class="sc-filter-bar">';
    html += '<button class="sc-filter-btn active" data-ph="all">すべて（'+ERRS.length+'件）</button>';
    phases.forEach(function(p){ html += '<button class="sc-filter-btn" data-ph="'+_esc(p)+'">'+_esc(p)+'</button>'; });
    html += '</div><div class="error-cards-grid">';

    ERRS.forEach(function(e) {
      html += '<div class="error-item-card" data-ph="'+_esc(e.phase)+'">';
      html += '<div class="eic-header"><span class="eic-code">'+_esc(e.code)+'</span><span class="eic-phase">'+_esc(e.phase)+'</span></div>';
      if (e.msg) html += '<div class="eic-msg"><code>'+_esc(e.msg)+'</code></div>';
      html += '<div class="eic-body">';
      html += '<div class="eic-cause"><strong>🔍 原因</strong>：'+_esc(e.cause)+'</div>';
      html += '<div class="eic-fix"><strong>解決策</strong>：'+_esc(e.fix)+'</div>';
      html += '</div></div>';
    });
    html += '</div>';
    root.innerHTML = html;
    root.dataset.rendered = '1';

    Array.from(root.querySelectorAll('.sc-filter-btn')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        Array.from(root.querySelectorAll('.sc-filter-btn')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var ph = this.dataset.ph;
        Array.from(root.querySelectorAll('.error-item-card')).forEach(function(c){
          c.style.display = (ph==='all' || c.dataset.ph===ph) ? '' : 'none';
        });
      });
    });
  };

  // ナビクリックでエラー集を表示
  document.addEventListener('click', function(e) {
    var item = e.target.closest('[data-view="error-list"]');
    if (item) setTimeout(window._renderErrorListNow, 300);
  });

  // hashchange対応
  window.addEventListener('hashchange', function() {
    if (location.hash.includes('error-list')) setTimeout(window._renderErrorListNow, 300);
  });
})();

/* ── Lesson詳細に関連図解を注入 ── */
(function() {
  // レッスンIDと図解IDのマッピング
  var LESSON_DIAGRAM_MAP = {
    // Phase 1: IT基礎
    'c01': 'webApp3Layer',
    // Phase 1の HTTP関連
    'l01-2': 'httpFlow', 'l01-3': 'httpFlow',
    // Phase 5: React
    'c05': 'reactComponents',
    // Phase 6: Next.js
    'c06': 'nextjsAppRouter',
    // Phase 7: Java
    'l07-3': 'springBoot3Layer', 'l07-4': 'springBoot3Layer',
    // Phase 8: DB/SQL
    'c08': 'erDiagram',
    // Phase 9: Spring Boot
    'l09-2': 'springBoot3Layer', 'l09-3': 'springBoot3Layer',
    // Phase 11: AI開発
    'c11': 'aiDevFlow',
    // Phase 12: フルスタック
    'c12': 'fullStackArch',
  };

  function getDiagramForLesson(lessonId) {
    if (!lessonId) return null;
    var D = window.DIAGRAMS || {};
    // 完全一致
    if (D[LESSON_DIAGRAM_MAP[lessonId]]) return D[LESSON_DIAGRAM_MAP[lessonId]];
    // チャプター前半（例: l05-2-1 → c05 → l05）
    var chapterPrefix = lessonId.replace(/-\d+-\d+$/, '').replace('l', 'c');
    if (D[LESSON_DIAGRAM_MAP[chapterPrefix]]) return D[LESSON_DIAGRAM_MAP[chapterPrefix]];
    // さらに短く（l05-2）
    var shortPrefix = lessonId.replace(/-\d+$/, '');
    if (D[LESSON_DIAGRAM_MAP[shortPrefix]]) return D[LESSON_DIAGRAM_MAP[shortPrefix]];
    return null;
  }

  // Lesson詳細のMutationObserver
  document.addEventListener('DOMContentLoaded', function() {
    var lRoot = document.querySelector('#lesson-detail-root');
    if (!lRoot) return;
    var obs = new MutationObserver(function(muts) {
      if (!muts.some(function(m){ return m.addedNodes.length>0; })) return;
      setTimeout(function() {
        if (lRoot.querySelector('.lesson-diagram-injected')) return;
        var h1 = lRoot.querySelector('h1');
        if (!h1) return;
        // 現在のlessonIDを取得（hash）
        var hash = location.hash;
        var m = hash.match(/lesson-detail:([^:]+)/);
        if (!m) return;
        var lid = m[1];
        var diagHtml = getDiagramForLesson(lid);
        if (!diagHtml) return;
        // コードセクションの前に挿入
        var codeSection = lRoot.querySelector('.code-section, .steps-section, .terms-section');
        if (!codeSection) return;
        var div = document.createElement('div');
        div.className = 'lesson-diagram-injected lesson-section';
        div.innerHTML = '<h3 class="ls-h3">関連図解</h3><div class="diagram-in-lesson">'+diagHtml+'</div>';
        codeSection.parentNode.insertBefore(div, codeSection);
      }, 200);
    });
    obs.observe(lRoot, {childList:true, subtree:false});
  });
})();

/* ── ホームstatsバー更新 ── */
(function() {
  function updateHomeStats() {
    try {
      var doneL = _storage.get('fcc_done_lessons', []);
      var doneP = _storage.get('fcc_done_phases', []);
    } catch(e) { var doneL=[]; var doneP=[]; }
    var sl = document.querySelector('#stat-lessons');
    var sp = document.querySelector('#stat-phases');
    if (sl) sl.textContent = doneL.length;
    if (sp) sp.textContent = doneP.length;
  }
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateHomeStats, 600);
  });
  window.addEventListener('storage', updateHomeStats);
})();

/* ── Lesson図解インジェクター修正版 ── */
(function() {
  var DIAG_MAP = {
    p01: 'webApp3Layer', p05: 'reactComponents',
    p06: 'nextjsAppRouter', p07: 'springBoot3Layer',
    p08: 'erDiagram', p09: 'springBoot3Layer',
    p11: 'aiDevFlow', p12: 'fullStackArch'
  };

  function injectLessonDiagram(root) {
    if (!root || root.querySelector('.lesson-diagram-injected')) return;
    if (!root.querySelector('h1')) return;
    // HashからPhase情報を取得
    var hash = location.hash;
    // hash例: #lesson-detail:l09-2-1 または #phase:p09:chapter:c09-2:lesson:l09-2-1
    var phaseId = null;
    var m = hash.match(/l(\d{2})-/);
    if (m) phaseId = 'p' + m[1];
    if (!phaseId) return;
    var D = window.DIAGRAMS || {};
    var diagKey = DIAG_MAP[phaseId];
    if (!diagKey || !D[diagKey]) return;
    // 挿入場所: コードセクション前 or 用語セクション前
    var target = root.querySelector('.code-section, .steps-section, .terms-section, .lesson-section');
    if (!target) {
      // フォールバック：h1の直後
      var h1 = root.querySelector('h1');
      target = h1 ? h1.nextElementSibling : null;
    }
    if (!target) return;
    var div = document.createElement('div');
    div.className = 'lesson-diagram-injected lesson-section';
    div.innerHTML = '<h3 class="ls-h3">Phase '+phaseId.replace('p','')+' 全体像</h3><div class="diagram-in-lesson">'+D[diagKey]+'</div>';
    target.parentNode.insertBefore(div, target);
  }

  document.addEventListener('DOMContentLoaded', function() {
    var lRoot = document.querySelector('#lesson-detail-root');
    if (!lRoot) return;
    var obs = new MutationObserver(function(muts) {
      if (!muts.some(function(m){ return m.addedNodes.length > 0; })) return;
      setTimeout(function(){ injectLessonDiagram(lRoot); }, 300);
    });
    obs.observe(lRoot, {childList: true, subtree: false});
  });
})();

/* ── 用語集表示修正: クリック時に即時レンダリング ── */
(function() {
  function esc(s){ if(s==null)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  window._renderExtraGlossaryNow = function() {
    var EXTRA = window.GLOSSARY_EXTRA_TERMS || [];
    if (!EXTRA.length) return;
    var glossRoot = document.querySelector('#glossary-root');
    if (!glossRoot) return;
    if (glossRoot.querySelector('.extra-glossary-done2')) return;
    var cats = {};
    EXTRA.forEach(function(t){ cats[t.cat]=cats[t.cat]||[]; cats[t.cat].push(t); });
    var html = '<div class="extra-glossary-done2" style="margin-top:24px">';
    html += '<h2 style="font-size:1.1rem;margin-bottom:12px">追加用語集（'+EXTRA.length+'語）</h2>';
    html += '<div class="glossary-nav" style="margin-bottom:12px"><button class="gn-btn active" data-cat="all">すべて</button>';
    Object.keys(cats).forEach(function(c){ html += '<button class="gn-btn" data-cat="'+_esc(c)+'">'+_esc(c)+'</button>'; });
    html += '</div><div class="extra-terms-grid">';
    EXTRA.forEach(function(t){
      html += '<div class="term-card extra-term-card" data-cat="'+_esc(t.cat)+'">';
      html += '<div class="extra-term-header"><dt>'+_esc(t.term)+'</dt><span class="extra-term-cat">'+_esc(t.cat)+'</span></div>';
      html += '<div class="extra-term-short">'+_esc(t.short)+'</div><dd>'+_esc(t.meaning)+'</dd></div>';
    });
    html += '</div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    var inner = div.firstChild;
    glossRoot.appendChild(inner);
    Array.from(inner.querySelectorAll('.gn-btn')).forEach(function(btn){
      btn.addEventListener('click', function(){
        Array.from(inner.querySelectorAll('.gn-btn')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var cat = this.dataset.cat;
        Array.from(inner.querySelectorAll('.extra-term-card')).forEach(function(c){
          c.style.display = (cat==='all'||c.dataset.cat===cat)?'':'none';
        });
      });
    });
  };

  document.addEventListener('click', function(e) {
    var v = e.target.closest('[data-view]');
    if (v && v.dataset.view === 'glossary') {
      setTimeout(window._renderExtraGlossaryNow, 400);
    }
  });
})();
/* ═══════════════════════════════════════════════════════
   Hoku MENTOR — Familink風 相棒型AIメンター レンダリング
   追記パッチ方式
   ═══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  function hesc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  /* ── テンプレートアイコンマップ ── */
  var TPL_ICONS = {
    error:'E', screenshot:'S', code:'C', task:'T', readme:'R',
    interview:'I', report:'D', github:'G',
  };

  /* ── テンプレートコピー ── */
  function setupHokuCopy(root) {
    if (!root) return;
    Array.from(root.querySelectorAll('[data-hoku-copy]')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tplId = this.dataset.hokuCopy;
        var H = window.Hoku_MENTOR || {};
        var tpl = (H.templates || []).find(function(t){ return t.id === tplId; });
        if (!tpl) return;
        try {
          navigator.clipboard.writeText(tpl.body).then(function() {
            btn.textContent = '✓ Copied';
            btn.classList.add('copied');
            setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
          }).catch(function(){ fallbackCopy(tpl.body, btn); });
        } catch(e) { fallbackCopy(tpl.body, btn); }
      });
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.textContent = '✓ Copied';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    } catch(e) {}
    document.body.removeChild(ta);
  }

  /* ── テンプレートモーダル ── */
  function openHokuModal(tpl) {
    var existing = document.getElementById('hoku-modal-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'hoku-modal-overlay';
    overlay.className = 'hoku-modal-overlay';

    overlay.innerHTML = '<div class="hoku-modal">' +
      '<div class="hoku-modal-head">' +
        '<h3>' + hesc(tpl.title) + '</h3>' +
        '<button class="hoku-modal-close" id="hoku-modal-close-btn">×</button>' +
      '</div>' +
      '<div class="hoku-modal-body">' +
        '<p class="hoku-modal-desc">' + hesc(tpl.desc) + '</p>' +
        '<pre class="hoku-modal-template">' + hesc(tpl.body) + '</pre>' +
        '<div class="hoku-modal-actions">' +
          '<button class="hoku-modal-copy-btn" id="hoku-modal-copy">Claudeにコピーして相談する</button>' +
        '</div>' +
        '<p style="font-size:.75rem;color:#64748b;margin-top:10px;">コピーしてClaude/Hokuに貼り付けて相談してください。個人情報・APIキーは送らないこと。</p>' +
      '</div>' +
    '</div>';

    document.body.appendChild(overlay);

    document.getElementById('hoku-modal-close-btn').addEventListener('click', function() {
      overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.getElementById('hoku-modal-copy').addEventListener('click', function() {
      var btn = this;
      try {
        navigator.clipboard.writeText(tpl.body).then(function() {
          btn.textContent = '✓ コピーしました';
          btn.classList.add('copied');
          setTimeout(function(){ btn.textContent = 'Claudeにコピーして相談する'; btn.classList.remove('copied'); }, 2500);
        }).catch(function(){ fallbackCopy(tpl.body, btn); });
      } catch(e) { fallbackCopy(tpl.body, btn); }
    });
  }

  /* ── ホームHoku紹介 ── */
  function renderHokuHomeSection() {
    try {
    var root = document.getElementById('hoku-home-section');
    if (!root) return;
    var H = window.Hoku_MENTOR;
    if (!H) return;

    var chips = (H.canHelp || []).slice(0,6).map(function(c) {
      return '<span class="hoku-home-chip">' + hesc(c.label) + '</span>';
    }).join('');

    root.innerHTML = '<div class="hoku-home-section">' +
      '<div class="hoku-home-top">' +
        '<div class="hoku-home-avatar">H</div>' +
        '<div class="hoku-home-top-text">' +
          '<h3>Hokuが、学習の相棒になります</h3>' +
          '<p>つまずいた時に、一緒に状況を整理してくれるAI学習メンター</p>' +
        '</div>' +
      '</div>' +
      '<div class="hoku-intro-bubble">' +
        'こんにちは、Hokuです。<br>' +
        'このカリキュラムでは、あなたが「AIに丸投げする人」ではなく、「AIを活用して自分の言葉で説明できるエンジニア」になることを支援します。<br>' +
        'エラー文、コード、スクリーンショット、課題の進め方で迷ったら、まず状況を一緒に整理しよう。' +
      '</div>' +
      '<div style="margin-bottom:14px"><p style="font-size:.78rem;color:#64748b;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">相談できること</p>' +
        '<div class="hoku-home-chips">' + chips + '</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-sm" onclick="document.querySelector(\'[data-view=hoku]\').click()">Hoku活用ガイドを見る →</button>' +
    '</div>';
  } catch(e) {}
  }

  /* ── Hokuページ全体 ── */
  function renderHokuPage() {
    var root = document.getElementById('hoku-page-root');
    if (!root || root.dataset.rendered) return;
    root.dataset.rendered = '1';

    var H = window.Hoku_MENTOR;
    if (!H) { root.innerHTML = '<p>Hokuデータを読み込み中...</p>'; return; }

    var html = '';

    /* ── 1. Hokuとは ── */
    html += '<div class="hoku-page-intro">' +
      '<div class="hoku-avatar">H</div>' +
      '<div class="hoku-intro-body">' +
        '<h1>Hoku — 学習の相棒</h1>' +
        '<p>' + hesc(H.description) + '</p>' +
        '<span class="hoku-intro-note">' + hesc(H.note) + '</span>' +
      '</div>' +
    '</div>';

    /* ── 2. サンプル会話 ── */
    html += '<h2 style="margin-bottom:12px">こんな相談ができる</h2>';
    html += '<div class="hoku-demo-panel">';
    html += '<div class="hoku-demo-tabs">';
    var demoLabels = ['エラー相談', 'コード解説', '課題の進め方', 'AI丸投げ防止'];
    demoLabels.forEach(function(lbl, i) {
      html += '<button class="hoku-demo-tab' + (i===0?' active':'') + '" data-demo-idx="' + i + '">' + lbl + '</button>';
    });
    html += '</div>';
    var demos = H.sampleMessages || [];
    demos.forEach(function(demo, idx) {
      html += '<div class="hoku-chat' + (idx===0 ? '' : ' hoku-demo-hidden') + '" id="hoku-demo-' + idx + '">';
      (demo.messages || []).forEach(function(msg) {
        if (msg.from === 'hoku') {
          html += '<div class="hoku-message">' +
            '<div class="hoku-avatar-sm">H</div>' +
            '<div><div class="hoku-sender">Hoku</div><div class="hoku-bubble">' + hesc(msg.text) + '</div></div>' +
          '</div>';
        } else {
          html += '<div class="hoku-message user">' +
            '<div><div class="hoku-bubble hoku-user-bubble">' + hesc(msg.text) + '</div></div>' +
          '</div>';
        }
      });
      html += '</div>';
    });
    html += '</div>';

    /* ── 3. 役割分担 ── */
    html += '<h2 style="margin-top:28px;margin-bottom:12px">Hokuと人間講師の役割分担</h2>';
    html += '<div class="hoku-role-grid">' +
      '<div class="hoku-role-card hoku-side">' +
        '<h4>Hoku（AI相棒）が担う</h4>' +
        '<ul class="hoku-role-list">' +
          (H.roles.hoku || []).map(function(r){ return '<li>' + hesc(r) + '</li>'; }).join('') +
        '</ul>' +
      '</div>' +
      '<div class="hoku-role-card instructor-side">' +
        '<h4>人間講師が担う</h4>' +
        '<ul class="hoku-role-list">' +
          (H.roles.instructor || []).map(function(r){ return '<li>' + hesc(r) + '</li>'; }).join('') +
        '</ul>' +
      '</div>' +
    '</div>';

    /* ── 4. できること ── */
    html += '<h2 style="margin-top:28px;margin-bottom:12px">Hokuに相談できること</h2>';
    html += '<div class="hoku-can-grid">';
    (H.canHelp || []).forEach(function(c) {
      html += '<div class="hoku-can-item">' +
        '<h4>' + hesc(c.label) + '</h4>' +
        '<p>' + hesc(c.desc) + '</p>' +
      '</div>';
    });
    html += '</div>';

    /* ── 5. できないこと ── */
    html += '<h2 style="margin-top:28px;margin-bottom:12px">Hokuに相談してはいけないこと</h2>';
    html += '<ul class="hoku-cannot-list">';
    (H.cannotHelp || []).forEach(function(c) {
      html += '<li>' + hesc(c) + '</li>';
    });
    html += '</ul>';

    /* ── 6. 利用ルール ── */
    html += '<h2 style="margin-top:28px;margin-bottom:12px">Hokuを使う基本ルール</h2>';
    html += '<ul class="hoku-rule-list">';
    (H.rules || []).forEach(function(r) {
      html += '<li>' + hesc(r) + '</li>';
    });
    html += '</ul>';
    html += '<div class="hoku-warning"><strong>AI丸投げは逆効果</strong>Hokuが課題の完成コードを出しても、自分の言葉で説明できなければ面談を通過できません。Hokuは「考え方の整理」と「進め方のアドバイス」のために使いましょう。</div>';

    /* ── 7. テンプレート ── */
    html += '<h2 style="margin-top:28px;margin-bottom:12px">Hoku質問テンプレート</h2>';
    html += '<p style="font-size:.87rem;color:#475569;margin-bottom:14px;">以下のテンプレートをコピーして、Claude または Hoku に貼り付けて相談してください。</p>';
    html += '<div class="hoku-template-grid" id="hoku-template-grid">';
    (H.templates || []).forEach(function(tpl) {
      var icon = TPL_ICONS[tpl.id] || tpl.id.slice(0,1).toUpperCase();
      html += '<div class="hoku-template-mini" data-hoku-tpl-id="' + hesc(tpl.id) + '">' +
        '<div class="hoku-template-icon">' + icon + '</div>' +
        '<h4>' + hesc(tpl.title) + '</h4>' +
        '<p>' + hesc(tpl.desc) + '</p>' +
      '</div>';
    });
    html += '</div>';

    root.innerHTML = html;

    /* ── イベント設定 ── */
    /* デモタブ */
    Array.from(root.querySelectorAll('.hoku-demo-tab')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        Array.from(root.querySelectorAll('.hoku-demo-tab')).forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var idx = parseInt(this.dataset.demoIdx, 10);
        Array.from(root.querySelectorAll('.hoku-chat')).forEach(function(el, i) {
          el.style.display = (i === idx) ? '' : 'none';
        });
      });
    });
    /* 初期非表示 */
    Array.from(root.querySelectorAll('.hoku-chat')).forEach(function(el, i) {
      if (i > 0) el.style.display = 'none';
    });

    /* テンプレートクリック → モーダル */
    var tplGrid = document.getElementById('hoku-template-grid');
    if (tplGrid) {
      tplGrid.addEventListener('click', function(e) {
        var mini = e.target.closest('.hoku-template-mini');
        if (!mini) return;
        var tplId = mini.dataset.hokuTplId;
        var H = window.Hoku_MENTOR || {};
        var tpl = (H.templates || []).find(function(t){ return t.id === tplId; });
        if (tpl) openHokuModal(tpl);
      });
    }
  }

  /* ── Phase詳細にHoku相談ボックスを注入 ── */
  function injectHokuPhaseConsult(phaseId, root) {
    if (!root || root.querySelector('.hoku-consult-box')) return;
    var H = window.Hoku_MENTOR || {};
    var advice = (H.phaseAdvice || {})[phaseId];
    if (!advice) return;

    var html = '<div class="hoku-consult-box">' +
      '<div class="hoku-consult-header">' +
        '<div class="hoku-avatar-sm">H</div>' +
        '<span>Hoku — このPhaseで相談できること</span>' +
      '</div>' +
      '<div class="hoku-consult-body">' +
        '<div class="hoku-consult-ok">' +
          '<h4>Hokuに聞いてよいこと</h4>' +
          '<ul class="hoku-consult-list">' +
            (advice.canAsk || []).map(function(s){ return '<li>' + hesc(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +
        '<div class="hoku-consult-ng" style="margin-top:8px">' +
          '<h4>自分で取り組むべきこと</h4>' +
          '<ul class="hoku-consult-list">' +
            (advice.dontAsk || []).map(function(s){ return '<li>' + hesc(s) + '</li>'; }).join('') +
          '</ul>' +
        '</div>' +
        (advice.tip ? '<div class="hoku-tip">' + hesc(advice.tip) + '</div>' : '') +
      '</div>' +
    '</div>';

    var div = document.createElement('div');
    div.innerHTML = html;
    // phase actionsの前に挿入
    var actions = root.querySelector('.phase-actions');
    if (actions) {
      root.insertBefore(div.firstChild, actions);
    } else {
      root.appendChild(div.firstChild);
    }
  }

  /* ── Lesson詳細にHoku相談カードを注入 ── */
  function injectHokuLessonCard(lessonId, root) {
    if (!root || root.querySelector('.hoku-sc-hint')) return;
    var phaseNum = lessonId ? parseInt((lessonId.match(/^l(\d+)-/) || [,'0'])[1], 10) : -1;
    var phaseId = phaseNum >= 0 ? 'p' + String(phaseNum).padStart(2,'0') : null;
    var H = window.Hoku_MENTOR || {};
    var advice = phaseId && (H.phaseAdvice || {})[phaseId];

    var canAsk = advice ? advice.canAsk.slice(0,3) : [
      'このコードを1行ずつ説明して',
      'このエラー文の意味を整理して',
      '面談でどう説明すればいいか練習して',
    ];

    var html = '<div class="hoku-sc-hint" style="margin-top:16px">' +
      '<div class="hoku-avatar-sm" style="flex-shrink:0">H</div>' +
      '<div><span class="hoku-sc-hint-label">Hoku メモ</span>' +
        '<div class="hoku-sc-hint-text">このレッスンで詰まったら、以下を Hoku に送ってみよう：' +
        '<ul style="margin:6px 0 0 16px;padding:0;font-size:.83rem;">' +
          canAsk.map(function(s){ return '<li>' + hesc(s) + '</li>'; }).join('') +
        '</ul>' +
        (advice && advice.tip ? '<p style="margin:6px 0 0;font-size:.8rem;color:#1e3a8a;">' + hesc(advice.tip) + '</p>' : '') +
      '</div></div>' +
    '</div>';

    var navAct = root.querySelector('.lesson-nav-actions');
    var div = document.createElement('div');
    div.innerHTML = html;
    if (navAct) navAct.parentNode.insertBefore(div.firstChild, navAct);
    else root.appendChild(div.firstChild);
  }

  /* ── Assignment にHoku提出前チェック注入 ── */
  function injectHokuAssignmentCheck(asgnRoot) {
    if (!asgnRoot || asgnRoot.querySelector('.hoku-precheck')) return;

    var items = [
      'READMEに概要・技術・機能・工夫点が書いてある',
      'GitHub URLが正しくプッシュされている',
      '画面キャプチャや操作説明が含まれている',
      'AI（Hoku）を使った箇所を AI-USAGE.md に記録した',
      'コードの主要な部分を自分の言葉で説明できる',
      '個人情報・APIキー・パスワードがコミットされていない',
      'エラーが出た場合の解決ログを残した',
      '不安な設計判断は講師に確認した',
    ];

    var html = '<div class="hoku-precheck">' +
      '<div class="hoku-precheck-header">' +
        '<div class="hoku-avatar-sm">H</div>' +
        '<span>Hoku — 提出前チェックリスト</span>' +
      '</div>' +
      '<ul class="hoku-precheck-list">';

    items.forEach(function(item, i) {
      html += '<li><input type="checkbox" id="hoku-chk-' + i + '"><label for="hoku-chk-' + i + '">' + hesc(item) + '</label></li>';
    });
    html += '</ul></div>';

    var div = document.createElement('div');
    div.innerHTML = html;
    asgnRoot.appendChild(div.firstChild);
  }

  /* ── SC にHokuヒント注入 ── */
  function injectHokuScHint(questionEl, question) {
    if (!questionEl || questionEl.querySelector('.hoku-sc-hint')) return;
    var hint = (question && question.instructorCheckPoint)
      ? 'この問題は「なぜそうなのか」の理由まで説明できるかが大事。答えを暗記するより、現場でどう使うかまで整理してみよう。\n講師確認ポイント：' + question.instructorCheckPoint
      : 'この問題では「なぜその処理が必要なのか」を説明できるかが大事。答えを暗記するより、現場でどう使うかまで整理してみよう。';

    var div = document.createElement('div');
    div.className = 'hoku-sc-hint';
    div.style.cssText = 'margin:8px 0;display:flex;gap:8px;align-items:flex-start';
    div.innerHTML = '<div class="hoku-avatar-sm" style="flex-shrink:0">H</div>' +
      '<div><span class="hoku-sc-hint-label">Hoku ヒント</span>' +
        '<div class="hoku-sc-hint-text">' + hesc(hint) + '</div>' +
      '</div>';
    questionEl.appendChild(div);
  }

  /* ── MutationObserver でPhase/Lesson/Assignment/SC に注入 ── */
  document.addEventListener('DOMContentLoaded', function() {
    /* Hokuホームセクション */
    renderHokuHomeSection();

    /* Hokuページ: クリック時に描画 */
    document.addEventListener('click', function(e) {
      var item = e.target.closest('[data-view]');
      if (item && item.dataset.view === 'hoku') {
        setTimeout(function(){ try{ renderHokuPage(); }catch(e){} }, 150);
      }
    });

    /* Phase詳細ルートを監視 */
    var phaseDetailRoot = document.querySelector('#phase-detail-root');
    if (phaseDetailRoot) {
      var phObs = new MutationObserver(function(muts) {
        if (!muts.some(function(m){ return m.addedNodes.length > 0; })) return;
        setTimeout(function() {
          try {
            var numEl = phaseDetailRoot.querySelector('.dh-num');
            if (!numEl) return;
            var phNum = parseInt(numEl.textContent.trim(), 10);
            if (isNaN(phNum)) return;
            var phId = 'p' + String(phNum).padStart(2,'0');
            injectHokuPhaseConsult(phId, phaseDetailRoot);
          } catch(e) {}
        }, 300);
      });
      phObs.observe(phaseDetailRoot, { childList: true, subtree: false });
    }

    /* Lesson詳細ルートを監視 */
    var lessonRoot = document.querySelector('#lesson-detail-root, #sec-lesson-detail');
    if (lessonRoot) {
      var lObs = new MutationObserver(function(muts) {
        if (!muts.some(function(m){ return m.addedNodes.length > 0; })) return;
        setTimeout(function() {
          // lesson IDを取得（hash or data属性から）
          var lid = null;
          var hash = window.location.hash;
          var m = hash.match(/l(\d{2}-\d+-\d+)/);
          if (m) lid = 'l' + m[1];
          injectHokuLessonCard(lid, lessonRoot);
        }, 400);
      });
      lObs.observe(lessonRoot, { childList: true, subtree: false });
    }
  });

  /* ── テンプレートコピーのグローバル設定 ── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-hoku-copy]');
    if (btn) {
      var tplId = btn.dataset.hokuCopy;
      var H = window.Hoku_MENTOR || {};
      var tpl = (H.templates || []).find(function(t){ return t.id === tplId; });
      if (!tpl) return;
      fallbackCopy(tpl.body, btn);
    }
  });

  /* ── 既存テンプレートコピー機能との統合 ── */
  window.renderHokuPage = renderHokuPage;
  window.renderHokuHomeSection = renderHokuHomeSection;
  window.injectHokuPhaseConsult = injectHokuPhaseConsult;
  window.injectHokuLessonCard = injectHokuLessonCard;
  window.injectHokuAssignmentCheck = injectHokuAssignmentCheck;
  window.injectHokuScHint = injectHokuScHint;

})();




/* ═══════════════════════════════════════════════════════
   Hoku アセット統合パッチ v3
   実際のHoku画像（透過PNG）を全コンテキストに適用
   SVGは完全廃止
   ═══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── 画像を取得（Hoku_IMGS優先、フォールバックはメイン）── */
  function hokuImg(name) {
    var imgs = window.HOKU_IMGS || {};
    return imgs[name] || window.Hoku_IMG_MAIN || '';
  }

  /* ── imgタグ作成（透過PNG前提）── */
  function makeHokuImg(name, size) {
    var src = hokuImg(name);
    if (!src) return '';
    return '<img src="' + src + '" '
      + 'style="width:' + (size||'100') + '%;height:' + (size||'100') + '%;'
      + 'object-fit:contain;display:block;background:none;" '
      + 'alt="Hoku">';
  }

  /* ── 大アバターを実画像（メイン）に差し替え ── */
  function applyMainAvatar(el, imgName) {
    if (!el || el.dataset.imgApplied) return;
    el.dataset.imgApplied = '1';
    el.style.cssText = 'background:none!important;border:none!important;'
      + 'box-shadow:none!important;border-radius:0!important;'
      + 'overflow:visible!important;';
    var src = imgName ? hokuImg(imgName) : window.Hoku_IMG_MAIN;
    if (!src) return;
    el.innerHTML = '<img src="' + src + '" '
      + 'style="width:100%;height:100%;object-fit:contain;display:block;background:none;" '
      + 'alt="Hoku">';
  }

  /* ── 小アバター（コンテキスト別表情画像）── */
  function applySmallAvatar(el, expression) {
    if (!el || el.dataset.imgApplied) return;
    el.dataset.imgApplied = '1';
    el.style.cssText = 'background:none!important;border:none!important;'
      + 'box-shadow:none!important;border-radius:0!important;'
      + 'overflow:visible!important;padding:0!important;';
    var src = hokuImg(expression || 'smile');
    if (!src) return;
    el.innerHTML = '<img src="' + src + '" '
      + 'style="width:100%;height:100%;object-fit:contain;display:block;background:none;" '
      + 'alt="Hoku ' + (expression||'smile') + '">';
  }

  /* ── テンプレートアイコンの表情マッピング ── */
  var TPL_EXPR = {
    'E': 'worried',   // エラー相談
    'S': 'thinking',  // スクリーンショット
    'C': 'pointing',  // コード解説
    'T': 'checklist', // 課題の進め方
    'R': 'smile',     // README
    'I': 'pointing',  // 面談
    'D': 'wave',      // 日報
    'G': 'happy',     // GitHub
  };

  /* ── 全Hoku要素に画像を適用 ── */
  function applyAllHokuImages() {
    /* 1. 大アバター（メイン画像）※ hoku-float-avatar は除外 */
    Array.from(document.querySelectorAll('.hoku-avatar:not([data-img-applied]):not(.hoku-float-avatar),'
      + '.hoku-home-avatar:not([data-img-applied])')).forEach(function(el) {
      applyMainAvatar(el, 'smile');
    });

    /* 2. 小アバター（コンテキスト別）*/
    Array.from(document.querySelectorAll('.hoku-avatar-sm:not([data-img-applied])')).forEach(function(el) {
      var ctx = el.closest('.hoku-consult-box') ? 'pointing'
              : el.closest('.hoku-precheck')    ? 'checklist'
              : el.closest('.hoku-sc-hint')     ? 'thinking'
              : el.closest('.hoku-warning')      ? 'worried'
              : el.closest('.hoku-demo-panel')   ? 'smile'
              : 'smile';
      applySmallAvatar(el, ctx);
    });

    /* 3. テンプレートアイコン */
    Array.from(document.querySelectorAll('.hoku-template-icon:not([data-img-applied])')).forEach(function(el) {
      if (el.dataset.imgApplied) return;
      el.dataset.imgApplied = '1';
      el.style.cssText = 'background:none!important;border:none!important;'
        + 'width:40px;height:40px;overflow:visible!important;padding:0;flex-shrink:0;';
      var letter = el.textContent.trim().charAt(0);
      var expr = TPL_EXPR[letter] || 'smile';
      var src = hokuImg(expr);
      if (src) {
        el.innerHTML = '<img src="' + src + '" '
          + 'style="width:100%;height:100%;object-fit:contain;display:block;" alt="Hoku">';
      }
    });

    /* 4. Hokuページイントロの大アバター（メイン画像で大きく）*/
    var introAv = document.querySelector('.hoku-page-intro .hoku-avatar:not([data-main-applied])');
    if (introAv) {
      introAv.dataset.mainApplied = '1';
      introAv.style.cssText = 'width:80px;height:80px;background:none!important;'
        + 'border:none!important;box-shadow:none!important;border-radius:0!important;'
        + 'overflow:visible!important;flex-shrink:0;';
      var mainSrc = window.Hoku_IMG_MAIN;
      if (mainSrc) {
        introAv.innerHTML = '<img src="' + mainSrc + '" '
          + 'style="width:100%;height:100%;object-fit:contain;display:block;" alt="Hoku">';
      }
    }
  }

  /* ── MutationObserver + 遅延適用 ── */
  var applyTimer = null;
  function scheduleApply() {
    if (applyTimer) clearTimeout(applyTimer);
    applyTimer = setTimeout(function(){ try{ applyAllHokuImages(); }catch(e){} }, 200);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(applyAllHokuImages, 300);
    setTimeout(applyAllHokuImages, 800);
    setTimeout(applyAllHokuImages, 1500);

    /* DOM変化を監視 */
    var obs = new MutationObserver(function(muts) {
      if (muts.some(function(m){ return m.addedNodes.length > 0; })) {
        scheduleApply();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    /* ナビクリック後にも適用 */
    document.addEventListener('click', function(e) {
      if (e.target.closest('[data-view], .phase-card, .lesson-row, .chapter-card')) {
        setTimeout(function(){ try{ applyAllHokuImages(); }catch(e){} }, 400);
        setTimeout(function(){ try{ applyAllHokuImages(); }catch(e){} }, 900);
      }
    });
  });

  /* グローバル公開 */
  window.applyAllHokuImages = applyAllHokuImages;
  window.hokuImg = hokuImg;

})();

/* ═══════════════════════════════════════════════════════
   Hoku FLOATING UI — 常駐AIメンターパネル
   全Phase対応 / テンプレートコピー / コンテキスト検出
   ═══════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   HOKU FLOAT v2 — ドラッグ常駐・画像+テキスト相談
   スクショ1: 会話UI / スクショ2: 常駐感・動き
   ═══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── ユーティリティ ── */
  function hesc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function safeGet(key, def) {
    try { var v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; }
    catch(e) { return def; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }
  function imgSrc(name) {
    var imgs = window.HOKU_IMGS || {};
    return imgs[name] || window.HOKU_IMG_MAIN || '';
  }

  /* ── 状態 ── */
  var state = {
    open: false,
    minimized: false,
    dragging: false,
    pos: { x: null, y: null },
    dragOffset: { x: 0, y: 0 },
    activeCategory: null,
    attachedImages: [],
    chatLog: [],
    currentContext: null,
  };

  /* ── 現在の学習コンテキスト取得 ── */
  function getContext() {
    var ctx = { phase: null, lesson: null, type: 'general' };
    var dh = document.querySelector('.dh-num');
    if (dh) {
      var m = dh.textContent.match(/(\d+)/);
      if (m) ctx.phase = 'Phase ' + String(parseInt(m[1],10)).padStart(2,'0');
    }
    var bc = document.querySelector('.breadcrumb');
    if (bc && !ctx.phase) {
      var bm = bc.textContent.match(/Phase\s*(\d+)/i);
      if (bm) ctx.phase = 'Phase ' + String(parseInt(bm[1],10)).padStart(2,'0');
    }
    var lh1 = document.querySelector('#lesson-detail-root h1, #sec-lesson-detail h1');
    if (lh1) { ctx.lesson = lh1.textContent.trim().slice(0,36); ctx.type = 'lesson'; }
    var secH = document.querySelector('#sec-skillchecks.active');
    if (secH) ctx.type = 'skillcheck';
    var secA = document.querySelector('#sec-assignments.active');
    if (secA) ctx.type = 'assignment';
    return ctx;
  }

  /* ── カテゴリ定義 ── */
  var CATS = [
    {key:'error',     label:'エラー相談'},
    {key:'screenshot',label:'スクショ相談'},
    {key:'code',      label:'コード解説'},
    {key:'vocab',     label:'用語を聞く'},
    {key:'task',      label:'課題の進め方'},
    {key:'github',    label:'GitHub提出前'},
    {key:'readme',    label:'README作成'},
    {key:'interview', label:'面談練習'},
    {key:'claudecode',label:'Claude Code指示文'},
    {key:'report',    label:'日報/週報'},
  ];

  /* ── Mock Responder (将来AIに差し替え) ── */
  var HOKU_PROVIDER = {
    name: 'mock',
    send: function(payload, callback) {
      setTimeout(function() {
        var resp = buildMockResponse(payload);
        callback(resp);
      }, 800 + Math.random() * 600);
    },
  };

  function buildMockResponse(payload) {
    var cat = payload.category || 'general';
    var hasImg = payload.attachedImages && payload.attachedImages.length > 0;
    var msg = payload.message || '';
    var ctx = payload.currentContext;

    var ctxStr = '';
    if (ctx && ctx.phase) ctxStr = ctx.phase + (ctx.lesson ? ' / ' + ctx.lesson : '');

    if (cat === 'error' || /エラー|error|Error/.test(msg)) {
      return 'OK、まず状況を整理しよ。\n\n' +
        (hasImg ? 'スクリーンショットを確認した。' : '') +
        'エラーが出る時は、だいたい以下のどれか：\n' +
        '・typo（変数名・プロパティ名のミス）\n' +
        '・import / export のミス\n' +
        '・非同期処理の順番\n' +
        '・undefinedへのアクセス\n\n' +
        '確認する順番：\n1. Consoleログを全部確認\n2. エラーが出た行を見る\n3. 直前に変えたコードを確認\n\n' +
        (hasImg ? '画像だけでは原因を断定できないので、エラー文とコードも一緒に送ってみて。' : 'Consoleのエラー文とコードも一緒に送ってくれると精度が上がる。') +
        '\n\n講師にも状況を共有しておこう。';
    }
    if (cat === 'screenshot' || hasImg) {
      return 'スクショ確認した。\n\n' +
        (msg ? 'やろうとしていたこと：' + msg.slice(0,60) + '\n\n' : '') +
        '読み取れること：\n・画面の状態を確認中\n・表示崩れ or エラー状態の可能性\n\n' +
        '追加で送ってほしいもの：\n' +
        '・Consoleのエラー文\n・直前に変えたコードの該当部分\n・Terminal ログ（Next.js / Spring Boot の場合）\n\n' +
        '画像だけだと断定はできないので、補足情報を一緒に送ってみよう。';
    }
    if (cat === 'code') {
      return 'コードを見るよ。\n\nコードを貼ってくれれば、1行ずつの意味・全体の流れ・改善できる点を整理するね。\n\n' +
        '面談で説明するための「自分の言葉バージョン」も一緒に作ろう。' +
        (ctxStr ? '\n\n今は ' + ctxStr + ' を学習中なんだね。' : '');
    }
    if (cat === 'vocab') {
      return '用語の説明ね。\n\n知りたい用語を送ってくれれば：\n・一言でいうと\n・現場ではどう使うか\n・具体例\n・面談でどう説明するか\n\nをまとめるよ。';
    }
    if (cat === 'task') {
      return 'いいね、まず分解しよう。\n\n課題名と要件を送ってくれれば、進める順番を一緒に整理する。\n\n完成コードをそのまま出すのはやめておく。課題の目的は「自分の言葉で説明できるようになること」だから、進め方と考え方を一緒に整理しよう。';
    }
    if (cat === 'interview') {
      return '面談練習やろう。\n\n制作物名・使用技術・実装した機能・苦戦した点を送ってくれれば、面談で聞かれそうな質問を出して、回答を一緒に磨いていく。';
    }
    if (cat === 'readme') {
      return 'README一緒に作ろう。\n\n制作物名・概要・使用技術・実装した機能・工夫した点・苦戦した点・AI使用箇所を送ってくれれば、READMEに入れるべき項目と文章案を整理するよ。';
    }
    if (cat === 'github') {
      return 'GitHub提出前チェックをしよう。\n\nリポジトリURL・README概要・AI使用箇所・環境変数の扱いを送ってくれれば、提出前の確認ポイントを整理する。APIキーやパスワードがコミットされていないかも確認しよう。';
    }
    return 'OK、詳しく教えてくれると一緒に整理できる。\n\n状況・エラー文・スクリーンショットがあるとかなり正確に見やすい。\n\n' +
      (ctxStr ? '今は ' + ctxStr + ' を学習中なんだね。どこで詰まってる？' : '何で詰まってる？');
  }

  /* ── sendToHoku: AI接続の抽象化レイヤー ── */
  function sendToHoku(payload, callback) {
    HOKU_PROVIDER.send(payload, callback);
  }

  /* ── 会話ログに追加 ── */
  function appendMessage(role, text, images) {
    state.chatLog.push({ role: role, text: text, images: images || [] });
  }

  /* ── チャットログHTML生成 ── */
  function buildChatLogHTML() {
    if (state.chatLog.length === 0) {
      var ctx = state.currentContext;
      var ps = window.HOKU_PHASE_SUPPORT || {};
      var phKey = null;
      if (ctx && ctx.phase) {
        var m = ctx.phase.match(/(\d+)/);
        if (m) phKey = 'p' + String(parseInt(m[1],10)).padStart(2,'0');
      }
      var ph = phKey ? ps[phKey] : null;
      var smiles = imgSrc('smile');

      var quickPrompts = ph ? ph.examples.slice(0,3) : [
        'エラー文を整理してほしい',
        'コードを1行ずつ説明してほしい',
        '課題の進め方を教えてほしい',
      ];

      return '<div class="hoku-empty-state">' +
        '<div class="hoku-empty-avatar">' + (smiles ? '<img src="' + smiles + '" alt="Hoku">' : 'H') + '</div>' +
        '<div class="hoku-empty-title">何でも聞いてね</div>' +
        '<div class="hoku-empty-desc">状況・エラー文・スクショがあると<br>かなり正確に整理できる</div>' +
        '<div class="hoku-quick-prompts">' +
          quickPrompts.map(function(q) {
            return '<button class="hoku-quick-prompt" data-prompt="' + hesc(q) + '">' + hesc(q) + '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    }

    var html = '';
    state.chatLog.forEach(function(msg) {
      if (msg.role === 'hoku') {
        var av = imgSrc('thinking');
        if (/エラー|error/.test(msg.text)) av = imgSrc('worried');
        else if (/できてる|いいね/.test(msg.text)) av = imgSrc('happy');
        html += '<div class="hoku-bubble-wrap">' +
          '<div class="hoku-msg-avatar">' + (av ? '<img src="' + av + '" alt="Hoku">' : '') + '</div>' +
          '<div><div class="hoku-bubble-name">Hoku</div>' +
          '<div class="hoku-bubble">' + hesc(msg.text) + '</div></div>' +
        '</div>';
      } else {
        html += '<div class="hoku-user-wrap">' +
          '<div class="hoku-user-bubble">' +
            hesc(msg.text) +
            (msg.images && msg.images.length ? msg.images.map(function(src) {
              return '<img src="' + src + '" class="hoku-attached-img" alt="添付画像">';
            }).join('') : '') +
          '</div>' +
        '</div>';
      }
    });
    return html;
  }

  /* ── コンテキストカードHTML ── */
  function buildContextHTML() {
    var ctx = state.currentContext;
    if (!ctx || (!ctx.phase && !ctx.lesson)) return '';
    var ps = window.HOKU_PHASE_SUPPORT || {};
    var phKey = null;
    if (ctx.phase) {
      var m = ctx.phase.match(/(\d+)/);
      if (m) phKey = 'p' + String(parseInt(m[1],10)).padStart(2,'0');
    }
    var ph = phKey ? ps[phKey] : null;
    return '<div class="hoku-context-card">' +
      '<span class="ctx-label">学習中</span>' +
      '<div class="ctx-value">' + hesc(ctx.phase || '') +
        (ctx.lesson ? '<small>' + hesc(ctx.lesson) + '</small>' : '') +
        (ph ? '<small style="color:#2563eb;margin-top:2px;">' + hesc(ph.message.slice(0,50)) + '…</small>' : '') +
      '</div>' +
    '</div>';
  }

  /* ── パネルHTML生成 ── */
  function buildPanelHTML() {
    var chips = CATS.map(function(c) {
      return '<button class="hoku-chip' + (state.activeCategory === c.key ? ' active' : '') + '" data-cat="' + hesc(c.key) + '">' + hesc(c.label) + '</button>';
    }).join('');

    var ctxHTML = buildContextHTML();
    var logHTML = buildChatLogHTML();
    var tplHTML = '';
    if (state.activeCategory) {
      var tpls = window.HOKU_TEMPLATES || {};
      var tpl = tpls[state.activeCategory];
      if (tpl) {
        tplHTML = '<div class="hoku-tpl-card">' +
          '<div class="hoku-tpl-head"><strong>' + hesc(tpl.label || state.activeCategory) + ' テンプレート</strong>' +
          '<button class="hoku-tpl-copy" data-tpl-key="' + hesc(state.activeCategory) + '">Copy</button></div>' +
          '<pre class="hoku-tpl-body">' + hesc(tpl.body) + '</pre>' +
        '</div>';
      }
    }

    return '<div class="hoku-header">' +
        '<div class="hoku-header-avatar" id="hokuPanelAv"></div>' +
        '<div class="hoku-header-info">' +
          '<h3>Hoku</h3>' +
          '<span class="hoku-subtitle">Hoku Tech AIメンター / 学習の相棒</span>' +
        '</div>' +
        '<div class="hoku-header-actions">' +
          '<button class="hoku-btn-icon" id="hokuMinBtn" title="最小化">—</button>' +
          '<button class="hoku-btn-icon" id="hokuCloseBtn" title="閉じる">×</button>' +
        '</div>' +
      '</div>' +
      ctxHTML +
      '<div class="hoku-chip-row" id="hokuChipRow">' + chips + '</div>' +
      '<div class="hoku-chat-log" id="hokuChatLog">' + logHTML + tplHTML + '</div>' +
      '<div class="hoku-helper-note">状況・エラー文・スクショがあると正確に整理しやすい ／ 答えだけでなく考え方まで</div>' +
      '<div class="hoku-input-bar">' +
        '<div class="hoku-preview-row" id="hokuPreviewRow"></div>' +
        '<div class="hoku-input-row">' +
          '<label class="hoku-upload-btn" title="画像を添付">' +
            '📎' +
            '<input type="file" id="hokuImgInput" accept="image/*" multiple style="display:none">' +
          '</label>' +
          '<textarea class="hoku-text-input" id="hokuTextInput" placeholder="状況を教えて…" rows="1"></textarea>' +
          '<button class="hoku-mic-btn" id="hokuMicBtn" title="音声入力">🎤</button>' +
          '<button class="hoku-send-btn" id="hokuSendBtn" title="送信">›</button>' +
        '</div>' +
      '</div>';
  }

  /* ── DOM生成 ── */
  function createFloatUI() {
    var root = document.getElementById('hokuFloatRoot');
    if (!root) {
      root = document.createElement('div');
      root.id = 'hokuFloatRoot';
      document.body.appendChild(root);
    }

    // バブル
    var bubble = document.createElement('div');
    bubble.className = 'hoku-float';
    bubble.id = 'hokuFloat';
    var av = imgSrc('smile');
    var imgStyle = 'width:100%;height:100%;object-fit:contain;display:block;background:none;pointer-events:none;-webkit-transform:translateZ(0);transform:translateZ(0);animation:hokuBreathe 3.5s ease-in-out infinite;';
    bubble.innerHTML =
      '<div class="hoku-float-avatar" id="hokuFloatAvatar" style="background:none!important;border:none!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important;filter:none!important;-webkit-filter:none!important;">' +
        (av ? '<img src="' + av + '" alt="Hoku" style="' + imgStyle + '">' : '<span style="font-size:2rem">⭐</span>') +
        '<div class="hoku-float-dot"></div>' +
        '<div class="hoku-float-badge" id="hokuBadge"></div>' +
      '</div>';
    root.appendChild(bubble);

    // パネル
    var panel = document.createElement('div');
    panel.className = 'hoku-panel';
    panel.id = 'hokuPanelEl';
    panel.style.display = 'none';
    panel.innerHTML = buildPanelHTML();
    root.appendChild(panel);

    // 位置をLocalStorageから復元
    restorePosition();
    bindEvents();

    // パネルアバター画像を適用
    applyPanelAvatar();
  }

  /* ── 位置復元 ── */
  function restorePosition() {
    var saved = safeGet('hokuFloatPos', null);
    var bubble = document.getElementById('hokuFloat');
    if (!bubble) return;

    var vw = window.innerWidth, vh = window.innerHeight;
    var bw = 70, bh = 70;

    var x, y;
    if (saved && saved.x != null) {
      x = Math.max(0, Math.min(saved.x, vw - bw));
      y = Math.max(0, Math.min(saved.y, vh - bh));
    } else {
      x = vw - bw - 16;
      y = vh - bh - 80;
    }

    bubble.style.left = x + 'px';
    bubble.style.top  = y + 'px';
    state.pos = { x: x, y: y };
  }

  /* ── パネル位置更新 ── */
  function updatePanelPosition() {
    var bubble = document.getElementById('hokuFloat');
    var panel  = document.getElementById('hokuPanelEl');
    if (!bubble || !panel || panel.style.display === 'none') return;

    var vw = window.innerWidth;
    if (vw <= 480) return; // スマホは CSS で制御

    var bRect  = bubble.getBoundingClientRect();
    var pw     = 380;
    var ph_max = 580;
    var margin = 10;
    var bx     = state.pos.x;
    var by     = state.pos.y;

    // パネルをバブルの左 or 右に表示
    var px, py;
    if (bx + 60 + pw + margin < vw) {
      px = bx + 60 + margin;
    } else {
      px = Math.max(margin, bx - pw - margin);
    }
    // 縦: バブルの上に揃える
    var vh = window.innerHeight;
    py = Math.min(by, vh - ph_max - margin);
    py = Math.max(margin, py);

    panel.style.left   = px + 'px';
    panel.style.top    = py + 'px';
    panel.style.bottom = 'auto';
    panel.style.right  = 'auto';
  }

  /* ── パネル開閉 ── */
  function openPanel() {
    var panel = document.getElementById('hokuPanelEl');
    if (!panel) return;
    state.open = true;
    state.currentContext = getContext();
    panel.innerHTML = buildPanelHTML();
    panel.style.display = 'flex';
    panel.classList.remove('closing');
    updatePanelPosition();
    applyPanelAvatar();
    bindPanelEvents();
    scrollChatToBottom();
    safeSet('hokuOpen', 1);
  }

  function closePanel() {
    var panel = document.getElementById('hokuPanelEl');
    if (!panel) return;
    state.open = false;
    panel.classList.add('closing');
    setTimeout(function() {
      try { panel.style.display = 'none'; panel.classList.remove('closing'); } catch(e) {}
    }, 160);
    safeSet('hokuOpen', 0);
  }

  function togglePanel() {
    if (state.open) closePanel(); else openPanel();
  }

  /* ── スクロール ── */
  function scrollChatToBottom() {
    var log = document.getElementById('hokuChatLog');
    if (log) log.scrollTop = log.scrollHeight;
  }

  /* ── 送信処理 ── */
  function sendMessage() {
    var inp = document.getElementById('hokuTextInput');
    var text = inp ? inp.value.trim() : '';
    if (!text && state.attachedImages.length === 0) return;

    // ユーザーメッセージを追加
    appendMessage('user', text, state.attachedImages.slice());
    inp.value = '';
    inp.style.height = '';
    state.attachedImages = [];
    updatePreviewRow();

    // パネルを再描画
    var log = document.getElementById('hokuChatLog');
    if (log) {
      log.innerHTML = buildChatLogHTML();
      // typing indicator
      var typing = document.createElement('div');
      typing.className = 'hoku-bubble-wrap';
      typing.innerHTML = '<div class="hoku-typing"><span></span><span></span><span></span></div>';
      log.appendChild(typing);
      scrollChatToBottom();
    }
    bindQuickPrompts();

    // AIに送信
    var payload = {
      message: text,
      attachedImages: state.attachedImages.slice(),
      currentContext: state.currentContext,
      category: state.activeCategory,
    };

    sendToHoku(payload, function(response) {
      // typing を消してHokuメッセージ追加
      appendMessage('hoku', response, []);
      var log2 = document.getElementById('hokuChatLog');
      if (log2) {
        log2.innerHTML = buildChatLogHTML();
        scrollChatToBottom();
      }
      bindQuickPrompts();
    });
  }

  /* ── 画像プレビュー更新 ── */
  function updatePreviewRow() {
    var row = document.getElementById('hokuPreviewRow');
    if (!row) return;
    if (state.attachedImages.length === 0) {
      row.classList.remove('has-items');
      row.innerHTML = '';
      return;
    }
    row.classList.add('has-items');
    row.innerHTML = state.attachedImages.map(function(src, i) {
      return '<div class="hoku-preview-item">' +
        '<img src="' + src + '" alt="添付">' +
        '<button class="hoku-preview-remove" data-img-idx="' + i + '">×</button>' +
      '</div>';
    }).join('');
    Array.from(row.querySelectorAll('[data-img-idx]')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.dataset.imgIdx, 10);
        state.attachedImages.splice(idx, 1);
        updatePreviewRow();
      });
    });
  }

  /* ── パネルアバターに画像を適用 ── */
  function applyPanelAvatar() {
    var av = document.getElementById('hokuPanelAv');
    if (!av || av.dataset.set) return;
    var src = imgSrc('smile');
    if (src) {
      av.dataset.set = '1';
      av.innerHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:contain;" alt="Hoku">';
    }
  }

  /* ── Quick Prompts ── */
  function bindQuickPrompts() {
    var log = document.getElementById('hokuChatLog');
    if (!log) return;
    Array.from(log.querySelectorAll('[data-prompt]')).forEach(function(btn) {
      btn.addEventListener('click', function() {
        var inp = document.getElementById('hokuTextInput');
        if (inp) { inp.value = this.dataset.prompt; inp.focus(); }
      });
    });
  }

  /* ── パネル内イベントバインド ── */
  function bindPanelEvents() {
    var closeBtn = document.getElementById('hokuCloseBtn');
    var minBtn   = document.getElementById('hokuMinBtn');
    var chipRow  = document.getElementById('hokuChipRow');
    var sendBtn  = document.getElementById('hokuSendBtn');
    var textInp  = document.getElementById('hokuTextInput');
    var imgInp   = document.getElementById('hokuImgInput');

    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (minBtn) minBtn.addEventListener('click', function() {
      closePanel();
    });

    // チップ
    if (chipRow) {
      chipRow.addEventListener('click', function(e) {
        var chip = e.target.closest('.hoku-chip');
        if (!chip) return;
        var key = chip.dataset.cat;
        state.activeCategory = (state.activeCategory === key) ? null : key;
        var log = document.getElementById('hokuChatLog');
        var tpls = window.HOKU_TEMPLATES || {};
        var tpl = state.activeCategory ? tpls[state.activeCategory] : null;
        if (log && tpl) {
          // テンプレートを末尾に追加表示
          var existing = log.querySelector('.hoku-tpl-card');
          if (existing) existing.remove();
          var div = document.createElement('div');
          div.className = 'hoku-tpl-card';
          div.innerHTML =
            '<div class="hoku-tpl-head"><strong>' + hesc(tpl.label || key) + ' テンプレート</strong>' +
            '<button class="hoku-tpl-copy" data-tpl-key="' + hesc(key) + '">Copy</button></div>' +
            '<pre class="hoku-tpl-body">' + hesc(tpl.body) + '</pre>';
          log.appendChild(div);
          scrollChatToBottom();
          bindCopyButtons();
        }
        // チップのアクティブ状態
        Array.from(chipRow.querySelectorAll('.hoku-chip')).forEach(function(c) {
          c.classList.toggle('active', c.dataset.cat === state.activeCategory);
        });
      });
    }

    // 送信
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (textInp) {
      textInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      textInp.addEventListener('input', function() {
        this.style.height = '';
        this.style.height = Math.min(this.scrollHeight, 80) + 'px';
      });
    }

    // 画像添付
    if (imgInp) {
      imgInp.addEventListener('change', function() {
        var files = Array.from(this.files);
        files.forEach(function(file) {
          if (!file.type.startsWith('image/')) return;
          var reader = new FileReader();
          reader.onload = function(ev) {
            state.attachedImages.push(ev.target.result);
            updatePreviewRow();
          };
          reader.readAsDataURL(file);
        });
        imgInp.value = '';
      });
    }

    bindCopyButtons();
    bindQuickPrompts();
  }

  function bindCopyButtons() {
    var panel = document.getElementById('hokuPanelEl');
    if (!panel) return;
    Array.from(panel.querySelectorAll('[data-tpl-key]')).forEach(function(btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function() {
        var key = this.dataset.tplKey;
        var tpls = window.HOKU_TEMPLATES || {};
        var tpl = tpls[key];
        if (!tpl) return;
        var self = this;
        try {
          navigator.clipboard.writeText(tpl.body).then(function() {
            self.textContent = '✓ Copied';
            self.classList.add('copied');
            setTimeout(function(){ self.textContent = 'Copy'; self.classList.remove('copied'); }, 2000);
          }).catch(function(){ fallbackCopy(tpl.body, self); });
        } catch(e) { fallbackCopy(tpl.body, self); }
      });
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); btn.textContent = '✓'; btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    } catch(e) {}
    document.body.removeChild(ta);
  }

  /* ── ドラッグ処理（iOS Safari完全対応版）── */

  /* ── 画面端に吸着 ── */
  function snap() {
    var bubble = document.getElementById('hokuFloat');
    if (!bubble) return;
    var vw = window.innerWidth;
    var bw = 70;
    var x = state.pos.x;
    if (x + bw / 2 < vw / 2) {
      x = 8;
    } else {
      x = vw - bw - 8;
    }
    bubble.style.left = x + 'px';
    state.pos.x = x;
    if (state.open) {
      setTimeout(function() { try { updatePanelPosition(); } catch(e) {} }, 50);
    }
  }

  function bindEvents() {
    var bubble = document.getElementById('hokuFloat');
    if (!bubble) return;

    var isDragging = false;
    var didMove    = false;
    var startClientX = 0, startClientY = 0;
    var startElemX   = 0, startElemY   = 0;

    // ── 共通：ドラッグ開始 ──
    function onDragStart(clientX, clientY) {
      isDragging = true;
      didMove    = false;
      startClientX = clientX;
      startClientY = clientY;
      var rect = bubble.getBoundingClientRect();
      startElemX = rect.left;
      startElemY = rect.top;
      bubble.classList.add('hoku-dragging');
      // iOS Safari: touch-action:none だけでは不十分なため
      /* overflowY制御はCSS touch-actionで代替 */
    }

    // ── 共通：ドラッグ移動 ──
    function onDragMove(clientX, clientY) {
      if (!isDragging) return;
      var dx = clientX - startClientX;
      var dy = clientY - startClientY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didMove = true;

      var x = startElemX + dx;
      var y = startElemY + dy;
      var vw = window.innerWidth, vh = window.innerHeight;
      x = Math.max(4, Math.min(x, vw - 68));
      y = Math.max(4, Math.min(y, vh - 68));
      bubble.style.left = x + 'px';
      bubble.style.top  = y + 'px';
      state.pos = { x: x, y: y };
      if (state.open) updatePanelPosition();
    }

    // ── 共通：ドラッグ終了 ──
    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      bubble.classList.remove('hoku-dragging');
      /* リセット不要 */
      snap();
      safeSet('hokuFloatPos', state.pos);
      if (!didMove) {
        // 移動なし → タップ判定
        togglePanel();
      }
    }

    // ── タッチイベント（iOS Safari必須: bubble要素に直接・passive:false）──
    bubble.addEventListener('touchstart', function(e) {
      // multitouch は無視
      if (e.touches.length !== 1) return;
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    bubble.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault(); // スクロールを止めてドラッグ優先
      onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false }); // ← passive:false が必須

    bubble.addEventListener('touchend', function(e) {
      onDragEnd();
    }, { passive: true });

    bubble.addEventListener('touchcancel', function() {
      isDragging = false;
      bubble.classList.remove('hoku-dragging');
      /* リセット不要 */
    }, { passive: true });

    // ── マウスイベント（PC用）──
    bubble.addEventListener('mousedown', function(e) {
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      onDragMove(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', function(e) {
      onDragEnd();
    });

    // ESCで閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && state.open) closePanel();
    });


    // ナビ変更時にコンテキスト更新
    document.addEventListener('click', function(e) {
      if (e.target.closest('[data-view], .phase-card, .lesson-row, .chapter-card')) {
        setTimeout(function() {
          try {
            state.currentContext = getContext();
            if (state.open) {
              var ctx = document.querySelector('.hoku-context-card');
              if (ctx && ctx.parentNode) {
                var newCtx = document.createElement('div');
                newCtx.innerHTML = buildContextHTML();
                if (newCtx.firstChild) {
                  ctx.parentNode.replaceChild(newCtx.firstChild, ctx);
                }
              }
            }
          } catch(e) {}
        }, 500);
      }
    });
  }

  /* ── Phase/Lesson/Assignment/SCへのインライン注入（既存機能）── */
  function doInjectHokuLesson() {
    var root = document.querySelector('#lesson-detail-root');
    if (!root || root.querySelector('.hoku-sc-hint')) return;
    if (!root.querySelector('h1')) return;
    var ctx = getContext();
    var ps = window.HOKU_PHASE_SUPPORT || {};
    var phKey = null;
    if (ctx.phase) {
      var m = ctx.phase.match(/(\d+)/);
      if (m) phKey = 'p' + String(parseInt(m[1],10)).padStart(2,'0');
    }
    var ph = phKey ? ps[phKey] : null;
    var tip = ph ? ph.message : 'エラーが出たら、エラー文・コード・スクリーンショットをセットで送ると原因を絞りやすい。';
    var smTh = imgSrc('thinking');
    var html = '<div class="hoku-sc-hint" style="margin-top:18px;display:flex;gap:10px;align-items:flex-start;background:#eff6ff;border:1px solid #dbeafe;border-left:3px solid #2563eb;border-radius:0 8px 8px 0;padding:10px 14px;">' +
      '<div style="width:34px;height:34px;flex-shrink:0;background:none;">' + (smTh ? '<img src="' + smTh + '" style="width:100%;height:100%;object-fit:contain;" alt="Hoku">' : '') + '</div>' +
      '<div><span style="font-size:.68rem;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:3px;">Hoku メモ</span>' +
      '<div style="font-size:.84rem;color:#1e3a8a;line-height:1.65;">' + hesc(tip) + '</div></div></div>';
    var navAct = root.querySelector('.lesson-nav-actions, .next-action-section');
    var div = document.createElement('div');
    div.innerHTML = html;
    if (navAct) navAct.parentNode.insertBefore(div.firstChild, navAct);
    else root.appendChild(div.firstChild);
  }

  document.addEventListener('click', function(e) {
    try {
      if (e.target.closest('.lesson-row')) {
        setTimeout(function(){ try{ doInjectHokuLesson(); }catch(e2){} }, 600);
        setTimeout(function(){ try{ doInjectHokuLesson(); }catch(e2){} }, 1100);
      }
    } catch(e) {}
  });

  /* ── 初期化 ── */
  document.addEventListener('DOMContentLoaded', function() {
    try {
      createFloatUI();
    } catch(ex) {
      try { console.warn('[Hoku] init error:', ex && ex.message); } catch(e) {}
    }

    /* アバター画像を遅延適用（iOS Safari: try-catch保護）*/
    setTimeout(function() {
      try {
        var av = document.getElementById('hokuFloatAvatar');
        if (!av) return;
        /* 青背景を完全除去 */
        av.setAttribute('style', 'background:none!important;border:none!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important;filter:none!important;-webkit-filter:none!important;');
        var src = '';
        try { src = (window.HOKU_IMGS && window.HOKU_IMGS.smile) || window.HOKU_IMG_MAIN || ''; } catch(e) {}
        if (!src) return;
        var img = av.querySelector('img');
        if (img) {
          img.src = src;
          img.setAttribute('style', 'width:100%;height:100%;object-fit:contain;display:block;background:none;pointer-events:none;animation:hokuBreathe 3.5s ease-in-out infinite;');
        } else {
          var dot = '<div class="hoku-float-dot"></div>';
          var badge = '<div class="hoku-float-badge" id="hokuBadge"></div>';
          av.innerHTML = '<img src="' + src + '" alt="Hoku" style="width:100%;height:100%;object-fit:contain;display:block;background:none;pointer-events:none;animation:hokuBreathe 3.5s ease-in-out infinite;">' + dot + badge;
        }
      } catch(ex) {
        try { console.warn('[Hoku] avatar update error:', ex && ex.message); } catch(e) {}
      }
    }, 500);

    /* 前回パネルが開いていた場合は復元 */
    setTimeout(function() {
      try {
        var wasOpen = safeGet('hokuOpen', 0);
        if (wasOpen) {
          setTimeout(function() { try { openPanel(); } catch(e) {} }, 100);
        }
      } catch(ex) {}
    }, 700);
  });

})();
