define(['backbone', 'views/Player'], function (Backbone, PlayerView) {
  var PlayerCollectionView = Backbone.View.extend({

    render: function () {
      this.collection.each(function (player) {
        var playerView = new PlayerView({ model: player });
        this.$el.append(playerView.render().el); // calling render method manually..
      }, this);

      return this;
    }
  });

  return PlayerCollectionView;
});