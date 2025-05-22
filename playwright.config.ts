import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000', // URL для Next.js приложения
    headless: true, // Запускать в headless режиме
    viewport: { width: 1280, height: 720 }, // Размер окна
    actionTimeout: 0, // Ожидание на действия (неограниченно)
    ignoreHTTPSErrors: true, // Игнорировать ошибки HTTPS
    screenshot: 'only-on-failure', // Делать скриншоты только при ошибке
    video: 'retain-on-failure', // Сохранять видео при ошибке
  },

  /* Запуск сервера Next.js для тестов */
  webServer: {
    command: 'npm run dev', // Команда для запуска Next.js приложения
    port: 3000, // Порт, на котором будет запущен сервер
    reuseExistingServer: !process.env.CI, // Использовать существующий сервер на CI
  },

  /* Настройки для проекта */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Использовать настройки для Desktop Chrome
    },
  ],
});
