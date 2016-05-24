import Socket from 'socket.io-client';
import Bluebird from 'bluebird';
import SocketConstants from './constants/socket';

class SocketClient {
  constructor() {
    this.pendingEvents = {};
  }

  init(options) {
    options = options || {};

    this.socket = Socket();
    this.flux = options.flux;

    const actionContext = {
      flux: this.flux,
      dispatch: this.flux.dispatcher.dispatch
    };
    const actions = this.flux.actions;
    const playActions = actions.play;
    const landingActions = actions.landing;

    // Pushing data into the app
    this.socket.on(SocketConstants.PUSH_GAMES, landingActions.updateGames.bind(actionContext));
    this.socket.on(SocketConstants.PUSH_GAME, playActions.receiveState.bind(actionContext));
    this.socket.on(SocketConstants.PUSH_PLAYER, playActions.receivePlayer.bind(actionContext));
    this.socket.on(SocketConstants.FORCE_QUIT, playActions.forceQuit.bind(actionContext));
    this.socket.on(SocketConstants.USER_JOINED, playActions.receivePlayer.bind(actionContext));
    this.socket.on(SocketConstants.USER_LEFT, playActions.userLeft.bind(actionContext));

    // Lets us use Promises when using callbacks on socket.emit()
    this.socket.emit = Bluebird.promisify(this.socket.emit);
  }

  createGame(payload) {
    return this.socket.emit(SocketConstants.CREATE_GAME, {
      username: payload.username,
      title: payload.title,
      capacity: payload.capacity
    });
  }

  joinUser(payload) {
    return this.socket.emit(SocketConstants.JOIN_USER, {
      username: payload.username,
      id: payload.id
    });
  }

  makeMove(payload) {
    return this.socket.emit(SocketConstants.MAKE_MOVE, {});
  }

  voteStart(payload) {
    return this.socket.emit(SocketConstants.VOTE_START, {});
  }

  allowMove(payload) {
    return this.socket.emit(SocketConstants.ALLOW_MOVE, {});
  }

  blockMove(payload) {
    return this.socket.emit(SocketConstants.BLOCK_MOVE, {});
  }

  doubtMove(payload) {
    return this.socket.emit(SocketConstants.DOUBT_MOVE, {});
  }

  blockerSuccess(payload) {
    return this.socket.emit(SocketConstants.BLOCKER_SUCCESS, {});
  }

  blockerDoubt(payload) {
    return this.socket.emit(SocketConstants.BLOCKER_DOUBT, {});
  }

  pullGame(payload) {
    return this.socket.emit(SocketConstants.PULL_GAME, {});
  }

  pullPlayer(payload) {
    return this.socket.emit(SocketConstants.PULL_PLAYER, {});
  }

  removeUser(payload) {
    return this.socket.emit(SocketConstants.REMOVE_USER, {});
  }

  ready(payload) {
    return this.socket.emit(SocketConstants.READY, {});
  }
}

export default new SocketClient(); // singleton
