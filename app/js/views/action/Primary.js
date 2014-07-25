define([
  'marionette',
  'models/action/influence/cards/Default',
  'models/action/influence/cards/Duke',
  'models/action/influence/InfluenceCollection',
  'views/action/influence/Influence',
  'hbs!templates/primary'
], function (Marionette, DefaultModel, DukeModel, InfluenceCollection, InfluenceView, primaryActionTemplate) {
  var PrimaryActionView = Marionette.CompositeView.extend({
    initialize: function (options) {
      options = options || {};

      this.collection = options.collection || new InfluenceCollection([
        new DefaultModel(),
        new DukeModel()
      ]);
    },
    className: 'c-primary-action-view',
    template: primaryActionTemplate,
    childView: InfluenceView,
    childViewContainer: '.c-primary-action-influences'
  });

  return PrimaryActionView;
});
