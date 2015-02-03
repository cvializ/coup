define([
  'marionette',
  'MainRegion',
  'Vent',
  'models/landing/Login',
  'views/landing/Login',
  'views/landing/Landing',
  'views/landing/Create',
  'constants/socket',
  'constants/client'
],
function (Marionette,
          mainRegion,
          vent,
          LoginCollectionModel,
          LoginView,
          LandingView,
          CreateView,
          socketConstants,
          clientConstants) {

  var CoupController = Marionette.Controller.extend({

    socket: null,

    games: null,

    loginView: null,

    landingView: null,

    errorHandler: function errorHandler(err) {
      alert('Error! ' + (err.message || err));
    },

    initialize: function initialize(options) {
      var self = this;

      self.socket = options.socket;

      vent.on(clientConstants.LANDING_INIT, function loadController() {
        self.games = new LoginCollectionModel();

        self.loginView = new LoginView({ collection: self.games });
        self.landingView = new LandingView();

        mainRegion.show(self.landingView);

        self.landingView.login.show(self.loginView);
        self.landingView.create.show(new CreateView());

        self.socket.emit(socketConstants.READY);
      });

      vent.on(clientConstants.LANDING_GAME_CREATE, function createNewGame(data) {
        self.socket.emit(socketConstants.CREATE_GAME, data, gameCreated);
      });

      function gameCreated(err, data) {
        if (err) {
          self.errorHandler(err);
        } else {
          // The callback is passed the new game's ID,
          // just like if we chose it from the list
          vent.trigger(clientConstants.LANDING_GAME_JOIN, data);
        }
      }

      vent.on(clientConstants.LANDING_GAME_JOIN, function joinExistingGame(data) {
        self.socket.emit(socketConstants.JOIN_USER , data, userJoined);
      });

      function userJoined(err, data) {
        if (err) {
          self.errorHandler(err);
        } else {
          vent.trigger(clientConstants.PLAY_INIT);
        }
      }

      vent.on(clientConstants.PLAY_END, function reloadController(data) {
        vent.trigger(clientConstants.LANDING_INIT);
      });

      self.socket.on(socketConstants.PUSH_GAMES, function updateGameData(data) {
        self.games.reset(data.games);
      });

      self.socket.on(socketConstants.USER_JOINED, function joinedAGame(data) {
        self.socket.player = data.player;
      });
    }
  });

  return CoupController;
});
