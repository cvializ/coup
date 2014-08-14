require.config({
  paths : {
    backbone : 'ext/backbone',
    underscore : 'ext/underscore',
    jquery : 'ext/jquery-2.1.1',
    marionette : 'ext/backbone.marionette',
    handlebars: 'ext/handlebars-v1.3.0',
    knockout: 'ext/knockout-3.1.0',
    'socket.io': '/socket.io/socket.io',
    'backbone.wreqr' : 'ext/backbone.wreqr',

    // plugins
    hbs: 'ext/require-handlebars-plugin/hbs',
    text: 'ext/millermedeiros-requirejs-plugins/lib/text',
    json: 'ext/millermedeiros-requirejs-plugins/src/json'
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

define(['CoupApp', 'socket.io'], function (CoupApp, io) {
  var socket = io.connect();

  socket.on('error', function (err) {
    console.error('ERROR');
    console.log(err);
  });

  CoupApp.start({ socket: socket });
});
