var Fluxxor   = require('fluxxor');
var ClientConstants = require('../constants/client');
var SocketClient = require('../SocketClient');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.gameState = {};
    this.isPlaying = false;
    this.phase =

    this.bindActions(
      ClientConstants.PLAY_INIT, this.onPlayInit,
      ClientConstants.PLAY_RECEIVE_STATE, this.onReceiveState
    );
  },

  onPlayInit: function (payload) {
    this.isPlaying = true;
    this.emit('change');
  },

  onReceiveState: function (payload) {
    this.gameState = payload.game;
    this.emit('change');
  }
});
