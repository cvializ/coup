var SocketClient = require('../SocketClient');
var ClientConstants = require('../constants/client');
var PlayActions;

module.exports = PlayActions = {
  init: function () {
    this.dispatch(ClientConstants.PLAY_INIT);
  },

  receiveState: function (payload) {
    this.dispatch(ClientConstants.PLAY_RECEIVE_STATE, { game: payload });
  },

  readyToStart: function () {
    // PLAY_START_READY

    SocketClient.voteStart({
      // no payload
    }).then(function (payload) {
      this.dispatch(ClientConstants.PLAY_START_READY_RECEIVED);
    }).catch(function (err) {
      alert(err);
    });
  },

  movePrimary: function (payload) {

  },

  movePrimaryChoice: function (payload) {
    // PLAY_MOVE_PRIMARY_CHOICE

    var move = payload;

  },

  moveSecondary: function () {
    // PLAY_MOVE_SECONDARY
  },

  moveTertiary: function () {
    // PLAY_MOVE_TERTIARY
  },

  playMoveSelectInfluence: function () {
    // PLAY_MOVE_SELECT_INFLUENCE
  }
};
