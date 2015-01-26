var Base = require('./Base'),
    MockController = Base.extend({
      constructor: function (options) {
        options = options || {};
        this.options = options;
        this.constants = options.constants || {};
        this.expected = options.expected || {};
        this.events = options.events || {};
        this.initialize(options);
      }
    });

module.exports = MockController;
