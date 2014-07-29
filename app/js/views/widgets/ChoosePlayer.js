define([
  'views/widgets/Choose',
  'views/widgets/PlayerChoice'
], function (ChooseView, PlayerChoiceView) {
  var ChoosePlayerView = ChooseView.extend({
    childView: PlayerChoiceView,
    selectEvent: 'play:move:primary:choice'
  });

  return ChoosePlayerView;
});
