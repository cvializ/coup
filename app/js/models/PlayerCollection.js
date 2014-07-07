define(['backbone', 'models/Player'], function (Backbone, PlayerModel) {
  // A List of People
  var PlayerCollectionModel = Backbone.Collection.extend({
    model: PlayerModel
  });

  return PlayerCollectionModel;
});
