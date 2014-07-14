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

define([
  'jquery',
  'views/action/SecondaryAction',
  'views/action/TertiaryAction',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/Play'
], function ($, SecondaryAction, TertiaryAction, PlayerCollection, PlayerCollectionView, PlayView) {

  var playerCollection = new PlayerCollection([
    {name: 'Carlos', coins: 5},
    {name: 'Erik', coins: 6},
    {name: 'Caleb', coins: 2},
    {name: 'Laura', coins: 7}
  ]);

  var playView = new PlayView();

  $('#coup-main').append(playView.render().el);

  playView.player.show(new PlayerCollectionView({ collection: playerCollection }));
  playView.action.show(new TertiaryAction());

  playerCollection.add({ name: 'Frank', coins: 2});
});