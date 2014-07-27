define([
  'backbone',
  'models/action/influence/AbilityCollection'
], function (Backbone, AbilityCollection) {
  var InfluenceModel = Backbone.Model.extend({
    defaults: {
      name: 'Unnamed Influence',
      abilities: [
        {
          name: 'Unnamed Ability',
          verb: 'Do Nothing'
        }
      ]
    },

    initialize: function (object) {
      var abilities = this.get('abilities'),
          i;

      for (i = 0; i < abilities.length; i++) {
        abilities[i].influence = this.get('name');
      }

      this.set('abilities', new AbilityCollection(abilities));
    }
  });

  return InfluenceModel;
});
