define(['marionette', 'hbs!templates/player'], function (Marionette, playerTemplate) {
  var PlayerView = Marionette.ItemView.extend({
    className: 'c-player-view',
    template: playerTemplate
  });

  return PlayerView;
});