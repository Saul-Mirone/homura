import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { App } from './App';

export const Root: React.FC<{ store: Store }> = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);
