# Shadowdark Encounter Tracker

A MERN stack web app for managing monsters and running combat encounters for the **Shadowdark RPG** tabletop role-playing game. Built as a learning project covering MongoDB, Express.js, React, and Node.js.

## Features

- **Monster Library** — Create, view, edit, and delete monsters with full stat blocks (AC, HP, attacks, ability modifiers, special abilities, XP)
- **Encounter Builder** — Build encounters by selecting monsters from the library with quantity controls and automatic XP calculation
- **Combat Tracker** — Run live combat with initiative rolling, turn tracking, HP management (damage/heal), round counter, and defeat tracking
- **Encounter History** — Review completed combats with stats (rounds, XP earned, combatants, defeated count)
- **Dark Dungeon Theme** — Torchlight amber accents on dark backgrounds, fitting the Shadowdark aesthetic
- **15 Pre-built Monsters** — Seed data ranging from Giant Rat (Lv 0) to Wraith (Lv 5)

## Tech Stack

| Layer    | Technology       |
|----------|------------------|
| Database | MongoDB Atlas    |
| Backend  | Express.js 5     |
| Frontend | React 19 (Vite)  |
| Runtime  | Node.js          |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- npm (comes with Node.js)

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MERN
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or from the root:

```bash
npm run install-all
```

### 3. Configure environment variables

Create `server/.env` with your MongoDB Atlas connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shadowdark-tracker?retryWrites=true&w=majority
PORT=5000
```

To get your connection string:
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click "Connect" > "Connect your application"
4. Copy the connection string and replace `<username>`, `<password>`, and `<cluster>` with your values

### 4. Seed the database

```bash
cd server
npm run seed
```

This populates 15 Shadowdark-style monsters into your database.

### 5. Start development servers

In two separate terminals:

```bash
# Terminal 1 — API server (port 5000)
cd server
npm run dev

# Terminal 2 — React dev server (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
MERN/
├── server/                    # Express API
│   ├── index.js               # Entry point
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   ├── Monster.js
│   │   ├── Encounter.js
│   │   └── CombatSession.js
│   ├── routes/                # API routes
│   │   ├── monsters.js        # /api/monsters
│   │   ├── encounters.js      # /api/encounters
│   │   └── combatSessions.js  # /api/combat-sessions
│   ├── middleware/
│   │   └── errorHandler.js
│   └── seed/                  # Database seeding
│       ├── monsters.json
│       └── seed.js
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/               # Fetch helper functions
│       ├── hooks/             # Custom React hooks
│       ├── components/        # Reusable UI components
│       └── pages/             # Route pages
└── package.json               # Root scripts
```

## Available Scripts

| Script | Location | Description |
|--------|----------|-------------|
| `npm run dev` | `server/` | Start Express with nodemon (auto-restart) |
| `npm run seed` | `server/` | Seed database with monsters |
| `npm start` | `server/` | Start Express (production) |
| `npm run dev` | `client/` | Start Vite dev server |
| `npm run build` | `client/` | Build React for production |
| `npm run build` | root | Build client for deployment |
| `npm start` | root | Start server (production) |

## API Reference

### Monsters `/api/monsters`
- `GET /` — List all monsters (supports `?search=name`)
- `GET /:id` — Get one monster
- `POST /` — Create a monster
- `PUT /:id` — Update a monster
- `DELETE /:id` — Delete a monster

### Encounters `/api/encounters`
- `GET /` — List all encounters
- `GET /:id` — Get encounter with populated monster data
- `POST /` — Create an encounter
- `PUT /:id` — Update an encounter
- `DELETE /:id` — Delete an encounter

### Combat Sessions `/api/combat-sessions`
- `GET /` — List sessions (supports `?status=active` or `?status=completed`)
- `GET /:id` — Get a session
- `POST /` — Create session from an encounter
- `POST /:id/combatants` — Add a player character
- `PATCH /:id/combatants/:combatantId` — Update combatant HP/status
- `POST /:id/roll-initiative` — Roll initiative for all combatants
- `POST /:id/next-turn` — Advance to next turn
- `POST /:id/complete` — End combat and calculate XP

## Deployment on Render.com

1. Push your code to GitHub
2. Go to [Render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
5. Add environment variable: `MONGO_URI` with your Atlas connection string
6. Add environment variable: `NODE_ENV=production`
7. Deploy

In production, Express serves the built React app as static files from `client/dist`.

## MERN Concepts Covered

This project teaches the following through hands-on implementation:

- **MongoDB/Mongoose** — Schemas, sub-documents, ObjectId references, `populate()`, validators, seeding
- **Express.js** — RESTful routing, middleware, error handling, CRUD operations, action endpoints
- **React** — Components, props, useState, useEffect, custom hooks, React Router, controlled forms, dynamic arrays, conditional rendering, modals
- **Full Stack** — Client-server architecture, REST API design, Vite proxy, fetch API, production builds

## Screenshots

*Screenshots will be added after the app is running.*
