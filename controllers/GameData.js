var Base = require('./Base'),
    games = require('../models/GameCollection');

var GameDataController = Base.extend({
  events: {
    'push:game': function pushGame(options) {
      options = options || {};

      if (options.destination) {
        options.destination.emit('push:game', options.game);
      }
    },

    'push:game:collection': function pushGameCollection(options) {
      options = options || {};

      if (options.destination) {
        options.destination.emit('push:games', options.games);
      }
    },

    'push:player': function pushPlayer(options) {
      options = options || {};

      options.destination.emit('push:player', { player: options.player })
    }
  }
});

module.exports = GameDataController;
