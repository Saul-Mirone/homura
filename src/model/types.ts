export type Status = 0 | 1;

export interface Source {
  id: number;
  name: string;
  link: string;
  sourceUrl: string;
  icon?: string;
}

export interface Post {
  id: number;
  sourceId: number;
  guid: string;
  link: string;
  title: string;
  content: string;
  unread: Status;
  starred: Status;
  date: string;
}

export type PostStatus = 'unread' | 'starred';
