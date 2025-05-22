# Test info

- Name: Создание турнира >> должен авторизовать судью и создать турнир
- Location: /Users/bogdanpurvins/projects/swiss/tests/e2e/create.spec.ts:4:3

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('div.grid > div').filter({ has: getByText('E2Etour') }).first().getByRole('button').filter({ has: locator('svg[data-lucide="trash-2"]') })

    at /Users/bogdanpurvins/projects/swiss/tests/e2e/create.spec.ts:88:24
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Создание турнира', () => {
   4 |   test('должен авторизовать судью и создать турнир', async ({ page }) => {
   5 |     await page.goto('/');
   6 |
   7 |     await expect(page.locator('main')).toHaveText('Not signed in');
   8 |
   9 |     await page.getByRole('link', { name: 'Sign in' }).click();
  10 |     await page.waitForURL('/api/auth/signin');
  11 |
  12 |     await page.getByPlaceholder('email@example.com').fill('judge@example.com');
  13 |     await page.getByRole('button').click();
  14 |
  15 |     await page.goto('http://localhost:1080/');
  16 |     await page.waitForSelector('table');
  17 |
  18 |     const firstRow = page.locator('tr').nth(1);
  19 |     await firstRow.click();
  20 |
  21 |     await page.waitForSelector('iframe');
  22 |     const frame = page.frameLocator('iframe');
  23 |
  24 |     const signInLink = frame.getByRole('link', { name: 'Sign in' });
  25 |     await signInLink.waitFor({ state: 'visible', timeout: 30000 });
  26 |
  27 |     const [newPage] = await Promise.all([
  28 |       page.context().waitForEvent('page'),
  29 |       signInLink.click(),
  30 |     ]);
  31 |
  32 |     await newPage.waitForLoadState('networkidle');
  33 |     await newPage.bringToFront();
  34 |     await newPage.waitForURL('http://localhost:3000/');
  35 |
  36 |     // Открытие модального окна
  37 |     const openDialogButton = newPage.getByRole('button', { name: /Create Tournament/i });
  38 |     await openDialogButton.click();
  39 |
  40 |     // Заполнение формы
  41 |     await newPage.getByLabel('Tournament Name').fill('E2Etour');
  42 |     await newPage.getByLabel('Number of Rounds').fill('7');
  43 |
  44 |     // Убедиться, что кнопка отправки активна
  45 |     const submitButton = newPage.getByRole('button', { name: /Create Tournament/i });
  46 |     await expect(submitButton).toBeEnabled();
  47 |
  48 |     // Отправка формы
  49 |     await submitButton.click();
  50 |         // Проверка перехода на страницу турнира (по имени)
  51 |     await newPage.waitForURL('http://localhost:3000/E2Etour');
  52 |     // Проверка вкладок
  53 |     const tabs = newPage.getByRole('tablist');
  54 |     await expect(tabs).toBeVisible();
  55 |
  56 |     const participantsTab = newPage.getByRole('tab', { name: /Participants/i });
  57 |     const pairingsTab = newPage.getByRole('tab', { name: /Pairings/i });
  58 |     const standingsTab = newPage.getByRole('tab', { name: /Standings/i });
  59 |
  60 |     await expect(participantsTab).toBeVisible();
  61 |     await expect(pairingsTab).toBeVisible();
  62 |     await expect(standingsTab).toBeVisible();
  63 |
  64 |     // Переключение на вкладку Pairings
  65 |     await pairingsTab.click();
  66 |
  67 |     // Переключение на вкладку Standings
  68 |     await standingsTab.click();
  69 |
  70 |     // Переключение обратно на Participants
  71 |     await participantsTab.click();
  72 |     await newPage.getByRole('link', { name: /Back to Tournaments/i }).click()
  73 |     await newPage.waitForURL('http://localhost:3000/')
  74 |
  75 |     // Найти карточку с E2Etour
  76 |
  77 |     const tournamentCard = newPage.locator('div.grid > div').filter({
  78 |       has: newPage.getByText('E2Etour')
  79 |     }).first();
  80 |     
  81 |     await expect(tournamentCard).toBeVisible({ timeout: 10000 });
  82 |
  83 |     // Находим кнопку удаления внутри карточки
  84 |     const deleteButton = tournamentCard.getByRole('button').filter({
  85 |       has: newPage.locator('svg[data-lucide="trash-2"]'),
  86 |     });
  87 |     
> 88 |     await deleteButton.click();
     |                        ^ Error: locator.click: Target page, context or browser has been closed
  89 |   });
  90 | });
  91 |
```