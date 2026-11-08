/* ═══════════════════════════════════════════════════════════════
 * Hoku Tech — 簡易ログインゲート (IIFE 追記パッチ)
 *
 * 目的: 共有 URL を開いた人にいきなり教材を見せず、ID / パスワード
 *       入力画面を挟むための「表示ゲート」。
 * 注意: ブラウザ内だけで完結する簡易チェックであり、本格的な認証・
 *       アクセス制御ではない。資格情報は平文で持たず SHA-256 ハッシュ
 *       のみを保持する。本番運用時はサーバ側認証へ置き換えること。
 * 保存キー: hoku:v2:auth (既存キーとは衝突しない新規キー)
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // sha256(email + "\n" + password)
  var ALLOWED = ['dd3f73fdb07cd31b696a9af514482db9a48452de46501bd00725bc2aa1abe468'];
  var KEY = 'hoku:v2:auth';

  function sha256(str) {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var bytes = unescape(encodeURIComponent(str)), l = bytes.length, words = [], i, j;
    for (i = 0; i < l; i++) words[i >> 2] |= bytes.charCodeAt(i) << (24 - (i % 4) * 8);
    words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
    words[(((l + 8) >> 6) + 1) * 16 - 1] = l * 8;
    function r(x, n) { return (x >>> n) | (x << (32 - n)); }
    for (i = 0; i < words.length; i += 16) {
      var w = [], a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (j = 0; j < 64; j++) {
        if (j < 16) w[j] = words[i + j] | 0;
        else w[j] = (r(w[j-15],7) ^ r(w[j-15],18) ^ (w[j-15] >>> 3)) + w[j-16] +
                    (r(w[j-2],17) ^ r(w[j-2],19) ^ (w[j-2] >>> 10)) + w[j-7] | 0;
        var t1 = h + (r(e,6) ^ r(e,11) ^ r(e,25)) + ((e & f) ^ (~e & g)) + K[j] + w[j] | 0;
        var t2 = (r(a,2) ^ r(a,13) ^ r(a,22)) + ((a & b) ^ (a & c) ^ (b & c)) | 0;
        h = g; g = f; f = e; e = d + t1 | 0; d = c; c = b; b = a; a = t1 + t2 | 0;
      }
      H[0] = H[0] + a | 0; H[1] = H[1] + b | 0; H[2] = H[2] + c | 0; H[3] = H[3] + d | 0;
      H[4] = H[4] + e | 0; H[5] = H[5] + f | 0; H[6] = H[6] + g | 0; H[7] = H[7] + h | 0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  if (ALLOWED.indexOf(get()) !== -1) return;

  var css = document.createElement('style');
  css.textContent =
    '#hokuLoginGate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'padding:16px;background:var(--bg-soft,#f8fafc);font-family:inherit}' +
    '#hokuLoginGate form{width:100%;max-width:360px;background:var(--bg,#fff);border:1px solid var(--line,#e2e8f0);' +
    'border-radius:14px;padding:28px 24px;box-shadow:0 10px 30px rgba(15,23,42,.08);box-sizing:border-box}' +
    '#hokuLoginGate h1{margin:0 0 4px;font-size:22px;color:var(--ink,#0f172a)}' +
    '#hokuLoginGate p{margin:0 0 20px;font-size:13px;color:#64748b}' +
    '#hokuLoginGate label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px;color:var(--ink,#0f172a)}' +
    '#hokuLoginGate input{width:100%;box-sizing:border-box;padding:10px 12px;font-size:16px;border:1px solid var(--line,#e2e8f0);border-radius:8px}' +
    '#hokuLoginGate button{width:100%;margin-top:20px;padding:11px;font-size:15px;font-weight:700;color:#fff;' +
    'background:var(--brand,#2563eb);border:0;border-radius:8px;cursor:pointer}' +
    '#hokuLoginGate .err{color:var(--rose,#e11d48);font-size:13px;margin-top:10px;min-height:1em}';
  document.head.appendChild(css);

  var gate = document.createElement('div');
  gate.id = 'hokuLoginGate';
  gate.innerHTML =
    '<form autocomplete="on" novalidate>' +
    '<h1>Hoku Tech</h1><p>ログインして学習を始めましょう</p>' +
    '<label for="hgEmail">メールアドレス (ID)</label>' +
    '<input id="hgEmail" type="email" autocomplete="username" required>' +
    '<label for="hgPass">パスワード</label>' +
    '<input id="hgPass" type="password" autocomplete="current-password" required>' +
    '<button type="submit">ログイン</button><div class="err" role="alert"></div></form>';
  document.body.appendChild(gate);
  var prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  gate.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = gate.querySelector('#hgEmail').value.trim().toLowerCase();
    var pass = gate.querySelector('#hgPass').value;
    var h = sha256(email + '\n' + pass);
    if (ALLOWED.indexOf(h) !== -1) {
      set(h);
      document.body.style.overflow = prevOverflow;
      gate.remove();
    } else {
      gate.querySelector('.err').textContent = 'メールアドレスまたはパスワードが違います';
    }
  });
})();
