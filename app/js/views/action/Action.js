define([
  'marionette',
  'models/action/Action',
  'hbs!templates/action'
], function (Marionette, ActionModel, actionTemplate) {
  var ActionView = Marionette.ItemView.extend({
    className: 'c-action-view',

    template: actionTemplate,

    'initialize': function initialize(options) {
      this.model = this.model || new this.actionModel(options);
    }
  });

  return ActionView;
});
