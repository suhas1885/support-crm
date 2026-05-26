# Support CRM

Customer Support Ticket CRM — React + Express + Firebase Firestore.

## Project structure

```
support-crm/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Express API backend
├── package.json     # Root scripts to run client/server
└── README.md
```

## Quick start

```bash
# 1. Install dependencies
npm run install:all

# 2. Copy environment files
copy server\.env.example server\.env
copy client\.env.example client\.env

# 3. Start backend (terminal 1)
npm run dev:server

# 4. Start frontend (terminal 2)
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: ${API_BASE_URL}/api/health (configured in `server/.env`)
