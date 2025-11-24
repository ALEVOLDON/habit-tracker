![Скрин интерфейса](docs/screenshot.svg)

# Habit Tracker

Full-stack трекер привычек: Node.js + Express + MongoDB на бэкенде и React + Vite на фронтенде.

## Возможности
- Регистрация/логин (JWT)
- CRUD привычек с частотой (daily/weekly) и категориями
- Отметка выполнения, фильтры и статистика
- CRUD категорий

## Быстрый старт (локально)
1) Клонировать:
```bash
git clone https://github.com/ALEVOLDON/habit-tracker.git
cd habit-tracker
```
2) Бэкенд:
```bash
cd habit-tracker-backend
npm install
cp .env.example .env   # заполните MONGO_URI, JWT_SECRET, при необходимости FRONTEND_URL
npm run dev
```
3) Фронтенд (новое окно):
```bash
cd habit-tracker-frontend
npm install
cp .env.example .env   # для локалки оставьте VITE_API_URL=http://localhost:5000/api
npm run dev
```
4) Открыть http://localhost:5173

## Переменные окружения
### Бэкенд (`habit-tracker-backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173   # прод: https://your-frontend.com
```
### Фронтенд (`habit-tracker-frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api   # прод: https://your-backend.com/api
```

## Скрипты
### Бэкенд
- npm run dev — dev-сервер (nodemon)
- npm test   — Jest + mongodb-memory-server

### Фронтенд
- npm run dev   — Vite dev server
- npm run build — прод сборка

## API (localhost:5000)
| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| POST   | /api/auth/register      | Регистрация |
| POST   | /api/auth/login         | Логин (JWT) |
| GET    | /api/habits             | Список привычек |
| POST   | /api/habits             | Создать привычку |
| PATCH  | /api/habits/:id         | Обновить привычку |
| PATCH  | /api/habits/:id/check   | Отметить выполнение |
| DELETE | /api/habits/:id         | Удалить привычку |
| GET    | /api/categories         | Список категорий |
| POST   | /api/categories         | Создать категорию |
| PATCH  | /api/categories/:id     | Обновить категорию |
| DELETE | /api/categories/:id     | Удалить категорию |

## Структура
```
habit-tracker/
├─ habit-tracker-backend/   # Express + MongoDB API
└─ habit-tracker-frontend/  # React + Vite SPA
```

## Деплой (Netlify + внешний бэкенд)
- Netlify: base `habit-tracker-frontend`, build `npm run build`, publish `habit-tracker-frontend/dist`.
- Env (Netlify): VITE_API_URL=https://your-backend.com/api
- Бэкенд .env: FRONTEND_URL=https://your-frontend.com (для CORS)

## License
MIT
