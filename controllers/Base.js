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
      this.listeners[key] = this.bindListener(key, events[key]);
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

  bindListener: function (key, listener) {
    var self = this,
        boundListener;

    // If we don't specify a listener function,
    // just use the default "passthrough" listener
    if (typeof(listener) !== 'function') {
      listener = self.createDefaultListener(key);
    }

    // Since the EventEmitter resets the listener's `this`,
    // wrap our desired function and bind `this` to it.
    // The wrapper's `this` will be reset, but not the inner fn.
    boundListener = function listenerWrapper() {
      listener.apply(self, arguments);
    };

    return boundListener;
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
