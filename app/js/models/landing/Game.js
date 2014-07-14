define(['backbone'], function () {
  var GameModel = Backbone.Model.extend({
    defaults: {
      name: 'Unnamed Game',
      players: [],
      joinable: true
    }
  });

  return GameModel;
});