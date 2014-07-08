define(['views/BaseCollection', 'views/Player'], function (BaseCollection, PlayerView) {
  var PlayerCollectionView = BaseCollection.extend({
    itemView: PlayerView
  });

  return PlayerCollectionView;
});