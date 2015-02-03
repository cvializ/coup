var SocketClient = require('../SocketClient');
var ClientConstants = require('../constants/client');
var LandingActions;

module.exports = LandingActions = {
  init: function () {
    // LANDING_INIT
    return SocketClient.ready();
  },

  createGame: function (payload) {
    var self = this;

    // LANDING_GAME_CREATE
    return SocketClient.createGame({
      username: payload.username,
      title: payload.title,
      capacity: payload.capacity
    })
    .then(self.flux.actions.landing.joinGame)
    .catch(function (err) {
      alert(err);
    });
  },

  joinGame: function (payload) {
    var self = this;

    // LANDING_GAME_JOIN
    return SocketClient.joinUser({
      id: payload.id,
      username: payload.username
    })
    .then(function () {
      self.dispatch(ClientConstants.PLAY_INIT);
    })
    .catch(function (err) {
      alert(err);
    });
  },

  updateGames: function (payload) {
    this.dispatch(ClientConstants.PUSH_GAMES, { games: payload.games });
  },

  quit: function () {
    // PLAY_END
    // this is triggered when the game is over
    this.dispatch(ClientConstants.PLAY_END);
  }
};
