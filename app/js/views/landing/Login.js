define(['marionette', 'views/landing/Game', 'hbs!templates/landing/login'], function (Marionette, GameView, loginTemplate) {
  var LoginView = Marionette.CompositeView.extend({
    className: 'c-login-view',
    template: loginTemplate,
    childView: GameView,
    childViewContainer: '.c-login-games'
  });

  return LoginView;
});
