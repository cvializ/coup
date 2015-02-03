var Base = require('./Base'),
    ServerConstants = require('../app/js/constants/server'),
    SocketConstants = require('../app/js/constants/socket');

var GameDataController = Base.extend({
  constants: ServerConstants,
  events: {
    PUSH_GAME: function pushGame(options) {
      options = options || {};

      if (options.destination) {
        options.destination.emit(SocketConstants.PUSH_GAME, options.game);
      }
    },

    PUSH_GAME_COLLECTION: function pushGameCollection(options) {
      options = options || {};

      if (options.destination) {
        options.destination.emit(SocketConstants.PUSH_GAMES, { games: options.games });
        console.log('PUSH GAMES');
      }
    },

    PUSH_PLAYER: function pushPlayer(options) {
      options = options || {};

      options.destination.emit(SocketConstants.PUSH_PLAYER, { player: options.player });
    }
  }
});

module.exports = GameDataController;
