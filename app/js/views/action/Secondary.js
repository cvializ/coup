define([
  'Vent',
  'views/action/Action',
  'models/action/Secondary',
  'constants/client'
], function (vent, ActionView, SecondaryActionModel, clientConstants) {
  var SecondaryAction = ActionView.extend({
    actionModel: SecondaryActionModel,

    events: {
      'click #secondary-allow': function allow() {
        vent.trigger(clientConstants.PLAY_MOVE_SECONDARY, { type: 'allow' });
      },
      'click #secondary-block': function block() {
        vent.trigger(clientConstants.PLAY_MOVE_SECONDARY, { type: 'block' });
      },
      'click #secondary-doubt': function doubt() {
        vent.trigger(clientConstants.PLAY_MOVE_SECONDARY, { type: 'doubt' });
      }
    }
  });

  return SecondaryAction;
});
