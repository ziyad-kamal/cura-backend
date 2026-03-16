import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import n from "eslint-plugin-n";
import globals from "globals";

export default [
    // Base JS recommended rules
    eslint.configs.recommended,

    {
        files: ["**/*.ts"],

        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                ...globals.node, // process, __dirname, etc.
            },
        },

        plugins: {
            "@typescript-eslint": tseslint,
            n: n,
        },

        rules: {
            // ── TypeScript ─────────────────────────────

            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",

            // ── General ────────────────────────────────
            "no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^(req|res|next|unused)$" },
            ],
            "no-console": "warn",
        },
    },

    // Ignore build output
    {
        ignores: ["dist/**", "node_modules/**"],
    },
];
