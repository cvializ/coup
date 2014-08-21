var Base = require('./Base');

var GameStateController = Base.extend({
  events: {
    'game over': 'default',
    'my turn': 'default',
    'new turn': 'default'
  }
});

module.exports = GameStateController;
