'use strict';

import SocketClient from '../SocketClient';
import ClientConstants from '../constants/client';

const PlayActions = {
  init() {
    this.dispatch(ClientConstants.PLAY_INIT);
  },

  receiveState(payload) {
    this.dispatch(ClientConstants.PLAY_RECEIVE_STATE, { game: payload });
  },

  receivePlayer(payload) {
    this.dispatch(ClientConstants.PLAY_RECEIVE_PLAYER, payload);
  },

  readyToStart() {
    // PLAY_START_READY
    SocketClient.voteStart({
      // no payload
    })
    .then((payload) => {
      this.dispatch(ClientConstants.PLAY_START_READY_RECEIVED);
    })
    .catch((err) => {
      alert(err);
    });
  },

  forceQuit() {
    this.dispatch(ClientConstants.PLAY_FORCE_QUIT);
  },

  userJoined(payload) {
    this.receivePlayer(payload);
  },

  userLeft() {
    SocketClient.pullGame();
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

export default PlayActions;
