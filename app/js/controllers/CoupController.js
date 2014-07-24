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

    errorHandler: function errorHandler(err) {
      alert('Error! ' + (err.message || err));
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
        self.socket.emit('create game', data, gameCreated);
      });

      function gameCreated(err, data) {
        if (err) {
          self.errorHandler(err);
        } else {
          // The callback is passed the new game's ID,
          // just like if we chose it from the list
          vent.trigger('landing:game:join', data);
        }
      }

      vent.on('landing:game:join', function joinExistingGame(data) {
        self.socket.emit('join user', data, userJoined);
      });

      function userJoined(err, data) {
        if (err) {
          self.errorHandler(err);
        } else {
          vent.trigger('play:init');
        }
      }

      vent.on('play:end', function reloadController(data) {
        vent.trigger('landing:init');
      });

      self.socket.on('push:games', function updateGameData(data) {
        self.games.reset(data);
      });
    }
  });

  return CoupController;
});
