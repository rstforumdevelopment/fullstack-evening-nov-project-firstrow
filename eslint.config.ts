import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  // 1. What ESlint should never look at.
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.next/**', '**/coverage/**'],
  },

  // 2. The baseline rules that apply to any JavaScript.
  js.configs.recommended,

  // 3. TypeScript rules
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 4. Out own adjustments to all the defaults
  {
    rules: {
      // Variables/Arguments named with a leading underscore is not a mistake
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // 5. `process.env` is readable exactly once, in the config module
  // that validates it. Everywhere else, import `env` instead - that way
  // the schema is the only description of what this service needs to run.
  {
    files: ['apps/**/*.ts', 'packages/**/*.ts'],
    ignores: ['apps/*/src/config/env.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Read configuration from `env` in src/config/env.ts, not from process.env.',
        },
      ],
    },
  },

  // 6. Switch off every rule that would argue with Prettier
  prettier,
]);
