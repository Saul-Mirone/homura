import { Database } from 'better-sqlite3';
import { Post } from './types';

const selectPostById = `
SELECT id, title, link, content, unread, starred, date from posts where id = ? ;`;

export function getPost(
  db: Database,
  id: number
): Pick<
  Post,
  'id' | 'title' | 'link' | 'content' | 'unread' | 'starred' | 'date'
> {
  return db.prepare(selectPostById).get(id);
}
