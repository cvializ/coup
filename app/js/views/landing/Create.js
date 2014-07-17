define(['marionette', 'CoupApp', 'hbs!templates/landing/create'], function (Marionette, CoupApp, createTemplate) {
  var CreateView = Marionette.ItemView.extend({
    className: 'c-create-view',
    template: createTemplate,
    ui: {
      username: '#create-game-username',
      title: '#create-game-title',
      capacity: '#create-game-capacity',
      create: 'input[type="button"]'
    },
    events: {
      'click @ui.create': function createButton() {
        CoupApp.vent.trigger('landing:game:create', {
          username: this.ui.username.val(),
          title: this.ui.title.val(),
          capacity: this.ui.capacity.val()
        });
      }
    }
  });

  return CreateView;
});
