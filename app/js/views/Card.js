define(['marionette', 'hbs!templates/card'], function (Marionette, cardTemplate) {
  var CardView = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'c-card-view',
    template: cardTemplate,
    onRender: function () {
      if (this.model.get('eliminated')) {
        this.$el.addClass('eliminated');
      } else {
        this.$el.removeClass('eliminated');
      }
    }
  });

  return CardView;
});
