var ExtendBase = require('class-extend'),
    Base;

Base = ExtendBase.extend({
  constructor: function (options) {
    this.initialize(options);
  },
  initialize: function (options) {
    options = options || {};
    var emitter = this.emitter = options.emitter,
        events = this.events;

    for (var key in events) {
      emitter.on(key, events[key]);
    }
  },
  stop: function () {
    var emitter = this.emitter,
        events = this.events;

    for (var key in events) {
      emitter.removeListener(key, events[key]);
    }
  }
});

module.exports = Base;
