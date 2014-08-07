define(['backbone'], function (Backbone) {
  var PlayModel = Backbone.Model.extend({
    defaults: {
      player: null
    }
  });

  return PlayModel;
});