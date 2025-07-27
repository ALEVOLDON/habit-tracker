# 🧠 Habit Tracker

Полноценное приложение для отслеживания привычек на **Node.js**, **Express**, **MongoDB** и **React + Vite**.

Следи за своими привычками, отмечай выполнение, используй категории и фильтры. Интерфейс полностью на русском, адаптивен для мобильных.

---

## 🚀 Возможности

- 🔐 Аутентификация пользователей (JWT)
- ➕ Создание, редактирование и удаление привычек
- ✅ Отметка выполнения привычки
- 🗂️ Категории привычек (создание, редактирование, удаление)
- 🔎 Фильтрация по частоте и категории
- 🖊️ Редактирование привычек и категорий прямо в интерфейсе
- 📱 Мобильная адаптивность
- 🇷🇺 Полная русификация интерфейса
- 🎨 Чистый и современный UI на React + Vite
- 🧹 ESLint и Prettier для чистоты кода

---

## ⚡ Быстрый старт

1. **Клонируй репозиторий:**
   ```bash
   git clone https://github.com/ALEVOLDON/habit-tracker.git
   cd habit-tracker
   ```
2. **Установи и запусти бэкенд:**
   ```bash
   cd habit-tracker-backend
   npm install
   cp .env.example .env # настрой .env с MONGO_URI и JWT_SECRET
   npm run dev
   ```
3. **Установи и запусти фронтенд:**
   ```bash
   cd ../habit-tracker-frontend
   npm install
   npm run dev
   ```
4. **Открой [http://localhost:5173](http://localhost:5173) в браузере**

---

## 📁 Структура проекта

```
habit-tracker/
├── habit-tracker-backend/   # Express + MongoDB API
├── habit-tracker-frontend/  # React + Vite frontend
```

---

## 🗂️ Работа с категориями
- Создавай, редактируй и удаляй категории в разделе "Категории" на дашборде.
- Привязывай привычки к категориям для удобной фильтрации.
- Можно фильтровать привычки по категории и частоте одновременно.

---

## 🧹 Линтер и Prettier
- Для чистоты кода используй:
  ```bash
  npm run lint    # Проверка кода линтером
  npm run format  # Форматирование Prettier
  ```
- Конфиги уже настроены в habit-tracker-frontend.

---

## 🔧 .env пример (backend)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your_jwt_secret
```

---

## 📬 API Endpoints (localhost:5000)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| POST   | `/api/auth/register`      | Register new user    |
| POST   | `/api/auth/login`         | Login user (returns JWT) |
| GET    | `/api/habits`             | Get all habits       |
| POST   | `/api/habits`             | Create new habit     |
| PATCH  | `/api/habits/:id/check`   | Mark as done         |
| PATCH  | `/api/habits/:id`         | Edit habit           |
| DELETE | `/api/habits/:id`         | Delete habit         |
| GET    | `/api/categories`         | Get all categories   |
| POST   | `/api/categories`         | Create category      |
| PATCH  | `/api/categories/:id`     | Edit category        |
| DELETE | `/api/categories/:id`     | Delete category      |

---

## 💻 Фронтенд

Вся логика и UI — в `habit-tracker-frontend`.
- React + Vite
- Полная поддержка русского языка
- Мобильная адаптивность

---

## 🛡️ Технологии
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, CSS
- **Инструменты**: Nodemon, ESLint, Prettier, Git

---

## 📚 License

MIT — feel free to use and modify.
