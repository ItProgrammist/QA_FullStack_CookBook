import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests/specs',
  // ИСПРАВЛЕНИЕ: Жестко указываем паттерн поиска файлов, чтобы робот нашел любые тесты
  testMatch: /.*?\.(spec|test)\.(js|jsx|ts|tsx)/,
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
