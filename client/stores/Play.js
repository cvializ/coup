var Fluxxor   = require('fluxxor');
var ClientConstants = require('../constants/client');
var SocketClient = require('../SocketClient');

module.exports = Fluxxor.createStore({
  initialize() {
    this.gameState = {};
    this.isPlaying = false;

    this.bindActions(
      ClientConstants.PLAY_INIT, this.onPlayInit,
      ClientConstants.PLAY_RECEIVE_STATE, this.onReceiveState
    );
  },

  onPlayInit(payload) {
    this.isPlaying = true;
    this.emit('change');
  },

  onReceiveState(payload) {
    this.gameState = payload.game;
    this.emit('change');
  }
});
