define(['backbone'], function (Backbone) {
  var ActionModel = Backbone.Model.extend({
    defaults: {
      title: 'Untitled Action',
      text: 'This action doesn\'t do anything!',
      choices: [
        { id: 'ok', title: 'OK', action: function () { console.log('YOU CHOSE OK.'); }}
      ]
    }
  });

  return ActionModel;
});