'use strict';

const SocketConstants = require('../app/js/constants/socket');

class BaseController {
  constructor(options) {
    this.initialize(options);
  }

  initialize(options) {
    options = options || {};

    this.listeners = {};

    const emitter = this.emitter = options.emitter,
          events = this.events;

    for (let key in events) {
      // If we don't specify a listener function,
      // just use the default "passthrough" listener
      if (typeof(events[key]) !== 'function') {
        events[key] = this.createDefaultListener(key);
      }

      this.listeners[key] = this.bindListener(events[key]);
      emitter.on(this.constants[key], this.listeners[key]);
    }
  }

  stop() {
    const emitter = this.emitter,
          events = this.events,
          listeners = this.listeners;

    for (let key in events) {
      emitter.removeListener(SocketConstants[key], listeners[key]);
    }
  }

  bindListener(listener) {
    var self = this;
    // Since the EventEmitter resets the listener's `this`,
    // wrap our desired function and bind `this` to it.
    // The wrapper's `this` will be reset, but not the inner fn.
    return function () {
      listener.apply(self, arguments);
    };
  }

  createDefaultListener(eventName) {
    return function (options, callback) {
      options = options || {};
      var destination = options.destination;

      if (destination) {
        delete options.destination;
        destination.emit(SocketConstants[eventName], options, callback);
      }
    };
  }
}

module.exports = BaseController;
