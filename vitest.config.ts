/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8', // ← cambio aquí
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['dist', 'tests', 'examples'],
    },
  },
});
