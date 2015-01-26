if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['keymirror'], function(keyMirror) {

  //var keyMirror = require('keymirror');
  var socket;

  // server to client and client to server events
  socket = keyMirror({
    // socket.on (server to client)
    PUSH_GAME_COLLECTION: null,
    PUSH_GAMES: null,   // push:games
    USER_JOINED: null,  // user joined
    PUSH_GAME: null,  // push:game
    PUSH_PLAYER: null,  // push:player
    USER_LEFT: null,  // user left
    FORCE_QUIT: null,   // force quit
    MY_TURN: null,  // my turn
    NEW_TURN: null,   // new turn
    MOVE_ATTEMPTED: null,   // move attempted
    MOVE_RESPONDED_TO: null,  // move responded to
    MOVE_BLOCKED: null,   // move blocked
    BLOCK_SUCCEEDED: null,  // block succeeded
    MOVE_SUCCEEDED: null,   // move succeeded
    MOVE_DOUBTER_SUCCEEDED: null,   // move doubter succeeded
    MOVE_DOUBTER_FAILED: null,  // move doubter failed
    BLOCK_DOUBTER_SUCCEEDED: null,  // block doubter succeeded
    BLOCK_DOUBTER_FAILED: null,   // block doubter failed
    SELECT_OWN_INFLUENCE: null,   // select own influence
    GAME_OVER: null,  // game over

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

  return socket;
});
