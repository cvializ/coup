define(['backbone'], function (Backbone) {
  var CardModel = Backbone.Model.extend({
    defaults: {
      influence: null,
      eliminated: false,
    }
  });

  return CardModel;
});
