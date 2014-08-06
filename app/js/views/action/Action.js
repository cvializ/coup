define([
  'marionette',
  'models/action/Action',
  'hbs!templates/action/action'
], function (Marionette, ActionModel, actionTemplate) {
  var ActionView = Marionette.ItemView.extend({
    className: 'c-action-view',

    template: actionTemplate,

    'initialize': function initialize(options) {
      options = options || {};

      this.model = this.model || new this.actionModel(options);
    }
  });

  return ActionView;
});
