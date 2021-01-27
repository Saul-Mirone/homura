import { Database } from 'better-sqlite3';
import { PostStatus, Source } from './types';

export const selectSourcesWithPostsCountByType = (type: PostStatus) => `
SELECT id, name, icon, link, SUM(counter) as count FROM (
  SELECT s.id, s.name, s.icon, s.link, p.${type} AS counter
  FROM sources s
  LEFT OUTER JOIN posts p
  ON p.sourceId = s.id
) t GROUP BY id;`;

export type SourceList = Array<
  Pick<Source, 'id' | 'name' | 'icon' | 'link'> & { count: number }
>;

export function getSourceList(db: Database, type: PostStatus): SourceList {
  return db.prepare(selectSourcesWithPostsCountByType(type)).all();
}
