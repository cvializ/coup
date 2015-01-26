define([
  'marionette',
  'Vent',
  'hbs!templates/action/influence/ability',
  'constants/client'
], function (Marionette, vent, abilityTemplate, clientConstants) {
  var AbilityView = Marionette.ItemView.extend({
    className: 'c-ability-view',
    template: abilityTemplate,
    events: {
      'click .c-ability' : function trigger() {
        vent.trigger(clientConstants.PLAY_MOVE_PRIMARY, {
          name: this.model.get('name'),
          verb: this.model.get('verb'),
          influence: this.model.get('influence'),
          needsTarget: this.model.get('needsTarget')
        });
      }
    }
  });

  return AbilityView;
});
