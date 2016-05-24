import Fluxxor from 'fluxxor';
import ClientConstants from '../constants/client';
import SocketClient from '../SocketClient';

const PlayStore = Fluxxor.createStore({
  initialize() {
    this.gameState = {};
    this.privilegedPlayer = {};
    this.isPlaying = false;

    this.bindActions(
      ClientConstants.PLAY_INIT, this.onPlayInit,
      ClientConstants.PLAY_RECEIVE_STATE, this.onReceiveState,
      ClientConstants.PLAY_RECEIVE_PLAYER, this.onReceivePlayer,
      ClientConstants.PLAY_START_READY_RECEIVED, this.onReadyReceived,
      ClientConstants.PLAY_FORCE_QUIT, this.onForceQuit
    );
  },

  onReadyReceived() {
    this.gameState.startedAck = true;
    this.emit('change');
  },

  onForceQuit() {
    this.isPlaying = false;
    this.privilegedPlayer = {};
    this.gameState = {};
    this.emit('change');
  },

  onPlayInit(payload) {
    this.isPlaying = true;
    this.emit('change');
  },

  onReceiveState(payload) {
    const game = payload.game;
    this.gameState = game;
    this.updateGameState(game, this.privilegedPlayer);
    this.emit('change');
  },

  onReceivePlayer(payload) {
    const players = this.gameState.players;
    const privilegedPlayer = payload.player;

    this.privilegedPlayer = privilegedPlayer;
    this.updateGameState(this.gameState, privilegedPlayer);
    this.emit('change');
  },

  onUserLeft() {
    if (game.players.length <= 2) {
      this.isPlaying = false;
      this.emit('change');
    }
    socketClient.pullGame();
  },

  updateGameState(gameState, privilegedPlayer) {
    this.gameState = gameState;
    const players = gameState.players;

    if (players) {
      const nonPrivilegedPlayer = players.filter((p) => {
        return p.id === privilegedPlayer.id;
      })[0];

      if (nonPrivilegedPlayer) {
        nonPrivilegedPlayer.influences = privilegedPlayer.influences;
      }
    }
  }
});

export default PlayStore;
