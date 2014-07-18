define(['backbone'], function () {
  var GameModel = Backbone.Model.extend({
    defaults: {
      title: 'Unnamed Game',
      players: [],
      joinable: true
    }
  });

  return GameModel;
});