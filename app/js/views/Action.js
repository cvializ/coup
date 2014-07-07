define(['backbone', 'models/Action', 'hbs!templates/action'], function (Backbone, ActionModel, actionTemplate) {
  var ActionView = Backbone.View.extend({
    template: actionTemplate,

    initialize: function () {
      this.model = this.model || new this.actionModel();
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return ActionView;
});