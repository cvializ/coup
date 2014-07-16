define(['marionette', 'CoupApp', 'hbs!templates/landing/create'], function (Marionette, CoupApp, createTemplate) {
  var CreateView = Marionette.ItemView.extend({
    className: 'c-create-view',
    template: createTemplate,
    ui: {
      username: '#create-game-username',
      title: '#create-game-title',
      capacity: '#create-game-capacity'
    },
    events: {
      'click input[type="button"]': function createButton() {
        CoupApp.LandingController.trigger('game:create', {
          username: this.ui.username.val(),
          title: this.ui.title.val(),
          capacity: this.ui.capacity.val()
        });
      }
    }
  });

  return CreateView;
});
