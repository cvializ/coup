define([
  'marionette',
  'Vent',
  'hbs!templates/ability'
], function (Marionette, vent, abilityTemplate) {
  var AbilityView = Marionette.ItemView.extend({
    template: abilityTemplate,
    events: {
      'click .c-ability' : function trigger() {
        vent.trigger('play:move:primary', {
          name: this.model.get('name'),
          verb: this.model.get('verb'),
          influence: this.model.get('influence')
        });
      }
    }
  });

  return AbilityView;
});
