define([
  'backbone',
  'models/action/influence/Influence'
], function (Backbone, InfluenceModel) {
  // A List of People
  var InfluenceCollectionModel = Backbone.Collection.extend({
    model: InfluenceModel
  });

  return InfluenceCollectionModel;
});
