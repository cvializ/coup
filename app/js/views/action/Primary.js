define([
  'marionette',
  'views/action/influence/Influence',
  'hbs!templates/action/primary'
], function (Marionette, InfluenceView, primaryActionTemplate) {
  var PrimaryActionView = Marionette.CompositeView.extend({
    className: 'c-primary-action-view',
    template: primaryActionTemplate,
    childView: InfluenceView,
    childViewContainer: '.c-primary-action-influences'
  });

  return PrimaryActionView;
});
