export interface Source {
  id: number;
  name: string;
  link: string;
  sourceUrl: string;
  icon?: string;
}

export type ISOString = string;

export interface Post {
  id: number;
  sourceId: number;
  guid: string;
  link: string;
  title: string;
  content: string;
  unread: boolean;
  starred: boolean;
  date: ISOString;
}

export type PostStatus = 'unread' | 'starred';
