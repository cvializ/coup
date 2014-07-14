define(['marionette', 'views/Player'], function (Marionette, PlayerView) {
  var PlayerCollectionView = Marionette.CollectionView.extend({
    childView: PlayerView
  });

  return PlayerCollectionView;
});