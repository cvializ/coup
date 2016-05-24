'use strict';

import keyMirror from 'keymirror';

// server to client and client to server events
const ServerConstants = keyMirror({
  PUSH_GAME: null,
  PUSH_GAME_COLLECTION: null,
  PUSH_PLAYER: null,

  GAME_OVER: null,
  MY_TURN: null,
  NEW_TURN: null,

  SELECT_OWN_INFLUENCE: null,

  MOCK: null
});

export default ServerConstants;
