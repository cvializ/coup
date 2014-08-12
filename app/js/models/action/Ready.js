define(['models/action/Action'], function (ActionModel) {
  var PendingActionModel = ActionModel.extend({
    defaults: {
      title: 'Ready to Play',
      text: 'Click "Start Play" when all players have joined.',
      choices: [
        { title: 'Start Play', id: 'ready-start-play' }
      ]
    }
  });

  return PendingActionModel;
});
