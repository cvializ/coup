define([
  'marionette',
  'models/action/Action',
  'hbs!templates/action'
], function (Marionette, ActionModel, actionTemplate) {
  var ActionView = Marionette.ItemView.extend({
    className: 'c-action-view',

    template: actionTemplate,

    'initialize': function initialize() {
      this.model = this.model || new this.actionModel();
    }
  });

  return ActionView;
});
