define(['socket.io', 'config'], function (io, config) {

  var socket = io.connect('http://' + config.host + ':' + config.port);

  socket.emit('ready');

  return socket;

});