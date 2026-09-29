# PROG2002 – Web Development II
## Assignment 2: Use Case (A Dynamic Website) — Project Report

**Student ID:** ______________ &nbsp;&nbsp; **Last Name:** ______________ &nbsp;&nbsp; **First Name:** ______________

**Title of the project:** Charity Events Hub — A Dynamic Web Application for Discovering Charity Fundraising Events

---

## 1. Introduction / Motivation

Community and charity organisations regularly host fundraising events such as fun
runs, gala dinners, silent auctions and concerts, yet potential attendees often
struggle to discover them in one place. Information is scattered across social
media, email lists and printed flyers, which makes it hard for people to find
events that match their interests, budget and location.

The goal of this project is to build a small dynamic website that acts as a
central directory of charity events. Users can browse upcoming events on the home
page, search and filter them by date, location and category, and view the full
details of a single event. The application demonstrates the key concepts from
PROG2002: a MySQL database, a RESTful API built with Node.js and Express, and a
plain JavaScript client that fetches data asynchronously and renders it using the
DOM.

## 2. Problem Statement

The system needs to solve the following concrete problems:

1. **Centralised discovery** — provide a single, always up-to-date list of charity
   events instead of scattered, manually maintained information.
2. **Filtering and search** — allow users to narrow the list by date, location and
   event category.
3. **Detail view** — let users drill into an event to see the organisation, time,
   location, ticket price, purpose and fundraising progress.
4. **Data integrity** — ensure only current/upcoming, non-suspended events are
   shown to the public, while still storing past and suspended records.
5. **Separation of concerns** — separate data storage (MySQL), business logic
   (Express API) and presentation (client) so each layer can be maintained
   independently.

## 3. Solution

The application follows a classic three-tier client–server architecture.

### 3.1 Architecture overview

```
[ Browser (client) ]  --fetch-->  [ Express API ]  --SQL-->  [ MySQL ]
   HTML / JS / DOM                  Node.js                    charityevents_db
```

- **Client tier** (`clientside/`): static HTML pages plus JavaScript that call the
  API with `fetch()` and render results by manipulating the DOM.
- **Server tier** (`api/`): an Express application exposing RESTful endpoints. It
  validates inputs, runs parameterised SQL queries through a connection pool, and
  returns JSON.
- **Data tier** (`database/`): a normalised MySQL schema with `organisations`,
  `categories` and `events` tables linked by primary/foreign keys.

### 3.2 Client–server communication

The client and server communicate over HTTP using JSON. For example, the Home page
calls `GET /api/events`, which the server answers with a JSON object such as:

```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "event_name": "City Fun Run 2026",
      "event_date": "2026-11-15T08:00:00.000Z",
      "location": "Brisbane CBD",
      "ticket_price": 25,
      "category_name": "Fun Run",
      "org_name": "Hope Foundation",
      "status": "upcoming"
    }
  ]
}
```

The JavaScript client decodes this response and builds card elements in the DOM.
All requests use Promises via `async`/`await`, which keeps the asynchronous flow
readable and avoids callback nesting. Because the client is served from a different
port than the API, CORS is enabled on the server to permit cross-origin requests.

## 4. Web UX

The interface is designed to be intuitive and consistent:

- **Consistent navigation** — every page shares the same header with a `Home |
  Search Events` menu, so users always know where they are and how to get back.
- **Card-based layout** — events are presented as visual cards with an image,
  category badge, date, location and a "View details" link.
- **Simple search form** — the Search page offers a date picker, a text field for
  location and a category dropdown (populated dynamically from the API). A
  "Clear Filters" button resets the form.
- **Feedback and validation** — users are told to pick at least one filter,
  "No matching events" is shown when a search is empty, and API failures display a
  clear error message rather than a blank screen.
- **Responsive styling** — a CSS grid reflows cards, and a media query collapses
  the layout on small screens.
- **Explicit progress indicators** — "Loading..." / "Searching..." placeholders are
  shown while requests are in flight.

## 5. Data Schema

The database `charityevents_db` contains three normalised tables. The
relationships are:

- **organisations (1) —— (N) events** — one organisation hosts many events.
- **categories (1) —— (N) events** — one category contains many events.

```
organisations                events                          categories
-------------------          ---------------------------     -------------------
org_id        PK  <----+     event_id      PK               category_id  PK
org_name                 |    event_name                     category_name
mission                  |    description                    description
contact_email           +--- org_id        FK
contact_phone                category_id    FK  ----------->  category_id
website                      event_date
                             location
                             ticket_price
                             goal_amount
                             raised_amount
                             image_url
                             is_suspended
```

- `event_status` is *not* stored as a column. Instead, the API computes `upcoming`
  vs `past` by comparing `event_date` with `NOW()`. The database only stores
  `is_suspended` (a boolean flag) to indicate events that are hidden from the
  public.
- The SQL file seeds 8 sample events (upcoming, past and suspended), 5 categories
  and 3 organisations.

## 6. API Design

The API follows RESTful conventions: resources are named with plural nouns,
filters are passed as query parameters, and every response has a consistent
shape (`{ success, data }` or `{ success, message }`).

| Method | Path                  | Purpose                                    | Success | Errors        |
|--------|-----------------------|--------------------------------------------|---------|---------------|
| GET    | `/api/events`         | Upcoming, non-suspended events             | 200     | 500           |
| GET    | `/api/events/search`  | Filter by `date`, `location`, `category`   | 200     | 500           |
| GET    | `/api/events/:id`     | Single event detail                        | 200     | 400, 404, 500 |
| GET    | `/api/categories`     | List of categories for the dropdown        | 200     | 500           |

### Example endpoint: `GET /api/events/search`

- **Purpose** — return events that match optional filters.
- **Request** — no request body (this assessment is read-only). It accepts query
  string parameters:
  - `date` (e.g. `2026-11-15`) — exact match on the event date.
  - `location` (e.g. `Brisbane`) — partial, case-insensitive match.
  - `category` (e.g. `1`) — exact match on `category_id`.
- **Response body** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "event_name": "City Fun Run 2026",
      "event_date": "2026-11-15T08:00:00.000Z",
      "location": "Brisbane CBD",
      "ticket_price": 25,
      "category_name": "Fun Run",
      "status": "upcoming"
    }
  ]
}
```

### Choice of HTTP methods

Only the `GET` method is used because the application is a **read-only** directory
of events; there is no requirement to create, update or delete resources. This
also matches the assessment brief, which does not require `POST`/`PUT`/`DELETE`.
Using `GET` for these endpoints is appropriate because they are safe and
idempotent. Input validation is performed on the server (for example, the `:id`
parameter is checked against a numeric regular expression and returns `400` for
invalid values), and all SQL uses parameterised placeholders (`?`) to prevent SQL
injection.

---

## 7. GenAI Declaration

_Select and complete the appropriate option from the assessment brief (Option A or
Option B) and describe which Generative AI tools were used and how._

**Option used:** ______

**Description of use:** Generative AI was used to review the project specification
and to draft reference code and this report. All generated material was reviewed,
understood and adapted by the author, and the final implementation reflects the
author's own work and understanding of the concepts taught in PROG2002.

## 8. Academic Integrity Statement

I declare that this assessment is my own work, except where otherwise acknowledged
and in accordance with the Southern Cross University Academic Integrity Policy.
Any assistance received from Generative AI tools has been declared above.

---

*Format: 12pt Arial, 1.5 line spacing.*
