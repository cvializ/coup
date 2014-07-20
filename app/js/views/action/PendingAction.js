define(['views/action/Action', 'models/action/PendingAction'], function (ActionView, PendingActionModel) {
  var PendingActionView = ActionView.extend({
    actionModel: PendingActionModel
  });

  return PendingActionView;
});