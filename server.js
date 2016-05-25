var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    debug = !!process.env.DEBUG,
    port = process.env.PORT || 8000;

module.exports = {
  app: app,
  server: server,
  io: io,
  initialize: function (callback) {

    if (debug) {
      console.log('Debug: enabling asset LiveReload...');
      app.use(require('connect-livereload')());

      require('livereload').createServer({
        exts: ['css'],
        applyCSSLive: true
      }).watch(__dirname + '/client/styles');
    }
    app.use(express.static(__dirname + '/client'));

    server.listen(port, function () {
      console.log('Server listening at port %d', port);
      callback();
    });
  }
};
