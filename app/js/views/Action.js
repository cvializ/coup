define(['views/Base', 'models/Action', 'hbs!templates/action'], function (BaseView, ActionModel, actionTemplate) {
  var ActionView = BaseView.extend({
    template: actionTemplate,

    initialize: function () {
      this.model = this.model || new this.actionModel();
    }
  });

  return ActionView;
});