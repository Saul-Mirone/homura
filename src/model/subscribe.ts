import { Database } from 'better-sqlite3';
import { Post, Source } from './types';

const insertSource = `
INSERT INTO sources (id, sourceUrl, name, icon, link, createdAt, updatedAt)
VALUES (NULL, :sourceUrl, :name, :icon, :link, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, unread, starred, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :unread, :starred, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

type CreateSourceOptions = Omit<Source, 'id'>;
type CreatePostOptions = Omit<Post, 'id'>;

export type SubscribePayload = CreateSourceOptions & {
  posts: Omit<CreatePostOptions, 'sourceId' | 'unread' | 'starred'>[];
};

export function subscribe(db: Database, payload: SubscribePayload) {
  const { posts: createPostOptions, ...creatOptions } = payload;

  const source: Source = db
    .prepare<CreateSourceOptions>(insertSource)
    .get(creatOptions);

  const posts: Post[] = createPostOptions.map((createPostOption) =>
    db
      .prepare<CreatePostOptions>(insertPost)
      .get({ ...createPostOption, sourceId: source.id, unread: 1, starred: 0 })
  );

  return {
    ...source,
    posts,
  };
}
