import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { App } from './App';

const RootComponent: React.FC<{ store: Store }> = ({ store }) => (
    <Provider store={store}>
        <App />
    </Provider>
);

export const Root = hot(module)(RootComponent);
