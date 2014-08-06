define([
  'views/widgets/Choose',
  'views/landing/Game',
  'hbs!templates/landing/login'
], function (ChooseView, GameView, loginTemplate) {
  var LoginView = ChooseView.extend({
    className: 'c-login-view c-choose-view c-group',
    template: loginTemplate,
    childView: GameView,
    childViewContainer: '.c-login-games',
    ui: {
      username: '#c-login-form-username',
      select: 'input[type="button"]'
    },
    choiceKey: 'id',
    selectEvent: 'landing:game:join'
  });

  return LoginView;
});
