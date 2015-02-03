var Socket = require('socket.io-client');
var Bluebird = require('bluebird');
var Constants = require('./constants/socket');

module.exports = new SocketClient();

function SocketClient() {
  this.pendingEvents = {};
}

SocketClient.prototype.init = function (options) {
  options = options || {};

  this.socket = Socket();
  this.flux = options.flux;

  var actionContext = {
    flux: this.flux,
    dispatch: this.flux.dispatcher.dispatch
  };

  // Pushing data into the app
  this.socket.on(Constants.PUSH_GAMES, this.flux.actions.landing.updateGames.bind(actionContext));
  this.socket.on(Constants.PUSH_GAME, this.flux.actions.play.receiveState.bind(actionContext));

  // Lets us use Promises when using callbacks on socket.emit()
  this.socket.emit = Bluebird.promisify(this.socket.emit);
};

SocketClient.prototype.createGame = function (payload) {
  return this.socket.emit(Constants.CREATE_GAME, {
    username: payload.username,
    title: payload.title,
    capacity: payload.capacity
  });
};

SocketClient.prototype.joinUser = function (payload) {
  return this.socket.emit(Constants.JOIN_USER, {
    username: payload.username,
    id: payload.id
  });
};

SocketClient.prototype.makeMove = function (payload) {
  return this.socket.emit(Constants.MAKE_MOVE, { });
};

SocketClient.prototype.voteStart = function (payload) {
  return this.socket.emit(Constants.VOTE_START, { });
};

SocketClient.prototype.allowMove = function (payload) {
  return this.socket.emit(Constants.ALLOW_MOVE, { });
};

SocketClient.prototype.blockMove = function (payload) {
  return this.socket.emit(Constants.BLOCK_MOVE, { });
};

SocketClient.prototype.doubtMove = function (payload) {
  return this.socket.emit(Constants.DOUBT_MOVE, { });
};

SocketClient.prototype.blockerSuccess = function (payload) {
  return this.socket.emit(Constants.BLOCKER_SUCCESS, { });
};

SocketClient.prototype.blockerDoubt = function (payload) {
  return this.socket.emit(Constants.BLOCKER_DOUBT, { });
};

SocketClient.prototype.pullGame = function (payload) {
  return this.socket.emit(Constants.PULL_GAME, { });
};

SocketClient.prototype.pullPlayer = function (payload) {
  return this.socket.emit(Constants.PULL_PLAYER, { });
};

SocketClient.prototype.removeUser = function (payload) {
  return this.socket.emit(Constants.REMOVE_USER, { });
};

SocketClient.prototype.ready = function (payload) {
  return this.socket.emit(Constants.READY, { });
};
