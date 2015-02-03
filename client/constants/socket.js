var keyMirror = require('keymirror');
var socket;

// server to client and client to server events
module.exports = socket = keyMirror({
  // socket.on (server to client)
  PUSH_GAME_COLLECTION: null,
  PUSH_GAMES: null,
  USER_JOINED: null,
  PUSH_GAME: null,
  PUSH_PLAYER: null,
  USER_LEFT: null,
  FORCE_QUIT: null,
  MY_TURN: null,
  NEW_TURN: null,
  MOVE_ATTEMPTED: null,
  MOVE_RESPONDED_TO: null,
  MOVE_BLOCKED: null,
  BLOCK_SUCCEEDED: null,
  MOVE_SUCCEEDED: null,
  MOVE_DOUBTER_SUCCEEDED: null,
  MOVE_DOUBTER_FAILED: null,
  BLOCK_DOUBTER_SUCCEEDED: null,
  BLOCK_DOUBTER_FAILED: null,
  SELECT_OWN_INFLUENCE: null,
  GAME_OVER: null,
  disconnect: null,

  // socket.emit (client to server)
  CREATE_GAME: null,
  JOIN_USER: null,
  MAKE_MOVE: null,
  VOTE_START: null,
  ALLOW_MOVE: null,
  BLOCK_MOVE: null,
  DOUBT_MOVE: null,
  BLOCKER_SUCCESS: null,
  BLOCKER_DOUBT: null,
  PULL_GAME: null,
  PULL_PLAYER: null,
  REMOVE_USER: null,
  READY: null
});
