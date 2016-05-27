'use strict';

import keyMirror from 'keymirror';

// server to client and client to server events
const ClientConstants = keyMirror({
  // used in landing controller
  RECEIVE_SOCKET_READY: null,
  ERROR_SOCKET_READY: null,
  REQUEST_CREATE_GAME: null,
  RECEIVE_CREATE_GAME: null,
  ERROR_CREATE_GAME: null,
  REQUEST_JOIN_GAME: null,
  RECEIVE_JOIN_GAME: null,
  ERROR_JOIN_GAME: null,
  RECEIVE_UPDATE_GAMES: null,

  // used in play controller
  PLAY_RECEIVE_GAME: null,
  PLAY_REQUEST_READY_START: null,
  PLAY_RECEIVE_READY_START: null,
  PLAY_ERROR_READY_START: null,

  // used in landing controller
  LANDING_INIT: null,
  LANDING_GAME_CREATE: null,
  LANDING_GAME_JOIN: null,
  PUSH_GAMES: null,
  PLAY_END: null,

  // used in play controller
  PLAY_INIT: null,
  PLAY_FORCE_QUIT: null,
  PLAY_RECEIVE_STATE: null,
  PLAY_RECEIVE_PLAYER: null,
  PLAY_START_READY: null,
  PLAY_START_READY_RECEIVED: null,
  PLAY_MOVE_PRIMARY: null,
  PLAY_MOVE_PRIMARY_CHOICE: null,
  PLAY_MOVE_SECONDARY: null,
  PLAY_MOVE_TERTIARY: null,
  PLAY_MOVE_SELECT_INFLUENCE: null
});

export default ClientConstants;
