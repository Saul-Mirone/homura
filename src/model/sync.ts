import { Database } from 'better-sqlite3';
import { assign, pick } from 'lodash';
import { Post, Source } from './types';

const selectSourcesUrl = `
SELECT id, sourceUrl FROM sources;`;

const selectPosts = `
SELECT id, sourceId, guid, title, link, content, date FROM posts`;

const updateSourceById = `
UPDATE sources SET link = :link, icon = :icon, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

const updatePostById = `
UPDATE posts SET title = :title, content = :content, link = :link, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

const insertPost = `
INSERT INTO posts (id, sourceId, guid, title, link, content, date, createdAt, updatedAt)
VALUES (NULL, :sourceId, :guid, :title, :link, :content, :date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;

const deletePostById = `
DELETE FROM posts where id = ? ;`;

type SourceUrl = Pick<Source, 'id' | 'sourceUrl'>;
type UpdateSourcePayload = Pick<Source, 'link' | 'icon'> & {
    posts: Pick<Post, 'title' | 'link' | 'guid' | 'content' | 'date'>[];
};

type PostItem = Pick<Post, 'id' | 'sourceId' | 'guid'>;
type CreatePostPayload = Pick<Post, 'sourceId' | 'guid' | 'title' | 'link' | 'content' | 'date'>;
type UpdatePostPayload = Pick<Post, 'title' | 'content' | 'link' | 'id'>;

export type SourceToPayload = (source: SourceUrl) => Promise<UpdateSourcePayload>;

export async function sync(db: Database, sourceToPayload: SourceToPayload) {
    const sources: SourceUrl[] = db.prepare(selectSourcesUrl).all();
    let posts: PostItem[] = db.prepare(selectPosts).all();

    const data = await Promise.all(
        sources.map(async (source) => {
            const payload = await sourceToPayload(source);

            return [source.id, payload] as const;
        }),
    );

    data.map(([id, updatePayload]: readonly [number, UpdateSourcePayload]) => {
        const { link, icon, posts: payloads } = updatePayload;
        db.prepare(updateSourceById).run({
            id,
            link,
            icon,
        });
        return [id, payloads] as const;
    })
        .flatMap(([id, payloads]) => payloads.map((payload) => ({ ...payload, sourceId: id })))
        .forEach((payload) => {
            const target = posts.find((post) => post.guid === payload.guid && post.sourceId === payload.sourceId);
            if (!target) {
                db.prepare<CreatePostPayload>(insertPost).run(payload);
                return;
            }

            const { id } = target;
            const params = assign(pick(payload, ['title', 'content', 'link']), {
                id,
            });
            db.prepare<UpdatePostPayload>(updatePostById).run(params);

            posts = posts.filter((p) => p.id !== id);
        });

    posts.forEach((post) => db.prepare(deletePostById).run(post.id));
}
