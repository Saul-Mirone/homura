import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PostAttributes {
  id: number;
  sourceId: number;
  guid: string;
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

  public content!: string;

  public unread!: boolean;

  public starred!: boolean;

  public date!: Date;

  public toJSON!: () => PostAttributes;
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
