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
      // If we don't specify a listener function,
      // just use the default "passthrough" listener
      if (typeof(events[key]) !== 'function') {
        events[key] = this.createDefaultListener(key);
      }

      this.listeners[key] = this.bindListener(events[key]);
      emitter.on(key, this.listeners[key]);
    }
  },

  stop: function () {
    var emitter = this.emitter,
        events = this.events,
        listeners = this.listeners;

    for (var key in events) {
      emitter.removeListener(key, listeners[key]);
    }
  },

  bindListener: function (listener) {
    var self = this;

    // Since the EventEmitter resets the listener's `this`,
    // wrap our desired function and bind `this` to it.
    // The wrapper's `this` will be reset, but not the inner fn.
    return function listenerWrapper() {
      listener.apply(self, arguments);
    };
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
