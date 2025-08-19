import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import tsESLint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tsESLint.configs.recommended,

  {
    plugins: { react: reactPlugin },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    plugins: { import: importPlugin },
    rules: {
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/no-unused-modules': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          pathGroups: [
            {
              pattern: 'src/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '*.{css,scss,sass,less}',
              group: 'type',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
];
