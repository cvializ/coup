define([
  'marionette',
  'models/action/influence/InfluenceCollection',
  'views/action/influence/Influence',
  'hbs!templates/primary'
], function (Marionette, InfluenceCollection, InfluenceView, primaryActionTemplate) {
  var PrimaryActionView = Marionette.CompositeView.extend({
    initialize: function (options) {
      options = options || {};

      this.collection = options.collection || new InfluenceCollection([
        {
          name: 'Default',
          abilities: [
            { name: 'Income', verb: 'Take Income' },
            { name: 'Foreign Aid', verb: 'take Foreign Aid' },
            { name: 'Coup', verb: 'Coup' }
          ]
        },
        {
          name: 'Duke',
          abilities: [
            { name: 'Treasury', verb: 'Tax the Treasury' }
          ]
        }
      ]);
    },
    className: 'c-primary-action-view',
    template: primaryActionTemplate,
    childView: InfluenceView,
    childViewContainer: '.c-primary-action-influences'
  });

  return PrimaryActionView;
});
