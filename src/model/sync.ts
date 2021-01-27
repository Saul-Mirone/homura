import { Database } from 'better-sqlite3';
import { Post, Source } from './types';

const selectSourcesUrl = `
SELECT id, sourceUrl FROM sources;`;

const selectPosts = `
SELECT id, sourceId, guid, title, link, content, date FROM posts`;

const updateSourceById = `
UPDATE sources SET link = :link, icon = :icon, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

const updatePostById = `
UPDATE posts SET title = :title, content = :content, link = :link; updatedAt = CURRENT_TIMESTAMP FROM posts WHERE id = :id ;`;

const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, unread, starred, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :unread, :starred, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

const deletePostById = `
DELETE FROM posts where id = ? ;`;

type SourceUrl = Pick<Source, 'id' | 'sourceUrl'>;
type UpdateSourcePayload = Pick<Source, 'link' | 'icon'> & {
  posts: Pick<Post, 'title' | 'link' | 'guid' | 'content' | 'date'>[];
};

type PostItem = Pick<Post, 'id' | 'sourceId' | 'guid'>;
type CreatePostPayload = Pick<
  Post,
  | 'sourceId'
  | 'guid'
  | 'title'
  | 'link'
  | 'content'
  | 'unread'
  | 'starred'
  | 'date'
>;
type UpdatePostPayload = Pick<Post, 'title' | 'content' | 'link' | 'id'>;

export type SourceToPayload = (
  source: SourceUrl
) => Promise<UpdateSourcePayload>;

export async function sync(db: Database, sourceToPayload: SourceToPayload) {
  const sources: SourceUrl[] = db.prepare(selectSourcesUrl).all();
  let posts: PostItem[] = db.prepare(selectPosts).all();

  const data = await Promise.all(
    sources.map(async (source) => {
      const payload = await sourceToPayload(source);

      return [source.id, payload] as const;
    })
  );

  data
    .map(([id, updatePayload]: readonly [number, UpdateSourcePayload]) => {
      const { link, icon, posts: payloads } = updatePayload;
      db.prepare(updateSourceById).run({
        id,
        link,
        icon,
      });
      return [id, payloads] as const;
    })
    .forEach(([id, payloads]) => {
      payloads.forEach((payload) => {
        const target = posts.find(
          (post) => post.guid === payload.guid && post.sourceId === id
        );
        if (!target) {
          db.prepare<CreatePostPayload>(insertPost).run({
            ...payload,
            sourceId: id,
            unread: 1,
            starred: 0,
          });
          return;
        }
        db.prepare<UpdatePostPayload>(updatePostById).run({
          id: target.id,
          title: payload.title,
          content: payload.content,
          link: payload.link,
        });
        posts = posts.filter((p) => p.id === target.id);
      });
    });

  posts.forEach((post) => db.prepare(deletePostById).run(post.id));
}
