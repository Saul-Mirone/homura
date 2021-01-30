import { Database } from 'better-sqlite3';
import { Preset } from '../constants/Preset';
import { Post, PostStatus, Source } from './types';

export const selectPostsBySourceId = (type?: PostStatus) => `
SELECT s.name, s.icon, p.id, p.sourceId, p.title, p.unread, p.starred, p.date, p.link
FROM sources s
LEFT OUTER JOIN posts p
ON s.id = p.sourceId
WHERE s.id = ?
${type !== undefined ? ` AND p.${type} = 1` : ''}
ORDER BY p.date DESC;`;

export const selectPostsByPreset = (type?: PostStatus) => `
SELECT s.name, s.icon, p.id, p.sourceId, p.title, p.unread, p.starred, p.date, p.link
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

type SourceKeys = 'name' | 'icon';
type PostKeys =
  | 'id'
  | 'title'
  | 'unread'
  | 'starred'
  | 'date'
  | 'sourceId'
  | 'link';

type PostItem = Pick<Source, SourceKeys> & Pick<Post, PostKeys>;
type PostList = Array<PostItem>;

export function getPostList(
  db: Database,
  options: GetPostListOptions
): PostList {
  const transformer = ({ unread, starred, ...rest }: PostItem) => ({
    ...rest,
    unread: Boolean(unread),
    starred: Boolean(starred),
  });
  if (typeof options !== 'string') {
    return db
      .prepare<number>(selectPostsBySourceId(options.type))
      .all(options.id)
      .map(transformer);
  }
  switch (options) {
    case Preset.Starred:
      return db.prepare(selectPostsByPreset('starred')).all(1).map(transformer);
    case Preset.Unread:
      return db.prepare(selectPostsByPreset('unread')).all(1).map(transformer);
    case Preset.Archive:
      return db.prepare(selectPostsByPreset('unread')).all(0).map(transformer);
    default:
    case Preset.All:
      return db.prepare(selectPostsByPreset()).all().map(transformer);
  }
}
