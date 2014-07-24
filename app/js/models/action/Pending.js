define(['models/action/Action'], function (ActionModel) {
  var PendingActionModel = ActionModel.extend({
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
