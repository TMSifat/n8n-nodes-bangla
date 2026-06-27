import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
  resolve: {
    // Redirect *.js imports to their *.ts source during test runs
    alias: [
      {
        find: /^(\.{1,2}\/.*)(\.js)$/,
        replacement: '$1',
      },
    ],
    extensions: ['.ts', '.js', '.json'],
  },
});
