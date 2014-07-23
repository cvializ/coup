define(['marionette', 'Vent', 'views/landing/Game', 'hbs!templates/landing/login'], function (Marionette, vent, GameView, loginTemplate) {
  var LoginView = Marionette.CompositeView.extend({
    className: 'c-login-view',
    template: loginTemplate,
    childView: GameView,
    childViewContainer: '.c-login-games',
    onRenderCollection: function collectionRendered() {
      // The render:collection event is triggered before
      // the newly rendered element in this.elBuffer is
      // attached to the DOM. So we need to manipulate this.elBuffer
      // GROSS
      this.elBuffer.querySelector('input[type="radio"]').setAttribute('checked', 'checked');
    },
    ui: {
      username: '#c-login-form-username',
      join: 'input[type="button"]'
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
