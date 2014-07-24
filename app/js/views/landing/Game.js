define([
  'marionette',
  'hbs!templates/landing/game'
], function (Marionette, gameTemplate) {
  var GameView = Marionette.ItemView.extend({
    className: 'c-game-view c-group',
    template: gameTemplate
  });

  return GameView;
});
