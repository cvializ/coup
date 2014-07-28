define(['marionette', 'views/Player'], function (Marionette, PlayerView) {
  var PlayerCollectionView = Marionette.CollectionView.extend({
    className: 'c-playercollection-view c-group',
    childView: PlayerView
  });

  return PlayerCollectionView;
});
