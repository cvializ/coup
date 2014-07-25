define([
  'marionette',
  'Vent',
  'hbs!templates/influence/ability'
], function (Marionette, vent, abilityTemplate) {
  var AbilityView = Marionette.ItemView.extend({
    template: abilityTemplate,
    events: {
      'click .c-ability' : function trigger() {
        vent.trigger('play:move:primary', { 
          name: this.model.name,
          verb: this.model.verb,
          influence: this.model.influence
        });
    }
  });
});
