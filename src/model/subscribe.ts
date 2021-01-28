import { Database } from 'better-sqlite3';
import { Post, Source } from './types';

const insertSource = `
INSERT INTO sources (id, sourceUrl, name, icon, link, createdAt, updatedAt)
VALUES (NULL, :sourceUrl, :name, :icon, :link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

const selectSource = `SELECT id, name, icon, link FROM sources where id = ? ;`;

type CreateSourceOptions = Omit<Source, 'id'>;
type CreatePostOptions = Omit<Post, 'id'>;

export type SubscribePayload = CreateSourceOptions & {
  posts: Omit<CreatePostOptions, 'sourceId' | 'unread' | 'starred'>[];
};

export function subscribe(db: Database, payload: SubscribePayload) {
  const { posts: createPostOptions, ...creatOptions } = payload;

  const sourceInfo = db
    .prepare<CreateSourceOptions>(insertSource)
    .run(creatOptions);

  const { lastInsertRowid } = sourceInfo;

  createPostOptions.forEach((createPostOption) => {
    db.prepare<Omit<Post, 'id' | 'unread' | 'starred'>>(insertPost).run({
      ...createPostOption,
      sourceId: lastInsertRowid as number,
    });
  });

  const source = db.prepare(selectSource).get(lastInsertRowid);

  return {
    ...source,
    posts: [],
  };
}
