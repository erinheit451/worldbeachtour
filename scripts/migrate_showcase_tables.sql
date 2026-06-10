-- Showcase schema: new tables + columns that generalize rich beach pages.
-- Every row here replaces narrative-only content with queryable, renderable data.

BEGIN;

-- Timeline events: history, design milestones, cultural moments
CREATE TABLE IF NOT EXISTS beach_timeline_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  year INTEGER NOT NULL,
  month INTEGER,
  event_type TEXT NOT NULL,         -- 'founded'|'built'|'cultural'|'sport'|'political'|'natural'|'infrastructure'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  wiki_url TEXT,
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_timeline_beach ON beach_timeline_events(beach_id, year);

-- Sub-zones: postos, coves, sections — micro-geography
CREATE TABLE IF NOT EXISTS beach_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  zone_code TEXT NOT NULL,
  name TEXT NOT NULL,
  position_along_beach_pct REAL,
  lat REAL,
  lng REAL,
  character TEXT NOT NULL,
  best_for TEXT,
  notes TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(beach_id, zone_code)
);

-- Landmarks: buildings, monuments, design features
CREATE TABLE IF NOT EXISTS beach_landmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  name TEXT NOT NULL,
  landmark_type TEXT NOT NULL,      -- 'hotel'|'fort'|'monument'|'natural'|'design'|'building'|'religious'
  year_built INTEGER,
  architect_or_designer TEXT,
  description TEXT NOT NULL,
  wikipedia_url TEXT,
  lat REAL,
  lng REAL,
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT
);

-- Cultural references: films, books, songs, notable people
CREATE TABLE IF NOT EXISTS beach_cultural_refs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  ref_type TEXT NOT NULL,           -- 'song'|'film'|'book'|'tv'|'event'|'person'|'album'
  title TEXT NOT NULL,
  creator TEXT,
  year INTEGER,
  description TEXT,
  wikipedia_url TEXT,
  external_url TEXT,
  source TEXT
);

-- Recurring events: festivals, NYE, seasonal happenings
CREATE TABLE IF NOT EXISTS beach_recurring_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  name TEXT NOT NULL,
  when_text TEXT NOT NULL,
  month INTEGER,
  description TEXT NOT NULL,
  typical_attendance INTEGER,
  photo_id INTEGER REFERENCES beach_photos(id),
  source TEXT
);

-- Verified businesses: real, named, sourced
CREATE TABLE IF NOT EXISTS beach_businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beach_id TEXT NOT NULL REFERENCES beaches(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,           -- 'restaurant'|'kiosk'|'hotel'|'bar'|'market'|'museum'|'rental'
  description TEXT NOT NULL,
  address TEXT,
  year_established INTEGER,
  lat REAL,
  lng REAL,
  external_url TEXT,
  verified_at TEXT,
  source TEXT NOT NULL             -- must cite a source
);

-- New columns on beaches: narrative + signature assets
ALTER TABLE beaches ADD COLUMN intro_text TEXT;
ALTER TABLE beaches ADD COLUMN favela_note TEXT;
ALTER TABLE beaches ADD COLUMN day_in_time_json TEXT;
ALTER TABLE beaches ADD COLUMN food_drink_json TEXT;
ALTER TABLE beaches ADD COLUMN hero_photo_id INTEGER REFERENCES beach_photos(id);
ALTER TABLE beaches ADD COLUMN gallery_photo_ids TEXT;
ALTER TABLE beaches ADD COLUMN signature_motif TEXT;
ALTER TABLE beaches ADD COLUMN is_showcase INTEGER DEFAULT 0;

COMMIT;
