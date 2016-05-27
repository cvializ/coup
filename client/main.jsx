import patch from './patch.js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


import SocketClient from './SocketClient.js';
import App from './containers/App.js';
import rootReducer from './reducers';
import store from './stores';

const root = document.getElementById('app');

SocketClient.init();

render(<Provider store={store}><App /></Provider>, root);
