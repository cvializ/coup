define(['backbone'], function (Backbone) {
  var BaseView = Backbone.View.extend({

    assign : function (selector, view) {
      var selectors;
      if (_.isObject(selector)) {
        selectors = selector;
      }
      else {
        selectors = {};
        selectors[selector] = view;
      }
      if (!selectors) return;
      _.each(selectors, function (view, selector) {
        view.setElement(this.$(selector)).render();
      }, this);
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return BaseView;
});


