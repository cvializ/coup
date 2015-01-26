define([
  'views/widgets/Choose',
  'views/widgets/CardChoice',
  'constants/client'
], function (ChooseView, CardChoiceView, clientConstants) {
  var ChooseCardView = ChooseView.extend({
    childView: CardChoiceView,
    selectEvent: clientConstants.PLAY_MOVE_SELECT_INFLUENCE,
    choiceKey: 'id'
  });

  return ChooseCardView;
});
