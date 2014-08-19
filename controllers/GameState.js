var Base = require('./Base');

var GameStateController = Base.extend({
  events: {
    'game over': this.useDefaultListener,
    'my turn': this.useDefaultListener,
    'new turn': this.useDefaultListener
  }
});

module.exports = GameStateController;
