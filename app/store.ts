import { Action, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { ThunkAction } from 'redux-thunk';
import { createRootReducer } from './rootReducer';

const rootReducer = createRootReducer();
export type RootState = ReturnType<typeof rootReducer>;

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV || ''
);

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      if (!shouldIncludeLogger) {
        return getDefaultMiddleware();
      }
      const logger = createLogger({
        level: 'info',
        collapsed: true,
      });
      return getDefaultMiddleware().concat(logger);
    },
    preloadedState: initialState,
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './rootReducer',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('./rootReducer').default)
    );
  }
  return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppDispatch = Store['dispatch'];
