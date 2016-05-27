import Socket from 'socket.io-client';
import Bluebird from 'bluebird';
import SocketConstants from './constants/socket.js';
import store from './stores';
import * as landingActions from './actions/landing.js';
import * as playActions from './actions/play.js';

class SocketClient {
  // get listeners() {
  //   const { play, landing } = this.flux.actions;
  //   return {
  //     [SocketConstants.PUSH_GAMES]: landing.updateGames,
  //     [SocketConstants.PUSH_GAME]: play.receiveState,
  //     [SocketConstants.MY_TURN]: play.myTurn,
  //     [SocketConstants.PUSH_PLAYER]: play.receivePlayer,
  //     [SocketConstants.FORCE_QUIT]: play.forceQuit,
  //     [SocketConstants.USER_JOINED]: play.receivePlayer,
  //     [SocketConstants.USER_LEFT]: play.userLeft
  //   };
  // }

  init(options) {
    options = options || {};

    this.socket = Socket();
    this.socket.on('event', function () {
      console.log.apply(console, arguments);
    });
    this.socket.on(SocketConstants.PUSH_GAMES, ({ games }) => {
      store.dispatch(landingActions.receiveUpdateGames(games))
    });
    this.socket.on(SocketConstants.PUSH_GAME, ({ game }) => {
      store.dispatch(playActions.receiveGame(game))
    });
    this.socket.on(SocketConstants.FORCE_QUIT, () => {
      store.dispatch(playActions.forceQuit());
    });
    this.socket.on(SocketConstants.USER_LEFT, () => {
      this.pullGame();
    });

    // Lets us use Promises when using callbacks on socket.emit()
    this.socket.emit = Bluebird.promisify(this.socket.emit);
  }

  createGame(username, title, capacity) {
    return this.socket.emit(SocketConstants.CREATE_GAME, { username, title, capacity });
  }

  joinUser(username, id) {
    return this.socket.emit(SocketConstants.JOIN_USER, { username, id });
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

  pullGame() {
    return this.socket.emit(SocketConstants.PULL_GAME);
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
