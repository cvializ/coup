var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 8000;

module.exports = {
  app: app,
  server: server,
  io: io,
  initialize: function (callback) {

    // Routing
    app.use(express.static(__dirname + '/app'));

    server.listen(port, function () {
      console.log('Server listening at port %d', port);
      callback();
    });

  }
};
