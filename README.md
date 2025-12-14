## Sweet Shop Kata
Sweet Shop is a full‑stack demo application where users can register and log in to view sweets with real‑time stock, purchase them, and manage their cart. The goal of this project is to practice secure JWT authentication, role‑based access (user/admin), TDD, and a clean React UI.

## Tech stack
Backend: Node.js, Express, SQLite (ya jo DB tumne use ki hai), JWT authentication, Jest + Supertest tests

Frontend: React, Vite, modern CSS (custom design, no UI framework)

Project structure
text
backend/           # Node.js + Express API
  ├─ src/
  ├─ scripts/
  ├─ tests/
  └─ client/       # React + Vite frontend

## How to run locally
Backend (API server)
bash
cd backend
npm install
npm run dev      # server: http://localhost:4000

Frontend (React client)
bash
cd backend/client
npm install
npm run dev      # client: http://localhost:5173
Backend ke .env file me apni DB aur JWT secret ki values set karni hongi (example: PORT, DATABASE_URL / DB_PATH, JWT_SECRET).

## Tests
- bash
- cd backend
- npm test         
Coverage ke liye:

- bash
- cd backend
- npm test -- --coverage
- Sample credentials

text
Admin
- Email: admin@example.com
- Password: admin123

Normal user
- Email: user@example.com
- Password: user123

## Front-End 
cd C:\Users\HP\sweet-shop-kata\backend\client
- npm install  
- npm run dev        # URL: http://localhost:5173

## Backend
cd C:\Users\HP\sweet-shop-kata\backend
- npm install
- npm run dev        # URL: http://localhost:4000
