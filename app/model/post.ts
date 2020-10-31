import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  Model,
  Optional,
  Sequelize,
} from 'sequelize';
import type { Source } from './source';

export interface PostAttributes {
  id: number;
  sourceId: number;
  guid: string;
  link: string;
  title: string;
  content: string;
  unread: boolean;
  starred: boolean;
  date: Date;
}

export type CreatePostAttributes = Optional<
  PostAttributes,
  'id' | 'starred' | 'unread'
>;

export class Post
  extends Model<PostAttributes, CreatePostAttributes>
  implements PostAttributes {
  public id!: number;

  public sourceId!: number;

  public guid!: string;

  public title!: string;

  public link!: string;

  public content!: string;

  public unread!: boolean;

  public starred!: boolean;

  public date!: Date;

  public toJSON!: () => PostAttributes;

  public getSource!: BelongsToGetAssociationMixin<Source>;

  public setSource!: BelongsToSetAssociationMixin<Source, number>;

  public createSource!: BelongsToCreateAssociationMixin<Source>;

  public static associations: {
    source: Association<Post, Source>;
  };
}

export const initPost = (sequelize: Sequelize): void => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      guid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      unread: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      starred: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'posts',
    }
  );
};
