var keyMirror = require('keymirror');

// client to (same) client events
module.exports = keyMirror({
  // used in landing controller
  LANDING_INIT: null,
  LANDING_GAME_CREATE: null,
  LANDING_GAME_JOIN: null,
  PUSH_GAMES: null,
  PLAY_END: null,

  // used in play controller
  PLAY_INIT: null,
  PLAY_START_READY: null,
  PLAY_START_READY_RECEIVED: null,
  PLAY_MOVE_PRIMARY: null,
  PLAY_MOVE_PRIMARY_CHOICE: null,
  PLAY_MOVE_SECONDARY: null,
  PLAY_MOVE_TERTIARY: null,
  PLAY_MOVE_SELECT_INFLUENCE: null
});
