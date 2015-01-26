define([
  'Vent',
  'views/action/Action',
  'models/action/Ready',
  'constants/client'
], function (vent, ActionView, ReadyActionModel, clientConstants) {
  var ReadyAction = ActionView.extend({
    actionModel: ReadyActionModel,

    events: {
      'click #ready-start-play': function ready() {
        vent.trigger(clientConstants.PLAY_START_READY);
      }
    }
  });

  return ReadyAction;
});
