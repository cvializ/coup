define(['marionette', 'hbs!templates/play'], function (Marionette, playTemplate) {
  var PlayView = Marionette.LayoutView.extend({
    template: playTemplate,

    regions: {
      player: '#c-player-area',
      action: '#c-action-area',
      result: '#c-result-area'
    }
  });

  return PlayView;
});