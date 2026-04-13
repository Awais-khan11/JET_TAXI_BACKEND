# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (auto-reload via tsx watch)
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Build to dist/
npm run build

# Database migrations
npx drizzle-kit generate   # generate migration from schema changes
npx drizzle-kit migrate    # apply migrations to database
npx drizzle-kit studio     # open Drizzle Studio GUI
```

No test runner is configured.

## Environment Variables

```
DATABASE_URL=postgresql://...   # Neon serverless PostgreSQL connection string
SMTP_USER=...                   # Gmail address for sending emails
SMTP_PASS=...                   # Gmail app-specific password
PORT=3000                       # Optional, defaults to 3000
```

## Architecture

**Entry flow:** `server.js` → `src/app.js` → `src/routes/email.routes.js` → `src/controllers/email.controllers.js`

**Language:** Full TypeScript (CommonJS modules). `tsx` runs TS directly in dev; `tsc` compiles to `dist/` for production.

**Database:** Neon serverless PostgreSQL via `@neondatabase/serverless` driver + Drizzle ORM. Connection in `src/db/index.js`. The only table is `bookings`, which doubles as a temporary OTP store — records are upserted on code generation (by email) and deleted after booking confirmation.

**Booking flow (two-step verification):**
1. `POST /api/send-code` — validates UK phone (+44XXXXXXXXXX) and email, generates 6-digit code, upserts into `bookings` with 5-min expiry, sends code via Gmail SMTP
2. `POST /api/confirm-booking` — validates code + expiry against DB, sends full booking details to admin email, deletes the record

**Email:** Nodemailer with Gmail SMTP (`src/config/Transporter.js`). Two service functions in `src/services/sendMail.js`: `sendCode()` for OTP emails, `sendMail()` for admin booking notifications.

**CORS:** Hardcoded to `http://localhost:5173` (Vite dev server). Update `src/app.js` when deploying to production.

**Deployment:** Vercel — `vercel.json` routes all requests to `server.js` via `@vercel/node`.
