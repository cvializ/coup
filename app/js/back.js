require.config({
  paths : {
    backbone : 'ext/backbone',
    underscore : 'ext/underscore',
    jquery : 'ext/jquery-2.1.1',
    marionette : 'ext/backbone.marionette',
    handlebars: 'ext/handlebars-v1.3.0',
    hbs: 'ext/require-handlebars-plugin/hbs',
    knockout: 'ext/knockout-3.1.0',
    config: '/config',
    'socket.io': '/socket.io/socket.io',
    'backbone.wreqr' : 'ext/backbone.wreqr'
  },
  shim : {
    jquery : {
      exports : 'jQuery'
    },
    underscore : {
      exports : '_'
    },
    backbone : {
      deps : ['jquery', 'underscore'],
      exports : 'Backbone'
    },
    marionette : {
      deps : ['jquery', 'underscore', 'backbone'],
      exports : 'Marionette'
    },
    'backbone.wreqr' : {
      deps : ['marionette', 'backbone']
    }
  },
  hbs: {
    templateExtension: 'html'
  }
});

define(['CoupApp', 'socket.io', 'config'], function (CoupApp, io, config) {
  var socket = io.connect('http://' + config.host + ':' + config.port);

  CoupApp.start({ socket: socket });
});
