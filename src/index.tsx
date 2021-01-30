// organize-imports-ignore
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';

import Prism from 'prismjs';
import { render } from 'react-dom';
import { Root } from './containers/Root';
import { configuredStore } from './store';

// organize-imports-ignore
import 'prismjs/themes/prism-coy.css';
import './app.pcss';

Prism.highlightAll();

const store = configuredStore();

document.addEventListener('DOMContentLoaded', () => {
    render(<Root store={store} />, document.getElementById('root'));
});
