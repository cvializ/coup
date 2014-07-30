define([
  'views/widgets/Choose',
  'views/widgets/CardChoice'
], function (ChooseView, CardChoiceView) {
  var ChooseCardView = ChooseView.extend({
    childView: CardChoiceView,
    selectEvent: 'play:move:select:influence',
    choiceKey: 'id'
  });

  return ChooseCardView;
});
