define([
  'backbone'
], function (Backbone) {
  var DukeModel = Backbone.Model.extend({
    defaults: {
      name: 'Duke',
      abilities: [
        {
          name: 'Treasury',
          verb: 'Tax the Treasury'
        }
      ]
    }
  });

  return DukeModel;
});
