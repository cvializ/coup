define(['backbone'], function (Backbone) {
  var PendingActionModel = Backbone.Model.extend({
    defaults: {
      title: 'Waiting...',
      text: 'Your opponents are judging your actions.',
      choices: [
        { title: 'OK', id: 'pending-ok' }
      ]
    }
  });

  return PendingActionModel;
});