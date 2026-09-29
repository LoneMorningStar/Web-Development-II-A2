-- ============================================================
--  PROG2002 Assessment 2 - Charity Events Database
--  Database: charityevents_db
--  Import:   mysql -u root -p < charityevents_db.sql
-- ============================================================

DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- ------------------------------------------------------------
-- Table: organisations  (one organisation hosts many events)
-- ------------------------------------------------------------
CREATE TABLE organisations (
  org_id        INT AUTO_INCREMENT PRIMARY KEY,
  org_name      VARCHAR(150) NOT NULL,
  mission       TEXT,
  contact_email VARCHAR(120),
  contact_phone VARCHAR(40),
  website       VARCHAR(200)
);

-- ------------------------------------------------------------
-- Table: categories  (one category contains many events)
-- ------------------------------------------------------------
CREATE TABLE categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE,
  description   VARCHAR(255)
);

-- ------------------------------------------------------------
-- Table: events
--   org_id      -> organisations.org_id      (FK)
--   category_id -> categories.category_id    (FK)
--   is_suspended: 1 = suspended, hidden from Home page
--   "upcoming"/"past" status is computed in the API layer
--     by comparing event_date with NOW()
-- ------------------------------------------------------------
CREATE TABLE events (
  event_id      INT AUTO_INCREMENT PRIMARY KEY,
  event_name    VARCHAR(180) NOT NULL,
  description   TEXT,
  event_date    DATETIME NOT NULL,
  location      VARCHAR(180) NOT NULL,
  ticket_price  DECIMAL(10,2) DEFAULT 0.00,   -- 0 means free
  goal_amount   DECIMAL(12,2) DEFAULT 0.00,
  raised_amount DECIMAL(12,2) DEFAULT 0.00,
  image_url     VARCHAR(255),
  is_suspended  TINYINT(1) DEFAULT 0,
  org_id        INT NOT NULL,
  category_id   INT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_org      FOREIGN KEY (org_id)      REFERENCES organisations(org_id),
  CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- ------------------------------------------------------------
-- Seed: categories
-- ------------------------------------------------------------
INSERT INTO categories (category_name, description) VALUES
('Fun Run',        'Community running/walking fundraiser'),
('Gala Dinner',    'Formal dinner and auction evening'),
('Silent Auction', 'Bidding-based fundraising event'),
('Concert',        'Live music charity concert'),
('Bake Sale',      'Community baking fundraiser');

-- ------------------------------------------------------------
-- Seed: organisations
-- ------------------------------------------------------------
INSERT INTO organisations (org_name, mission, contact_email, contact_phone, website) VALUES
('Hope Foundation', 'Supporting children education',   'info@hope.org',  '0400000001', 'https://hope.org'),
('Green Earth',     'Environmental protection',         'hello@green.org','0400000002', 'https://green.org'),
('Care Australia',  'Community health support',         'care@care.org',  '0400000003', 'https://care.org');

-- ------------------------------------------------------------
-- Seed: events (8+ sample events covering past/upcoming/suspended)
-- ------------------------------------------------------------
INSERT INTO events
(event_name, description, event_date, location, ticket_price, goal_amount, raised_amount, image_url, is_suspended, org_id, category_id) VALUES
('City Fun Run 2026',
 'A 5km charity fun run through the city to raise funds for children''s education programs.',
 '2026-11-15 08:00:00', 'Brisbane CBD',     25.00, 10000.00,  3200.00, 'images/funrun.svg',   0, 1, 1),
('Charity Gala Night',
 'A formal gala dinner and live auction evening supporting Hope Foundation.',
 '2026-12-05 18:30:00', 'Hilton Brisbane', 120.00, 50000.00, 18500.00, 'images/gala.svg',     0, 1, 2),
('Silent Auction for Kids',
 'An online silent auction of donated items, with all proceeds going to children in need.',
 '2026-10-20 10:00:00', 'Online',            0.00, 20000.00,  7600.00, 'images/auction.svg',  0, 2, 3),
('Green Earth Concert',
 'A live charity concert featuring local artists to support environmental protection.',
 '2026-11-30 19:00:00', 'Riverstage',       45.00, 30000.00, 12000.00, 'images/concert.svg',  0, 2, 4),
('Community Bake Sale',
 'A community bake sale raising funds for a local homeless shelter.',
 '2026-10-05 09:00:00', 'South Bank',        5.00,  2000.00,   900.00, 'images/bake.svg',     0, 3, 5),
('Charity Walk for Health',
 'A 10km awareness walk along the Gold Coast to promote community health.',
 '2026-11-01 07:30:00', 'Gold Coast',       15.00,  8000.00,  2500.00, 'images/walk.svg',     0, 3, 1),
('Past Run 2025',
 'Last year''s fun run, fully completed and now archived as a past event.',
 '2025-11-10 08:00:00', 'Brisbane CBD',     20.00, 10000.00, 10000.00, 'images/funrun.svg',   0, 1, 1),
('Suspended Event X',
 'An event that was suspended due to a policy review and is hidden from the public.',
 '2026-12-01 10:00:00', 'Unknown',          10.00,  5000.00,   100.00, 'images/placeholder.svg', 1, 1, 2);
