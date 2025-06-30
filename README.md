# Full‑Stack Content Platform · React + Node/Express

![Hero GIF](https://media.giphy.com/media/Mw0DWqUEYbNs1aKwxH/giphy.gif)

> A modern full‑stack starter that lets you **create, manage & rate** games, videos, artwork and music. Built with a clean architecture, typed REST API and exhaustive tests so you can focus on what matters—shipping features.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E=18.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green.svg)](https://mongodb.com/)

---

## Table of Contents

- [Demo](#demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Useful Scripts](#-useful-scripts)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## Demo

A live deployment is available on **Vercel** (frontend) and **Render** (backend)  
👉 ~<https://content-platform.vercel.app>~

---

## ✨ Features

- **Full CRUD** for content items with granular permissions  
- JWT‑based **authentication & authorization** (access + refresh tokens)  
- **MongoDB** persistence via Mongoose ODM  
- **React 18 + Vite** SPA with React Router & Context API  
- **Tailwind CSS** design system with dark‑mode switcher  
- **Swagger UI** auto‑generated API docs  
- **Jest & Supertest** integration tests and React Testing Library UI tests  
- One‑command **Docker** deployment (dev & prod)  
- Pre‑configured **ESLint**, **Prettier** and **Husky** git hooks  

---

## 🛠 Tech Stack

| Layer      | Tech                                                     |
|------------|----------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios                      |
| Backend    | Node 18, Express 5, Mongoose 7                           |
| Database   | MongoDB Atlas / Local Mongo                              |
| Tooling    | ESLint / Prettier, Husky, Jest, Supertest, React Testing Library |
| DevOps     | Docker, Docker Compose, GitHub Actions CI                |

---

## 📂 Project Structure

```text
.
├── backend-app
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── utils
│   └── tests
└── react-app
    ├── src
    │   ├── components
    │   ├── hooks
    │   ├── pages
    │   └── services
    └── tests
```

---

## 🚀 Getting Started

### 1 · Clone repo

```bash
git clone [https://github.com/ekimbasoglu/shampoo-tracker.git
cd shampoo-tracker
```

### 2 · Install dependencies

```bash
# backend
cd backend-app && npm ci

# frontend
cd ../react-app && npm ci
```

### 3 · Configure environment variables

Create the following `.env` files (examples are included):

```bash
# backend-app/.env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/contentplatform
JWT_SECRET=supersecret
```

```bash
# react-app/.env
VITE_BACKEND_URI=http://localhost:3000
```

### 4 · Run in development mode

```bash
# In one terminal
cd backend-app && npm run dev

# In another terminal
cd react-app && npm run dev
```

The frontend will be served at <http://localhost:5173> and will proxy API calls to the backend on port 3000.

---

~## 🧪 Running Tests~ In Progress

```bash
~# Drop + seed test DB then run suites~
~cd backend-app && npm run drop && npm test~
```

~Frontend unit/integration tests:~

```bash
~cd react-app && npm test~
```

---

## 📝 API Reference

Start the backend and open **/api-docs** to explore interactive Swagger UI.

![Swagger screenshot](./docs/swagger.png)

---

## 📦 Useful Scripts

| Command                       | Description                           |
|-------------------------------|---------------------------------------|
| `npm run dev`                 | Start dev server with nodemon         |
| `npm run build`               | Compile production build              |
| `npm run lint`                | Lint & fix source                     |
| `npm run format`              | Prettier formatting                   |
| `npm test`                    | Run tests                             |
| `npm run seed`                | Seed Mongo with sample data           |
| `npm run drop`                | Drop Mongo database                   |

---

## 🗺️ Roadmap

- [ ] Admin dashboard & analytics  
- [ ] GraphQL gateway

---

## 🤝 Contributing

1. Fork the project  
2. Create your feature branch (`git checkout -b feat/amazing`)  
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)  
4. Push to the branch (`git push origin feat/amazing`)  
5. Open a Pull Request  

---

## 📄 License

Distributed under the **MIT** License. See [`LICENSE`](LICENSE) for details.

---

## 📬 Contact

Ekim Basoglu – <ekimbasoglu@hotmail.com>  

Project Link: <https://github.com/ekimbasoglu/shampoo-tracker>

---

*Built with ♥ in 2025.*
