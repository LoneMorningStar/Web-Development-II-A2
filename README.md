# Charity Events Hub — PROG2002 Assessment 2

A dynamic web application that lets users discover and search charity fundraising
events. It demonstrates a full client–server architecture:

- **Database:** MySQL (`charityevents_db`)
- **RESTful API:** Node.js + Express
- **Client:** HTML + JavaScript + DOM + `fetch` (Promises / `async/await`)

## Project structure

```
charity-events-project/
├── api/                    # backend  -> usernameA2-api.zip
│   ├── event_db.js         # MySQL connection pool
│   ├── server.js           # Express entry point
│   ├── routes/
│   │   ├── events.js       # /api/events endpoints
│   │   └── categories.js   # /api/categories endpoint
│   ├── package.json
│   ├── .env                # local DB config (not committed)
│   └── .env.example
├── clientside/             # frontend -> usernameA2-clientside.zip
│   ├── index.html          # Home
│   ├── search.html         # Search
│   ├── event.html          # Event detail
│   ├── css/style.css
│   ├── js/{api,home,search,event}.js
│   └── images/
├── database/
│   └── charityevents_db.sql
├── docs/
│   └── project-report.md
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MySQL](https://dev.mysql.com/downloads/) server (local instance)

## Quick start

### 1. Import the database

```bash
mysql -u root -p < database/charityevents_db.sql
```

### 2. Start the API

```bash
cd api
npm install
npm start          # http://localhost:3000
```

The API endpoints are:

| Method | Path                         | Purpose                          |
|--------|------------------------------|----------------------------------|
| GET    | `/api/events`                | Home: upcoming, non-suspended    |
| GET    | `/api/events/search`         | Search by date/location/category |
| GET    | `/api/events/:id`            | Single event detail              |
| GET    | `/api/categories`            | All categories                   |

### 3. Start the client

```bash
cd clientside
npx serve .        # or use VS Code "Live Server"
```

Then open `http://localhost:5500/index.html`.

> The client calls `http://localhost:3000/api/...`. CORS is already enabled in
> the API so cross-port requests work.

## Database credentials

Edit `api/.env` to match your local MySQL setup. The default expects
`root` with an empty password and a database named `charityevents_db`.

## Submission (per the assessment brief)

- Project report (PDF/Word)
- `usernameA2-clientside.zip`
- `usernameA2-api.zip`
- `database/charityevents_db.sql` (for the marker to import locally)
- GitHub repository URL
- Demo video link (SCU OneDrive)
