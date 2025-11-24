# Progress - Habit Tracker

*Update: 2025-11-24*

## Done
- Unified habit contract to `title`/`frequency` on frontend API; removed duplicate auth middleware (all routes use `middleware/auth`).
- Moved the new frontend architecture into `src`: Auth/Habit contexts, `useAsync`, `services/api` with `VITE_API_URL`, simple `notificationService`.
- Updated routing: `/login`, `/register`, protected `/` via `ProtectedRoute`; new Login/Register/Dashboard pages.
- New Dashboard: add habits (title + frequency + category), category filter, list with check/delete, category manager with inline edit/delete.
- Refreshed styles in App.css/index.css for the new layout without extra deps.
- Backend tests (`npm test`) — все 5 suites/47 tests прошли (Jest + mongodb-memory-server).
- Удалён легаси фронта (старые Dashboard/api/Auth и TS-заготовки в корне), чтобы не путаться.
- Добавлены примеры env: backend `.env.example` (PORT/MONGO_URI/JWT_SECRET/FRONTEND_URL), frontend `.env.example` (VITE_API_URL).

## Next
- Run `npm run build`/`npm test` for the frontend to verify (not run yet).
- Add refresh tokens or auto-logout on 401 responses.
- Improve UX: inline habit editing, completion cues, progress visuals.
- Clean unused legacy files (old Dashboard.jsx/api.js and TS stubs in root) after confirming the new build.
- For deploy set `VITE_API_URL` and ensure backend CORS matches.
- Try local run: backend `npm install && npm run dev` with `.env` (MONGO_URI/JWT_SECRET), frontend `cd habit-tracker-frontend && npm install && VITE_API_URL=http://localhost:5000/api npm run dev`.

## Что сделано (RU)
- Привели контракт привычек к `title`/`frequency` на фронте; убрали дублирующий auth middleware — все маршруты используют `middleware/auth`.
- Перенесли новую архитектуру фронтенда в `src`: контексты Auth/Habit, хук `useAsync`, сервис `services/api` с `VITE_API_URL`, простой `notificationService`.
- Обновили роутинг: `/login`, `/register`, защищенный `/` через `ProtectedRoute`; новые страницы Login/Register/Dashboard.
- Новый Dashboard: добавление привычек (title + frequency + категория), фильтр по категориям, список с отметкой/удалением, менеджер категорий с inline-редактированием/удалением.
- Обновили стили в App.css/index.css под новую сетку/карточки без внешних зависимостей.

## Дальше (RU)
- Прогнать `npm run build`/`npm test` во фронтенде (пока не запускались).
- Добавить refresh tokens или авто-логаут по 401.
- Улучшить UX: inline-редактирование привычек, подсветка статуса, визуализация прогресса.
- Очистить устаревшие файлы (старый Dashboard.jsx/api.js и TS-заготовки в корне) после проверки сборки.
- Для деплоя прописать `VITE_API_URL` и сверить CORS на бэкенде.
- Для локального запуска: backend `npm install && npm run dev` с `.env` (MONGO_URI/JWT_SECRET); frontend `cd habit-tracker-frontend && npm install && VITE_API_URL=http://localhost:5000/api npm run dev`.
