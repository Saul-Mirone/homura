import { ipcMain, ipcRenderer } from 'electron';

export const channel = [
  'init',
  'checkUrl',
  'confirm',
  'getSourceById',
  'getPostById',
  'setPostUnread',
  'setPostStarred',
  'countBy',
] as const;

type Fn = (...args: any[]) => any;

type Tail<T extends any[]> = T extends [any, ...infer U] ? U : [];

type Child<T extends Record<any, Fn>> = {
  [K in keyof T]: (...args: Tail<Parameters<T[K]>>) => ReturnType<T[K]>;
};

export function generateChild<
  T extends Record<typeof channel[number], Fn>
>(): Child<T> {
  return channel.reduce((acc, key) => {
    return {
      ...acc,
      [key]: (...args: any[]) => ipcRenderer.invoke(key, ...args),
    };
  }, {}) as Child<T>;
}

export function listenToMain<T extends Record<typeof channel[number], Fn>>(
  records: T
): void {
  Object.entries(records).forEach(([key, handler]) => {
    ipcMain.handle(key, handler);
  });
}
