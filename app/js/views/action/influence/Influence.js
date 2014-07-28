define([
  'marionette',
  'models/action/influence/AbilityCollection',
  'views/action/influence/Ability',
  'hbs!templates/influence'
], function (Marionette, AbilityCollection, AbilityView, influenceTemplate) {
  var InfluenceView = Marionette.CompositeView.extend({
    initialize: function (options) {
      this.collection = this.model.get('abilities');
    },
    className: 'c-influence-view',
    template: influenceTemplate,
    childView: AbilityView,
    childViewContainer: '.c-influence-abilities'
  });

  return InfluenceView;
});
