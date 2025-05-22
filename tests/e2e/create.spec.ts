import { test, expect } from '@playwright/test';

test.describe('Создание турнира', () => {
  test('должен авторизовать судью и создать турнир', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main')).toHaveText('Not signed in');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.waitForURL('/api/auth/signin');

    await page.getByPlaceholder('email@example.com').fill('judge@example.com');
    await page.getByRole('button').click();

    await page.goto('http://localhost:1080/');
    await page.waitForSelector('table');

    const firstRow = page.locator('tr').nth(1);
    await firstRow.click();

    await page.waitForSelector('iframe');
    const frame = page.frameLocator('iframe');

    const signInLink = frame.getByRole('link', { name: 'Sign in' });
    await signInLink.waitFor({ state: 'visible', timeout: 30000 });

    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      signInLink.click(),
    ]);

    await newPage.waitForLoadState('networkidle');
    await newPage.bringToFront();
    await newPage.waitForURL('http://localhost:3000/');

    // Открытие модального окна
    const openDialogButton = newPage.getByRole('button', { name: /Create Tournament/i });
    await openDialogButton.click();

    // Заполнение формы
    await newPage.getByLabel('Tournament Name').fill('E2Etour');
    await newPage.getByLabel('Number of Rounds').fill('7');

    // Убедиться, что кнопка отправки активна
    const submitButton = newPage.getByRole('button', { name: /Create Tournament/i });
    await expect(submitButton).toBeEnabled();

    // Отправка формы
    await submitButton.click();
        // Проверка перехода на страницу турнира (по имени)
    await newPage.waitForURL('http://localhost:3000/E2Etour');
    // Проверка вкладок
    const tabs = newPage.getByRole('tablist');
    await expect(tabs).toBeVisible();

    const participantsTab = newPage.getByRole('tab', { name: /Participants/i });
    const pairingsTab = newPage.getByRole('tab', { name: /Pairings/i });
    const standingsTab = newPage.getByRole('tab', { name: /Standings/i });

    await expect(participantsTab).toBeVisible();
    await expect(pairingsTab).toBeVisible();
    await expect(standingsTab).toBeVisible();

    // Переключение на вкладку Pairings
    await pairingsTab.click();

    // Переключение на вкладку Standings
    await standingsTab.click();

    // Переключение обратно на Participants
    await participantsTab.click();
  });
});
