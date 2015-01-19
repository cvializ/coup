var Base = require('./Base');

var PlayerController = Base.extend({
  events: {
    'select own influence': 'default'
  }
});

module.exports = PlayerController;
