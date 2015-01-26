define([
  'views/widgets/Choose',
  'views/widgets/PlayerChoice',
  'constants/client'
], function (ChooseView, PlayerChoiceView, clientConstants) {
  var ChoosePlayerView = ChooseView.extend({
    childView: PlayerChoiceView,
    selectEvent: clientConstants.PLAY_MOVE_PRIMARY_CHOICE
  });

  return ChoosePlayerView;
});
