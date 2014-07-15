define(['socket.io', 'config'], function (io, config) {

  var urlPath = window.location.pathname,
      gameId = urlPath.substring(urlPath.lastIndexOf('/')),
      // gameId contains the leading /
      // e.g. if the namespace is "coupGame", the gameId is "/coupGame"
      // socket = io.connect('http://' + config.host + ':' + config.port + gameId);
      socket = io.connect('http://' + config.host + ':' + config.port);

  //socket.emit('ready');

  return socket;

});
