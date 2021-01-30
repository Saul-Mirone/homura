import { Database } from 'better-sqlite3';

const createSourcesTable = `
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceUrl VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  link VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);`;

const createSourcesIndex = `PRAGMA INDEX_LIST(sources);`;

const createPostsTable = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceId INTEGER NOT NULL REFERENCES sources (id) ON DELETE CASCADE ON UPDATE CASCADE,
  guid VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  unread TINYINT(1) DEFAULT 1,
  starred TINYINT(1) DEFAULT 0,
  date DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);`;

const createPostsIndex = `PRAGMA INDEX_LIST(posts);`;

export function initialize(db: Database) {
    db.prepare(createSourcesTable).run();
    db.prepare(createSourcesIndex).get();
    db.prepare(createPostsTable).run();
    db.prepare(createPostsIndex).get();
}
