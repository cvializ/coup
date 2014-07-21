define([
  'marionette',
  'MainRegion',
  'Vent',
  'models/landing/Login',
  'views/landing/Login',
  'views/landing/Landing',
  'views/landing/Create',
  'views/Play'
],
function (Marionette,
          mainRegion,
          vent,
          LoginCollectionModel,
          LoginView,
          LandingView,
          CreateView,
          PlayView) {

  var CoupController = Marionette.Controller.extend({

    socket: null,

    games: null,

    loginView: null,

    landingView: null,

    errorHandler: function errorHandler(data) {
      alert('Error! ' + data.message);
    },

    initialize: function initialize(options) {
      var self = this;

      self.socket = options.socket;

      vent.on('landing:init', function loadController() {
        self.games = new LoginCollectionModel();

        self.loginView = new LoginView({ collection: self.games });
        self.landingView = new LandingView();

        mainRegion.show(self.landingView);

        self.landingView.login.show(self.loginView);
        self.landingView.create.show(new CreateView());

        self.socket.emit('ready');
      });

      vent.on('landing:game:create', function createNewGame(data) {
        self.socket.emit('create game', data);
      });

      vent.on('landing:game:join', function joinExistingGame(data) {
        self.socket.emit('join user', data);
      });

      vent.on('play:end', function reloadController(data) {
        vent.trigger('landing:init');
      });

      self.socket.on('create game succeeded', function createGameSucceeded(data) {
        self.socket.emit('join user', data);
      });
      self.socket.on('create game failed', self.errorHandler);

      self.socket.on('join user succeeded', function joinUserSucceeded(data) {
        vent.trigger('play:init');
      });

      self.socket.on('push:games', function updateGameData(data) {
        self.games.set(data);
      });

      self.socket.on('join user failed', self.errorHandler);
    }
  });

  return CoupController;
});
