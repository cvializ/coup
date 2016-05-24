import ReactDOM from 'react-dom';
import React from 'react';
import Fluxxor from 'fluxxor';
import SocketClient from './SocketClient';
import actions from './actions';
import stores from './stores';
import Application from './components/CoupApp.jsx';

const flux = new Fluxxor.Flux(stores, actions);

// log dispatches
flux.on('dispatch', function(type, payload) {
 console.log("[Dispatch]", type, payload);
});

SocketClient.init({ flux });

ReactDOM.render(<Application flux={flux} />, document.getElementById('app'));
