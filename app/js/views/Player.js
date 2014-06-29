define(['backbone', 'hbs!templates/player'], function (Backbone, playerTemplate) {
    var PlayerView = Backbone.View.extend({
        template: playerTemplate,

        render: function () {
          this.$el.html(this.template(this.model.attributes));
          return this;
        }
    });

    return PlayerView;
});