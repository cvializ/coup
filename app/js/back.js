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
    'socket.io': '/socket.io/socket.io'
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
    }
  },
  hbs: {
    templateExtension: 'html'
  }
});

define(['jquery', 'CoupApp', 'models/Player', 'views/Player', 'views/SecondaryAction'],
function ($, CoupApp, PlayerModel, PlayerView, SecondaryAction) {

  var players = [
    {name: 'Carlos', coins: 5},
    {name: 'Erik', coins: 6},
    {name: 'Caleb', coins: 2}
  ];

  for (var i = 0; i < players.length; i++) {
    var view = new PlayerView({ model: new PlayerModel(players[i]) });
    $('#c-player-area').append(view.render().el);
  }

  var act = new SecondaryAction();
  $('#c-action-area').append(act.render().el);
/*
  var controller = new CoupController({
    mainRegion: MyApp.mainRegion
  });

  controller.show();*/

});