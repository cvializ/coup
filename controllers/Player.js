var Base = require('./Base');

var PlayerController = Base.extend({
  events: {
    'select own influence': function selectInfluence(options, callback) {
      options = options || {};

      if (options.destination) {
        options.destination.emit('select own influence', null, callback);
      }
    }
  }
});

module.exports = PlayerController;
