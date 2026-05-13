/* =========================================================
data/phase-illustrations.js
Phase ごとのカラフル SVG ヒーローイラスト（13枚）
外部依存ゼロ・インライン SVG
========================================================= */
window.PHASE_ILLUSTRATIONS = {
/* ── Phase 0: 事前準備・PC基礎 ── */
p00: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="phase-illus"><rect width="320" height="160" rx="12" fill="#0f172a"/><rect x="20" y="15" width="190" height="120" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/><rect x="20" y="15" width="190" height="22" rx="8" fill="#0f172a"/><circle cx="33" cy="26" r="4" fill="#f87171"/><circle cx="45" cy="26" r="4" fill="#fbbf24"/><circle cx="57" cy="26" r="4" fill="#4ade80"/><text x="28" y="55" font-family="monospace" font-size="9" fill="#22c55e">$ node --version</text><text x="28" y="70" font-family="monospace" font-size="9" fill="#a78bfa">v18.19.0</text><text x="28" y="85" font-family="monospace" font-size="9" fill="#22c55e">$ git --version</text><text x="28" y="100" font-family="monospace" font-size="9" fill="#a78bfa">git version 2.42</text><text x="28" y="115" font-family="monospace" font-size="9" fill="#22c55e">$ code . ▌</text><text x="230" y="45" font-size="40" text-anchor="middle">🖥️</text><text x="230" y="90" font-size="28" text-anchor="middle">⌨️</text><text x="230" y="130" font-size="22" text-anchor="middle">✅</text></svg>`,
/* ── Phase 1: IT基礎・Web基礎 ── */
p01: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g01" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#3b82f6"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g01)" opacity=".1"/>
<!-- Browser box -->
<rect x="20" y="25" width="120" height="90" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
<rect x="20" y="25" width="120" height="22" rx="8" fill="#334155"/>
<circle cx="32" cy="36" r="4" fill="#f87171"/><circle cx="44" cy="36" r="4" fill="#fbbf24"/><circle cx="56" cy="36" r="4" fill="#4ade80"/>
<rect x="65" y="30" width="70" height="12" rx="6" fill="#0f172a"/>
<text x="100" y="40" text-anchor="middle" font-size="7" fill="#94a3b8">https://example.com</text>
<!-- Browser content -->
<rect x="26" y="52" width="108" height="8" rx="2" fill="#60a5fa" opacity=".5"/>
<rect x="26" y="64" width="80" height="6" rx="2" fill="#94a3b8" opacity=".4"/>
<rect x="26" y="74" width="95" height="6" rx="2" fill="#94a3b8" opacity=".3"/>
<rect x="26" y="84" width="60" height="6" rx="2" fill="#94a3b8" opacity=".2"/>
<rect x="26" y="96" width="40" height="14" rx="3" fill="#3b82f6"/>
<text x="46" y="107" text-anchor="middle" font-size="7" fill="white">送信</text>
<!-- Arrow right -->
<line x1="145" y1="70" x2="175" y2="70" stroke="#60a5fa" stroke-width="2.5" stroke-dasharray="5,3"/>
<polygon points="175,66 185,70 175,74" fill="#60a5fa"/>
<text x="165" y="65" text-anchor="middle" font-size="8" fill="#60a5fa">Request</text>
<!-- Arrow left -->
<line x1="175" y1="85" x2="145" y2="85" stroke="#4ade80" stroke-width="2.5" stroke-dasharray="5,3"/>
<polygon points="145,81 135,85 145,89" fill="#4ade80"/>
<text x="165" y="98" text-anchor="middle" font-size="8" fill="#4ade80">Response</text>
<!-- Server box -->
<rect x="180" y="25" width="120" height="90" rx="8" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
<text x="240" y="48" text-anchor="middle" font-size="10" font-weight="bold" fill="#4ade80">🖧 Server</text>
<rect x="190" y="55" width="100" height="6" rx="2" fill="#22c55e" opacity=".4"/>
<rect x="190" y="65" width="80" height="6" rx="2" fill="#22c55e" opacity=".3"/>
<text x="240" y="88" text-anchor="middle" font-size="9" fill="#94a3b8">Spring Boot</text>
<text x="240" y="100" text-anchor="middle" font-size="8" fill="#64748b">REST API</text>
<!-- Status codes -->
<rect x="20" y="125" width="280" height="50" rx="8" fill="#0f172a"/>
<text x="160" y="140" text-anchor="middle" font-size="9" font-weight="bold" fill="#94a3b8">HTTP Status Codes</text>
<rect x="30" y="147" width="35" height="16" rx="3" fill="#22c55e" opacity=".2"/><text x="47" y="158" text-anchor="middle" font-size="8" fill="#22c55e">200 OK</text>
<rect x="75" y="147" width="40" height="16" rx="3" fill="#3b82f6" opacity=".2"/><text x="95" y="158" text-anchor="middle" font-size="8" fill="#60a5fa">201 Created</text>
<rect x="125" y="147" width="45" height="16" rx="3" fill="#f59e0b" opacity=".2"/><text x="147" y="158" text-anchor="middle" font-size="8" fill="#fbbf24">400 Bad Req</text>
<rect x="180" y="147" width="45" height="16" rx="3" fill="#f87171" opacity=".2"/><text x="202" y="158" text-anchor="middle" font-size="8" fill="#f87171">404 Not Found</text>
<rect x="235" y="147" width="55" height="16" rx="3" fill="#ef4444" opacity=".2"/><text x="262" y="158" text-anchor="middle" font-size="8" fill="#ef4444">500 Server Err</text>
</svg>`,
/* ── Phase 2: HTML/CSS ── */
p02: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g02" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ec4899"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g02)" opacity=".1"/>
<!-- Code editor -->
<rect x="15" y="20" width="160" height="165" rx="8" fill="#1e293b"/>
<rect x="15" y="20" width="160" height="22" rx="8" fill="#0f172a"/>
<text x="95" y="35" text-anchor="middle" font-size="9" fill="#64748b">index.html</text>
<!-- HTML code lines -->
<text x="22" y="56" font-family="monospace" font-size="8" fill="#f87171">&lt;!</text>
<text x="33" y="56" font-family="monospace" font-size="8" fill="#f87171">DOCTYPE html&gt;</text>
<text x="22" y="68" font-family="monospace" font-size="8" fill="#60a5fa">&lt;html&gt;</text>
<text x="22" y="80" font-family="monospace" font-size="8" fill="#60a5fa"> &lt;head&gt;</text>
<text x="22" y="92" font-family="monospace" font-size="8" fill="#a78bfa"> &lt;title&gt;</text>
<text x="72" y="92" font-family="monospace" font-size="8" fill="#fbbf24">My Page</text>
<text x="109" y="92" font-family="monospace" font-size="8" fill="#a78bfa">&lt;/title&gt;</text>
<text x="22" y="104" font-family="monospace" font-size="8" fill="#60a5fa"> &lt;/head&gt;</text>
<text x="22" y="116" font-family="monospace" font-size="8" fill="#60a5fa"> &lt;body&gt;</text>
<text x="22" y="128" font-family="monospace" font-size="8" fill="#4ade80"> &lt;header&gt;</text>
<text x="22" y="140" font-family="monospace" font-size="8" fill="#f59e0b"> &lt;h1&gt;</text>
<text x="62" y="140" font-family="monospace" font-size="8" fill="#fbbf24">Hello!</text>
<text x="94" y="140" font-family="monospace" font-size="8" fill="#f59e0b">&lt;/h1&gt;</text>
<text x="22" y="152" font-family="monospace" font-size="8" fill="#4ade80"> &lt;/header&gt;</text>
<text x="22" y="164" font-family="monospace" font-size="8" fill="#60a5fa"> &lt;/body&gt;</text>
<text x="22" y="176" font-family="monospace" font-size="8" fill="#60a5fa">&lt;/html&gt;</text>
<!-- Preview pane -->
<rect x="185" y="20" width="120" height="165" rx="8" fill="white"/>
<rect x="185" y="20" width="120" height="28" rx="8" fill="#f1f5f9"/>
<text x="245" y="38" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Preview</text>
<!-- Layout preview -->
<rect x="192" y="55" width="106" height="18" rx="3" fill="#3b82f6"/>
<text x="245" y="67" text-anchor="middle" font-size="8" fill="white">Header</text>
<rect x="192" y="78" width="65" height="80" rx="3" fill="#e2e8f0"/>
<text x="225" y="120" text-anchor="middle" font-size="8" fill="#64748b">Sidebar</text>
<rect x="261" y="78" width="37" height="80" rx="3" fill="#f0f9ff"/>
<text x="280" y="120" text-anchor="middle" font-size="7" fill="#94a3b8">Main</text>
<rect x="192" y="163" width="106" height="14" rx="3" fill="#94a3b8"/>
<text x="245" y="173" text-anchor="middle" font-size="7" fill="white">Footer</text>
<!-- CSS badge -->
<circle cx="290" cy="35" r="12" fill="#ec4899" opacity=".15"/>
<text x="290" y="40" text-anchor="middle" font-size="11">🎨</text>
</svg>`,
/* ── Phase 3: JavaScript ── */
p03: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="phase-illus"><rect width="320" height="160" rx="12" fill="#0f172a"/><rect x="15" y="15" width="55" height="55" rx="6" fill="#f7df1e"/><text x="30" y="58" font-family="monospace" font-size="28" font-weight="bold" fill="#1a1a1a">JS</text><rect x="80" y="10" width="225" height="140" rx="8" fill="#1e293b"/><text x="90" y="35" font-family="monospace" font-size="8" fill="#64748b">// 関数・配列・DOM・fetch</text><text x="90" y="50" font-family="monospace" font-size="8" fill="#a78bfa">const</text><text x="118" y="50" font-family="monospace" font-size="8" fill="#e2e8f0"> tasks = [];</text><text x="90" y="65" font-family="monospace" font-size="8" fill="#4ade80">tasks.map</text><text x="132" y="65" font-family="monospace" font-size="8" fill="#e2e8f0">(t =&gt; t.title)</text><text x="90" y="80" font-family="monospace" font-size="8" fill="#60a5fa">fetch</text><text x="112" y="80" font-family="monospace" font-size="8" fill="#e2e8f0">('/api/tasks')</text><text x="90" y="95" font-family="monospace" font-size="8" fill="#60a5fa">  .then</text><text x="117" y="95" font-family="monospace" font-size="8" fill="#e2e8f0">(r =&gt; r.json())</text><text x="90" y="115" font-family="monospace" font-size="8" fill="#64748b">// イベント</text><text x="90" y="130" font-family="monospace" font-size="8" fill="#f59e0b">btn.addEventListener</text><text x="90" y="143" font-family="monospace" font-size="8" fill="#e2e8f0">('click', handler)</text><text x="15" y="115" font-size="22" text-anchor="middle">⚡</text><text x="15" y="140" font-size="20" text-anchor="middle">🎯</text></svg>`,
/* ── Phase 4: Git/GitHub ── */
p04: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g04" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#6366f1"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g04)" opacity=".1"/>
<!-- Git branch visualization -->
<!-- main branch line -->
<line x1="30" y1="100" x2="290" y2="100" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
<!-- Commits on main -->
<circle cx="50" cy="100" r="10" fill="#6366f1" stroke="#fff" stroke-width="2"/>
<text x="50" y="104" text-anchor="middle" font-size="8" fill="white">A</text>
<circle cx="100" cy="100" r="10" fill="#6366f1" stroke="#fff" stroke-width="2"/>
<text x="100" y="104" text-anchor="middle" font-size="8" fill="white">B</text>
<circle cx="270" cy="100" r="10" fill="#6366f1" stroke="#fff" stroke-width="2"/>
<text x="270" y="104" text-anchor="middle" font-size="8" fill="white">E</text>
<!-- feature branch -->
<path d="M100,100 Q100,55 140,55" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<line x1="140" y1="55" x2="230" y2="55" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
<path d="M230,55 Q270,55 270,100" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<!-- Commits on feature -->
<circle cx="155" cy="55" r="9" fill="#22c55e" stroke="#fff" stroke-width="2"/>
<text x="155" y="59" text-anchor="middle" font-size="8" fill="white">C</text>
<circle cx="210" cy="55" r="9" fill="#22c55e" stroke="#fff" stroke-width="2"/>
<text x="210" y="59" text-anchor="middle" font-size="8" fill="white">D</text>
<!-- Labels -->
<text x="30" y="125" font-size="10" fill="#94a3b8" font-weight="bold">main</text>
<text x="148" y="40" font-size="9" fill="#22c55e">feature/add-login</text>
<!-- PR badge -->
<rect x="185" y="150" width="110" height="35" rx="8" fill="#6366f1" opacity=".15" stroke="#6366f1" stroke-width="1"/>
<text x="240" y="165" text-anchor="middle" font-size="10" font-weight="bold" fill="#6366f1">Pull Request</text>
<text x="240" y="178" text-anchor="middle" font-size="8" fill="#94a3b8">Review → Merge ✅</text>
<!-- Commands -->
<rect x="15" y="145" width="160" height="40" rx="6" fill="#0f172a"/>
<text x="22" y="160" font-family="monospace" font-size="8" fill="#22c55e">$ git switch -c feature/xxx</text>
<text x="22" y="172" font-family="monospace" font-size="8" fill="#60a5fa">$ git add . && git commit</text>
<text x="22" y="184" font-family="monospace" font-size="8" fill="#a78bfa">$ git push origin feature/xxx</text>
</svg>`,
/* ── Phase 5: React ── */
p05: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g05" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#8b5cf6"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g05)" opacity=".1"/>
<!-- React atom logo -->
<circle cx="60" cy="100" r="8" fill="#61dafb"/>
<ellipse cx="60" cy="100" rx="28" ry="9" fill="none" stroke="#61dafb" stroke-width="2" opacity=".7"/>
<ellipse cx="60" cy="100" rx="28" ry="9" fill="none" stroke="#61dafb" stroke-width="2" transform="rotate(60 60 100)" opacity=".7"/>
<ellipse cx="60" cy="100" rx="28" ry="9" fill="none" stroke="#61dafb" stroke-width="2" transform="rotate(120 60 100)" opacity=".7"/>
<!-- Component tree -->
<rect x="100" y="20" width="200" height="30" rx="6" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5"/>
<text x="200" y="40" text-anchor="middle" font-size="10" fill="#a78bfa">App.jsx</text>
<!-- Level 2 -->
<line x1="155" y1="50" x2="130" y2="75" stroke="#475569" stroke-width="1.5"/>
<line x1="200" y1="50" x2="200" y2="75" stroke="#475569" stroke-width="1.5"/>
<line x1="245" y1="50" x2="270" y2="75" stroke="#475569" stroke-width="1.5"/>
<rect x="95" y="75" width="80" height="25" rx="5" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
<text x="135" y="91" text-anchor="middle" font-size="9" fill="#4ade80">TaskForm</text>
<rect x="160" y="75" width="80" height="25" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
<text x="200" y="91" text-anchor="middle" font-size="9" fill="#fbbf24">TaskList</text>
<rect x="225" y="75" width="80" height="25" rx="5" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/>
<text x="265" y="91" text-anchor="middle" font-size="9" fill="#22d3ee">FilterBar</text>
<!-- Level 3 -->
<line x1="200" y1="100" x2="200" y2="120" stroke="#475569" stroke-width="1.5"/>
<rect x="160" y="120" width="80" height="25" rx="5" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5"/>
<text x="200" y="136" text-anchor="middle" font-size="9" fill="#fb7185">TaskItem</text>
<!-- Props arrows -->
<text x="100" y="115" font-size="8" fill="#6b7280">props ↓</text>
<text x="100" y="150" font-size="8" fill="#22c55e">useState 🔄</text>
<text x="100" y="165" font-size="8" fill="#60a5fa">useEffect ⚡</text>
<text x="100" y="180" font-size="8" fill="#a78bfa">callback ↑</text>
</svg>`,
/* ── Phase 6: Next.js ── */
p06: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g06" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="#374151"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="#0f172a"/>
<!-- Next.js logo -->
<circle cx="50" cy="50" r="28" fill="#fff"/>
<text x="50" y="58" text-anchor="middle" font-size="24" font-weight="bold" fill="#000">N</text>
<!-- File tree -->
<rect x="95" y="15" width="210" height="170" rx="8" fill="#1e293b"/>
<text x="120" y="32" font-size="9" fill="#94a3b8" font-weight="bold">app/</text>
<text x="130" y="48" font-size="9" fill="#60a5fa">layout.tsx</text>
<text x="130" y="62" font-size="9" fill="#4ade80">page.tsx</text>
<text x="130" y="76" font-size="9" fill="#fbbf24">loading.tsx</text>
<text x="130" y="90" font-size="9" fill="#f87171">error.tsx</text>
<text x="130" y="104" font-size="9" fill="#a78bfa" font-style="italic">about/</text>
<text x="145" y="118" font-size="9" fill="#4ade80"> page.tsx</text>
<text x="130" y="132" font-size="9" fill="#a78bfa" font-style="italic">posts/[id]/</text>
<text x="145" y="146" font-size="9" fill="#4ade80"> page.tsx</text>
<text x="130" y="160" font-size="9" fill="#06b6d4" font-style="italic">api/route.ts</text>
<!-- URL mapping arrows -->
<line x1="215" y1="62" x2="245" y2="62" stroke="#4ade80" stroke-width="1" stroke-dasharray="3"/>
<text x="250" y="66" font-size="8" fill="#4ade80">/</text>
<line x1="215" y1="118" x2="245" y2="118" stroke="#4ade80" stroke-width="1" stroke-dasharray="3"/>
<text x="250" y="122" font-size="8" fill="#4ade80">/about</text>
<line x1="215" y1="146" x2="245" y2="146" stroke="#4ade80" stroke-width="1" stroke-dasharray="3"/>
<text x="250" y="150" font-size="8" fill="#4ade80">/posts/1</text>
<line x1="215" y1="160" x2="245" y2="160" stroke="#06b6d4" stroke-width="1" stroke-dasharray="3"/>
<text x="250" y="164" font-size="8" fill="#06b6d4">/api/xxx</text>
<!-- Vercel badge -->
<rect x="20" y="95" width="65" height="25" rx="5" fill="#fff" opacity=".9"/>
<text x="52" y="112" text-anchor="middle" font-size="10" font-weight="bold" fill="#000">▲ Vercel</text>
<!-- Server label -->
<rect x="20" y="130" width="65" height="20" rx="4" fill="#22c55e" opacity=".2"/>
<text x="52" y="143" text-anchor="middle" font-size="8" fill="#22c55e">Server Comp.</text>
<rect x="20" y="155" width="65" height="20" rx="4" fill="#3b82f6" opacity=".2"/>
<text x="52" y="168" text-anchor="middle" font-size="8" fill="#60a5fa">Client Comp.</text>
</svg>`,
/* ── Phase 7: Java ── */
p07: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g07" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#dc2626"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g07)" opacity=".1"/>
<!-- Java coffee cup -->
<rect x="20" y="40" width="60" height="60" rx="8" fill="#f97316" opacity=".8"/>
<rect x="25" y="48" width="50" height="44" rx="5" fill="#1e293b"/>
<text x="50" y="80" text-anchor="middle" font-size="28">☕</text>
<path d="M80,60 Q95,60 95,75 Q95,90 80,90" fill="none" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
<!-- OOP pyramid -->
<rect x="95" y="15" width="210" height="35" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/>
<text x="200" y="37" text-anchor="middle" font-size="11" font-weight="bold" fill="#fb923c">カプセル化</text>
<rect x="105" y="58" width="190" height="30" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
<text x="200" y="78" text-anchor="middle" font-size="11" font-weight="bold" fill="#fbbf24">継承 (extends)</text>
<rect x="115" y="96" width="170" height="30" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
<text x="200" y="116" text-anchor="middle" font-size="11" font-weight="bold" fill="#4ade80">ポリモーフィズム</text>
<rect x="125" y="134" width="150" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/>
<text x="200" y="154" text-anchor="middle" font-size="11" font-weight="bold" fill="#22d3ee">インターフェース</text>
<!-- Error -->
<rect x="15" y="140" width="75" height="50" rx="6" fill="#1e293b"/>
<text x="52" y="155" text-anchor="middle" font-size="7" fill="#f87171">NullPointerExcept</text>
<text x="52" y="167" text-anchor="middle" font-size="7" fill="#f87171">ClassCastException</text>
<text x="52" y="179" text-anchor="middle" font-size="7" fill="#fbbf24">try-catch-finally</text>
</svg>`,
/* ── Phase 8: SQL/DB ── */
p08: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g08" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#6366f1"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g08)" opacity=".1"/>
<!-- Users table -->
<rect x="15" y="15" width="130" height="110" rx="6" fill="#1e293b"/>
<rect x="15" y="15" width="130" height="22" rx="6" fill="#0ea5e9" opacity=".7"/>
<text x="80" y="30" text-anchor="middle" font-size="10" font-weight="bold" fill="white">users</text>
<text x="25" y="50" font-size="8" fill="#fbbf24">🔑 id</text><text x="85" y="50" font-size="8" fill="#94a3b8">INT PK</text>
<text x="25" y="63" font-size="8" fill="#e2e8f0">name</text><text x="85" y="63" font-size="8" fill="#64748b">VARCHAR</text>
<text x="25" y="76" font-size="8" fill="#e2e8f0">email</text><text x="85" y="76" font-size="8" fill="#64748b">UNIQUE</text>
<line x1="20" y1="82" x2="140" y2="82" stroke="#334155" stroke-width="1"/>
<text x="25" y="95" font-size="8" fill="#94a3b8">1</text><text x="35" y="95" font-size="8" fill="#e2e8f0">山田太郎</text>
<text x="25" y="107" font-size="8" fill="#94a3b8">2</text><text x="35" y="107" font-size="8" fill="#e2e8f0">鈴木花子</text>
<text x="25" y="119" font-size="8" fill="#94a3b8">3</text><text x="35" y="119" font-size="8" fill="#e2e8f0">田中一郎</text>
<!-- Relation line -->
<line x1="145" y1="70" x2="175" y2="70" stroke="#94a3b8" stroke-width="2"/>
<text x="160" y="65" text-anchor="middle" font-size="9" fill="#94a3b8">1</text>
<text x="168" y="80" text-anchor="middle" font-size="9" fill="#94a3b8">N</text>
<!-- Tasks table -->
<rect x="175" y="15" width="130" height="125" rx="6" fill="#1e293b"/>
<rect x="175" y="15" width="130" height="22" rx="6" fill="#6366f1" opacity=".7"/>
<text x="240" y="30" text-anchor="middle" font-size="10" font-weight="bold" fill="white">tasks</text>
<text x="185" y="50" font-size="8" fill="#fbbf24">🔑 id</text>
<text x="185" y="63" font-size="8" fill="#f87171">🔗 user_id</text><text x="235" y="63" font-size="8" fill="#64748b">FK</text>
<text x="185" y="76" font-size="8" fill="#e2e8f0">title</text>
<text x="185" y="89" font-size="8" fill="#e2e8f0">priority</text><text x="230" y="89" font-size="8" fill="#64748b">ENUM</text>
<text x="185" y="102" font-size="8" fill="#e2e8f0">done</text><text x="220" y="102" font-size="8" fill="#64748b">BOOLEAN</text>
<line x1="180" y1="108" x2="300" y2="108" stroke="#334155" stroke-width="1"/>
<text x="185" y="120" font-size="8" fill="#94a3b8">1</text><text x="195" y="120" font-size="8" fill="#e2e8f0">HTML学習</text>
<text x="185" y="132" font-size="8" fill="#94a3b8">2</text><text x="195" y="132" font-size="8" fill="#e2e8f0">CSS習得</text>
<!-- SQL query -->
<rect x="15" y="140" width="290" height="50" rx="6" fill="#0f172a"/>
<text x="25" y="155" font-family="monospace" font-size="8" fill="#60a5fa">SELECT</text>
<text x="60" y="155" font-family="monospace" font-size="8" fill="#e2e8f0"> u.name, t.title</text>
<text x="25" y="167" font-family="monospace" font-size="8" fill="#60a5fa">FROM</text>
<text x="50" y="167" font-family="monospace" font-size="8" fill="#fbbf24"> users u</text>
<text x="90" y="167" font-family="monospace" font-size="8" fill="#60a5fa"> JOIN</text>
<text x="112" y="167" font-family="monospace" font-size="8" fill="#fbbf24"> tasks t</text>
<text x="150" y="167" font-family="monospace" font-size="8" fill="#60a5fa"> ON</text>
<text x="165" y="167" font-family="monospace" font-size="8" fill="#e2e8f0"> u.id = t.user_id</text>
<text x="25" y="179" font-family="monospace" font-size="8" fill="#60a5fa">WHERE</text>
<text x="58" y="179" font-family="monospace" font-size="8" fill="#e2e8f0"> t.done = </text>
<text x="105" y="179" font-family="monospace" font-size="8" fill="#4ade80">FALSE</text>
</svg>`,
/* ── Phase 9: Spring Boot ── */
p09: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g09" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#10b981"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g09)" opacity=".1"/>
<!-- Spring Boot logo leaf -->
<path d="M35,100 Q35,40 80,40 Q55,70 70,100 Q55,130 80,160 Q35,160 35,100 Z" fill="#22c55e" opacity=".8"/>
<path d="M80,40 Q125,40 125,100 Q125,160 80,160 Q105,130 90,100 Q105,70 80,40 Z" fill="#16a34a" opacity=".9"/>
<!-- 3 Layer architecture -->
<rect x="140" y="15" width="165" height="38" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
<text x="222" y="33" text-anchor="middle" font-size="10" font-weight="bold" fill="#fbbf24">@RestController</text>
<text x="222" y="46" text-anchor="middle" font-size="8" fill="#94a3b8">@GetMapping @PostMapping</text>
<line x1="222" y1="53" x2="222" y2="68" stroke="#475569" stroke-width="2" marker-end="url(#arrD)"/>
<rect x="140" y="68" width="165" height="38" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
<text x="222" y="85" text-anchor="middle" font-size="10" font-weight="bold" fill="#4ade80">@Service</text>
<text x="222" y="98" text-anchor="middle" font-size="8" fill="#94a3b8">@Transactional ビジネスロジック</text>
<line x1="222" y1="106" x2="222" y2="121" stroke="#475569" stroke-width="2"/>
<rect x="140" y="121" width="165" height="38" rx="6" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
<text x="222" y="138" text-anchor="middle" font-size="10" font-weight="bold" fill="#c4b5fd">@Repository</text>
<text x="222" y="151" text-anchor="middle" font-size="8" fill="#94a3b8">JpaRepository DB操作</text>
<!-- DB cylinder -->
<ellipse cx="222" cy="173" rx="35" ry="8" fill="#334155" stroke="#64748b" stroke-width="1"/>
<rect x="187" y="165" width="70" height="16" fill="#334155"/>
<ellipse cx="222" cy="165" rx="35" ry="8" fill="#475569" stroke="#64748b" stroke-width="1"/>
<text x="222" y="170" text-anchor="middle" font-size="8" fill="#94a3b8">MySQL</text>
<!-- HTTP badge -->
<rect x="20" y="155" width="110" height="35" rx="6" fill="#0f172a"/>
<text x="75" y="170" text-anchor="middle" font-family="monospace" font-size="8" fill="#60a5fa">POST /api/tasks</text>
<text x="75" y="183" text-anchor="middle" font-family="monospace" font-size="8" fill="#fbbf24">{"title": "学習"}</text>
</svg>`,
/* ── Phase 10: Python ── */
p10: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="phase-illus"><rect width="320" height="160" rx="12" fill="#0f172a"/><rect x="15" y="20" width="45" height="45" rx="6" fill="#3b82f6"/><rect x="15" y="70" width="45" height="45" rx="6" fill="#f7df1e"/><text x="37" y="50" text-anchor="middle" font-size="20" fill="white">🐍</text><text x="37" y="102" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#333">PY</text><rect x="70" y="10" width="235" height="60" rx="8" fill="#1e293b"/><text x="80" y="30" font-family="monospace" font-size="8" fill="#64748b">import pandas as pd</text><text x="80" y="44" font-family="monospace" font-size="8" fill="#a78bfa">df</text><text x="90" y="44" font-family="monospace" font-size="8" fill="#e2e8f0"> = pd.read_csv("data.csv")</text><text x="80" y="58" font-family="monospace" font-size="8" fill="#e2e8f0">df.groupby("dept")["score"].mean()</text><rect x="70" y="80" width="235" height="70" rx="8" fill="#1e293b"/><text x="175" y="97" text-anchor="middle" font-size="9" fill="#64748b">月次売上グラフ</text><rect x="85" y="110" width="16" height="30" rx="2" fill="#3b82f6" opacity=".8"/><rect x="110" y="100" width="16" height="40" rx="2" fill="#8b5cf6" opacity=".8"/><rect x="135" y="90" width="16" height="50" rx="2" fill="#22c55e" opacity=".8"/><rect x="160" y="105" width="16" height="35" rx="2" fill="#f59e0b" opacity=".8"/><rect x="185" y="95" width="16" height="45" rx="2" fill="#06b6d4" opacity=".8"/><rect x="210" y="85" width="16" height="55" rx="2" fill="#f43f5e" opacity=".8"/><line x1="80" y1="140" x2="300" y2="140" stroke="#334155" stroke-width="1"/></svg>`,
/* ── Phase 11: AI駆動開発 ── */
p11: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g11" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g11)" opacity=".1"/>
<!-- AI brain circuit -->
<circle cx="70" cy="100" r="45" fill="#1e293b" stroke="#8b5cf6" stroke-width="2"/>
<!-- Brain connections -->
<circle cx="70" cy="100" r="8" fill="#8b5cf6"/>
<circle cx="50" cy="80" r="5" fill="#a78bfa" opacity=".7"/>
<circle cx="90" cy="80" r="5" fill="#a78bfa" opacity=".7"/>
<circle cx="45" cy="108" r="5" fill="#c4b5fd" opacity=".7"/>
<circle cx="95" cy="112" r="5" fill="#c4b5fd" opacity=".7"/>
<circle cx="60" cy="125" r="5" fill="#ddd6fe" opacity=".7"/>
<circle cx="80" cy="122" r="5" fill="#ddd6fe" opacity=".7"/>
<line x1="70" y1="92" x2="50" y2="85" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<line x1="70" y1="92" x2="90" y2="85" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<line x1="70" y1="108" x2="45" y2="113" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<line x1="70" y1="108" x2="95" y2="117" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<line x1="70" y1="108" x2="60" y2="120" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<line x1="70" y1="108" x2="80" y2="117" stroke="#8b5cf6" stroke-width="1.5" opacity=".6"/>
<text x="70" y="56" text-anchor="middle" font-size="18">🤖</text>
<!-- Claude Code label -->
<rect x="120" y="15" width="185" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5"/>
<text x="212" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#c4b5fd">Claude Code</text>
<text x="212" y="47" text-anchor="middle" font-size="8" fill="#94a3b8">ターミナルで動くAIパートナー</text>
<!-- Prompt -->
<rect x="120" y="65" width="185" height="55" rx="6" fill="#0f172a"/>
<text x="130" y="80" font-size="8" fill="#64748b">CLAUDE.md</text>
<text x="130" y="93" font-family="monospace" font-size="7" fill="#4ade80">• Spring Boot 3.x</text>
<text x="130" y="104" font-family="monospace" font-size="7" fill="#60a5fa">• Java 17 / MySQL</text>
<text x="130" y="115" font-family="monospace" font-size="7" fill="#a78bfa">• コメントは日本語</text>
<!-- AI usage log -->
<rect x="120" y="130" width="185" height="55" rx="6" fill="#1e293b"/>
<text x="212" y="146" text-anchor="middle" font-size="9" font-weight="bold" fill="#fbbf24">AI利用ログ</text>
<text x="130" y="159" font-size="7" fill="#94a3b8">✅ 採用: DTO設計の叩き台</text>
<text x="130" y="170" font-size="7" fill="#f87171">✏️ 修正: バリデーション追加</text>
<text x="130" y="181" font-size="7" fill="#64748b">❌ 却下: Entityの直接返却</text>
</svg>`,
/* ── Phase 12: フルスタック最終制作 ── */
p12: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" class="phase-illus">
<defs>
<linearGradient id="g12" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#8b5cf6"/>
</linearGradient>
</defs>
<rect width="320" height="200" rx="16" fill="url(#g12)" opacity=".1"/>
<!-- Trophy -->
<text x="30" y="50" font-size="40">🏆</text>
<!-- Full stack arch -->
<rect x="90" y="10" width="75" height="50" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
<text x="127" y="30" text-anchor="middle" font-size="9" font-weight="bold" fill="#60a5fa">Next.js</text>
<text x="127" y="43" text-anchor="middle" font-size="8" fill="#94a3b8">TypeScript</text>
<text x="127" y="54" text-anchor="middle" font-size="7" fill="#64748b">Vercel ▲</text>
<!-- Arrow -->
<line x1="165" y1="35" x2="185" y2="35" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4"/>
<text x="175" y="30" text-anchor="middle" font-size="8" fill="#94a3b8">API</text>
<rect x="185" y="10" width="75" height="50" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
<text x="222" y="30" text-anchor="middle" font-size="9" font-weight="bold" fill="#4ade80">Spring Boot</text>
<text x="222" y="43" text-anchor="middle" font-size="8" fill="#94a3b8">Java 17</text>
<text x="222" y="54" text-anchor="middle" font-size="7" fill="#64748b">Render 🌐</text>
<!-- Arrow -->
<line x1="260" y1="35" x2="280" y2="35" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4"/>
<rect x="280" y="22" width="35" height="26" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
<text x="297" y="35" text-anchor="middle" font-size="8" font-weight="bold" fill="#fbbf24">MySQL</text>
<!-- Portfolio section -->
<rect x="15" y="75" width="290" height="50" rx="6" fill="#0f172a"/>
<text x="160" y="92" text-anchor="middle" font-size="9" font-weight="bold" fill="#f43f5e">🎓 卒業制作テーマ選択</text>
<rect x="22" y="98" width="55" height="20" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
<text x="49" y="112" text-anchor="middle" font-size="7" fill="#60a5fa">タスク管理</text>
<rect x="83" y="98" width="55" height="20" rx="3" fill="#1e293b" stroke="#8b5cf6" stroke-width="1"/>
<text x="110" y="112" text-anchor="middle" font-size="7" fill="#a78bfa">学習記録</text>
<rect x="144" y="98" width="55" height="20" rx="3" fill="#1e293b" stroke="#22c55e" stroke-width="1"/>
<text x="171" y="112" text-anchor="middle" font-size="7" fill="#4ade80">勤怠管理</text>
<rect x="205" y="98" width="55" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
<text x="232" y="112" text-anchor="middle" font-size="7" fill="#fbbf24">CRM</text>
<rect x="266" y="98" width="32" height="20" rx="3" fill="#1e293b" stroke="#ec4899" stroke-width="1"/>
<text x="282" y="112" text-anchor="middle" font-size="7" fill="#f9a8d4">AI…</text>
<!-- Interview prep -->
<rect x="15" y="135" width="290" height="55" rx="6" fill="#1e293b"/>
<text x="160" y="152" text-anchor="middle" font-size="9" font-weight="bold" fill="#fbbf24">🎤 面談想定質問 23問</text>
<text x="30" y="167" font-size="8" fill="#94a3b8">「なぜこのアプリを作りましたか？」</text>
<text x="30" y="179" font-size="8" fill="#94a3b8">「DB設計で気をつけた点は？」</text>
<text x="30" y="191" font-size="8" fill="#94a3b8">「AIをどのように活用しましたか？」</text>
</svg>`
}; // end PHASE_ILLUSTRATIONS