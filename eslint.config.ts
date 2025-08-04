import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import tsEslint from '@typescript-eslint/eslint-plugin'; // Import the TypeScript ESLint plugin itself

// This configuration uses the new flat config format introduced in ESLint v9.
// It combines configurations for Vue, TypeScript, and Prettier integration.

export default defineConfigWithVueTs(
  // Base configuration for files to lint
  {
    name: 'app/files-to-lint',
    // Specifies the files to be linted.
    // This pattern covers TypeScript files (.ts, .mts, .tsx) and Vue Single File Components (.vue).
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // Global ignores: Specifies files/directories that ESLint should ignore.
  // This is crucial for avoiding linting generated code or build artifacts.
  globalIgnores([
    '**/dist/**',       // Ignore compiled output directory
    '**/dist-ssr/**',   // Ignore SSR build output
    '**/coverage/**',   // Ignore test coverage reports
    '**/node_modules/**', // Explicitly ignore node_modules, though often implicitly ignored
    'src/components/ui/**', // Ignore specific file as requested
  ]),

  // Vue.js specific rules:
  // We're using 'flat/recommended' which provides a good balance of error prevention
  // and best practices for Vue components, going beyond the 'essential' set.
  // You can choose 'flat/strongly-recommended' for even stricter rules.
  pluginVue.configs['flat/recommended'],

  // TypeScript specific rules:
  // 'vueTsConfigs.recommended' includes recommended rules from @typescript-eslint/eslint-plugin
  // and integrates them correctly for Vue files.
  vueTsConfigs.recommended,

  // Optional: Add additional TypeScript rules directly from @typescript-eslint/eslint-plugin
  // This allows for more granular control over TypeScript linting.
  // For example, you might want to enforce consistent type imports or explicit function return types.
  {
    name: 'app/typescript-overrides',
    files: ['**/*.{ts,mts,tsx}'], // Apply these specifically to TypeScript files
    plugins: {
      '@typescript-eslint': tsEslint, // Register the plugin
    },
    rules: {
      // Example: Enforce explicit return types on functions and methods
      // '@typescript-eslint/explicit-function-return-type': 'warn',
      // Example: Disallow unused variables (overrides default JS rule)
      // '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Example: Enforce consistent type imports
      // '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // Prettier integration:
  // 'skipFormatting' disables ESLint rules that conflict with Prettier,
  // allowing Prettier to handle all code formatting without interference from ESLint.
  // Make sure you have Prettier configured and running separately.
  skipFormatting,

  // Optional: Add custom rules or overrides for specific project needs.
  // This is where you'd add rules specific to your team's coding standards
  // or disable certain rules for specific files/patterns.
  {
    name: 'app/custom-rules',
    rules: {
      // Example: Disallow console.log in production builds (or just warn)
      // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Example: Enforce camelCase naming convention (if not already covered)
      // 'camelcase': 'error',
      // Example: Allow specific global variables
      // 'no-undef': 'off', // Be careful with this one, usually handled by environments
    },
  },
);

// If you need to allow more languages other than `ts` in `.vue` files,
// uncomment the following lines and adjust `scriptLangs` as needed.
// This is useful if you mix TypeScript with JavaScript or JSX within Vue SFCs.
// import { configureVueProject } from '@vue/eslint-config-typescript';
// configureVueProject({ scriptLangs: ['ts', 'tsx', 'js', 'jsx'] });
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup
