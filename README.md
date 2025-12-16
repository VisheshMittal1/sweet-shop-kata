## Sweet Shop Kata
Sweet Shop is a full‑stack demo application where users can register and log in to view sweets with real‑time stock, purchase them, and manage their cart. The goal of this project is to practice secure JWT authentication, role‑based access (user/admin), TDD, and a clean React UI.

## Tech stack
Backend: Node.js, Express, SQLite, JWT authentication, Jest + Supertest tests

Frontend: React, Vite, modern CSS (custom design, no UI framework)

Project structure
text
backend/           # Node.js + Express API
  ├─ src/
  ├─ scripts/
  ├─ tests/
  └─ client/       # React + Vite frontend

## Tests
bash
cd backend
npm test         

bash
cd backend
npm test -- --coverage
Sample credentials

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
