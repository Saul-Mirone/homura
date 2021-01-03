import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from 'sequelize';
import { Post } from './post';

export interface SourceAttributes {
  id: number;
  name: string;
  link: string;
  sourceUrl: string;
  icon: string | null;
}

export type CreateSourceAttributes = Optional<SourceAttributes, 'id'>;

export class Source
  extends Model<SourceAttributes, CreateSourceAttributes>
  implements SourceAttributes {
  public id!: number;

  public name!: string;

  public link!: string;

  public sourceUrl!: string;

  public icon!: string | null;

  public getPosts!: HasManyGetAssociationsMixin<Post>;

  public addPost!: HasManyAddAssociationMixin<Post, number>;

  public hasPost!: HasManyHasAssociationMixin<Post, number>;

  public countPosts!: HasManyCountAssociationsMixin;

  public createPost!: HasManyCreateAssociationMixin<Post>;

  public posts?: Post[];

  public toJSON!: () => SourceAttributes & {
    posts: Array<ReturnType<Post['toJSON']>>;
  };

  public static associations: {
    posts: Association<Source, Post>;
  };
}

export const initSource = (sequelize: Sequelize): void => {
  Source.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'sources' }
  );

  Source.hasMany(Post, {
    sourceKey: 'id',
    foreignKey: 'sourceId',
    as: 'posts',
  });
  Post.belongsTo(Source, {
    targetKey: 'id',
    foreignKey: 'sourceId',
    as: 'source',
  });
};
