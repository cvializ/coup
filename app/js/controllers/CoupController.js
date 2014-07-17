define([
  'marionette',
  'socket',
  'CoupApp',
  'models/landing/Login',
  'views/landing/Login',
  'views/landing/Landing',
  'views/landing/Create',
  'views/Play'
], function (Marionette, socket, CoupApp, LoginCollectionModel, LoginView, LandingView, CreateView, PlayView) {

  CoupController = Marionette.Controller.extend({

    initialize: function (options) {
      this.socket = options.socket;

      CoupApp.vent.on('landing:init', function () {
        CoupApp.main.show(landingView);

        landingView.login.show(loginView);
        landingView.create.show(new CreateView());

        socket.emit('ready');
      });

      CoupApp.vent.on('landing:game:create', function (data) {
        socket.emit('create game', data);
        this.trigger('landing:game:join', data);
      });

      CoupApp.vent.on('landing:game:join', function (data) {
        console.log('joining game');
        socket.emit('join user', data);
        CoupApp.vent.trigger('play:init', data);
      });
    }
  });

  socket.on('initialize', function (data) {
    console.log(data);
  });

  socket.on('gamejoiner', function (data) {
    console.log('Game joined.');
    CoupApp.main.show(new PlayView());
  });

  socket.on('push:games', function (data) { games.set(data); });

  var games = new LoginCollectionModel();

  var loginView = new LoginView({ collection: games });
  var landingView = new LandingView();

  return CoupController;
});
