# PingXiang Charity — PROG2002 Assessment 2

A dynamic web application that lets users discover and search charity fundraising
events. It demonstrates a full client–server architecture:

- **Database:** MySQL (`charityevents_db`)
- **RESTful API:** Node.js + Express
- **Client:** HTML + JavaScript + DOM + `fetch` (Promises / `async/await`)

> 中文说明请见 [README.zh-CN.md](README.zh-CN.md)

## Features

- Events list with category badges and funding progress bars
- Search / filter by date, location and category
- Event detail shown in a modal ("View details") or on a dedicated page

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
│   ├── index.html          # Home (landing + mission + events list)
│   ├── search.html         # Search / filter
│   ├── event.html          # Event detail page
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js          # fetch wrapper
│   │   ├── nav.js          # shared navigation / menu / animations
│   │   ├── home.js         # home events list rendering
│   │   ├── search.js       # search / filter logic
│   │   └── event.js        # detail page rendering
│   ├── videos/             # hero background video
│   └── images/
├── database/
│   └── charityevents_db.sql
├── start.bat               # one-click launcher (Windows)
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MySQL](https://dev.mysql.com/downloads/) server (local instance)

## Quick start

### Option A — one-click (Windows)

Double-click `start.bat`. It starts the API on `http://localhost:3000`, serves
the client on `http://localhost:5500`, and opens the site in your browser.

Make sure your MySQL service (e.g. `MySQL84`) is running first.

### Option B — manual

#### 1. Import the database

```bash
mysql -u root -p < database/charityevents_db.sql
```

#### 2. Start the API

```bash
cd api
npm install
npm start          # http://localhost:3000
```

The API endpoints are:

| Method | Path                 | Purpose                          |
|--------|----------------------|----------------------------------|
| GET    | `/api/events`        | Upcoming, non-suspended events   |
| GET    | `/api/events/search` | Search by date/location/category |
| GET    | `/api/events/:id`    | Single event detail              |
| GET    | `/api/categories`    | All categories                   |

#### 3. Start the client

```bash
cd clientside
npx serve .        # or use VS Code "Live Server"
```

Then open `http://localhost:5500/index.html`.

> The client calls `http://localhost:3000/api/...`. CORS is already enabled in
> the API so cross-port requests work.

## Database credentials

Edit `api/.env` to match your local MySQL setup:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=charityevents_db
```

Copy `.env.example` to `.env` and fill in your own values.