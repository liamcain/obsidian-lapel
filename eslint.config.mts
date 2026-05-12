import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

declare global {
  interface ImportMeta {
    dirname: string;
  }
}

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    ignores: [
      "node_modules",
      "esbuild.config.mjs",
      "scripts/build-local.mjs",
      "main.js",
      "src/obsidian.d.ts",
    ],
  },
);
