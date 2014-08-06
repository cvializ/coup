define(['backbone', 'models/Card'], function (Backbone, CardModel) {
  // A List of People
  var CardCollectionModel = Backbone.Collection.extend({
    model: CardModel
  });

  return CardCollectionModel;
});
