var Base = require('./Base'),
    MockController = Base.extend({
      constructor: function (options) {
        options = options || {};
        this.events = options.events || {};
        this.initialize(options);
      }
    });

module.exports = MockController;
