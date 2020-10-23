import { ipcMain, ipcRenderer } from 'electron';

const channelName = [
  'getSourceList',
  'checkUrl',
  'confirm',
  'getSourceById',
  'getPostById',
  'setPostUnread',
  'setPostStarred',
  'countBy',
] as const;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Fn = (...args: any[]) => any;

type Tail<T extends unknown[]> = T extends [unknown, ...infer U] ? U : [];

type Child<T extends Record<string, Fn>> = {
  [K in keyof T]: (...args: Tail<Parameters<T[K]>>) => ReturnType<T[K]>;
};

export function generateChild<
  T extends Record<typeof channelName[number], Fn>
>(): Child<T> {
  return channelName.reduce((acc, key) => {
    return {
      ...acc,
      [key]: (...args: unknown[]) => ipcRenderer.invoke(key, ...args),
    };
  }, {}) as Child<T>;
}

export function listenToMain<T extends Record<typeof channelName[number], Fn>>(
  records: T
): void {
  Object.entries(records).forEach(([key, handler]) => {
    ipcMain.handle(key, handler);
  });
}
