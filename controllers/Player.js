var Base = require('./Base');

var PlayerController = Base.extend({
  events: {
    'select own influence': this.useDefaultListener
  }
});

module.exports = PlayerController;
