import { Database } from 'better-sqlite3';

const updateAllPostsAsReadBySourceId = `
UPDATE posts SET unread = 0, updatedAt = CURRENT_TIMESTAMP WHERE sourceId = ? ;`;

const updateAllPostsAsRead = `
UPDATE posts SET unread = 0, updatedAt = CURRENT_TIMESTAMP;`;

export function markPostsAsRead(db: Database, id?: number) {
    if (id) {
        return db.prepare(updateAllPostsAsReadBySourceId).run(id);
    }

    return db.prepare(updateAllPostsAsRead).run();
}
