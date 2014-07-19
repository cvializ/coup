define([
  'marionette',
  'MainRegion',
  'Vent',
  'views/Play',
  'models/Player',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/action/PrimaryAction'
], function (Marionette, mainRegion, vent, PlayView, PlayerModel, PlayerCollectionModel, PlayerCollectionView, PrimaryActionView) {

  var PlayController = Marionette.Controller.extend({
    socket: null,

    game: null,

    playView: null,

    playersCollection: null,

    playersView: null,

    'initialize': function initialize(options) {
      var self = this;

      options = options || {};
      options.socket = options.socket || null;

      self.socket = options.socket;

      vent.on('play:init', function loadController(data) {
        data = data || {};

        self.playView = new PlayView();
        self.playersCollection = new PlayerCollectionModel();
        self.playersView = new PlayerCollectionView({ collection: self.playersCollection});

        mainRegion.show(self.playView);

        self.playView.player.show(self.playersView);
        self.playView.action.show(new PrimaryActionView());

        self.socket.emit('pull:game');
      });

      self.socket.on('push:game', function updateGameData(data) {
        self.game = data;

        self.playersCollection.set(self.game.players);
      });

      self.socket.on('user joined', function userJoined() {
        self.socket.emit('pull:game');
      });

      self.socket.on('user left', function userLeft() {
        if (self.game.players.length > 2) {
          self.socket.emit('pull:game');
        }
      });

      self.socket.on('you are alone', function gameAbandoned() {
        vent.trigger('play:end');
      });
    }
  });

  return PlayController;
});
