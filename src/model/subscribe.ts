import { Database } from 'better-sqlite3';
import { Post, Source } from './types';

const insertSource = `
INSERT INTO sources (id, sourceUrl, name, icon, link, createdAt, updatedAt)
VALUES (NULL, :sourceUrl, :name, :icon, :link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

const selectSource = `SELECT id, name, icon, link FROM sources where id = ? ;`;

type CreateSourceKeys = 'sourceUrl' | 'name' | 'icon' | 'link';
type CreatePostKeys =
  | 'sourceId'
  | 'guid'
  | 'title'
  | 'link'
  | 'content'
  | 'date';

type CreateSourceOptions = Pick<Source, CreateSourceKeys>;
type CreatePostOptions = Pick<Post, CreatePostKeys>;

type PostParams = Omit<Post, 'id' | 'unread' | 'starred'>;

export type SubscribePayload = CreateSourceOptions & {
  posts: Omit<CreatePostOptions, 'sourceId'>[];
};

export function subscribe(
  db: Database,
  payload: SubscribePayload
): Pick<Source, 'id' | 'name' | 'icon' | 'link'> & { count: number } {
  const { posts: createPostOptions, ...creatOptions } = payload;

  const sourceInfo = db
    .prepare<CreateSourceOptions>(insertSource)
    .run(creatOptions);

  const { lastInsertRowid } = sourceInfo;

  createPostOptions
    .map((x) => ({ ...x, sourceId: lastInsertRowid as number }))
    .forEach((params) => {
      db.prepare<PostParams>(insertPost).run(params);
    });

  return {
    ...db.prepare(selectSource).get(lastInsertRowid),
    count: createPostOptions.length,
  };
}
