var Base = require('./Base');

var GameStateController = Base.extend({
  constants: require('../app/js/constants/server'),
  events: {
    GAME_OVER: 'default',
    MY_TURN: 'default',
    NEW_TURN: 'default'
  }
});

module.exports = GameStateController;
