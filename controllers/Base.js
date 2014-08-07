var util = require('util'),
    ExtendBase = require('class-extend'),
    Base;

Base = ExtendBase.extend({
  constructor: function (options) {
    this.initialize(options);
  },
  initialize: function (options) {
    options = options || {};
    var socket = this.socket = options.socket,
        events = this.events;

    for (var key in events) {
      socket.on(key, events[key]);
    }
  }
});

module.exports = Base;
