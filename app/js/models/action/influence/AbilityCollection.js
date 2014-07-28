define([
  'backbone',
  'models/action/influence/Ability'
], function (Backbone, AbilityModel) {
  // A List of People
  var AbilityCollectionModel = Backbone.Collection.extend({
    model: AbilityModel
  });

  return AbilityCollectionModel;
});
