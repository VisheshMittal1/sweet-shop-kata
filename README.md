## Sweet Shop Kata
Sweet Shop ek full‑stack demo application hai jisme users login/register karke real‑time stock ke saath mithaiyan dekh sakte hain, purchase kar sakte hain, aur cart manage kar sakte hain.
Is project ka goal secure JWT authentication, role‑based access (user/admin), TDD, aur clean React UI practice karna hai.

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
bash
cd backend
npm test         # Jest + Supertest test suite
Coverage ke liye:

bash
cd backend
npm test -- --coverage
Sample credentials
Apne seed/initial users ke hisaab se yahan actual creds likh dena:

text
Admin
- Email: admin@example.com
- Password: admin123

Normal user
- Email: user@example.com
- Password: user123
