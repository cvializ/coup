var Fluxxor   = require('fluxxor');
var ClientConstants = require('../constants/client');
var SocketClient = require('../SocketClient');

module.exports = Fluxxor.createStore({
  initialize() {
    this.games = [];

    this.bindActions(
      ClientConstants.PUSH_GAMES, this.onPushGames
    );
  },

  onPushGames(payload) {
    this.games = payload.games;
    this.emit('change');
  }
});
