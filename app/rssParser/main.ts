import { IpcMainInvokeEvent } from 'electron';
import Parser from 'rss-parser';
import { CreateSourceResult, DB } from '../model';
import { getFaviconByUrl } from '../utils';
import { listenToMain } from './common';

type CheckResult = {
  name: string;
  link: string;
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
export type Listener = ReturnType<RssParserMain['listener']>;

export class RssParserMain {
  private parser: Parser;
  private checkResult: CheckResult | null;

  constructor(private readonly db: DB) {
    this.parser = new Parser();
    this.checkResult = null;
  }

  public listener() {
    return {
      init: (_: Event) => this.init(),
      checkUrl: (_: Event, url: string) => this.handleCheckUrl(url),
      confirm: (_: Event, name: string) => this.confirm(name),
      getSourceById: (_: Event, id: number) => this.db.getSourceById(id),
      getPostById: (_: Event, id: number) => this.db.getPostById(id),
      setPostUnread: (_: Event, id: number, unread: boolean) =>
        this.setPostUnread(id, unread),
      setPostStarred: (_: Event, id: number, starred: boolean) =>
        this.setPostStarred(id, starred),
      countBy: (_: Event, type?: 'unread' | 'starred') => this.db.countBy(type),
    }
  }

  public listen(): void {
    listenToMain(this.listener());
  }

  private init() {
    return this.db.getSourceList();
  }

  private async handleCheckUrl(url: string): Promise<string> {
    try {
      const { title = '', link = '', items = [] } = await this.checkURL(url);
      const faviconUrl = await getFaviconByUrl(link);
      this.checkResult = {
        name: title,
        link,
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
    console.log(Object.keys(tmp));
    console.log(name, tmp.link, tmp.icon);
    return this.db.createSource({
      name,
      link: tmp.link,
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
