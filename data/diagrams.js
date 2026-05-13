/* =========================================================
   data/diagrams.js  ─  インラインSVG/HTML図解集
   外部画像に依存しない・全てSVG/HTML/CSSで描画
   ========================================================= */
window.DIAGRAMS = {

/* ── Web アプリ 3層構成図 ── */
webApp3Layer: `
<div class="diagram-wrap">
<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#6b7280"/>
    </marker>
    <marker id="arr2" markerWidth="8" markerHeight="6" refX="2" refY="3" orient="auto">
      <polygon points="8 0, 0 3, 8 6" fill="#6b7280"/>
    </marker>
  </defs>
  <!-- ブラウザ（フロント） -->
  <rect x="20" y="90" width="130" height="100" rx="10" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="85" y="118" text-anchor="middle" font-size="13" font-weight="bold" fill="#1d4ed8">ブラウザ</text>
  <text x="85" y="138" text-anchor="middle" font-size="11" fill="#1d4ed8">（フロントエンド）</text>
  <text x="85" y="155" text-anchor="middle" font-size="10" fill="#3b82f6">HTML/CSS/JS</text>
  <text x="85" y="170" text-anchor="middle" font-size="10" fill="#3b82f6">React/Next.js</text>
  <!-- 矢印 双方向 -->
  <line x1="150" y1="130" x2="195" y2="130" stroke="#6b7280" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="195" y1="145" x2="150" y2="145" stroke="#6b7280" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="172" y="125" text-anchor="middle" font-size="9" fill="#6b7280">Request</text>
  <text x="172" y="160" text-anchor="middle" font-size="9" fill="#6b7280">Response</text>
  <!-- サーバー（バックエンド） -->
  <rect x="195" y="70" width="130" height="140" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="260" y="100" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803d">Webサーバー</text>
  <text x="260" y="118" text-anchor="middle" font-size="11" fill="#15803d">（バックエンド）</text>
  <text x="260" y="138" text-anchor="middle" font-size="10" fill="#16a34a">Spring Boot</text>
  <text x="260" y="153" text-anchor="middle" font-size="10" fill="#16a34a">Controller</text>
  <text x="260" y="168" text-anchor="middle" font-size="10" fill="#16a34a">Service</text>
  <text x="260" y="183" text-anchor="middle" font-size="10" fill="#16a34a">Repository</text>
  <!-- 矢印 双方向 -->
  <line x1="325" y1="130" x2="370" y2="130" stroke="#6b7280" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="370" y1="145" x2="325" y2="145" stroke="#6b7280" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="348" y="125" text-anchor="middle" font-size="9" fill="#6b7280">SQL</text>
  <text x="348" y="160" text-anchor="middle" font-size="9" fill="#6b7280">結果</text>
  <!-- DB -->
  <rect x="370" y="90" width="130" height="100" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="435" y="118" text-anchor="middle" font-size="13" font-weight="bold" fill="#b45309">Database</text>
  <text x="435" y="138" text-anchor="middle" font-size="11" fill="#b45309">MySQL / H2</text>
  <text x="435" y="158" text-anchor="middle" font-size="10" fill="#d97706">テーブル / レコード</text>
  <text x="435" y="173" text-anchor="middle" font-size="10" fill="#d97706">SELECT / INSERT</text>
  <!-- ラベル -->
  <text x="85" y="210" text-anchor="middle" font-size="11" fill="#6b7280">① UI表示・操作</text>
  <text x="260" y="230" text-anchor="middle" font-size="11" fill="#6b7280">② ビジネスロジック</text>
  <text x="435" y="210" text-anchor="middle" font-size="11" fill="#6b7280">③ データ永続化</text>
</svg>
<p class="diagram-caption">Webアプリの3層アーキテクチャ：フロントエンド・バックエンド・データベース</p>
</div>`,

/* ── HTTP リクエスト/レスポンス図 ── */
httpFlow: `
<div class="diagram-wrap">
<svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <defs>
    <marker id="arrf" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#3b82f6"/>
    </marker>
    <marker id="arrb" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#16a34a"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="20" y="60" width="100" height="100" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="70" y="102" text-anchor="middle" font-size="14" font-weight="bold" fill="#1d4ed8">Client</text>
  <text x="70" y="120" text-anchor="middle" font-size="11" fill="#3b82f6">ブラウザ</text>
  <text x="70" y="136" text-anchor="middle" font-size="11" fill="#3b82f6">アプリ</text>
  <!-- Server -->
  <rect x="380" y="60" width="100" height="100" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <text x="430" y="102" text-anchor="middle" font-size="14" font-weight="bold" fill="#15803d">Server</text>
  <text x="430" y="120" text-anchor="middle" font-size="11" fill="#16a34a">Spring Boot</text>
  <text x="430" y="136" text-anchor="middle" font-size="11" fill="#16a34a">API</text>
  <!-- Request arrow -->
  <line x1="120" y1="90" x2="380" y2="90" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrf)" stroke-dasharray="none"/>
  <rect x="175" y="55" width="150" height="30" rx="5" fill="#dbeafe"/>
  <text x="250" y="70" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">① HTTP Request</text>
  <text x="250" y="83" text-anchor="middle" font-size="10" fill="#3b82f6">GET /api/tasks  Headers: {…}</text>
  <!-- Response arrow -->
  <line x1="380" y1="130" x2="120" y2="130" stroke="#16a34a" stroke-width="2" marker-end="url(#arrb)"/>
  <rect x="175" y="132" width="150" height="42" rx="5" fill="#dcfce7"/>
  <text x="250" y="147" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">② HTTP Response</text>
  <text x="250" y="161" text-anchor="middle" font-size="10" fill="#16a34a">Status: 200 OK</text>
  <text x="250" y="174" text-anchor="middle" font-size="10" fill="#16a34a">Body: [{id:1, title:…}]</text>
  <!-- Status codes hint -->
  <text x="250" y="200" text-anchor="middle" font-size="10" fill="#6b7280">200=成功 | 201=作成 | 400=Bad Request | 401=認証 | 404=Not Found | 500=サーバーエラー</text>
</svg>
<p class="diagram-caption">HTTPリクエスト/レスポンスの流れとステータスコード</p>
</div>`,

/* ── Spring Boot 3層構造 ── */
springBoot3Layer: `
<div class="diagram-wrap">
<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <defs>
    <marker id="arrdown" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
      <polygon points="0 0, 8 0, 4 6" fill="#6b7280"/>
    </marker>
    <marker id="arrup" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
      <polygon points="0 6, 8 6, 4 0" fill="#6b7280"/>
    </marker>
  </defs>
  <!-- HTTP Client -->
  <rect x="160" y="10" width="160" height="45" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="240" y="33" text-anchor="middle" font-size="13" font-weight="bold" fill="#1d4ed8">HTTP Client</text>
  <text x="240" y="48" text-anchor="middle" font-size="10" fill="#3b82f6">Postman / Next.js / ブラウザ</text>
  <!-- Arrow down -->
  <line x1="240" y1="55" x2="240" y2="75" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arrdown)"/>
  <text x="255" y="68" font-size="9" fill="#6b7280">@RequestBody / @PathVariable</text>
  <!-- Controller -->
  <rect x="100" y="75" width="280" height="55" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="240" y="98" text-anchor="middle" font-size="14" font-weight="bold" fill="#b45309">① Controller</text>
  <text x="240" y="114" text-anchor="middle" font-size="10" fill="#92400e">@RestController  @GetMapping  @PostMapping</text>
  <text x="240" y="127" text-anchor="middle" font-size="10" fill="#92400e">HTTPリクエストを受け付けてServiceに委譲。ResponseEntityで返す。</text>
  <!-- Arrow down -->
  <line x1="240" y1="130" x2="240" y2="152" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arrdown)"/>
  <!-- Service -->
  <rect x="100" y="152" width="280" height="55" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
  <text x="240" y="175" text-anchor="middle" font-size="14" font-weight="bold" fill="#15803d">② Service</text>
  <text x="240" y="191" text-anchor="middle" font-size="10" fill="#166534">@Service  @Transactional</text>
  <text x="240" y="204" text-anchor="middle" font-size="10" fill="#166534">ビジネスロジック / バリデーション / DTOとEntityの変換</text>
  <!-- Arrow down -->
  <line x1="240" y1="207" x2="240" y2="229" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arrdown)"/>
  <!-- Repository -->
  <rect x="100" y="229" width="280" height="55" rx="8" fill="#fdf4ff" stroke="#a855f7" stroke-width="2"/>
  <text x="240" y="252" text-anchor="middle" font-size="14" font-weight="bold" fill="#7e22ce">③ Repository</text>
  <text x="240" y="268" text-anchor="middle" font-size="10" fill="#6b21a8">@Repository  JpaRepository&lt;Entity, Long&gt;</text>
  <text x="240" y="281" text-anchor="middle" font-size="10" fill="#6b21a8">DBのCRUD操作。findAll・save・deleteByIdが自動生成。</text>
  <!-- Arrow down -->
  <line x1="240" y1="284" x2="240" y2="304" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arrdown)"/>
  <!-- DB -->
  <rect x="170" y="304" width="140" height="12" rx="3" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
  <text x="240" y="315" text-anchor="middle" font-size="10" fill="#4b5563">MySQL / H2 Database</text>
</svg>
<p class="diagram-caption">Spring Bootの3層アーキテクチャ（Controller → Service → Repository → DB）</p>
</div>`,

/* ── Git フロー図 ── */
gitFlow: `
<div class="diagram-wrap">
<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <!-- Lanes -->
  <rect x="0" y="30" width="520" height="40" rx="0" fill="#fef3c7" opacity="0.5"/>
  <rect x="0" y="70" width="520" height="40" rx="0" fill="#dbeafe" opacity="0.5"/>
  <rect x="0" y="110" width="520" height="40" rx="0" fill="#dcfce7" opacity="0.5"/>
  <rect x="0" y="150" width="520" height="40" rx="0" fill="#fdf4ff" opacity="0.5"/>
  <!-- Lane labels -->
  <text x="8" y="57" font-size="10" fill="#b45309" font-weight="bold">作業中</text>
  <text x="8" y="97" font-size="10" fill="#1d4ed8" font-weight="bold">main</text>
  <text x="8" y="137" font-size="10" fill="#15803d" font-weight="bold">feature/xxx</text>
  <text x="8" y="177" font-size="10" fill="#7e22ce" font-weight="bold">GitHub</text>
  <!-- Steps -->
  <!-- 1 初期 -->
  <rect x="50" y="80" width="60" height="20" rx="4" fill="#3b82f6"/>
  <text x="80" y="95" text-anchor="middle" font-size="10" fill="white">main:A</text>
  <!-- 2 branch -->
  <rect x="150" y="120" width="80" height="20" rx="4" fill="#16a34a"/>
  <text x="190" y="135" text-anchor="middle" font-size="10" fill="white">git switch -c</text>
  <line x1="80" y1="100" x2="190" y2="120" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="4"/>
  <!-- 3 commit -->
  <rect x="260" y="120" width="70" height="20" rx="4" fill="#16a34a"/>
  <text x="295" y="135" text-anchor="middle" font-size="10" fill="white">commit B</text>
  <line x1="230" y1="130" x2="260" y2="130" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrf)"/>
  <!-- 4 push -->
  <rect x="360" y="160" width="60" height="20" rx="4" fill="#a855f7"/>
  <text x="390" y="175" text-anchor="middle" font-size="10" fill="white">git push</text>
  <line x1="295" y1="140" x2="390" y2="160" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="4"/>
  <!-- 5 PR → merge -->
  <rect x="440" y="80" width="60" height="20" rx="4" fill="#3b82f6"/>
  <text x="470" y="95" text-anchor="middle" font-size="10" fill="white">main:B</text>
  <line x1="390" y1="160" x2="470" y2="100" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="110" y1="90" x2="440" y2="90" stroke="#3b82f6" stroke-width="1.5"/>
  <!-- Labels under -->
  <text x="80" y="210" text-anchor="middle" font-size="10" fill="#6b7280">①cloneまたは\npull</text>
  <text x="190" y="210" text-anchor="middle" font-size="10" fill="#6b7280">②featureブランチ\n作成</text>
  <text x="295" y="210" text-anchor="middle" font-size="10" fill="#6b7280">③変更をcommit</text>
  <text x="390" y="210" text-anchor="middle" font-size="10" fill="#6b7280">④GitHub\nにpush</text>
  <text x="470" y="210" text-anchor="middle" font-size="10" fill="#6b7280">⑤PR→\nmerge</text>
</svg>
<p class="diagram-caption">GitHubFlowの基本的な流れ（ブランチ → コミット → プッシュ → PR → マージ）</p>
</div>`,

/* ── React コンポーネント図 ── */
reactComponents: `
<div class="diagram-wrap">
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <!-- App -->
  <rect x="160" y="10" width="160" height="50" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="240" y="33" text-anchor="middle" font-size="14" font-weight="bold" fill="#1d4ed8">App.jsx</text>
  <text x="240" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">state: tasks, filter</text>
  <!-- Lines down from App -->
  <line x1="200" y1="60" x2="120" y2="100" stroke="#6b7280" stroke-width="1.5"/>
  <line x1="240" y1="60" x2="240" y2="100" stroke="#6b7280" stroke-width="1.5"/>
  <line x1="280" y1="60" x2="360" y2="100" stroke="#6b7280" stroke-width="1.5"/>
  <!-- TaskForm -->
  <rect x="40" y="100" width="130" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="105" y="123" text-anchor="middle" font-size="12" font-weight="bold" fill="#15803d">TaskForm.jsx</text>
  <text x="105" y="140" text-anchor="middle" font-size="10" fill="#16a34a">props: onAdd</text>
  <!-- FilterBar -->
  <rect x="175" y="100" width="130" height="50" rx="8" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
  <text x="240" y="123" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">FilterBar.jsx</text>
  <text x="240" y="140" text-anchor="middle" font-size="10" fill="#ca8a04">props: filter, onFilter</text>
  <!-- TaskList -->
  <rect x="310" y="100" width="130" height="50" rx="8" fill="#fdf4ff" stroke="#a855f7" stroke-width="1.5"/>
  <text x="375" y="123" text-anchor="middle" font-size="12" font-weight="bold" fill="#7e22ce">TaskList.jsx</text>
  <text x="375" y="140" text-anchor="middle" font-size="10" fill="#a855f7">props: tasks, onToggle</text>
  <!-- Lines down from TaskList -->
  <line x1="375" y1="150" x2="375" y2="185" stroke="#6b7280" stroke-width="1.5"/>
  <!-- TaskItem -->
  <rect x="310" y="185" width="130" height="50" rx="8" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="375" y="208" text-anchor="middle" font-size="12" font-weight="bold" fill="#be123c">TaskItem.jsx</text>
  <text x="375" y="225" text-anchor="middle" font-size="10" fill="#f43f5e">props: task, onToggle</text>
  <!-- Props label -->
  <text x="240" y="270" text-anchor="middle" font-size="11" fill="#6b7280">親→子：props で渡す（読み取り専用）</text>
  <text x="240" y="285" text-anchor="middle" font-size="11" fill="#6b7280">子→親：コールバック関数（onAdd, onToggle）で通知</text>
</svg>
<p class="diagram-caption">Reactのコンポーネント構成とprops/コールバックの流れ</p>
</div>`,

/* ── Next.js App Router 図 ── */
nextjsAppRouter: `
<div class="diagram-wrap">
<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <!-- Folder structure on left -->
  <rect x="10" y="10" width="200" height="240" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="110" y="30" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155">app/</text>
  <text x="35" y="50" font-size="11" fill="#475569">├── layout.tsx</text>
  <text x="35" y="68" font-size="11" fill="#475569">├── page.tsx</text>
  <text x="35" y="86" font-size="11" fill="#475569">├── loading.tsx</text>
  <text x="35" y="104" font-size="11" fill="#475569">├── error.tsx</text>
  <text x="35" y="122" font-size="11" fill="#6366f1">├── about/</text>
  <text x="55" y="140" font-size="11" fill="#475569">└── page.tsx</text>
  <text x="35" y="158" font-size="11" fill="#6366f1">├── posts/</text>
  <text x="55" y="176" font-size="11" fill="#475569">├── page.tsx</text>
  <text x="55" y="194" font-size="11" fill="#6366f1">└── [id]/</text>
  <text x="75" y="212" font-size="11" fill="#475569">└── page.tsx</text>
  <text x="35" y="230" font-size="11" fill="#6366f1">└── api/hello/route.ts</text>
  <!-- Arrow -->
  <text x="215" y="135" font-size="18" fill="#6b7280">→</text>
  <!-- URL mapping on right -->
  <rect x="235" y="10" width="235" height="240" rx="8" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
  <text x="352" y="30" text-anchor="middle" font-size="12" font-weight="bold" fill="#0c4a6e">URL</text>
  <text x="245" y="55" font-size="11" fill="#0369a1">layout.tsx → 全ページ共通レイアウト</text>
  <text x="245" y="75" font-size="11" fill="#0c4a6e">page.tsx → /（トップ）</text>
  <text x="245" y="95" font-size="11" fill="#64748b">loading.tsx → ローディングUI</text>
  <text x="245" y="115" font-size="11" fill="#64748b">error.tsx → エラーUI</text>
  <text x="245" y="140" font-size="11" fill="#7c3aed">about/page.tsx → /about</text>
  <text x="245" y="165" font-size="11" fill="#7c3aed">posts/page.tsx → /posts</text>
  <text x="245" y="190" font-size="11" fill="#7c3aed">[id]/page.tsx → /posts/1</text>
  <text x="245" y="215" font-size="11" fill="#7c3aed">/posts/2 … など動的に</text>
  <text x="245" y="240" font-size="11" fill="#0c4a6e">api/hello/route.ts → /api/hello</text>
</svg>
<p class="diagram-caption">Next.js App Routerのファイル構成とURLマッピング</p>
</div>`,

/* ── DB ER図サンプル ── */
erDiagram: `
<div class="diagram-wrap">
<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <!-- users table -->
  <rect x="20" y="30" width="150" height="160" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <rect x="20" y="30" width="150" height="30" rx="4" fill="#f59e0b"/>
  <text x="95" y="51" text-anchor="middle" font-size="13" font-weight="bold" fill="white">users</text>
  <text x="30" y="80" font-size="11" fill="#1f2937">🔑 id (PK, BIGINT)</text>
  <text x="30" y="98" font-size="11" fill="#1f2937">name (VARCHAR)</text>
  <text x="30" y="116" font-size="11" fill="#1f2937">email (VARCHAR, UQ)</text>
  <text x="30" y="134" font-size="11" fill="#1f2937">created_at (TIMESTAMP)</text>
  <!-- tasks table -->
  <rect x="220" y="30" width="170" height="195" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <rect x="220" y="30" width="170" height="30" rx="4" fill="#3b82f6"/>
  <text x="305" y="51" text-anchor="middle" font-size="13" font-weight="bold" fill="white">tasks</text>
  <text x="230" y="80" font-size="11" fill="#1f2937">🔑 id (PK, BIGINT)</text>
  <text x="230" y="98" font-size="11" fill="#1f2937">🔗 user_id (FK → users)</text>
  <text x="230" y="116" font-size="11" fill="#1f2937">title (VARCHAR)</text>
  <text x="230" y="134" font-size="11" fill="#1f2937">priority (ENUM)</text>
  <text x="230" y="152" font-size="11" fill="#1f2937">done (BOOLEAN)</text>
  <text x="230" y="170" font-size="11" fill="#1f2937">due_date (DATE)</text>
  <text x="230" y="188" font-size="11" fill="#1f2937">created_at (TIMESTAMP)</text>
  <!-- tags table -->
  <rect x="440" y="30" width="65" height="95" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <rect x="440" y="30" width="65" height="30" rx="4" fill="#16a34a"/>
  <text x="473" y="51" text-anchor="middle" font-size="11" font-weight="bold" fill="white">tags</text>
  <text x="448" y="80" font-size="10" fill="#1f2937">🔑 id</text>
  <text x="448" y="96" font-size="10" fill="#1f2937">name</text>
  <text x="448" y="112" font-size="10" fill="#1f2937">(UNIQUE)</text>
  <!-- task_tags (join) -->
  <rect x="440" y="155" width="65" height="70" rx="4" fill="#fdf4ff" stroke="#a855f7" stroke-width="2"/>
  <rect x="440" y="155" width="65" height="25" rx="4" fill="#a855f7"/>
  <text x="473" y="171" text-anchor="middle" font-size="9" font-weight="bold" fill="white">task_tags</text>
  <text x="448" y="195" font-size="9" fill="#1f2937">task_id (FK)</text>
  <text x="448" y="210" font-size="9" fill="#1f2937">tag_id (FK)</text>
  <!-- Relations -->
  <line x1="170" y1="110" x2="220" y2="110" stroke="#6b7280" stroke-width="2"/>
  <text x="195" y="105" text-anchor="middle" font-size="10" fill="#6b7280">1</text>
  <text x="195" y="120" text-anchor="middle" font-size="10" fill="#6b7280">N</text>
  <line x1="390" y1="130" x2="440" y2="80" stroke="#6b7280" stroke-width="1.5"/>
  <line x1="390" y1="150" x2="440" y2="180" stroke="#6b7280" stroke-width="1.5"/>
  <text x="410" y="107" font-size="9" fill="#6b7280">M</text>
  <text x="410" y="170" font-size="9" fill="#6b7280">N</text>
  <!-- Notes -->
  <text x="20" y="215" font-size="10" fill="#6b7280">🔑 PK = 主キー（Primary Key）</text>
  <text x="20" y="230" font-size="10" fill="#6b7280">🔗 FK = 外部キー（Foreign Key）</text>
  <text x="20" y="245" font-size="10" fill="#6b7280">UQ = ユニーク制約</text>
  <text x="20" y="265" font-size="10" fill="#6b7280">users:tasks = 1:N（1人のユーザーが複数のタスクを持つ）</text>
  <text x="20" y="280" font-size="10" fill="#6b7280">tasks:tags = M:N（多対多 → task_tags中間テーブルで実現）</text>
</svg>
<p class="diagram-caption">タスク管理アプリのER図（users・tasks・tags・task_tagsの4テーブル）</p>
</div>`,

/* ── Hoku相談フロー図 ── */
hokuFlow: `
<div class="diagram-wrap">
<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <defs>
    <marker id="arr3" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#6b7280"/>
    </marker>
  </defs>
  <!-- Start -->
  <ellipse cx="240" cy="25" rx="80" ry="18" fill="#1e40af" />
  <text x="240" y="30" text-anchor="middle" font-size="12" fill="white" font-weight="bold">問題・疑問が発生</text>
  <line x1="240" y1="43" x2="240" y2="63" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <!-- Diamond -->
  <polygon points="240,63 310,95 240,127 170,95" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
  <text x="240" y="90" text-anchor="middle" font-size="11" fill="#92400e">自分で</text>
  <text x="240" y="105" text-anchor="middle" font-size="11" fill="#92400e">調べた？</text>
  <!-- No path (left) -->
  <line x1="170" y1="95" x2="80" y2="95" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <text x="125" y="87" text-anchor="middle" font-size="10" fill="#6b7280">まず自己解決</text>
  <rect x="20" y="108" width="120" height="50" rx="8" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <text x="80" y="130" text-anchor="middle" font-size="11" font-weight="bold" fill="#b91c1c">❌ 丸投げNG</text>
  <text x="80" y="148" text-anchor="middle" font-size="10" fill="#b91c1c">「全部作って」は不可</text>
  <!-- Yes path (right) -->
  <line x1="310" y1="95" x2="390" y2="95" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <text x="350" y="87" text-anchor="middle" font-size="10" fill="#6b7280">5〜10分調べた</text>
  <rect x="360" y="68" width="110" height="55" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5"/>
  <text x="415" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">✅ Hoku</text>
  <text x="415" y="107" text-anchor="middle" font-size="10" fill="#15803d">テンプレートで</text>
  <text x="415" y="120" text-anchor="middle" font-size="10" fill="#15803d">質問する</text>
  <!-- Down from yes -->
  <line x1="415" y1="123" x2="415" y2="155" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <polygon points="415,155 480,185 415,215 350,185" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="415" y="180" text-anchor="middle" font-size="11" fill="#92400e">解決</text>
  <text x="415" y="195" text-anchor="middle" font-size="11" fill="#92400e">した？</text>
  <!-- Yes → done -->
  <line x1="415" y1="215" x2="415" y2="245" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <text x="428" y="232" font-size="10" fill="#6b7280">Yes</text>
  <ellipse cx="415" cy="258" rx="55" ry="17" fill="#16a34a"/>
  <text x="415" y="263" text-anchor="middle" font-size="11" fill="white" font-weight="bold">✅ 学習継続</text>
  <!-- No → instructor -->
  <line x1="350" y1="185" x2="260" y2="185" stroke="#6b7280" stroke-width="1.5" marker-end="url(#arr3)"/>
  <text x="305" y="177" text-anchor="middle" font-size="10" fill="#6b7280">No / 理解困難</text>
  <rect x="160" y="165" width="100" height="40" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="210" y="185" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">講師に相談</text>
  <text x="210" y="200" text-anchor="middle" font-size="10" fill="#3b82f6">週次面談 / Slack</text>
  <!-- Bottom note -->
  <text x="240" y="295" text-anchor="middle" font-size="10" fill="#6b7280">Hokuが解決できないもの：採点・合否・キャリア最終判断 → 必ず講師へ</text>
</svg>
<p class="diagram-caption">Hokuへの相談フロー（自己解決 → Hoku質問 → 講師相談の3ステップ）</p>
</div>`,

/* ── AI 駆動開発フロー ── */
aiDevFlow: `
<div class="diagram-wrap">
<div class="ai-flow-grid">
  <div class="ai-flow-step ai-step-ok">
    <div class="ai-flow-icon">✅</div>
    <div class="ai-flow-label">AIに任せてよいこと</div>
    <ul class="ai-flow-list">
      <li>ボイラープレートコード生成</li>
      <li>エラーメッセージの解読</li>
      <li>テストケースの洗い出し</li>
      <li>READMEの下書き</li>
      <li>リファクタリング提案</li>
      <li>SQL・CSS の書き方確認</li>
    </ul>
  </div>
  <div class="ai-flow-step ai-step-ng">
    <div class="ai-flow-icon">❌</div>
    <div class="ai-flow-label">AIに任せてはいけないこと</div>
    <ul class="ai-flow-list">
      <li>「アプリを全部作って」</li>
      <li>課題そのものを解かせる</li>
      <li>APIキー・パスワードを貼る</li>
      <li>顧客・社内の機密情報を貼る</li>
      <li>採点・合否の判断</li>
      <li>キャリアの最終決断</li>
    </ul>
  </div>
  <div class="ai-flow-step ai-step-flow">
    <div class="ai-flow-icon">🔄</div>
    <div class="ai-flow-label">AI駆動開発フロー</div>
    <ol class="ai-flow-list">
      <li>Issue/要件を自分で書く</li>
      <li>AIに叩き台を生成させる</li>
      <li>出力を全てレビューする</li>
      <li>採用・修正・却下を判断</li>
      <li>AI利用ログに記録する</li>
      <li>面談で説明できるか確認</li>
    </ol>
  </div>
</div>
<p class="diagram-caption">AI駆動開発の正しい使い方：AIは「道具」、判断は「人間」が行う</p>
</div>`,

/* ── フルスタック構成図 ── */
fullStackArch: `
<div class="diagram-wrap">
<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" class="diagram-svg">
  <!-- Browser -->
  <rect x="10" y="10" width="120" height="260" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="70" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">Browser</text>
  <rect x="20" y="45" width="100" height="30" rx="4" fill="#bfdbfe"/>
  <text x="70" y="65" text-anchor="middle" font-size="10" fill="#1d4ed8">Next.js</text>
  <rect x="20" y="85" width="100" height="30" rx="4" fill="#bfdbfe"/>
  <text x="70" y="105" text-anchor="middle" font-size="10" fill="#1d4ed8">TypeScript</text>
  <rect x="20" y="125" width="100" height="30" rx="4" fill="#bfdbfe"/>
  <text x="70" y="145" text-anchor="middle" font-size="10" fill="#1d4ed8">Tailwind CSS</text>
  <rect x="20" y="165" width="100" height="30" rx="4" fill="#bfdbfe"/>
  <text x="70" y="185" text-anchor="middle" font-size="10" fill="#1d4ed8">Vercel Deploy</text>
  <!-- Arrow -->
  <text x="155" y="145" text-anchor="middle" font-size="20" fill="#6b7280">⇄</text>
  <text x="155" y="162" text-anchor="middle" font-size="9" fill="#6b7280">REST API</text>
  <text x="155" y="174" text-anchor="middle" font-size="9" fill="#6b7280">JSON/HTTPS</text>
  <!-- Spring Boot -->
  <rect x="185" y="10" width="145" height="260" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <text x="258" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">Spring Boot</text>
  <rect x="195" y="45" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="64" text-anchor="middle" font-size="10" fill="#15803d">@RestController</text>
  <rect x="195" y="83" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="102" text-anchor="middle" font-size="10" fill="#15803d">@Service + @Transactional</text>
  <rect x="195" y="121" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="140" text-anchor="middle" font-size="10" fill="#15803d">JpaRepository</text>
  <rect x="195" y="159" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="178" text-anchor="middle" font-size="10" fill="#15803d">Entity + DTO</text>
  <rect x="195" y="197" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="216" text-anchor="middle" font-size="10" fill="#15803d">@Valid バリデーション</text>
  <rect x="195" y="235" width="125" height="28" rx="4" fill="#bbf7d0"/>
  <text x="258" y="254" text-anchor="middle" font-size="10" fill="#15803d">Render Deploy</text>
  <!-- Arrow -->
  <text x="350" y="145" text-anchor="middle" font-size="20" fill="#6b7280">⇄</text>
  <text x="350" y="162" text-anchor="middle" font-size="9" fill="#6b7280">JPA/SQL</text>
  <!-- MySQL -->
  <rect x="375" y="10" width="135" height="260" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="443" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#b45309">MySQL</text>
  <rect x="385" y="45" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="64" text-anchor="middle" font-size="10" fill="#b45309">users テーブル</text>
  <rect x="385" y="83" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="102" text-anchor="middle" font-size="10" fill="#b45309">tasks テーブル</text>
  <rect x="385" y="121" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="140" text-anchor="middle" font-size="10" fill="#b45309">tags テーブル</text>
  <rect x="385" y="159" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="178" text-anchor="middle" font-size="10" fill="#b45309">インデックス</text>
  <rect x="385" y="197" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="216" text-anchor="middle" font-size="10" fill="#b45309">外部キー制約</text>
  <rect x="385" y="235" width="115" height="28" rx="4" fill="#fde68a"/>
  <text x="443" y="254" text-anchor="middle" font-size="10" fill="#b45309">Render MySQL</text>
</svg>
<p class="diagram-caption">フルスタックアプリの技術スタック全体像（Next.js + Spring Boot + MySQL）</p>
</div>`

}; // end DIAGRAMS