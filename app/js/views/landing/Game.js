define(['marionette', 'hbs!templates/landing/game'], function (Marionette, gameTemplate) {
  var GameView = Marionette.ItemView.extend({
    className: 'c-game-view',
    template: gameTemplate
  });

  return GameView;
});