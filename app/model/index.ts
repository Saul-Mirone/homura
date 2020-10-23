import { Sequelize } from 'sequelize';
import { CreatePostAttributes, initPost, Post, PostAttributes } from './post';
import { CreateSourceAttributes, initSource, Source } from './source';

export type SourceJSON = ReturnType<Source['toJSON']>;
export type PostJSON = ReturnType<Post['toJSON']>;

export type CreateSourceOptions = CreateSourceAttributes & {
  posts: Omit<CreatePostAttributes, 'sourceId'>[];
};

export type CreateSourceResult = Omit<SourceJSON, 'posts'> & {
  posts: Array<Omit<PostJSON, 'content'>>;
};

export type GetSourceListResult = Array<
  Omit<SourceJSON, 'posts'> & { unreadCount: number }
>;

export class DB {
  private readonly sequelize: Sequelize;

  private initialized: boolean;

  constructor() {
    this.sequelize = new Sequelize('sqlite::memory:');
    this.initialized = false;
  }

  public async init(): Promise<void> {
    initPost(this.sequelize);
    initSource(this.sequelize);
    await this.sequelize.sync();
    this.initialized = true;
  }

  public async createSource({
    posts,
    ...sourceOptions
  }: CreateSourceOptions): Promise<CreateSourceResult> {
    this.checkInitialized();
    const source = await Source.create(sourceOptions);
    await Promise.all(posts.map((post) => source.createPost(post)));

    const result = await Source.findByPk(source.id, {
      include: [
        {
          model: Source.associations.posts.target,
          as: Source.associations.posts.as,
          attributes: ['id', 'title', 'unread', 'starred', 'date'],
        },
      ],
      rejectOnEmpty: true,
    });

    return result.toJSON();
  }

  public async getSourceList(): Promise<GetSourceListResult> {
    this.checkInitialized();
    const sourceList = await Source.findAll();

    return Promise.all(
      sourceList.map(async (source) => {
        const unreadCount = await source.countPosts({
          where: {
            unread: true,
          },
        });
        const json = source.toJSON();
        return {
          ...json,
          unreadCount,
        };
      })
    );
  }

  public async getSourceById(id: number): Promise<CreateSourceResult> {
    this.checkInitialized();
    const source = await Source.findByPk(id, {
      include: [Source.associations.posts],
      rejectOnEmpty: true,
    });

    return source.toJSON();
  }

  public async getPostById(id: number): Promise<PostJSON> {
    this.checkInitialized();
    const post = await Post.findByPk(id, {
      rejectOnEmpty: true,
    });

    return post.toJSON();
  }

  public async updatePostById(
    id: number,
    options: Partial<Pick<PostAttributes, 'unread' | 'starred'>>
  ): Promise<void> {
    this.checkInitialized();
    await Post.update(options, {
      where: {
        id,
      },
    });
  }

  public countBy(type?: 'unread' | 'starred'): Promise<number> {
    this.checkInitialized();
    switch (type) {
      case 'unread':
        return Post.count({ where: { unread: true } });
      case 'starred':
        return Post.count({ where: { starred: true } });
      default:
        return Post.count();
    }
  }

  private checkInitialized() {
    if (!this.initialized) throw new Error('Not initialized!');
  }
}
