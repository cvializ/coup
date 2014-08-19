var ExtendBase = require('class-extend'),
    Base;

Base = ExtendBase.extend({
  constructor: function (options) {
    this.listeners = {};
    this.initialize(options);
  },

  initialize: function (options) {
    options = options || {};
    var emitter = this.emitter = options.emitter,
        events = this.events;

    for (var key in events) {
      this.listeners[key] = (events[key] || this.createDefaultListener(key));
      emitter.on(key, this.listeners[key]);
    }
  },

  stop: function () {
    var emitter = this.emitter,
        events = this.events;

    for (var key in events) {
      emitter.removeListener(key, this.listeners[key]);
    }
  },

  useDefaultListener: null,

  createDefaultListener: function createDefaultListener(eventName) {
    return function (options, callback) {
      options = options || {};
      var destination = options.destination;

      if (destination) {
        delete options.destination;
        destination.emit(eventName, options, callback);
      }
    };
  }
});

module.exports = Base;
