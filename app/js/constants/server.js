if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['keymirror'], function(keyMirror) {
  //var keyMirror = require('keymirror');
  var server;

  // server to server events
  server = keyMirror({
    PUSH_GAME: null,
    PUSH_GAME_COLLECTION: null,
    PUSH_PLAYER: null,

    GAME_OVER: null,
    MY_TURN: null,
    NEW_TURN: null,

    SELECT_OWN_INFLUENCE: null,

    MOCK: null
  });

  return server;
});
