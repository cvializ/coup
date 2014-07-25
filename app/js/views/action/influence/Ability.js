define([
  'marionette',
  'Vent',
  'hbs!templates/ability'
], function (Marionette, vent, abilityTemplate) {
  var AbilityView = Marionette.ItemView.extend({
    template: abilityTemplate,
    events: {
      'click .c-ability' : function trigger() {
        var attributes = this.model.attributes;

        vent.trigger('play:move:primary', { 
          name: attributes.name,
          verb: attributes.verb,
          influence: attributes.influence
        });
      }
    }
  });

  return AbilityView;
});
