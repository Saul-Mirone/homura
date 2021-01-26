import Database from 'better-sqlite3';
import {
  createPostsIndex,
  createPostsTable,
  createSourcesIndex,
  createSourcesTable,
} from './statement';

export class DB {
  private readonly sqlite: Database.Database;

  constructor() {
    const dbPath = ':memory:';
    this.sqlite = new Database(dbPath, { verbose: console.log });
  }

  public init() {
    this.sqlite.prepare(createSourcesTable).run();
    this.sqlite.prepare(createSourcesIndex).run();
    this.sqlite.prepare(createPostsTable).run();
    this.sqlite.prepare(createPostsIndex).run();
  }
}
