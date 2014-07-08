define(['backbone'], function (Backbone) {
  var BaseCollectionView = Backbone.View.extend({
    render: function () {
      this.collection.each(function (item) {
        var view = new this.itemView({ model: item });
        this.$el.append(view.render().el);
      }, this);

      return this;
    }
  });

  return BaseCollectionView;
});