define([
  'marionette',
  'views/action/influence/Ability',
  'hbs!templates/influence.html'
], function (Marionette, AbilityView, influenceTemplate) { 
  var InfluenceView = Marionette.CompositeView.extend({
    classname: 'c-influence-view'
    template: influenceTemplate,
    childView: AbilityView,
    childContainer: '.c-influence-abilities'
  });

  return InfluenceView;
});
