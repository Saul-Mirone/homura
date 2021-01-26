export const createSourcesTable = `
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceUrl VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  link VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);`;

export const createSourcesIndex = `PRAGMA INDEX_LIST(sources);`;

export const createPostsTable = `
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

export const createPostsIndex = `PRAGMA INDEX_LIST(posts);`;

export const selectSourcesWithPostsCountByType = (
  type: 'unread' | 'starred'
) => `
SELECT id, name, icon, link, SUM(counter) as count FROM (
  SELECT s.id, s.name, s.icon, s.link, p.${type} AS counter
  FROM sources s
  LEFT OUTER JOIN posts p
  ON p.sourceId = s.id
) t GROUP BY id;`;

export const selectPostsBySourceId = (type?: 'unread' | 'starred') => `
SELECT s.name, s.icon, p.id, p.title, p.unread, p.starred, p.date
FROM sources s
LEFT OUTER JOIN posts p
ON s.id = p.sourceId
WHERE s.id = ?
${type !== undefined ? ` AND p.${type} = 1` : ''}
ORDER BY p.date DESC;`;

export const selectPostsByPreset = (type?: 'unread' | 'starred') => `
SELECT s.name, s.icon, p.id, p.title, p.unread, p.starred, p.date
FROM sources s
LEFT OUTER JOIN posts p
ON p.sourceId = s.id
${type !== undefined ? `WHERE p.${type} = 1` : ''}
ORDER BY p.date DESC;`;

export const updatePostStatusById = (type: 'unread' | 'starred') => `
UPDATE posts SET ${type} = :value, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

export const deletePostsBySourceId = `
DELETE FROM posts where sourceId = ? ;`;

export const deleteSourceById = `
DELETE FROM sources where id = ? ;`;

export const updateSourceNameById = `
UPDATE sources SET name = :name, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

export const selectPostById = `
SELECT id, title, link, content, unread, starred, date from posts where id = ? ;`;

export const updateAllPostsAsReadBySourceId = `
UPDATE posts SET unread = 0, updatedAt = CURRENT_TIMESTAMP WHERE sourceId = ? ;`;

export const insertSource = `
INSERT INTO sources (id, sourceUrl, name, icon, link, createdAt, updatedAt)
VALUES (NULL, :sourceUrl, :name, :icon, :link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

export const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, unread, starred, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :unread, :starred, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
