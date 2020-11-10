import { mockStore } from './mockStore';

export function formatActions<T extends ReturnType<typeof mockStore>>(
  store: T
) {
  return store.getActions().map((x) => {
    if (x.meta) {
      x.meta.requestId = 'fake-request-id';
    }
    if (x.error) {
      x.error.stack = 'fake-stack';
    }
    return x;
  });
}
