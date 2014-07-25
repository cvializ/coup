define(['backbone'], function (Backbone) {
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
      var abilities = this.attributes.abilities,
          i;

      for (i = 0; i < abilities.length; i++) {
        abilities[i].influence = this.attributes.name;
      }
    }
  });
});
