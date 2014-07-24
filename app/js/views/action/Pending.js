define([
  'views/action/Action',
  'models/action/Pending'
], function (ActionView, PendingActionModel) {
  var PendingActionView = ActionView.extend({
    actionModel: PendingActionModel
  });

  return PendingActionView;
});
