define(['marionette', 'models/action/Action', 'hbs!templates/action'],
function (Marionette, ActionModel, actionTemplate) {
  var ActionView = Marionette.ItemView.extend({
    className: 'c-action-container',

    template: actionTemplate,

    initialize: function () {
      this.model = this.model || new this.actionModel();
    }
  });

  return ActionView;
});