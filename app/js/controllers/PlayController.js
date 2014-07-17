define([
  'marionette',
  'socket',
  'CoupApp',
  'views/Play',
  'models/Player',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/action/PrimaryAction'
], function (Marionette, socket, CoupApp, PlayView, PlayerModel, PlayerCollectionModel, PlayerCollectionView, PrimaryActionView) {

  PlayController = Marionette.Controller.extend({

    initialize: function (options) {
      options = options || {};

      var self = this;

      this.socket = options.socket || socket;
      this.game = null;

      CoupApp.vent.on('play:init', function (data) {
        data = data || {};

        CoupApp.main.show(playView);

        playView.player.show(playersView);
        playView.action.show(new PrimaryActionView());

        self.socket.emit('pull:game', { title: data.title });
      });

      this.socket.on('push:game', function (data) {
        this.game = data;

        playersCollection.set(this.game.players);
      });
    }
  });

  var playView = new PlayView();
  var playersCollection = new PlayerCollectionModel([
    {name: 'Carlos', coins: 2}
  ]);
  var playersView = new PlayerCollectionView({ collection: playersCollection});

  return PlayController;
});
