var React = require('react');
var Fluxxor = require('fluxxor');
var SocketClient = require('./SocketClient');
var actions = require('./actions');
var stores = require('./stores');
var Application = require('./components/CoupApp.jsx');

var flux = new Fluxxor.Flux(stores, actions);

// log dispatches
flux.on('dispatch', function(type, payload) {
 console.log("[Dispatch]", type, payload);
});

SocketClient.init({ flux: flux });

React.render(<Application flux={flux} />, document.getElementById('app'));
