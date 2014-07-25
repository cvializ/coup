define([
  'marionette',
  'models/action/influence/InfluenceCollection',
  'views/action/influence/Influence',
  'json!models/action/influence/cards/Default.json',
  'json!models/action/influence/cards/Duke.json',
  'hbs!templates/primary'
], function (Marionette,InfluenceCollection, InfluenceView, defaultData, dukeData, primaryActionTemplate) {

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
      dukeData
    ]
  });

  return PrimaryActionView;
});
