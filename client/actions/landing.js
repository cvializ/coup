import SocketClient from '../SocketClient';
import ClientConstants from '../constants/client';

const LandingActions = {
  init() {
    // LANDING_INIT
    return SocketClient.ready();
  },

  createGame(payload) {
    // LANDING_GAME_CREATE
    return SocketClient.createGame({
      username: payload.username,
      title: payload.title,
      capacity: payload.capacity
    })
    .then(this.flux.actions.landing.joinGame)
    .catch((err) => {
      alert(err);
    });
  },

  joinGame(payload) {
    // LANDING_GAME_JOIN
    return SocketClient.joinUser({
      id: payload.id,
      username: payload.username
    })
    .then(() => {
      this.dispatch(ClientConstants.PLAY_INIT);
    })
    .catch((err) => {
      alert(err);
    });
  },

  updateGames(payload) {
    this.dispatch(ClientConstants.PUSH_GAMES, { games: payload.games });
  },

  quit() {
    // PLAY_END
    // this is triggered when the game is over
    this.dispatch(ClientConstants.PLAY_END);
  }
};

export default LandingActions;
