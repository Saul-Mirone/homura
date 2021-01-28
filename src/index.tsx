// organize-imports-ignore
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Prism from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import React from 'react';
import { render } from 'react-dom';
import './app.pcss';
import { configuredStore } from './store';

Prism.highlightAll();

const store = configuredStore();

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(<Root store={store} />, document.getElementById('root'));
});
