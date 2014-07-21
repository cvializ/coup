define(['marionette', 'Vent', 'views/landing/Game', 'hbs!templates/landing/login'], function (Marionette, vent, GameView, loginTemplate) {
  var LoginView = Marionette.CompositeView.extend({
    className: 'c-login-view',
    template: loginTemplate,
    childView: GameView,
    childViewContainer: '.c-login-games',
    onRender: function onRender() {
      $('input[type="radio"]').first().attr('checked', true);
    },
    ui: {
      username: '#c-login-form-username',
      join: 'input[type="button"]'
    },
    collectionEvents: {
      add: 'onRender',
      remove: 'onRender'
    },
    events: {
      'click @ui.join': function clickJoin() {
        vent.trigger('landing:game:join', {
          username: this.ui.username.val(),
          id: $('input[type="radio"]:checked', this.$el).val()
        });
      }
    }
  });

  return LoginView;
});
