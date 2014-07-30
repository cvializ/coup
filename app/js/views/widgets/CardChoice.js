define([
  'marionette',
  'views/widgets/Wrapper',
  'views/Card',
  'hbs!templates/widgets/cardChoice'
], function (Marionette, WrapperView, CardView, cardChoiceTemplate) {
  var CardChoiceView = WrapperView.extend({
    className: 'c-card-choice-view',
    template: cardChoiceTemplate,
    childView: CardView
  });

  return CardChoiceView;
});
