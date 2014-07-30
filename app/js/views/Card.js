define(['marionette', 'hbs!templates/card'], function (Marionette, cardTemplate) {
  var CardView = Marionette.ItemView.extend({
    className: 'c-card-view',
    template: cardTemplate
  });

  return CardView;
});
