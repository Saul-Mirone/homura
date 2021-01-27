import { app } from 'electron';
import path from 'path';
import { FindOptions, Sequelize } from 'sequelize';
import { Preset } from '../constants/Preset';
import {
  CreatePostAttributes,
  initPost,
  Post,
  PostAttributes,
} from './postModel';
import { CreateSourceAttributes, initSource, Source } from './sourceModel';

export type SourceJSON = ReturnType<Source['toJSON']>;
export type PostJSON = ReturnType<Post['toJSON']>;

export type DiffSourceOptions = Omit<
  CreateSourceAttributes,
  'sourceUrl' | 'name'
> & {
  posts: Omit<CreatePostAttributes, 'sourceId'>[];
};

export type CreateSourceOptions = CreateSourceAttributes & {
  posts: Omit<CreatePostAttributes, 'sourceId'>[];
};

export type CreateSourceResult = Omit<SourceJSON, 'posts'> & {
  posts: Array<Omit<PostJSON, 'content'>>;
};

export type GetSourceListResult = Array<
  Omit<SourceJSON, 'posts'> & { count: number }
>;

export class DB {
  private readonly sequelize: Sequelize;

  private initialized: boolean;

  constructor() {
    const dbPath = path.resolve(
      app.getPath('appData'),
      'homura',
      '0.0.1',
      'database.sqlite'
    );
    console.log(dbPath);
    // const dbPath = ':memory:';
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
    });
    this.initialized = false;
  }

  // @DONE
  public async init(): Promise<void> {
    initPost(this.sequelize);
    initSource(this.sequelize);
    await Post.sync();
    await Source.sync();
    this.initialized = true;
  }

  // @DONE
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
          attributes: ['id', 'title', 'unread', 'starred', 'date', 'link'],
        },
      ],
      rejectOnEmpty: true,
    });

    return result.toJSON();
  }

  public async diffWithSource(id: number, options: DiffSourceOptions) {
    this.checkInitialized();
    const { posts, ...rest } = options;
    await Source.update(rest, {
      where: {
        id,
      },
    });
    const prevSource = await Source.findByPk(id, {
      include: [
        {
          model: Source.associations.posts.target,
          as: Source.associations.posts.as,
          attributes: [
            'id',
            'title',
            'unread',
            'starred',
            'date',
            'guid',
            'link',
          ],
        },
      ],
      rejectOnEmpty: true,
    });
    let prevPosts = [...(await prevSource.getPosts())];

    await Promise.all(
      posts.map(async (post) => {
        const existPost = await Post.findOne({
          where: {
            sourceId: id,
            guid: post.guid,
          },
        });
        if (existPost) {
          await Post.update(
            {
              title: post.title,
              content: post.content,
              link: post.link,
              date: post.date,
            },
            {
              where: {
                id: existPost.id,
              },
            }
          );
          prevPosts = prevPosts.filter((p) => p.guid === post.guid);
          return;
        }
        await Post.create({
          title: post.title,
          sourceId: id,
          link: post.link,
          content: post.content,
          date: post.date,
          guid: post.guid,
        });
      })
    );

    await Promise.all(
      prevPosts.map((x) =>
        Post.destroy({
          where: {
            guid: x.guid,
          },
        })
      )
    );
  }

  // @DONE
  public async updateSourceNameById(id: number, name: string): Promise<void> {
    this.checkInitialized();
    await Source.update(
      { name },
      {
        where: {
          id,
        },
      }
    );
  }

  // @DONE
  public async getSourceList(
    count: 'unread' | 'starred'
  ): Promise<GetSourceListResult> {
    this.checkInitialized();
    const sourceList = await Source.findAll();

    return Promise.all(
      sourceList.map(async (source) => {
        const options =
          count === 'starred'
            ? {
                starred: true,
              }
            : {
                unread: true,
              };
        const sourceCount = await source.countPosts({
          where: options,
        });
        const json = source.toJSON();
        return {
          ...json,
          count: sourceCount,
        };
      })
    );
  }

  public async getSourceUrlList() {
    this.checkInitialized();
    const sourceList = await Source.findAll();
    return sourceList.map(({ id, sourceUrl }) => ({ id, sourceUrl }));
  }

  // @DONE
  public async getSourceById(id: number): Promise<CreateSourceResult> {
    this.checkInitialized();
    const source = await Source.findByPk(id, {
      include: [
        {
          model: Source.associations.posts.target,
          as: Source.associations.posts.as,
          attributes: [
            'id',
            'title',
            'unread',
            'starred',
            'date',
            'link',
            'sourceId',
            'content',
          ],
        },
      ],
      rejectOnEmpty: true,
    });

    return source.toJSON();
  }

  // @DONE
  public getPostByPreset(
    preset: Preset
  ): Promise<Array<PostJSON & { sourceName: string; icon: string | null }>> {
    this.checkInitialized();
    const getResult = async (options?: FindOptions<PostAttributes>) => {
      const posts = await Post.findAll(options);
      return Promise.all(
        posts.map(async (x) => {
          const source = await x.getSource();
          return {
            sourceName: source.name,
            icon: source.icon,
            ...x.toJSON(),
          };
        })
      );
    };
    switch (preset) {
      case Preset.Unread:
        return getResult({ where: { unread: true } });
      case Preset.Starred:
        return getResult({ where: { starred: true } });
      case Preset.Archive:
        return getResult({ where: { unread: false } });
      case Preset.All:
      default:
        return getResult();
    }
  }

  // @DONE
  public async getPostById(id: number): Promise<PostJSON> {
    this.checkInitialized();
    const post = await Post.findByPk(id, {
      rejectOnEmpty: true,
    });

    return post.toJSON();
  }

  // @DONE
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

  // @DONE
  public async markAllPostsAsReadBySourceId(sourceId: number): Promise<void> {
    this.checkInitialized();
    await Post.update(
      {
        unread: false,
      },
      {
        where: {
          sourceId,
        },
      }
    );
  }

  // @DONE
  public async removeSourceById(id: number): Promise<void> {
    this.checkInitialized();
    await Post.destroy({
      where: {
        sourceId: id,
      },
    });
    await Source.destroy({
      where: {
        id,
      },
    });
  }

  private checkInitialized() {
    if (!this.initialized) throw new Error('Not initialized!');
  }
}
