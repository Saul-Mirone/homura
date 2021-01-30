import { Database } from 'better-sqlite3';
import { PostStatus } from './types';

const updatePostStatusById = (type: PostStatus) => `
UPDATE posts SET ${type} = :value, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

export type UpdatePostStatusOptions = {
    id: number;
    value: boolean;
    type: PostStatus;
};

export function updatePostStatus(db: Database, options: UpdatePostStatusOptions) {
    const { id, value, type } = options;
    return db.prepare(updatePostStatusById(type)).run({ id, value: value ? 1 : 0 });
}
