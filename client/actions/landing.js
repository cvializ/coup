'use strict';

import SocketClient from '../SocketClient';
import ClientConstants from '../constants/client';

export function postSocketReady() {
  return (dispatch) => {
    return SocketClient
    .ready()
    .then(() => {
      return dispatch(receiveSocketReady())
    })
    .catch(() => dispatch(errorSocketReady()));
  }
}

function receiveSocketReady() {
  return {
    type: ClientConstants.RECEIVE_SOCKET_READY
  };
}

function errorSocketReady() {
  return {
    type: ClientConstants.ERROR_SOCKET_READY
  };
}

export function postCreateGame(username, title, capacity) {
  // LANDING_GAME_CREATE
  return (dispatch) => {
    dispatch(requestCreateGame());

    return SocketClient
    .createGame(username, title, capacity)
    .then(({ username, id }) => {
      dispatch(receiveCreateGame(username, id));
      return dispatch(postJoinGame(username, id));
    }) // join the game
    .catch((error) => {
      return dispatch(errorCreateGame(error, username, title, capacity))
    });
  };
}

function receiveCreateGame(username, id) {
  return {
    type: ClientConstants.RECEIVE_CREATE_GAME,
    payload: { username, id }
  };
}

function requestCreateGame(username, title, capacity) {
  return {
    type: ClientConstants.REQUEST_CREATE_GAME,
    payload: { username, title, capacity }
  };
}

function errorCreateGame(error, username, title, capacity) {
  return {
    type: ClientConstants.ERROR_CREATE_GAME,
    payload: { username, title, capacity },
    error: error
  }
}

export function postJoinGame(username, id) {

  return (dispatch) => {
    dispatch(requestJoinGame(username, id));

    return SocketClient
    .joinUser(username, id)
    .then(({ player }) => {
      return dispatch(receiveJoinGame(player, username, id))
    })
    .catch((error) => {
      dispatch(errorJoinGame(error, username, id))
    });
  };
}

function requestJoinGame(username, id) {
  return {
    type: ClientConstants.REQUEST_JOIN_GAME,
    payload: { username, id }
  }
}

function receiveJoinGame(player, username, id) {
  return {
    type: ClientConstants.RECEIVE_JOIN_GAME,
    payload: { player, username, id }
  }
}

function errorJoinGame(error, username, id) {
  return {
    type: ClientConstants.ERROR_JOIN_GAME,
    payload: { username, id },
    error
  }
}

export function receiveUpdateGames(games) {
  return {
    type: ClientConstants.RECEIVE_UPDATE_GAMES,
    payload: { games }
  };
}
