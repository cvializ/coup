define([
  'views/Choose',
  'views/PlayerChoice',
  'hbs!templates/choosePlayer'
], function (ChooseView, PlayerChoiceView) {
  var ChoosePlayerView = ChooseView.extend({
    childView: PlayerChoiceView,
    selectEvent: 'play:move:primary:choice'
  });

  return ChoosePlayerView;
});
