
# 🧠 Habit Tracker

A full-stack habit tracking application built with **Node.js**, **Express**, **MongoDB**, and **React + Vite**.

Track your daily habits, mark them as complete, and stay consistent.

---

## 🚀 Features

- 🔐 User authentication (JWT-based)
- ➕ Create new habits
- ✅ Mark habits as completed
- 🗑️ Delete and uncheck habits
- 🎨 Clean React frontend built with Vite
- 🧩 Modular backend structure

---

## 📁 Project structure

```
habit-tracker/
├── habit-tracker-backend/   # Express + MongoDB API
├── habit-tracker-frontend/  # React + Vite frontend
```

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/ALEVOLDON/habit-tracker.git
cd habit-tracker
```

### 2. Install backend

```bash
cd habit-tracker-backend
npm install
cp .env.example .env # create .env with MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Install frontend

```bash
cd ../habit-tracker-frontend
npm install
npm run dev
```

---

## 🔧 .env example (backend)

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
| DELETE | `/api/habits/:id/check`   | Uncheck              |

---

## 💻 Frontend

Located in `habit-tracker-frontend`  
Built with **React + Vite**. Handles login, dashboard, and habit interactions.

---

## 🛡️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, CSS
- **Tools**: Nodemon, Postman, Git

---

## 📚 License

MIT — feel free to use and modify.
