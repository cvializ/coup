define(['backbone', 'hbs!templates/action'], function (Backbone, actionTemplate) {
  var ActionView = Backbone.View.extend({
    template: actionTemplate,

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return ActionView;
});