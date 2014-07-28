define([
  'marionette'
], function (Marionette) {
  var WrapperView = Marionette.LayoutView.extend({
    childView: Marionette.ItemView,
    regions: {
      subView: '.subView'
    },
    onRender: function () {
      this.subView.show(new this.childView({ model: this.model }));
    }
  });

  return WrapperView;
});
