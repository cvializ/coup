import Fluxxor from 'fluxxor';
import ClientConstants from '../constants/client';
import SocketClient from '../SocketClient';

const LandingStore = Fluxxor.createStore({
  initialize() {
    this.games = [];

    this.bindActions(
      ClientConstants.PUSH_GAMES, this.onPushGames
    );
  },

  onPushGames(payload) {
    this.games = payload.games;
    this.emit('change');
  }
});

export default LandingStore;
