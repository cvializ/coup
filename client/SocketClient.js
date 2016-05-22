const Socket = require('socket.io-client');
const Bluebird = require('bluebird');
Const Constants = require('./constants/socket');

class SocketClient {
  constructor() {
    this.pendingEvents = {};
  }

  init(options) {
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
  }

  createGame(payload) {
    return this.socket.emit(Constants.CREATE_GAME, {
      username: payload.username,
      title: payload.title,
      capacity: payload.capacity
    });
  }

  joinUser(payload) {
    return this.socket.emit(Constants.JOIN_USER, {
      username: payload.username,
      id: payload.id
    });
  }

  makeMove(payload) {
    return this.socket.emit(Constants.MAKE_MOVE, {});
  }

  voteStart(payload) {
    return this.socket.emit(Constants.VOTE_START, {});
  }

  allowMove(payload) {
    return this.socket.emit(Constants.ALLOW_MOVE, {});
  }

  blockMove(payload) {
    return this.socket.emit(Constants.BLOCK_MOVE, {});
  }

  doubtMove(payload) {
    return this.socket.emit(Constants.DOUBT_MOVE, {});
  }

  blockerSuccess(payload) {
    return this.socket.emit(Constants.BLOCKER_SUCCESS, {});
  }

  blockerDoubt(payload) {
    return this.socket.emit(Constants.BLOCKER_DOUBT, {});
  }

  pullGame(payload) {
    return this.socket.emit(Constants.PULL_GAME, {});
  }

  pullPlayer(payload) {
    return this.socket.emit(Constants.PULL_PLAYER, {});
  }

  removeUser(payload) {
    return this.socket.emit(Constants.REMOVE_USER, {});
  }

  ready(payload) {
    return this.socket.emit(Constants.READY, {});
  }
}

module.exports = new SocketClient();
