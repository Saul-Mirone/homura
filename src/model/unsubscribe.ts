import { Database } from 'better-sqlite3';

const deletePostsBySourceId = `
DELETE FROM posts where sourceId = ? ;`;

const deleteSourceById = `
DELETE FROM sources where id = ? ;`;

export function unsubscribe(db: Database, id: number) {
    db.prepare(deletePostsBySourceId).run(id);
    db.prepare(deleteSourceById).run(id);
}
