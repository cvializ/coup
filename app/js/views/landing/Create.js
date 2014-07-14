define(['marionette', 'hbs!templates/landing/create'], function (Marionette, createTemplate) {
  var CreateView = Marionette.ItemView.extend({
    template: createTemplate,
  });

  return CreateView;
});
