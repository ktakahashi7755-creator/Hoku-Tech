import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next の既定の除外設定を上書きする
  globalIgnores([
    // eslint-config-next の既定の除外対象:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 教材サンプルのビルド成果物
    "content/code/**/target/**",
  ]),
  {
    // 教材の検証用スクリプト (check.js) は Node.js でそのまま実行する CommonJS のため require を許可する
    files: ["content/code/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
