import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  // Global ignores
  {
    // stardust/, qa/, skills/ = redesign tooling (Playwright capture/verify scripts,
    // prototypes, agent skills), not site code
    ignores: ['**/helix-importer-ui/**', 'stardust/**', 'qa/**', 'skills/**'],
  },
  
  // Recommended ESLint rules
  js.configs.recommended,
  
  // Main configuration
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        allowImportExportEverywhere: true,
        sourceType: 'module',
        requireConfigFile: false,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import rules
      'import/extensions': ['error', 'always', { ignorePackages: true }],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      
      // Code quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-param-reassign': ['error', { props: false }],
      'no-console': 'off',
      
      // Style
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      
      // Best practices
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
    },
  },
];