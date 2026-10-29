# Vendor Onboarding Tracker

## Run with Docker

From the project root:

```bash
docker compose up -d
```

App URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Run Manually

Prerequisites:

- Node.js 20+
- pnpm
- PostgreSQL running on `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`

1. Install dependencies

```bash
cd vendor-tracker-be
pnpm install
cd ../vendor-tracker-fe
pnpm install
```

2. Start backend

```bash
cd vendor-tracker-be
echo DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public" > .env
pnpm run start:dev
```

3. Start frontend

```bash
cd vendor-tracker-fe
echo VITE_BACKEND_URL="http://localhost:3000/api" > .env
pnpm run dev
```

Open http://localhost:5173
