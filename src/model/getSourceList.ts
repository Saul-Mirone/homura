import { Database } from 'better-sqlite3';
import { isNil, negate, pickBy } from 'lodash';
import { PostStatus, Source } from './types';

export const selectSourcesWithPostsCountByType = (type: PostStatus) => `
SELECT id, name, icon, link, SUM(counter) as count FROM (
  SELECT s.id, s.name, s.icon, s.link, p.${type} AS counter
  FROM sources s
  LEFT OUTER JOIN posts p
  ON p.sourceId = s.id
) t GROUP BY id;`;

type SourceKeys = 'id' | 'name' | 'icon' | 'link';

type SourceItem = Pick<Source, SourceKeys> & { count: number };

export type SourceList = SourceItem[];

export function getSourceList(db: Database, type: PostStatus): SourceList {
  return db
    .prepare(selectSourcesWithPostsCountByType(type))
    .all()
    .map((x) => pickBy(x, negate(isNil)) as SourceItem);
}
