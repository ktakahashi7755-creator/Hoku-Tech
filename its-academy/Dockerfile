# PROVIDE ENGINEER ACADEMY — コンテナイメージ (手順は ../docs/deployment-guide.md §5)
#
#   docker build -t its-academy .                       … アプリ (runner) を作る
#   docker build --target tools -t its-academy-tools .  … マイグレーション・初期データ投入用
#
# セキュリティヘッダー (HSTS・upgrade-insecure-requests) はビルド時に確定するため、
# HTTPS で公開するイメージは COOKIE_SECURE=true (既定) でビルドする。

ARG NODE_IMAGE=node:22-bookworm-slim

# 1. 依存関係
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# 社内プロキシ等で独自の CA 証明書が必要な場合は --secret id=ca,src=<証明書> を渡す (任意)
RUN --mount=type=secret,id=ca,required=false \
    if [ -f /run/secrets/ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/ca; fi; \
    npm ci --no-audit --no-fund

# 2. ビルド
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ARG COOKIE_SECURE=true
ENV NEXT_TELEMETRY_DISABLED=1 \
    COOKIE_SECURE=${COOKIE_SECURE}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# 3. マイグレーション・初期データ投入用 (開発用の依存関係を含む。常駐させない)
FROM build AS tools
ENV NODE_ENV=production
CMD ["npx", "prisma", "migrate", "deploy"]

# 4. 実行用 (standalone 出力のみ。root 以外で動かす)
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
