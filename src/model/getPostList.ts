import { Database } from 'better-sqlite3';
import { Preset } from '../constants/Preset';
import { Post, PostStatus, Source } from './types';

export const selectPostsBySourceId = (type?: PostStatus) => `
SELECT s.name, s.icon, p.id, p.title, p.unread, p.starred, p.date
FROM sources s
LEFT OUTER JOIN posts p
ON s.id = p.sourceId
WHERE s.id = ?
${type !== undefined ? ` AND p.${type} = 1` : ''}
ORDER BY p.date DESC;`;

export const selectPostsByPreset = (type?: PostStatus) => `
SELECT s.name, s.icon, p.id, p.title, p.unread, p.starred, p.date
FROM sources s
LEFT OUTER JOIN posts p
ON p.sourceId = s.id
${type !== undefined ? `WHERE p.${type} = ? ` : ''}
ORDER BY p.date DESC;`;

export type GetPostListOptions =
  | {
      type?: PostStatus;
      id: number;
    }
  | Preset;

type PostList = Array<
  Pick<Source, 'name' | 'icon'> &
    Pick<Post, 'id' | 'title' | 'unread' | 'starred' | 'date'>
>;

export function getPostList(
  db: Database,
  options: GetPostListOptions
): PostList {
  if (typeof options !== 'string') {
    return db
      .prepare<number>(selectPostsBySourceId(options.type))
      .all(options.id);
  }
  switch (options) {
    case Preset.Starred:
      return db.prepare(selectPostsByPreset('starred')).all(1);
    case Preset.Unread:
      return db.prepare(selectPostsByPreset('unread')).all(1);
    case Preset.Archive:
      return db.prepare(selectPostsByPreset('unread')).all(0);
    default:
    case Preset.All:
      return db.prepare(selectPostsByPreset()).all();
  }
}
