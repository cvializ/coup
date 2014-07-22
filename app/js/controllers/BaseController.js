define(['marionette'], function () {
  var BaseController = Marionette.Controller.extend({
    socket: null,

    initialize: function (options) {
      options = options || {};
      this.socket = options.socket || null;

    };

    onSocket: function (eventTitle, successCb, failCb) {
      self.socket.on(eventTitle + 'Succeeded', successCb);
      self.socket.on(eventTitle + 'Failed', failCb || );
    }
  });

  return BaseController;
});
