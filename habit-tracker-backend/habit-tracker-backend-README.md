
# 📦 Habit Tracker — Backend

This is the backend API for the Habit Tracker app, built with **Node.js**, **Express**, and **MongoDB**.

It provides authentication and habit management endpoints.

---

## 🚀 How to Run

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your_jwt_secret
```

3. Start development server:

```bash
npm run dev
```

---

## 📬 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/register        | Register a new user      |
| POST   | /api/auth/login           | Login user (JWT)         |
| GET    | /api/habits               | Get user habits          |
| POST   | /api/habits               | Add new habit            |
| PATCH  | /api/habits/:id/check     | Mark habit as done       |
| DELETE | /api/habits/:id/check     | Uncheck habit            |
