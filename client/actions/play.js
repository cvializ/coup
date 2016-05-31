'use strict';

import SocketClient from '../SocketClient';
import ClientConstants from '../constants/client';

export function init() {
  return {
    type: ClientConstants.PLAY_INIT
  };
}

export function receiveGame(game) {
  return {
    type: ClientConstants.PLAY_RECEIVE_GAME,
    payload: { game }
  };
}

export function receivePlayer(player) {
  return {
    type: ClientConstants.PLAY_RECEIVE_PLAYER,
    payload: { player }
  };
}

export function postReadyStart() {
  return (dispatch) => {
    dispatch(requestReadyStart());

    return SocketClient
    .voteStart()
    .then((payload) => dispatch(receiveReadyStart()))
    .catch((err) => dispatch(errorReadyStart(err)));
  };
}

function requestReadyStart() {
  return {
    type: ClientConstants.PLAY_REQUEST_READY_START
  };
}

function receiveReadyStart() {
  return {
    type: ClientConstants.PLAY_RECEIVE_READY_START
  };
}

function errorReadyStart(error) {
  return {
    type: ClientConstants.PLAY_ERROR_READY_START,
    error
  };
}

export function myTurn() {
  return {
    type: ClientConstants.PLAY_MOVE_PRIMARY
  };
}

export function newTurn() {
  return {
    type: ClientConstants.PLAY_MOVE_STANDBY
  };
}

export function forceQuit() {
  return {
    type: ClientConstants.PLAY_FORCE_QUIT
  };
}

export function userLeft() {
  SocketClient.pullGame();
  return {
    type: ClientConstants.USER_LEFT
  }
}
