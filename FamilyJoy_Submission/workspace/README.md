# FamilyJoy - Developer Setup Guide

This guide is for new teammates to set up a runnable local environment as quickly as possible.

## Tech Stack and Boundaries

Use these technologies as the default implementation boundary for this project.

### Required Stack

- Backend:
  - Node.js + Express
  - EJS (SSR)
  - express-ejs-layouts
  - express-session + express-mysql-session
  - mysql2
- Frontend:
  - Bootstrap 5 (default components/utilities first)
  - Vanilla JavaScript (no build step required)
- Database:
  - MySQL (`familyjoy_db`)
- Mobile wrapper:
  - Capacitor Android

### Development Constraints

- Do not introduce SPA frameworks (React/Vue/Angular) for current scope.
- Do not add CSS frameworks that overlap Bootstrap (e.g., Tailwind).
- Prefer Bootstrap components before writing custom UI patterns.
- Keep page rendering server-side via EJS unless explicitly approved.
- Keep frontend interaction scripts in standalone files under `public/js` (Vanilla JavaScript).
- Do not move page interaction logic back into inline `<script>` blocks inside EJS templates.
- Keep admin tools and one-off scripts in `workspace/tools`.
- Keep admin module isolated under `workspace/src/familyjoy_admin`.

### MVC Responsibility Boundary (Important)

- Model/Service/Repository (server):
  - Data access, business rules, validation, authorization.
- View (EJS):
  - HTML structure and server-rendered data binding only.
- Controller:
  - Request/response orchestration and view-model binding.
- Frontend JavaScript (Vanilla JS in `public/js`):
  - UI behavior only (tabs, modal triggers, list interactions, progressive enhancement).

This project uses MVC with SSR.  
Using standalone Vanilla JS files is the current approved way to keep frontend behavior maintainable without introducing a SPA stack.

## 1. What this repo contains

- `workspace/package.json`: root scripts (Capacitor + wrappers)
- `workspace/src/package.json`: web server app (Express + EJS)
- `workspace/src/familyjoy_server`: server code
- `workspace/src/familyjoy_client`: main app UI
- `workspace/src/familyjoy_admin`: admin portal UI + server module
- `workspace/tools`: local utilities (admin seeding, image tools, optional local scripts)
- `workspace/.env`: environment configuration (server + DB + Capacitor)

## 2. Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- MySQL (XAMPP/phpMyAdmin is supported)
- Git
- (Optional) Android Studio for Capacitor Android testing

## 3. Quick Start (Web only)

Run all commands from:

```sh
cd workspace
```

### Step 1: Install dependencies

```sh
npm install
npm install --prefix src
```

### Step 2: Configure database

Create database:

- Name: `familyjoy_db`
- Charset: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`

### Step 3: Verify `.env`

Required DB keys in `workspace/.env`:

```env
PORT=3000
SESSION_SECRET=your_session_secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=familyjoy_db
```

### Step 4: Import baseline database structure

Import this SQL file into `familyjoy_db`:

- `workspace/src/database_backup/familyjoy_db.sql`

You can import using phpMyAdmin (Import tab) or MySQL CLI.

### Step 5: Seed admin account (optional but recommended)

```sh
node tools/db-tool.js seed-admin
```

### Step 6: Start the app

Dev mode (with auto-reload):

```sh
npm run dev
```

Or normal start:

```sh
npm start
```

### Step 7: Verify URLs

- Main app: `http://localhost:3000`
- Admin portal: `http://localhost:3000/admin`

Default admin credentials:

- Username: `admin`
- Password: `admin123456`

## 4. Admin portal behavior (important)

- Admin and normal user login are separated.
- Admin pages use `adminUser` session.
- Main user auth flow does not grant admin access.

## 5. Useful commands

```sh
# Start web app (dev)
npm run dev

# Start web app (normal)
npm start

# Unified DB tool (recommended)
node tools/db-tool.js seed-admin
node tools/db-tool.js clear
node tools/db-tool.js clear --with-admin
```

## 6. Optional: Android (Capacitor)

```sh
npm run cap:sync
npm run cap:open:android
```

Emulator host mapping:

- In Android emulator, `localhost` of host machine is `10.0.2.2`
- Server URL example: `http://10.0.2.2:3000`

## 7. Troubleshooting

### Port 3000 already in use (Windows PowerShell)

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

### Admin login fails

- Re-run:
  ```sh
  node tools/db-tool.js seed-admin
  ```
- Confirm `system_admins` table exists in `familyjoy_db`.

### I ran db-clear and admin still exists

- This is expected default behavior.
- `db-tool.js clear` keeps `system_admins` unless you run:
  ```sh
  node tools/db-tool.js clear --with-admin
  ```

## 8. Notes for contributors

- Keep admin utilities in `tools/` (not in runtime scripts unless required).
- Keep docs in sync when changing routes, auth flow, or schema.
- Use DB backup import for teammate onboarding; migration scripts are local development-only.
- DB operation scripts are managed through `tools/db-tool.js` + `tools/db_tasks/*`.
