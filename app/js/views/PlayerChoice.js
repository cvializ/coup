define([
  'marionette',
  'views/Wrapper',
  'views/Player',
  'hbs!templates/playerChoice'
], function (Marionette, WrapperView, PlayerView, playerChoiceTemplate) {
  var PlayerChoiceView = WrapperView.extend({
    className: 'c-player-choice-view',
    template: playerChoiceTemplate,
    childView: PlayerView
  });

  return PlayerChoiceView;
});
