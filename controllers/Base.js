var ExtendBase = require('class-extend'),
    Base;

Base = ExtendBase.extend({
  constructor: function (options) {
    this.initialize(options);
  },

  initialize: function (options) {
    options = options || {};

    this.listeners = {};

    var emitter = this.emitter = options.emitter,
        events = this.events;

    for (var key in events) {
      if (typeof(events[key]) !== 'function') {
        this.listeners[key] = this.createDefaultListener(key);
      } else {
        this.listeners[key] = events[key];
      }
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
