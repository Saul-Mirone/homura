import { IpcMainInvokeEvent } from 'electron';
import Parser from 'rss-parser';
import { Preset } from '../constants/Preset';
import { DB } from '../model/sqlite';
import { PostStatus } from '../model/types';
import { getFaviconByUrl } from '../utils';
import { listenToMain } from './common';

type CheckResult = {
  name: string;
  link: string;
  sourceUrl: string;
  icon?: string;
  items: Array<{
    guid: string;
    title: string;
    link: string;
    content: string;
    date: Date;
  }>;
};

type Event = IpcMainInvokeEvent;
export type Listener = ReturnType<ChannelMain['listener']>;

export class ChannelMain {
  private parser: Parser;

  private checkResult: CheckResult | null;

  constructor(private readonly db: DB) {
    this.parser = new Parser();
    this.checkResult = null;
  }

  public listener() {
    return {
      getSourceList: (_: Event, status: PostStatus) =>
        this.db.getSourceList(status),
      checkUrl: (_: Event, url: string) => this.handleCheckUrl(url),
      confirm: (_: Event, name: string) => this.confirm(name),
      getSourceById: (_: Event, id: number) => this.db.getPostList({ id }),
      getPostById: (_: Event, id: number) => this.db.getPost(id),
      setPostUnread: (_: Event, id: number, unread: boolean) =>
        this.db.updatePostStatus({ id, type: 'unread', value: unread }),
      setPostStarred: (_: Event, id: number, starred: boolean) =>
        this.db.updatePostStatus({ id, type: 'starred', value: starred }),
      getPostByPreset: (_: Event, preset: Preset) =>
        this.db.getPostList(preset),
      markAllAsReadBySourceId: (_: Event, sourceId?: number) =>
        this.db.markPostsAsRead(sourceId),
      sync: () => this.sync(),
      removeSourceById: (_: Event, sourceId: number) =>
        this.db.unsubscribe(sourceId),
      updateSourceNameById: (_: Event, sourceId: number, name: string) =>
        this.db.updateSource({ id: sourceId, name }),
    };
  }

  public listen(): void {
    listenToMain(this.listener());
  }

  private async sync() {
    await this.db.sync(async ({ sourceUrl }) => {
      const { link = '', items = [] } = await this.checkURL(sourceUrl);
      const faviconUrl = await getFaviconByUrl(link);
      return {
        link,
        icon: faviconUrl,
        posts: items.map((item) => ({
          title: item.title ?? '',
          link: item.link ?? '',
          guid: item.guid ?? item.id ?? item.isoDate ?? '',
          content: item['content:encoded'] ?? item.content ?? '',
          date: new Date(item.isoDate as string),
        })),
      };
    });
  }

  private async handleCheckUrl(url: string): Promise<string> {
    try {
      const { title = '', link = '', items = [] } = await this.checkURL(url);
      const faviconUrl = await getFaviconByUrl(link);
      this.checkResult = {
        name: title,
        link,
        sourceUrl: url,
        icon: faviconUrl,
        items: items.map((item) => ({
          title: item.title ?? '',
          link: item.link ?? '',
          guid: item.guid ?? item.id ?? item.isoDate ?? '',
          content: item['content:encoded'] ?? item.content ?? '',
          date: new Date(item.isoDate as string),
        })),
      };
      return title;
    } catch {
      return '';
    }
  }

  private confirm(name: string) {
    const tmp: CheckResult | null = {
      ...this.checkResult,
    } as CheckResult | null;
    this.checkResult = null;

    if (!tmp) throw new Error();
    return this.db.subscribe({
      name,
      link: tmp.link,
      sourceUrl: tmp.sourceUrl,
      icon: tmp.icon,
      posts: tmp.items.map(({ title, content, date, guid, link }) => ({
        link,
        guid,
        title,
        content,
        date,
      })),
    });
  }

  private checkURL(url: string) {
    return this.parser.parseURL(url);
  }
}
