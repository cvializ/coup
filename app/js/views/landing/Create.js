define(['marionette', 'hbs!templates/landing/create'], function (Marionette, createTemplate) {
  var CreateView = Marionette.ItemView.extend({
  	className: 'c-create-view',
    template: createTemplate,
  });

  return CreateView;
});
