import { IpcMainInvokeEvent } from 'electron';
import Parser from 'rss-parser';
import { Preset } from '../constants/Preset';
import { CreateSourceResult, DB } from '../model';
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
      getSourceList: (_: Event, count: 'unread' | 'starred') =>
        this.getSourceList(count),
      checkUrl: (_: Event, url: string) => this.handleCheckUrl(url),
      confirm: (_: Event, name: string) => this.confirm(name),
      getSourceById: (_: Event, id: number) => this.db.getSourceById(id),
      getPostById: (_: Event, id: number) => this.db.getPostById(id),
      setPostUnread: (_: Event, id: number, unread: boolean) =>
        this.setPostUnread(id, unread),
      setPostStarred: (_: Event, id: number, starred: boolean) =>
        this.setPostStarred(id, starred),
      countBy: (_: Event, type?: 'unread' | 'starred') => this.db.countBy(type),
      getPostByPreset: (_: Event, preset: Preset) =>
        this.db.getPostByPreset(preset),
      markAllAsReadBySourceId: (_: Event, sourceId: number) =>
        this.db.markAllPostsAsReadBySourceId(sourceId),
      sync: () => this.sync(),
      removeSourceById: (_: Event, sourceId: number) =>
        this.db.removeSourceById(sourceId),
      updateSourceNameById: (_: Event, sourceId: number, name: string) =>
        this.db.updateSourceNameById(sourceId, name),
    };
  }

  public listen(): void {
    listenToMain(this.listener());
  }

  private async sync() {
    const urlList = await this.db.getSourceUrlList();
    await Promise.all(
      urlList.map(async ({ sourceUrl, id }) => {
        const { link = '', items = [] } = await this.checkURL(sourceUrl);
        const faviconUrl = await getFaviconByUrl(link);
        const data = {
          link,
          icon: faviconUrl || null,
          posts: items.map((item) => ({
            title: item.title ?? '',
            link: item.link ?? '',
            guid: item.guid ?? item.id ?? item.isoDate ?? '',
            content: item['content:encoded'] ?? item.content ?? '',
            date: new Date(item.isoDate as string),
          })),
        };
        await this.db.diffWithSource(id, data);
      })
    );
  }

  private getSourceList(count: 'unread' | 'starred') {
    return this.db.getSourceList(count);
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
          guid: item.guid ?? '',
          content: item['content:encoded'] ?? item.content ?? '',
          date: new Date(item.isoDate as string),
        })),
      };
      return title;
    } catch {
      return '';
    }
  }

  private confirm(name: string): Promise<CreateSourceResult> {
    const tmp: CheckResult | null = {
      ...this.checkResult,
    } as CheckResult | null;
    this.checkResult = null;

    if (!tmp) throw new Error();
    return this.db.createSource({
      name,
      link: tmp.link,
      sourceUrl: tmp.sourceUrl,
      icon: tmp.icon || null,
      posts: tmp.items.map(({ title, content, date, guid }) => ({
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

  private setPostUnread(id: number, unread: boolean) {
    return this.db.updatePostById(id, {
      unread,
    });
  }

  private setPostStarred(id: number, starred: boolean) {
    return this.db.updatePostById(id, {
      starred,
    });
  }
}
