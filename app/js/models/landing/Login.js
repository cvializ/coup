define(['backbone', 'models/landing/Game'], function (Backbone, GameModel) {
  var LoginModel = Backbone.Collection.extend({
    model: GameModel
  });

  return LoginModel;
});