import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended (type-aware off to keep lint fast)
  ...tseslint.configs.recommended,

  // React Hooks
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Allow setState in effects for intentional reset-on-change patterns (e.g. hooks page)
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // Next.js rules
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Project-specific overrides
  {
    rules: {
      // Allow unused vars prefixed with _ (common pattern)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow explicit any in mock code for now
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow empty object types (used in component props)
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },

  // Ignore build output and dependencies
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "*.config.mjs",
      "*.config.js",
      "*.config.ts",
    ],
  },
);
