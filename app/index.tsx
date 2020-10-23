import Prism from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { configuredStore } from './store';
import './app.global.pcss';

Prism.highlightAll();

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
});
