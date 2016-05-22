'use strict';

const SocketClient = require('../SocketClient');
const ClientConstants = require('../constants/client');
const PlayActions = {
  init() {
    this.dispatch(ClientConstants.PLAY_INIT);
  },

  receiveState(payload) {
    this.dispatch(ClientConstants.PLAY_RECEIVE_STATE, { game: payload });
  },

  readyToStart() {
    // PLAY_START_READY
    socketClient.voteStart({
      // no payload
    }).then((payload) => {
      this.dispatch(ClientConstants.PLAY_START_READY_RECEIVED);
    }).except((err) => {
      alert(err);
    });
  },

  movePrimary(payload) {

  },

  movePrimaryChoice(payload) {
    // PLAY_MOVE_PRIMARY_CHOICE

    var move = payload;

  },

  moveSecondary() {
    // PLAY_MOVE_SECONDARY
  },

  moveTertiary() {
    // PLAY_MOVE_TERTIARY
  },

  playMoveSelectInfluence() {
    // PLAY_MOVE_SELECT_INFLUENCE
  }
};

module.exports = PlayActions;
