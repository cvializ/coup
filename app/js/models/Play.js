define(['backbone'], function (Backbone) {
  var PlayModel = Backbone.Model.extend({
    defaults: {
      playersView: null,
      actionView: null
    }
  });

  return PlayModel;
});