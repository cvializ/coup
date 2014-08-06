define([
  'marionette',
  'models/action/influence/InfluenceCollection',
  'views/action/influence/Influence',
  'hbs!templates/action/primary',
  'json!models/action/influence/cards/Default.json',
  'json!models/action/influence/cards/Ambassador.json',
  'json!models/action/influence/cards/Assassin.json',
  'json!models/action/influence/cards/Duke.json',
  'json!models/action/influence/cards/Captain.json'
  // Don't load the contessa.json; she can only block
  // and does not have any primary actions.
], function (Marionette,
             InfluenceCollection,
             InfluenceView,
             primaryActionTemplate,
             // Card data
             defaultData,
             ambassadorData,
             assassinData,
             dukeData,
             captainData) {

  var PrimaryActionView = Marionette.CompositeView.extend({
    initialize: function (options) {
      options = options || {};

      this.collection = options.collection || new InfluenceCollection(this.influences);
    },
    className: 'c-primary-action-view',
    template: primaryActionTemplate,
    childView: InfluenceView,
    childViewContainer: '.c-primary-action-influences',
    influences: [
      defaultData,
      ambassadorData,
      assassinData,
      dukeData,
      captainData
    ]
  });

  return PrimaryActionView;
});
