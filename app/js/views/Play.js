define(['views/Base','hbs!templates/play'], function (BaseView, playTemplate) {
  var PlayView = BaseView.extend({
    template: playTemplate,

    initialize: function () {
      this.model.bind('change', this.render, this);
    },

    render: function () {
      BaseView.prototype.render.apply(this, arguments);

      this.assign({
        '#c-player-area': this.model.get('playerView'),
        '#c-action-area': this.model.get('actionView')
      });

      return this;
    }
  });

  return PlayView;
});