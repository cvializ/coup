define([
  'marionette',
  'socket',
  'CoupApp',
  'models/landing/Login',
  'views/landing/Login',
  'views/landing/Landing'
], function (Marionette, socket, CoupApp, LoginCollectionModel, LoginView, LandingView) {

  CoupController = Marionette.Controller.extend({

    initialize: function (options) {
      this.socket = options.socket;

      this.listenTo(this, 'init', function () {
        CoupApp.main.show(landingView);

        landingView.login.show(loginView);
      });
    }
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