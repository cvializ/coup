import Immutable from 'immutable';
import ClientConstants from '../constants/client.js'
import store from '../stores';
const initialState = Immutable.fromJS({
  isPlaying: false,
  startedAck: false,
  privilegedPlayer: null,
  gameState: null,
  games: []
});

export default function rootReducer(state = initialState, action) {
  const { type, payload = null, error = null } = action;

  // You must ALWAYS return a new state. ALWAYS
  switch (action.type) {
    case ClientConstants.RECEIVE_UPDATE_GAMES: {
      const { games } = Immutable.fromJS(payload);
      return state.set('games', Immutable.fromJS(games));
    }
    case ClientConstants.PLAY_RECEIVE_GAME: {
      const { game } = Immutable.fromJS(payload);
      const { players } = game;
      const { privilegedPlayer } = state;
      const { id: privilegedId } = privilegedPlayer;
      const indexOfPlayer = players.findIndex(({ id }) => id === privilegedId);

      state = state.set('gameState', game);
      if (indexOfPlayer !== -1) {
        state = state.setIn(['gameState', 'players', indexOfPlayer], privilegedPlayer);
      }
      state = state.set('isPlaying', true);
      return state;
    }
    case ClientConstants.PLAY_RECEIVE_READY_START: {
      return state.set('startedAck', true);
    }
    case ClientConstants.RECEIVE_CREATE_GAME: {
      return state;
    }
    case ClientConstants.RECEIVE_JOIN_GAME: {
      const { player } = Immutable.fromJS(payload);
      return state.set('privilegedPlayer', player);
    }
    default:
      return state;
  }
}
