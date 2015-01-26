var Base = require('./Base');

var PlayerController = Base.extend({
  constants: require('../app/js/constants/server'),
  events: {
    SELECT_OWN_INFLUENCE: 'default'
  }
});

module.exports = PlayerController;
