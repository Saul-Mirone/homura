import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { App } from './App';

const Root: React.FC<{ store: Store }> = ({ store }) => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default hot(Root);
