# Chess Tournament Manager 

Веб-приложение для управления шахматными турнирами, реализованное на Next.js с поддержкой Swiss-системы жеребьёвки.

## 🚀 Технологии

- [Next.js](https://nextjs.org/) — фреймворк для React с серверным рендерингом
- [Prisma ORM](https://www.prisma.io/) — работа с базой данных
- [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) — стилизация и UI-компоненты
- [Radix UI](https://www.radix-ui.com/) — базовые компоненты интерфейса
- [Vitest](https://vitest.dev/) — модульное тестирование
- [Playwright](https://playwright.dev/) — e2e тестирование

## ⚙️ Возможности

- Регистрация игроков и создание турниров
- Автоматическое построение пар по швейцарской системе
- Учёт результатов и подсчёт очков
- Разграничение ролей (игрок / судья)
- Отображение турнирной таблицы, пар и участников

## 🛠️ Установка и запуск

```bash
# Клонируем репозиторий
git clone https://github.com/your-username/chess-tournament-app.git
cd swiss

# Устанавливаем зависимости
pnpm install

# Генерируем Prisma клиент и сидируем базу данных
pnpx prisma generate

# Запуск проекта
pnpm run dev
```
## 🧪 Тесты
```bash
# Unit тесты
pnpm test

# E2E тесты
pnpm test:e2e

# E2E тесты в режиме дебагга
pnpm test:e2e:debug
```
