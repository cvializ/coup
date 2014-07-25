define([
  'backbone'
], function (Backbone,) {
  var AbilityModel = Backbone.Model.extend({
    defaults: {
      name: 'Unnamed Ability',
      verb: 'Do Nothing'
    }
  });

  return AbilityModel;
});
