import Database from 'better-sqlite3';
import { getPost } from './getPost';
import { getPostList, GetPostListOptions } from './getPostList';
import { getSourceList } from './getSourceList';
import { initialize } from './initialize';
import { markPostsAsRead } from './markPostsAsRead';
import { subscribe, SubscribePayload } from './subscribe';
import { SourceToPayload, sync } from './sync';
import { PostStatus } from './types';
import { unsubscribe } from './unsubscribe';
import { updatePostStatus, UpdatePostStatusOptions } from './updatePostStatus';
import { updateSource, UpdateSourceOptions } from './updateSource';

export class Model {
    private readonly sqlite: Database.Database;

    constructor() {
        const dbPath = ':memory:';
        this.sqlite = new Database(dbPath, { verbose: console.log });
        this.initialize();
    }

    private initialize() {
        return initialize(this.sqlite);
    }

    public subscribe(payload: SubscribePayload) {
        return subscribe(this.sqlite, payload);
    }

    public unsubscribe(id: number) {
        return unsubscribe(this.sqlite, id);
    }

    public getSourceList(type: PostStatus) {
        return getSourceList(this.sqlite, type);
    }

    public getPostList(options: GetPostListOptions) {
        return getPostList(this.sqlite, options);
    }

    public updateSource(options: UpdateSourceOptions) {
        return updateSource(this.sqlite, options);
    }

    public markPostsAsRead(sourceId?: number) {
        return markPostsAsRead(this.sqlite, sourceId);
    }

    public updatePostStatus(options: UpdatePostStatusOptions) {
        return updatePostStatus(this.sqlite, options);
    }

    public getPost(id: number) {
        return getPost(this.sqlite, id);
    }

    public sync(fn: SourceToPayload) {
        return sync(this.sqlite, fn);
    }
}
