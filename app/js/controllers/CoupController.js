define([
  'marionette',
  'socket',
  'socket.io',
  'config',
  'CoupApp',
  'models/landing/Login',
  'views/landing/Login',
  'views/landing/Landing',
  'views/landing/Create'
], function (Marionette, socket, io, config, CoupApp, LoginCollectionModel, LoginView, LandingView, CreateView) {

  CoupController = Marionette.Controller.extend({

    initialize: function (options) {
      this.socket = options.socket;

      this.listenTo(this, 'init', function () {
        CoupApp.main.show(landingView);

        landingView.login.show(loginView);
        landingView.create.show(new CreateView());
      });

      this.listenTo(this, 'game:create', function (data) {
        socket.emit('create game', data);
      });
    }
  });

  socket.on('initialize', function (data) {
    console.log(data);
  });

  var games = new LoginCollectionModel([
    {
      name: 'My Coupl Game',
      players: [
          {name: 'Carlos', coins: 5},
          {name: 'Erik', coins: 6},
          {name: 'Caleb', coins: 2},
          {name: 'Laura', coins: 7}
      ]
    },
    {
      name: 'New Game',
      players: [
        {name: 'JWOWW', coins: 1},
        {name: 'Frank', coins: 6}
      ]
    }
  ]);

  var loginView = new LoginView({ collection: games });
  var landingView = new LandingView();

  return CoupController;
});
