define(['views/Base', 'hbs!templates/player'], function (BaseView, playerTemplate) {
  var PlayerView = BaseView.extend({
    template: playerTemplate
  });

  return PlayerView;
});