// @ts-check
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['nodes/**/*.ts'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
